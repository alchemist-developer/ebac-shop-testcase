import { config as loadDotenv } from 'dotenv'
import path from 'node:path'

const fallbackFile = path.resolve(process.cwd(), '.env')

loadDotenv({ path: fallbackFile, quiet: true })

const environmentName = process.env.TEST_ENV ?? 'local'
const environmentFile = path.resolve(process.cwd(), `.env.${environmentName}`)

if (environmentName !== 'local') {
  const loadedEnvironment = loadDotenv({
    path: environmentFile,
    override: true,
    quiet: true
  })

  if (loadedEnvironment.error && !process.env.BASE_URL) {
    throw new Error(
      `BASE_URL is not configured for TEST_ENV="${environmentName}". ` +
        `Create ${path.basename(environmentFile)} or define BASE_URL.`
    )
  }
}

const baseURL = process.env.BASE_URL

if (!baseURL) {
  throw new Error(
    `BASE_URL is not configured for TEST_ENV="${environmentName}". ` +
      `Create ${path.basename(environmentFile)} or define BASE_URL.`
  )
}

export const environmentConfig = {
  name: environmentName,
  baseURL
} as const
