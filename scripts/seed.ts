import { faker } from '@faker-js/faker';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/my-next-app';
const TASKS_COUNT = 50;

async function seed() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const tasksCollection = db.collection('tasks');

    // Clear existing tasks
    await tasksCollection.deleteMany({});

    const tasks = Array.from({ length: TASKS_COUNT }, () => ({
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      completed: faker.datatype.boolean(),
      createdAt: faker.date.past(), // Add this line
    }));

    const result = await tasksCollection.insertMany(tasks);
    console.log(`${result.insertedCount} tasks inserted`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

seed().catch(console.error);
