const Express = require('express'),
  BodyParser = require('body-parser'),
  Mongoose = require('mongoose'),
  Passport = require('passport'),
  ExpressSession = require('express-session'),
  LocalStrategy = require('passport-local');

const routes = require('./routes');

const { IP, PORT, DB } = require('./config');

Mongoose.Promise = global.Promise;
Mongoose.connect(DB, { useNewUrlParser: true });

const app = Express();

app.use(BodyParser.json());

// Init DEMO auth
const { Users } = require('./models');
app.use(
  ExpressSession({
    secret: process.env.SESSION_SECRET || 'demosecret',
    resave: true,
    saveUninitialized: false
  })
);
app.use(Passport.initialize());
app.use(Passport.session());
Passport.use(new LocalStrategy(Users.authenticate()));
Passport.serializeUser(Users.serializeUser());
Passport.deserializeUser(Users.deserializeUser());

app.use(routes);

// For React Application in PROD
if (process.env.NODE_ENV !== 'development') {
  // For PROD assets (images, css files, etc)
  app.use(Express.static('dist'));

  // For React browserHistory Paths
  const Path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(Path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  app.get('*', (req, res) => {
    const redirectUrl = `http://localhost:8080${req.path}`;
    res.redirect(redirectUrl);
  });
}

app.listen(PORT, IP, () => {
  console.log(`Server listening on ${IP}:${PORT}`);
});

// Spawns as separate processess
// DISABLED for demo
// services.initialize();
