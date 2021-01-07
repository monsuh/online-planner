const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Module for Project database model. 
 * @module
 */

 /**
  * Class representing the database document structure of a project task.
  * @class
  * 
  * @param {String} name - This is the name of the project task (will be a public instance variable).
  * @param {Date} deadline - This is the start time of the project task (will be a public instance variable).
  * @param {String} status - This is the status of the project task (complete or incomplete) (will be a public instance variable).
  * @param {String} type - This is the type of document (will be a public instance variable).
  */
const ProjectTaskSchema = new Schema({
     name: String,
     deadline: Date,
     status: {type: String, default: "incomplete"},
     type: {type: String, default: "projectTask"}
});

 /**
  * Class representing the database document structure of a project.
  * @class
  * 
  * @param {String} name - This is the name of the project (will be a public instance variable).
  * @param {Date} deadline - This is the start time of the project (will be a public instance variable).
  * @param {String} user - This is the user who created the project (will be a public instance variable).
  * @param {Array} taskList - This is the list of associated tasks (will be a public instance variable).
  * @param {String} type - This is the type of document (will be a public instance variable).
  */
const ProjectSchema = new Schema({
     name : String,
     deadline : Date,
     user : String,
     taskList : [ProjectTaskSchema],
     type: {type: String, default: "project"}
});

/**
 * Hashes password before saving to database.
 * 
 * @param {String} action - This is the database action before which the function will be executed.
 * @param {Function} preFunction - This is the function that occurs before the action.
 */
ProjectSchema.pre("validate", function(next) {
     console.log("sort middleware accessed");
     this.taskList.sort(function (a,b) {
          let paramA = a.deadline;
          let paramB = b.deadline;
          if (paramA < paramB) {
               return -1;
          }
          if (paramA > paramB) {
               return 1;
          }
          return 0;
     });
     next();
});

module.exports = mongoose.model("Project", ProjectSchema, "projects");
