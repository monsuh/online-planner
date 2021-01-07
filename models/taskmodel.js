const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Module for Task database model. 
 * @module
 */

 /**
  * Class representing the database document structure of a task.
  * @class
  * 
  * @param {String} name - This is the name of the task (will be a public instance variable).
  * @param {Date} deadline - This is the start time of the task (will be a public instance variable).
  * @param {String} user - This is the user who created the task (will be a public instance variable).
  * @param {String} status - This is the status of the task (complete or incomplete) (will be a public instance variable).
  * @param {String} type - This is the type of document (will be a public instance variable).
  */
TaskSchema = new Schema({
     name: String,
     deadline: Date,
     user : String,
     status : {type: String, default: "incomplete"},
     type : {type: String, default: "task"}
});

module.exports = mongoose.model("Task", TaskSchema, "tasks");