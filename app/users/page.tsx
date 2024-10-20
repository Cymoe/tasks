import clientPromise from '@/lib/mongodb'

async function getUsers() {
  const client = await clientPromise
  const db = client.db("your_database_name")
  return db.collection("users").find({}).limit(10).toArray()
}

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user._id.toString()}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}
