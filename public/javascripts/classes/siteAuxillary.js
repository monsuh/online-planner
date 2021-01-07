/**
 * @classdesc This is the class used to handle nauxillary functions on the page that do not require HTTP calls.
 * @class
 * @extends SiteAjax
 */
class SiteAuxillary extends SiteAjax {

     /**@inheritdoc */
     constructor(projectArray, recentlyCreatedArray) {
          super(projectArray, recentlyCreatedArray);
     }

     /**
      * Displays modal box to add or update specific project or task
      * 
      * @param {String} elementId - This is the element id of the modal box
      * @param {String} openerId - This is the database document id of the project or task that opened the modal
      */
     openModal(elementId, openerId) {
          $(`#${elementId}`).css("display", "block");
          if(openerId) {
               $(`#${elementId} fieldset button`).attr("rel", openerId);
          }
     }

     /**
      * Hides previously open modal box
      * 
      * @param {String} elementId - This is the element id of the modal box
      */
     closeModal(elementId) {
          $(`#${elementId}`).css("display", "none");
     }

     /**
      * Fills in fields for update modal box
      * 
      * @param {String} htmlType - This is the type of activity (project or task) the div belongs to.
      * @param {String} elementId - This is the id of the div of the project or task being updated.
      * @param {String} containerId - This is the id of the container that the div belongs to. 
      */
     prefillUpdateModal(htmlType, elementId, containerId) {
          console.log(elementId);
          console.log(containerId);
          let that = this;
          let htmlTypeCap = htmlType.charAt(0).toUpperCase() + htmlType.slice(1);
          let currentName;
          let currentDateRaw;
          let currentDate;
          let currentDateMonth;
          let currentDateNumber;
          let currentStartHours;
          let currentStartMinutes;
          let currentEndHours;
          let currentEndMinutes;
          if(htmlType === "project") {
               currentName = $(`#wrapper ${containerId} #container ${elementId} #projectInfo .projectTitle`).html();
               currentDateRaw = new Date($(`#wrapper ${containerId} #container ${elementId} #projectInfo .date`).html());
          }
          else if(htmlType === "task") {
               currentName = $(`#wrapper ${containerId} #container ${elementId} fieldset label`).html();
               currentDateRaw = new Date($(`#wrapper ${containerId} #container ${elementId} .date`).html());
          }
          else if(htmlType === "projectTask") {
               currentName = $(`#wrapper ${containerId} #container #${$(elementId).parent().parent().attr("id")} #taskContainer ${elementId} fieldset label`).html();
               currentDateRaw = new Date($(`#wrapper ${containerId} #container #${$(elementId).parent().parent().attr("id")} #taskContainer ${elementId} .date`).html());
          }
          else {
               currentName = $(`#wrapper ${containerId} #container ${elementId} #eventInfo .projectTitle`).html();
               currentDateRaw = new Date($(`#wrapper ${containerId} #container ${elementId} #eventInfo .date`).html());
               currentStartHours = ($(`#wrapper ${containerId} #container ${elementId} #eventInfo .time`).html()).split(" - ")[0].split(":")[0];
               currentStartMinutes = ($(`#wrapper ${containerId} #container ${elementId} #eventInfo .time`).html()).split(" - ")[0].split(":")[1];
               currentEndHours = ($(`#wrapper ${containerId} #container ${elementId} #eventInfo .time`).html()).split(" - ")[1].split(":")[0];
               currentEndMinutes = ($(`#wrapper ${containerId} #container ${elementId} #eventInfo .time`).html()).split(" - ")[1].split(":")[1];
          }
          if (currentDateRaw.getMonth() < 10) {
               currentDateMonth = "0" + (currentDateRaw.getMonth() + 1);
          }
          else {
               currentDateMonth = currentDateRaw.getMonth() + 1;
          }
          if (currentDateRaw.getDate() < 10) {
               currentDateNumber = "0" + (currentDateRaw.getMonth() + 1);
          }
          else {
               currentDateNumber = currentDateRaw.getDate();
          }
          currentDate = `${currentDateRaw.getFullYear()}-${currentDateMonth}-${currentDateNumber}`;
          console.log(`Name: ${currentName} Date: ${currentDate}`);
          $(`#update${htmlTypeCap} fieldset input#change${htmlTypeCap}Name`).val(currentName); 
          $(`#update${htmlTypeCap} fieldset input#change${htmlTypeCap}Deadline`).val(currentDate); 
          if(htmlType === "event") {
               $(`#update${htmlTypeCap} fieldset input#inputStartEventHours`).val(currentStartHours); 
               $(`#update${htmlTypeCap} fieldset input#inputStartEventMinutes`).val(currentStartMinutes); 
               $(`#update${htmlTypeCap} fieldset input#inputEndEventHours`).val(currentEndHours); 
               $(`#update${htmlTypeCap} fieldset input#inputEndEventMinutes`).val(currentEndMinutes); 
          }
     }

