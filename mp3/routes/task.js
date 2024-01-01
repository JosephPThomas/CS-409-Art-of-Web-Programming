const Express = require('express');
const Router = Express.Router();
const User = require('../models/user');
const Task = require('../models/task');

const handleErrors = (result, error) => {
  console.error(error);
  result.status(500).json({ "message": "Error", "data": {}, "error": error.message });
};

Router.param('id', (request, result, next, id) => {
  Task.findById(id)
    .then(task => {
      if (!task) {
        return result.status(404).json({ "message": "Task was not found", "data": {} });
      }
      request.task = task;
      next();
    })
    .catch(error => {
      handleErrors(result, error);
    });
});

Router.get('/', async (request, result) => {
  const query = Task.find();

  if (request.query.where) {
    query.where(JSON.parse(request.query.where));
  }

  if (request.query.sort) {
    query.sort(JSON.parse(request.query.sort));
  }

  if (request.query.select) {
    query.select(JSON.parse(request.query.select));
  }

  if (request.query.skip) {
    query.skip(parseInt(request.query.skip, 10));
  }

  if (request.query.limit) {
    query.limit(Math.min(100, parseInt(request.query.limit, 10)));
  }

  if (request.query.count === 'true') {
    Task.countDocuments(query)
      .then((count) => {
        result.json({ "message": "OK. Retrieved task count.", "data": count });
      })
      .catch((error) => {
        handleErrors(result, error);
      });
  } else {
    query.exec()
      .then((tasks) => {
        if (tasks.length === 0) {
          result.status(404).json({ "message": "Task was not found", "data": {} });
        } else {
          result.json({ "message": "OK", "data": tasks });
        }
      })
      .catch((error) => {
        handleErrors(result, error);
      });
  }
});

Router.post('/', async (request, result) => {
  const task = new Task(request.body);
  let user;

  if (request.body.assignedUser && request.body.assignedUser.trim() !== "") {
    user = await User.findById(request.body.assignedUser);
  }

  try {
    const newTask = await task.save();

    if (user && !newTask.completed) {
      user.pendingTasks.push(newTask._id);
      await user.save();
    }

    result.status(201).json({ "message": "Task created successfully", "data": newTask });
  } catch (error) {
    handleErrors(result, error);
  }
});

Router.get('/:id', (request, result) => {
  result.json({ "message": "Task retrieve successful", "data": request.task });
});

Router.put('/:id', async (request, result) => {
  let task;
  let user;
  try {
    task = request.task;

    // Update assignedUser if it's changed
    if (request.body.assignedUser && task.assignedUser !== request.body.assignedUser) {
      if (task.assignedUser && task.assignedUser.trim() !== "") {
        remuser = await User.findById(task.assignedUser);
      }
      if (request.body.assignedUser && request.body.assignedUser.trim() !== "") {
        user = await User.findById(request.body.assignedUser);
      }
      if (remuser) {
        remuser.pendingTasks.pull(task._id);
        await remuser.save();
      }
      if (user) {
        user.pendingTasks.push(task._id);
        await user.save();
      }
    }

    // Update other fields of the task
    Object.assign(task, request.body);

    // Save the updated task
    const updatedTask = await task.save();

    result.json({ "message": "Task update successful", "data": updatedTask });
  } catch (error) {
    handleErrors(result, error);
  }
});

Router.delete('/:id', async (request, result) => {
  const task = request.task;
  let user;
  if (task.assignedUser !== "") {
    user = await User.findById(task.assignedUser);
  }
  if (user) {
    user.pendingTasks.pull(task._id);
    await user.save();
  }
  await task.remove()
    .then(() => {
      result.json({ "message": "Task delete successful", "data": {} });
    })
    .catch((error) => {
      handleErrors(result, error);
    });
});

module.exports = Router;
