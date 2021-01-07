const path = require("path");
const express = require("express");

const database = require("./database.js");
const ProjectModel = require("./models/projectmodel.js");
const TaskModel = require("./models/taskmodel.js");
const projectdb = require("./controllers/databasecontroller.js");

const bodyParser = require('body-parser');

const session = require("express-session");

const pug = require("pug");

const userRouter = require('./routes/authenticationroute.js');
const projectAndTaskRouter = require('./routes/projectandtaskroute.js');
const scheduleRouter = require('./routes/scheduleroute.js');

const app = express();

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'modules')));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
     secret : process.env.SECRET,
     resave : true,
     saveUninitialized : false
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/', userRouter);
app.use('/project', projectAndTaskRouter);
app.use('/schedule', scheduleRouter);

app.listen(3000, function() {
     console.log(`Listening to requests on http://localhost:3000`);
});