// server.js
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var Task = require("./Task.modal");

const port = 8080;

mongoose.connect(
  "mongodb+srv://shivanshuchobey:RE8i84K6Sy0y8TxA@cluster0.m2e0ig6.mongodb.net/todolistapp"
);

// Middleware to parse JSON bodies
app.use(express.json());

// Define a simple route
app.get("/tasks", async (req, res) => {
  //   res.send("Hello World!");
  console.log("Getting all tasks");
  let data = await Task.find({});
  console.log(data);
  res.json(data);
});

app.post("/addTask", async (req, res) => {
  try {
    const newTask = new Task({
      title: "Complete CRUD task 10",
      description: "Complete the Basics on CRUD mongoose",
      completed: false,
    });
    const savedTask = await newTask.save();
    console.log(savedTask);
    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Error adding task : " + error);
  }
});

app.post("/updateTask/:taskId", async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { completed: true },
      { new: true } // This option tells Mongoose to return the updated document rather than the original one. By default, Mongoose returns the original document if this option is not specified.
    );

    if (!updatedTask) {
      return res.status(404), json({ error: "Task not found" });
    }

    console.log("Task updated : ", updatedTask);
    res.status(200).json({ updatedTask });
  } catch (error) {
    console.error("Error updating task : ", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

app.delete("/deleteTask/:taskId", async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404), json({ error: "Task not found" });
    }

    console.log("Task deleted : ", deletedTask);
    res.status(200).json({ message: "Task deleted sucessfully" });
  } catch (error) {
    console.error("Error deleting task : ", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