     /**
      * Shows all project tasks (complete and incomplete) belonging to a project
      * 
      * @param {String} elementId - This is the id of the element of the parent project
      */
     showAllProjectTasks(elementId) {
          let databaseContentArray;
          if(elementId.split(" ")[0] === "#projectList") {
               databaseContentArray = this.projectArray;
          }
          else {
               databaseContentArray = this.recentlyCreatedArray;
          }
          console.log(databaseContentArray);
          this.removeElements("pastTask", elementId.slice(1));
          this.removeElements("taskContainer", elementId.slice(1));
          let projectId = $(`#wrapper ${elementId} #projectInfo a.linkUpdateProject`).attr("rel");
          console.log(projectId);
          console.log(databaseContentArray);
          databaseContentArray.forEach(function(doc) {
               if(doc instanceof ProjectHTML && doc.id === projectId) {
                    console.log("tasklist " + doc.taskList.toString());
                    let isThereComplete = false;
                    doc.taskList.forEach(async function(task) {
                         if(task.status === "complete") {
                              isThereComplete = true;
                              await task.createPastDiv(`${elementId} #taskContainer`);
                         }
                         else {
                              await task.createDiv(`${elementId} #taskContainer`);
                         }
                    });
                    if(isThereComplete && $(`${elementId} #pastTask button.hidePastTaskBtn`).length === 0) {
                         console.log("button being created")
                         //&& $(`#projectList #container ${elementId} #pastTask button.hidePastTaskBtn`).length === 0
                         $(`${elementId} #pastTask`).append(`<button type="button" class="hidePastTaskBtn">Hide past tasks</button>`);
                    }
               }
          });
     }

     /**
      * Shows only the incomplete project tasks belonging to a project
      * 
      * @param {String} elementId - This is the id of the element of the parent project
      */
     showCurrentProjectTasks(elementId) {
          let databaseContentArray;
          if(elementId.split(" ")[0] === "#projectList") {
               databaseContentArray = this.projectArray;
          }
          else {
               databaseContentArray = this.recentlyCreatedArray;
          }
          let projectId = $(`#wrapper ${elementId} #projectInfo a.linkUpdateProject`).attr("rel");
          this.removeElements("pastTask", elementId.slice(1));
          this.removeElements("taskContainer", elementId.slice(1));
          databaseContentArray.forEach(function(doc) {
               if(doc instanceof ProjectHTML && doc.id === projectId) {
                    console.log(`taskList: ${doc.taskList}`);
                    let isThereComplete = false;
                    doc.taskList.forEach(async function(task) {
                         if(task.status === "incomplete") {
                              await task.createDiv(`${elementId} #taskContainer`);
                         }
                         else if(task.status === "complete") {
                              isThereComplete = true;
                         }
                    });
                    if (isThereComplete) {
                         $(`${elementId} #pastTask`).append(`<button type="button" class="pastTaskBtn">Show past tasks</button>`);
                    }
               }
          });
     }
}