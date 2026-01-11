import { auth } from './src/lib/auth.js'

async function test() {
  console.log('Testing signUpEmail...')
  const start = Date.now()
  try {
    const res = await auth.api.signUpEmail({
      body: {
        email: `test-${Date.now()}@example.com`,
        password: 'password123',
        name: 'Test User'
      }
    })
    console.log('Success!', res)
  } catch (err) {
    console.error('Error!', err)
  }
  console.log(`Took ${Date.now() - start}ms`)
}

test()
