const Express = require('express');
const Router = Express.Router();
const User = require('../models/user');
const Task = require('../models/task');

const errorHandling = (result, error, status = 500) => {
  console.error(error);
  result.status(status).json({ "message": "Error", "data": {}, "error": error.message });
};

Router.param('id', (request, result, next, id) => {
  User.findById(id)
    .then(user => {
      if (!user) {
        return result.status(404).json({ "message": "User was not found", "data": {} });
      }
      request.user = user;
      next();
    })
    .catch(error => {
      errorHandling(result, error);
    });
});

Router.get('/', async (request, result) => {
  let query = User.find();
  let error = null;

  // Handle additional parameters
  try {
    if (request.query.where) {
      const query_where = JSON.parse(request.query.where);
      query.where(query_where);
    }

    if (request.query.sort) {
      const query_sort = JSON.parse(request.query.sort);
      query.sort(query_sort);
    }

    if (request.query.select) {
      const query_select = JSON.parse(request.query.select);
      query.select(query_select);
    }

    if (request.query.skip) {
      const query_skip = Number(request.query.skip);
      query.skip(query_skip);
    }

    const query_limit = request.query.limit ? Number(request.query.limit) : undefined;
    if (query_limit !== undefined && query_limit <= 0) {
      return result.status(400).json({ "message": "Error", "data": {}, "error": "The limit must be a positive value" });
    }

    query.limit(query_limit);

    if (request.query.count === 'true') {
      const query_count = await query.countDocuments().exec();
      result.json({ "message": "OK. Retrieved user count.", "data": query_count });
      return;
    }
  } catch (e) {
    error = e;
  }

  if (error) {
    errorHandling(result, error);
    return;
  }

  try {
    const query_user = await query.exec();
    if (query_user.length === 0) {
      result.status(404).json({ "message": "User not found", "data": {} });
    } else {
      result.json({ "message": "OK", "data": query_user });
    }
  } catch (e) {
    errorHandling(result, e);
  }
});

Router.post('/', async (request, result) => {
  try {
    const user = new User(request.body);
    const newUser = await user.save();

    if (request.body.pendingTasks) {
      await Task.updateMany(
        { _id: { $in: request.body.pendingTasks } },
        { $set: { assignedUser: newUser._id, assignedUserName: newUser.name } }
      );
    }

    result.status(201).json({ "message": "User create successful", "data": newUser });
  } catch (error) {
    let errorMessage = "Error occurred while creating the user";
    if (error.name === 'ValidationError') {
      errorMessage += ": " + error.message;
      return errorHandling(result, error, 400);
    }
    errorHandling(result, error, 500);
  }
});

Router.get('/:id', (request, result) => {
  result.json({ "message": "OK", "data": request.user });
});

Router.put('/:id', async (request, result) => {
  try {
    const user = request.user;
    Object.assign(user, request.body);
    const updatedUser = await user.save();

    if (request.body.pendingTasks) {
      const tasksToUnassign = user.pendingTasks.filter(t => !request.body.pendingTasks.includes(t));
      await Task.updateMany(
        { _id: { $in: tasksToUnassign } },
        { $set: { assignedUser: '', assignedUserName: 'unassigned' } }
      );

      await Task.updateMany(
        { _id: { $in: request.body.pendingTasks } },
        { $set: { assignedUser: user._id, assignedUserName: user.name } }
      );
    }

    result.json({ "message": "User update successful", "data": updatedUser });
  } catch (error) {
    errorHandling(result, error, 400);
  }
});

Router.delete('/:id', async (request, result) => {
  const user = request.user;
  
  user.remove()
    .then(() => {
      return Task.updateMany(
        { _id: { $in: user.pendingTasks } },
        { $set: { assignedUser: '', assignedUserName: 'unassigned' } }
      );
    })
    .then(() => {
      result.json({ "message": "User delete successful", "data": {} });
    })
    .catch(error => {
      errorHandling(result, error);
    });
});

module.exports = Router;
