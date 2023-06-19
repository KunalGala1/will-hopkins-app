require('dotenv').config();
const PORT = process.env.PORT || 5000;

const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

// db
const connectDB = require('./config/db');
// const User = require('./models/User');
connectDB();

// const Content = require('./models/Content');
// console.log(Content);

const app = express();

// Passport config
require('./config/passport')(passport);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  cors({
    origin: ['http://localhost:5000'],
    credentials: true,
  })
);

// express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);

// passport
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// routes
app.use('/', require('./routes/index'));
app.use('/', require('./routes/users'));
app.use('/dashboard', require('./routes/dashboard'));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});
