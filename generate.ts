import { faker } from '@faker-js/faker';
import { FindAll, Store } from './lib/db';
import { UserCollection } from './types/auth';
const api = "http://localhost:4000"
async function generateUsers(number: number) {
    for (let i = 0; i < number; i++) {
        const user = JSON.stringify({
            email: faker.internet.email(),
            name: faker.internet.displayName(),
            password: "admin1234"
        })
        const reponse = await fetch(`${api}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: user
        })
        const data = await reponse.json()
        console.log(data)
    }
}

async function Posts(number: number) {
    for (let i = 0; i < number; i++) {
        const allUsers = FindAll("users") as unknown as UserCollection
        const users = Object.values(allUsers)
        const session = users[Math.floor(Math.random() * users.length)].id
        const posts = {
            post_id: (Date.now() * Math.round(Math.random() * 9999)).toString(),
            user_id: session,
            post: faker.lorem.sentence(),
            likes: 0,
            dislikes: 0,
            comments: [],
            created_at: faker.date.between({ from: '2020-01-01T00:00:00.000Z', to: Date.now() }),
            updated_at: new Date().toISOString()
        }
        Store("posts", posts)
    }
}
await Posts(1000)
