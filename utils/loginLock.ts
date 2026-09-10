import fs from 'node:fs'
import path from 'node:path'

const LOCK_FILE = path.resolve('playwright/.auth/.login.lock')
const LOCK_POLL_INTERVAL_MS = 250
const LOCK_ACQUIRE_TIMEOUT_MS = 60_000

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function acquireLoginLock(): Promise<void> {
  fs.mkdirSync(path.dirname(LOCK_FILE), { recursive: true })
  const deadline = Date.now() + LOCK_ACQUIRE_TIMEOUT_MS

  for (;;) {
    try {
      fs.writeFileSync(LOCK_FILE, String(process.pid), { flag: 'wx' })
      return
    } catch {
      if (Date.now() > deadline) {
        throw new Error(
          `Could not acquire the login lock (${LOCK_FILE}) within ${LOCK_ACQUIRE_TIMEOUT_MS}ms. ` +
            'Another worker may have crashed while holding it — delete the lock file manually if so.'
        )
      }
      await sleep(LOCK_POLL_INTERVAL_MS)
    }
  }
}

function releaseLoginLock(): void {
  fs.rmSync(LOCK_FILE, { force: true })
}

/**
 * The app under test cannot reliably handle concurrent logins of the same
 * shared test account (observed: parallel workers logging in simultaneously
 * time out intermittently). This serializes only the login step itself
 * across worker processes via a file lock, while each worker still ends up
 * with its own independent, isolated session afterward.
 */
export async function withLoginLock<T>(fn: () => Promise<T>): Promise<T> {
  await acquireLoginLock()

  try {
    return await fn()
  } finally {
    releaseLoginLock()
  }
}
