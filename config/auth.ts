import path from 'node:path'

export function authStateFileForWorker(workerIndex: number): string {
  return path.resolve(`playwright/.auth/worker-${workerIndex}.json`)
}
