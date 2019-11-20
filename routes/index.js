const Express = require('express');
const mainRouter = Express.Router();

mainRouter.use('/auth', require('./auth-routes'));
mainRouter.use('/api', require('./api-routes'));

module.exports = mainRouter;
