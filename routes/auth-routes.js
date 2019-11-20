const Passport = require('passport'),
  Express = require('express');

const middleware = require('../middleware');

const authRouter = new Express.Router();

authRouter.post('/login', Passport.authenticate('local'), (req, res) => {
  res.json(req.user);
});

authRouter.get('/me', middleware.MiddlewareIsAuthenticated, (req, res) => {
  res.json(req.user);
});

authRouter.get('/logout', (req, res) => {
  req.logout();
  res.status(200).send();
});

module.exports = authRouter;
