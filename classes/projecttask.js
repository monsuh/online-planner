const Task = require("./task.js");

module.exports = class ProjectTask extends Task {
     constructor(name, deadline, id, status, associatedProject) {
          super(name, deadline, id, status);
          this.associatedProject = associatedProject;
     }
     getAssociatedProject() {
          return this.associatedProject
     }
}
