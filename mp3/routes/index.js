/*
 * Connect all of your endpoints together here.
 */
module.exports = function (app, router) {
    app.use('/api/users', require('./user'));
    app.use('/api/tasks', require('./task'));
};

