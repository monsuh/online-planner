/**
 * This is the class used to create Project objects
 * 
 * @class
 */
module.exports = class Project {

     /**
      * This function is the constructor function for a Project object
      * @constructor
      * @param {string} name - This is the initial name of the project viewable to the user (will be a private instance variable)
      * @param {Date} deadline - This is the initial date on which the project is due (will be a private instance variable)
      */
     constructor(name, deadline) {
          this.name = name;
          this.deadline = deadline;
     }

     /**
      * Returns user viewable name of Project object
      */
     getName() {
          return this.name;
     }

     /**
      * Returns deadline of Project object
      */
     getDeadline() {
          return this.deadline;
     }
}
