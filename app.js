const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const { isAuthenticated } = require('./middleware/auth');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'sarthak9814',
  resave: false,
  saveUninitialized: true
})); 


app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated || false;
  res.locals.user = req.session.user || null;
  next();
});

app.use(authRoutes);
app.use(isAuthenticated);
app.use(userRoutes);

const PORT = 3000;
const URI = 'mongodb+srv://sarthak1797:sarthak1797@cluster-drivetest.xdvmr6p.mongodb.net/Drive-Test-DB?retryWrites=true&w=majority&appName=Cluster-DriveTest'

mongoose.connect(URI)
  .then(result => app.listen(PORT, () => {
    console.log(`DB connected & Server running on http://localhost:${PORT}.`);
  }))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.render('pages/home', { title: 'Home', body: '<%- include("pages/home") %>' });
});