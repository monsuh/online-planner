const DatabaseController = require("./databasecontroller.js");
const Project = require("../models/projectmodel.js");
const Task = require("../models/taskmodel.js");

/**
 * Module with functions related to manipulating project task information in the database. 
 * @module
 */

/**
 * @classdesc This is the class used to manipulate project task information in the database.
 * @class
 */
module.exports = class ProjectTaskController extends DatabaseController {

     /**@inheritdoc*/
     constructor(req, res) {
          super(req, res);
     }

     /**@inheritdoc*/
     add() {
          let req = this.req;
          let res = this.res;
          let projectTask = {"name" : req.body.name, "deadline" : req.body.deadline};
          Project.findById(req.params.id, function(err, project) {
               if (err) throw err;
               else {
                    project.taskList.push(projectTask);
                    project.save(function (err) {
                         if (err) {
                              res.send({msg: err});
                         }
                         else {
                              console.log("project task document added");
                              res.send({msg:''});
                         }
                    });
               }
          });
     }

     /**@inheritdoc*/
     update() {
          let req = this.req;
          let res = this.res;
          Project.findById(req.params.projectid, function(err, project) {
               if (err) throw err;
               else {
                    let taskListIds = project.taskList.map((projectTask) => projectTask._id);
                    let updateIndex = taskListIds.indexOf(req.params.id);
                    project.taskList[updateIndex] = req.body;
                    project.save(function (err) {
                         if (err) {
                              res.send({msg: err});
                         }
                         else {
                              console.log("project task document added");
                              res.send({msg:''});
                         }
                    });
               }
          });
     }

     /**@inheritdoc*/
     delete() {
          let req = this.req;
          let res = this.res;
          Project.findById(req.params.projectid, function(err, project) {
               if (err) throw err;
               else {
                    let taskListIds = project.taskList.map((projectTask) => projectTask._id);
                    let deleteIndex = taskListIds.indexOf(req.params.id);
                    project.taskList.splice(deleteIndex, 1);
                    project.save(function (err) {
                         if (err) {
                              res.send({msg: err});
                         }
                         else {
                              console.log("project task document deleted");
                              res.send({msg:''});
                         }
                    });
               }
          });
     }

     /**
      * Changes the status of a project task within a project as specified by the user.
      */
     changeStatus() {
          let req = this.req;
          let res = this.res;
          Project.findById(req.params.projectid, function(err, project) {
               if (err) throw err;
               else {
                    let taskListIds = project.taskList.map((projectTask) => projectTask._id);
                    let updateIndex = taskListIds.indexOf(req.params.id);
                    console.log(req.body.status)
                    project.taskList[updateIndex].status = req.body.status;
                    project.save(function (err) {
                         if (err) {
                              res.send({msg: err});
                         }
                         else {
                              console.log("project task document status changed");
                              res.send({msg:''});
                         }
                    });
               }
          });
     }
}