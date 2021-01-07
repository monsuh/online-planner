/**
 * @classdesc This is the class used to create HTML for project objects.
 * @class
 * @extends EventHTML
 */
class ProjectHTML extends EventHTML{

     /** 
      * This is the constructor function for a Project HTML object.
      * @inheritdoc
      * 
      * @param {Array} taskList - This is the list of tasks associated with the project (will be a public instance variable).
      */
     constructor(name, deadline, endTime, id, taskList) {
          super(name, deadline, endTime, id);
          this.taskList = taskList;
     }

     /**@inheritdoc*/
     createDiv(toAppend, classNameAddition = "") {
          let that = this;
          return new Promise (function(resolve, reject) {
               console.log("project createDiv accessed");
               let nameNoSpace = that.name.replace(/\s+/g, '');
               let html = 
               `<div id=project${that.id.slice(4,11)} class=project${classNameAddition}>
                    <div id=projectInfo>
                         <p id=${nameNoSpace}title class=projectTitle>${that.name}</p>
                         <p id=${nameNoSpace}date class=date>${that.deadline.getFullYear()}/${that.deadline.getMonth() + 1}/${that.deadline.getDate()}</p>
                         <a href=# rel=${that.id} class=linkDeleteProject>delete</a>
                         <a href=# rel=${that.id} class=linkUpdateProject>update</a>
                         <a href=# rel=${that.id} class=linkAddProjectTask>add</a>
                    </div>
                    <div id=pastTask>
                    </div>
                    <div id=taskContainer>
                    </div>
               </div>`;
               $(toAppend).append(html);
               resolve();
          });
     }
}
