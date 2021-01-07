/**
 * @classdesc This is the class used to create HTML for task objects.
 * @class
 * @extends EventHTML
 */
class TaskHTML extends EventHTML {

     /**
      * This is the constructor function for a TaskHTML object.
      * @inheritdoc
      * 
      * @param {String} status - This is the status of the project (complete or incomplete).
      */
     constructor(name, deadline, endTime, id, status) {
          super(name, deadline, endTime, id);
          this.status = status;
     }

     /** @inheritdoc */
     createDiv(toAppend, classNameAddition = "") {
          let that = this;
          return new Promise (function(resolve, reject) {
               console.log("task createDiv accessed");
               let nameNoSpace = that.name.replace(/\s+/g, '');
               let html = 
               `<div id=task${that.id.slice(4,11)} class=task${classNameAddition}>
                    <fieldset class=activityfieldset>
                         <input type=checkbox id=${nameNoSpace} data-link=${that.id} name=${nameNoSpace} data-htmlType=task class=activitycheckbox></input>
                         <label for=${nameNoSpace} class=activitychecklabel>${that.name}</label>
                    </fieldset>`
               if (classNameAddition === "") {
                    html = html +  `
                    <p id=${nameNoSpace}date class=date>${that.deadline.getFullYear()}/${that.deadline.getMonth() + 1}/${that.deadline.getDate()}</p>`
               }
               html = html + `
                    <a href=# rel=${that.id} class=linkDeleteTask>delete</a>
                    <a href=# rel=${that.id} class=linkUpdateTask>update</a>
               </div>`;
               $(toAppend).append(html);
               resolve();
          });
     }
}