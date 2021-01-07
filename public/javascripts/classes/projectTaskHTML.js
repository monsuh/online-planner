/**
 * @classdesc This is the class used to create projectTask HTML objects.
 * @class
 * @extends TaskHTML
 */
class ProjectTaskHTML extends TaskHTML {

     /**
      * This is the constructor function for a ProjectTaskHTML object.
      * @inheritdoc
      * 
      * @param {String} projectId - This is the database document id of the associated project (will be a public instance variable). 
      */
     constructor(name, deadline, endTime, id, status, projectId) {
          super(name, deadline, endTime, id, status)
          this.projectId = projectId;
     }

     /** @inheritdoc */
     createDiv(toAppend, classNameAddition = "") {
          let that = this;
          if (this.status === "incomplete") {
               return new Promise (function(resolve, reject) {
                    console.log("project task createDiv accessed");
                    let nameNoSpace = that.name.replace(/\s+/g, '');
                    let html = 
                    `<div id=task${that.id.slice(4,11)} class=projectTask${classNameAddition}>
                         <fieldset class=activityfieldset>
                              <input type=checkbox id=${nameNoSpace} data-link=${that.projectId}/${that.id} name=${nameNoSpace} data-htmlType= projecttask class=activitycheckbox></input>
                              <label for=${nameNoSpace} class=activitychecklabel>${that.name}</label>
                         </fieldset>`
                    if (classNameAddition === "") {
                         html = html + `
                         <p id=${nameNoSpace}date class=date>${that.deadline.getFullYear()}/${that.deadline.getMonth() + 1}/${that.deadline.getDate()}</p>`;
                    }
                    html = html + `
                         <a href=# rel=${that.projectId}/${that.id} class=linkDeleteProjectTask>delete</a>
                         <a href=# rel=${that.projectId}/${that.id} class=linkUpdateProjectTask>update</a>
                    </div>`;
                    $(`${toAppend}`).append(html);
                    console.log("appended");
                    resolve();
               });
          }
          else {
               return new Promise (function(resolve, reject) {
                    console.log("project task createDiv accessed");
                    console.log(`${toAppend.split(" ")[0]} ${toAppend.split(" ")[1]} ${toAppend.split(" ")[2]}`);
                    let nameNoSpace = that.name.replace(/\s+/g, '');
                    if($(`${toAppend.split(" ")[0]} ${toAppend.split(" ")[1]} ${toAppend.split(" ")[2]} #pastTask button.pastTaskBtn`).length === 0) {
                         let html = `<button type="button" id="btn${nameNoSpace}" class="pastTaskBtn">Show past tasks</button>`
                         $(`${toAppend.split(" ")[0]} ${toAppend.split(" ")[1]} ${toAppend.split(" ")[2]} #pastTask`).append(html);
                         console.log(`${nameNoSpace} button appended`);
                         resolve();
                    }
                    else {
                         resolve();
                    }
               });
          }
     }

     /**
      * Creates div to display completed project tasks.
      * 
      * @param {String} toAppend - This is the id of the element the completed project task div will be appended to.
      */
     createPastDiv(toAppend) {
          let that = this;
          let nameNoSpace = that.name.replace(/\s+/g, '');
          return new Promise (function(resolve, reject) {
               let html = 
               `<div class=pastProjectTaskOverlay>
                    <div id=task${that.id.slice(4,11)} class=pastProjectTask>
                         <fieldset class=activityfieldset>
                              <input type=checkbox id=${nameNoSpace} data-link=${that.projectId}/${that.id} name=${nameNoSpace} data-htmlType= projecttask class=activitycheckbox checked></input>
                              <label for=${nameNoSpace} class=activitychecklabel>${that.name}</label>
                         </fieldset>
                         <p id=${nameNoSpace}date class=date>${that.deadline.getFullYear()}/${that.deadline.getMonth() + 1}/${that.deadline.getDate()}</p>
                         <a href=# rel=${that.projectId}/${that.id} class=linkDeleteProjectTask>delete</a>
                         <a href=# rel=${that.projectId}/${that.id} class=linkUpdateProjectTask>update</a>
                    </div>
               </div>`;
               $(toAppend).append(html);
               resolve();
          });
     }
}