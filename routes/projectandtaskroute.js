const path = require("path");
const express = require("express");
const DatabaseController = require("../controllers/databasecontroller.js");
const ProjectTaskController = require("../controllers/projecttaskcontroller.js");
const router = express.Router();

router.use(function(req, res, next) {
     if (req.session.userId) {
          next();
     }
     else {
          res.redirect("/");
     }
});

router.get('/', function(req, res) {
     res.render("index.pug");
});

router.get('/userinfo', function(req, res) {
     new DatabaseController(req, res).retrieveForUser();
});

router.get('/search/:searchType/:searchTerm', function(req, res) {
     new DatabaseController(req, res).binarySearch();
});

router.post('/addproject', function(req, res) {
     new DatabaseController(req, res, "project").add();
});

router.put('/updateproject/:id', function(req, res) {
     new DatabaseController(req, res, "project").update();
});

router.delete('/deleteproject/:id', function(req, res) {
     new DatabaseController(req, res, "project").delete();
});

router.post('/addtask', function(req, res) {
     new DatabaseController(req, res, "task").add();
});

router.put('/updatetask/:id', function(req, res) {
     new DatabaseController(req, res, "task").update();
});

router.delete('/deletetask/:id', function(req, res) {
     new DatabaseController(req, res, "task").delete();
});

router.post('/addprojecttask/:id', function(req, res) {
     new ProjectTaskController(req, res).add();
});

router.put('/updateprojecttask/:projectid/:id', function(req, res) {
     new ProjectTaskController(req, res).update();
});

router.delete('/deleteprojecttask/:projectid/:id', function(req, res) {
     new ProjectTaskController(req, res).delete();
});

router.put('/changestatusprojecttask/:projectid/:id', function(req, res) {
     new ProjectTaskController(req, res).changeStatus();
});

router.post('/addevent', function(req, res) {
     new DatabaseController(req, res, "event").add();
});

router.put('/updateevent/:id', function(req, res) {
     new DatabaseController(req, res, "event").update();
});

router.delete('/deleteevent/:id', function(req, res) {
     new DatabaseController(req, res, "event").delete();
});

module.exports = router;
