import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import { NextResponse } from "next/server";

// GET: Fetch all tasks
export async function GET() {
  try {
    await dbConnect();
    const tasks = await Task.find({});

    // Ensure that tasks is an array
    if (!Array.isArray(tasks)) {
      return NextResponse.json(
        { error: "Tasks data is not an array" },
        { status: 400 }
      );
    }

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

// POST: Create a new task
export async function POST(req) {
  try {
    await dbConnect();
    const { title, description, dueDate } = await req.json();

    // Validate input data
    if (!title || !description || !dueDate) {
      return NextResponse.json(
        { error: "Title, description, and due date are required" },
        { status: 400 }
      );
    }

    const newTask = await Task.create({ title, description, dueDate });
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

// DELETE: Delete a task by ID
export async function DELETE(req) {
  try {
    await dbConnect();
    const { id } = await req.json();

    // Validate input
    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const task = await Task.findByIdAndDelete(id);

    // Check if task exists before deleting
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
