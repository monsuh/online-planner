const Project = require("./project.js")

/**
 * This is the class used to create Task objects
 * 
 * @class
 */
module.exports = class Task extends Project{

     /**
      * This function is the constructor function for a Task object
      * @constructor
      * @param {string} name - This is the initial name of the task viewable to the user (will be a private instance variable)
      * @param {Date} deadline - This is the initial date on which the task is due (will be a private instance variable)
      * @param {string} status - This is the status of the task: complete, incomplete, or overdue (will be a private instance variable)
      */
     constructor(name, deadline, id, status) {
          super(name, deadline, id);
          this.status = status;
     }

     /**
      * Returns the status of the task
      */
     getStatus() {
          return this.status;
     }
}