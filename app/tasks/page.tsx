'use client'

import { useState, useEffect } from 'react'
import { ObjectId } from 'mongodb'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AddTask } from '../components/AddTask'
import { EditTask } from '../components/EditTask'

interface Task {
  _id: ObjectId;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    // Sort tasks by createdAt in descending order (latest first)
    const sortedTasks = data.sort((a: Task, b: Task) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setTasks(sortedTasks);
  };

  const addTask = async (title: string, description: string) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const newTask = await response.json();
      setTasks([newTask, ...tasks]); // Add new task at the beginning
    } catch (error) {
      console.error('Failed to add task:', error);
      // You might want to set an error state here and display it to the user
    }
  };

  const toggleTaskCompletion = async (id: string) => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: !tasks.find(t => t._id.toString() === id)?.completed }),
    });
    if (response.ok) {
      setTasks(tasks.map(task => 
        task._id.toString() === id ? { ...task, completed: !task.completed } : task
      ));
    }
  };

  const deleteTask = async (id: string) => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setTasks(tasks.filter(task => task._id.toString() !== id));
    }
  };

  const editTask = async (id: string, title: string, description: string) => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    });
    if (response.ok) {
      setTasks(tasks.map(task => 
        task._id.toString() === id ? { ...task, title, description } : task
      ));
      setEditingTaskId(null);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Tasks</h1>
      <AddTask onAdd={addTask} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {tasks.map((task) => (
          editingTaskId === task._id.toString() ? (
            <EditTask
              key={task._id.toString()}
              task={{
                _id: task._id.toString(),
                title: task.title,
                description: task.description,
                completed: task.completed
              }}
              onSave={editTask}
              onCancel={() => setEditingTaskId(null)}
            />
          ) : (
            <Card key={task._id.toString()}>
              <CardHeader>
                <CardTitle>{task.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">{task.description}</p>
                <div className="flex justify-between items-center">
                  <Badge 
                    variant={task.completed ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => toggleTaskCompletion(task._id.toString())}
                  >
                    {task.completed ? 'Completed' : 'Pending'}
                  </Badge>
                  <div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mr-2"
                      onClick={() => setEditingTaskId(task._id.toString())}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => deleteTask(task._id.toString())}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        ))}
      </div>
    </div>
  )
}
