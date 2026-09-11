export interface TestUser {
  email: string
  password: string
}

export async function generateTestUser(workerIndex: number): Promise<TestUser> {
  const { faker } = await import('@faker-js/faker')
  const uniqueId = `${Date.now()}${workerIndex}${faker.string.alphanumeric(6)}`

  return {
    email: `qa.${uniqueId}@aarin.test`,
    password: `Qa${faker.string.alphanumeric({ length: 10, casing: 'mixed' })}!1`
  }
}
