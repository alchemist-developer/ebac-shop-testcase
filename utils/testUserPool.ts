import fs from 'node:fs'
import path from 'node:path'
import { TestUser } from './testUser'

export function readPooledTestUser(poolFile: string): TestUser | undefined {
  if (!fs.existsSync(poolFile)) {
    return undefined
  }

  return JSON.parse(fs.readFileSync(poolFile, 'utf-8')) as TestUser
}

export function savePooledTestUser(poolFile: string, user: TestUser): void {
  fs.mkdirSync(path.dirname(poolFile), { recursive: true })
  fs.writeFileSync(poolFile, JSON.stringify(user))
}
