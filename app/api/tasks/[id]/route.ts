import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const client = await clientPromise
  const db = client.db("my-next-app")
  const updateData = await request.json()
  await db.collection("tasks").updateOne(
    { _id: new ObjectId(params.id) },
    { $set: updateData }
  )
  return NextResponse.json({ message: 'Task updated successfully' })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const client = await clientPromise
  const db = client.db("my-next-app")
  await db.collection("tasks").deleteOne({ _id: new ObjectId(params.id) })
  return NextResponse.json({ message: 'Task deleted successfully' })
}
