import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET() {
  const client = await clientPromise
  const db = client.db("my-next-app")
  const tasks = await db.collection("tasks")
    .find({})
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order
    .toArray()
  return NextResponse.json(tasks)
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("my-next-app")
    const { title, description } = await request.json()
    const result = await db.collection("tasks").insertOne({
      title,
      description,
      completed: false,
      createdAt: new Date(),
    })
    const newTask = await db.collection("tasks").findOne({ _id: result.insertedId })
    return NextResponse.json(newTask)
  } catch (error) {
    console.error('Failed to add task:', error);
    return NextResponse.json({ error: 'Failed to add task' }, { status: 500 });
  }
}
