/**
 * @classdesc This is the class used to make ajax calls to change or retrieve project and task information.
 * @class
 */
class SiteAjax {

     /**
      * This function is the constructor function for a SiteAjax object.
      * @constructor
      * 
      * @param {Array} upcomingArray - This is the array where all retrieved upcoming content will be saved (will be a public instance variable).
      * @param {Array} recentlyCreatedArray - This is the array where all retrieved recently created content will be saved (will be a public instance variable).
      */
     constructor(upcomingArray, recentlyCreatedArray) {
          this.upcomingArray = upcomingArray;
          this.recentlyCreatedArray = recentlyCreatedArray;
     }

     /**
      * Removes all class objects from DOM and empties upcomingArray
      * 
      * @param {String} removeDiv - This is the id of the div to be removed
      * @param {String} parent - This is the id of the div that is the parent of the div to be removed
      */
     removeElements(removeDiv, parent) {
          console.log(`accessed removeElements() method for #${parent} #${removeDiv}`);
          let div = $("<div>").attr("id", removeDiv);
          $(`#${parent} #${removeDiv}`).detach();
          $(`#${parent}`).append(div);
     }

     /**
      * Handles response sent back by database by logging errors or reloading the project list
      *  
      * @param {Response} response - This is the response object sent from the ajax call
      * @param {String} elementId - This is the id of the element that contains an input fieldset that must be cleared
      */
     handleResponse(response, elementId) {
          if (response.msg === '' && elementId) {
               console.log("ajax call successful");
               $(`${elementId} fieldset input`).val("");
               this.populateDivs();
          }
          else if(response.msg === '' && !(elementId)) {
               console.log("ajax call successful");
               this.populateDivs();
          }
          else {
               console.log(`ERROR ${JSON.stringify(response.msg)}`);
          }
     }

     /**
      * Creates a project or task div based on information retrieved from database.
      * 
      * @param {JSON} doc - This is the JSON representation of the project or task information retrieved from the database.
      * @param {String} elementToAppend - This is the id of the element to which the new project or task is added to.
      * @param {Array} databaseContentArray - This is the array to which the JSON information is saved to.
      */
     async createProjectOrTask(doc, elementToAppend, databaseContentArray) {
          if (doc.type === "project") {
               let projectHTML = new ProjectHTML(doc.name, new Date(doc.deadline), 0, doc._id, []);
               let projectTaskArray = doc.taskList;
               await projectHTML.createDiv(elementToAppend);
               projectTaskArray.forEach(async function(projectTask) {
                    console.log("creating div for " + projectTask.name);
                    let projectTaskHTML = new ProjectTaskHTML(projectTask.name, new Date(projectTask.deadline), 0, projectTask._id, projectTask.status , doc._id);
                    projectHTML.taskList.push(projectTaskHTML);
                    await projectTaskHTML.createDiv(`${elementToAppend} #project${doc._id.slice(4,11)} #taskContainer`);
               });
               databaseContentArray.push(projectHTML);
          }
          else if (doc.type === "task") {
               let taskHTML = new TaskHTML(doc.name, new Date(doc.deadline), 0, doc._id, doc.status);
               databaseContentArray.push(taskHTML);
               await taskHTML.createDiv(elementToAppend);
          }
          else if (doc.type === "event") {
               let eventHTML = new EventHTML(doc.name, new Date(doc.deadline), new Date(doc.endTime), doc._id);
               databaseContentArray.push(eventHTML);
               await eventHTML.createDiv(elementToAppend);
          }
     }

     /**
      * Creates divisions using information received from database
      */
      async populateDivs() {
          let upcomingArray = this.upcomingArray;
          upcomingArray.length = 0;
          let recentlyCreatedArray = this.recentlyCreatedArray;
          recentlyCreatedArray.length = 0;
          let that = this;
          console.log("accessed populateDivs() method");
          this.removeElements("container", "projectList");
          this.removeElements("container", "recentlyCreatedList");
          $.getJSON("/project/userinfo", function(docs) {
               console.log(docs);
               docs[0].forEach(async function(doc) {
                    that.createProjectOrTask(doc, "#projectList #container", upcomingArray);
               });
               docs[1].forEach(async function(doc) {
                    that.createProjectOrTask(doc, "#recentlyCreatedList #container", recentlyCreatedArray);
               });
          });
     }

     /**
      * Receives search term from user and sends to database controller classes as HTML GET request to search for their search term
      * 
      * @param {String} searchType - This is the parameter of the search (date or name)
      */
     search(searchType) {
          this.removeElements("searchResult", "wrapper");
          let searchTerm = $("#search fieldset input#search").val();
          console.log(`search term: ${searchTerm}`);
          if (!searchTerm) {
               alert("Please fill in the search bar");
          }
          else {
               $.ajax({
                    type: "GET",
                    url: "/project/search/" + searchType + "/" + searchTerm,
               }).done(async function(response) {
                    if (response.msg === '') {
                         console.log("search result received");
                         $(`search fieldset input`).val("");
                         console.log("remove div");
                         let searchResult = response.searchResult;
                         let searchResultDeadline = new Date(searchResult.deadline);
                         if (searchResult.type === "projectTask") {
                              let searchResultProjectDeadline = new Date(searchResult.projectDeadline);
                              $("#searchResult").append(`<p>Project: ${searchResult.projectName}, ${searchResultProjectDeadline.getFullYear()}/${searchResultProjectDeadline.getMonth() + 1}/${searchResultProjectDeadline.getDate()}</p>`)
                              $("#searchResult").append(`<p> Project Task: ${searchResult.name}, ${searchResultDeadline.getFullYear()}/${searchResultDeadline.getMonth() + 1}/${searchResultDeadline.getDate()}</p>`);
                         }
                         else {
                              $("#searchResult").append(`<p>${searchResult.name}, ${searchResultDeadline.getFullYear()}/${searchResultDeadline.getMonth() + 1}/${searchResultDeadline.getDate()}</p>`);
                         }
                    }
                    else {
                         console.log(`ERROR ${response.msg}`);
                         $("#searchResult").append(`<p>No results</p>`);
                    }
               });
          }
     }

     /**
      * Receives information from user and sends to database controller classes as HTML POST request to add object
      * 
      * @param {String} htmlType - This is the string that specifies whether the function is being used for a task or project
      * @param {String} rel - This is the database document id of the project to which a project task is being added to
      */
     add(htmlType, rel = "") {
          console.log("add function accessed");
          let that = this;
          let htmlTypeCap = htmlType.charAt(0).toUpperCase() + htmlType.slice(1);
          let deadline = new Date($(`#add${htmlTypeCap} fieldset input#input${htmlTypeCap}Deadline`).val());
          deadline.setDate(deadline.getDate() + 1);
          let projectName = $(`#add${htmlTypeCap} fieldset input#input${htmlTypeCap}Name`).val();
          let startHours = 0;
          let startMinutes = 0;
          let endHours = 0;
          let endMinutes = 0;
          if (htmlType === "event") {
               startHours = parseInt($(`#add${htmlTypeCap} fieldset input#inputStartEventHours`).val());
               startMinutes = parseInt($(`#add${htmlTypeCap} fieldset input#inputStartEventMinutes`).val());
               endHours = parseInt($(`#add${htmlTypeCap} fieldset input#inputEndEventHours`).val());
               endMinutes = parseInt($(`#add${htmlTypeCap} fieldset input#inputEndEventMinutes`).val());
          }
          switch(true) {
               case (deadline === ""):
               case (projectName === ""):
               case (startHours === ""):
               case (startMinutes === ""):
               case (endHours === ""):
               case (endMinutes === ""):
                    console.log("User did not fill in fields");
                    alert("You got a registered bruh moment (YOU DIDN'T FILL IN ALL FIELDS)");
                    break;
               case (isNaN(startHours) === true):
               case (isNaN(startMinutes) === true):
               case (isNaN(endHours) === true):
               case (isNaN(endMinutes) === true):
                    console.log("User did not fill fields with correct value types");
                    alert("You got a registered bruh moment (YOU DIDN'T FILL FIELDS WITH THEIR CORRECT TYPES)");
                    break;
               case (endHours > 60 || endHours < 0):
               case (endMinutes > 60 || endHours < 0):
                    console.log("User did not input viable time values");
                    alert("You got a registered bruh moment (THE HOUR VALUE OF YOUR TIME MUST BE LESS THAN 24 GREATER THAN 0 AND THE MINUTES VALUE LESS THAN 60 GREATER THAN 0)");
                    break; 
               case (endHours < startHours):
               case (endHours === startHours && endMinutes < startMinutes):
                    console.log("User did not input correct times");
                    alert("You got a registered bruh moment (YOUR END TIME IS LATER THAN YOUR START TIME)");
                    break; 
               default:
                    let newInfo;
                    if (htmlType === "event") {
                         let startTime = new Date(deadline).setHours(startHours, startMinutes);
                         let endTime = new Date(deadline).setHours(endHours, endMinutes);
                         newInfo = {
                              "name" : projectName,
                              "deadline" : startTime,
                              "endTime" : endTime
                         }
                    }
                    else {
                         console.log(deadline);
                         newInfo = {
                              "name" : projectName,
                              "deadline" : deadline
                         }    
                    }
                    console.log("Data gathered");
                    let url;
                    if (htmlType === "projectTask") {
                         url = `/project/addprojecttask/` + rel;
                    }
                    else {
                         url = `/project/add${htmlType.toLowerCase()}/`;
                    }
                    $.ajax({
                         type: "POST",
                         data: newInfo,
                         url: url,
                         dataType: 'JSON'
                    }).done((response) => that.handleResponse(response, `#add${htmlTypeCap}`));
          }
     }

     /**
      * Receives information from user and sends to database controller classes as HTML PUT request to update object
      *
      * @param {string} htmlType - This is the string that specifies whether the function is being used for a task or project
      * @param {string} rel - This is the object id that specifies where the update link leads to (will be a private instance variable)
      */
     update(htmlType, rel) {
          event.preventDefault();
          let that = this;
          let htmlTypeCap = htmlType.charAt(0).toUpperCase() + htmlType.slice(1);
          console.log("update function accessed");
          let updatedInfo;
          let updatedName = $(`#update${htmlTypeCap} fieldset input#change${htmlTypeCap}Name`).val();
          let updatedDeadline = $(`#update${htmlTypeCap} fieldset input#change${htmlTypeCap}Deadline`).val();
          if (htmlType === "event") {
               let startHours = parseInt($(`#update${htmlTypeCap} fieldset input#inputStart${htmlTypeCap}Hours`).val());
               let startMinutes = parseInt($(`#update${htmlTypeCap} fieldset input#inputStart${htmlTypeCap}Minutes`).val());
               let endHours = parseInt($(`#update${htmlTypeCap} fieldset input#inputEnd${htmlTypeCap}Hours`).val());
               let endMinutes = parseInt($(`#update${htmlTypeCap} fieldset input#inputEnd${htmlTypeCap}Minutes`).val());
               updatedDeadline = new Date(updatedDeadline.split("-")[0], parseInt(updatedDeadline.split("-")[1] - 1), updatedDeadline.split("-")[2]);
               console.log("Inputted date: " + updatedDeadline);
               let startTime = updatedDeadline.setHours(startHours, startMinutes);
               let endTime = new Date(updatedDeadline.setHours(endHours, endMinutes));
               updatedInfo = {
                    "name" : updatedName,
                    "deadline" : startTime,
                    "endTime" : endTime
               }
          }
          else {
               updatedDeadline = new Date(updatedDeadline.split("-")[0], parseInt(updatedDeadline.split("-")[1] - 1), updatedDeadline.split("-")[2]);
               updatedInfo = {
                    'name': updatedName,
                    'deadline': updatedDeadline
               }
          }
          console.log(`${htmlType} updated`);
          console.log(rel);
          $.ajax({
               type: "PUT",
               data: updatedInfo,
               url: `/project/update${htmlType.toLowerCase()}/` + rel,
               dataType: "JSON"
          }).done((response) => that.handleResponse(response, `#update${htmlTypeCap}`));
     }

     /**
      * Receives information from user and sends to database controller classes as HTML DELETE request to delete object
      *
      * @param {string} htmlType - This is the string that specifies whether the function is being used for a task or project
      * @param {string} rel - This is the object id that specifies where the delete link leads to (will be a private instance variable)
      */
     delete(htmlType, rel, isForCheckbox) {
          event.preventDefault();
          console.log("delete function accessed");
          let that = this;
          let deleteConfirm;
          if(isForCheckbox) {
               deleteConfirm = true;
          }
          else {
               deleteConfirm = confirm("Are you sure you want to delete this?");
          }
          if(deleteConfirm) {
               $.ajax({
                    type: "DELETE",
                    url: `/project/delete${htmlType}/` + rel
               }).done((response) => that.handleResponse(response));
          }
     }

     /**
      * Changes the status of a project task to complete or incomplete
      * 
      * @param {String} parentId - This is the id of the parent of the element of the parent project.
      * @param {String} elementId - This is the id of the element of the parent project.
      * @param {String} rel - This is the database document id of the project and the database document id of the project task separated by a slash
      * @param {Boolean} isIncomplete - This is whether the document was complete or incomplete
      */
     changeStatusProjectTask(parentId, elementId, rel, isIncomplete) {
          console.log("project task change status function accessed");
          let that = this;
          let databaseContentArray;
          console.log(parentId);
          if(parentId === "projectList") {
               databaseContentArray = this.upcomingArray;
          }
          else {
               databaseContentArray = this.recentlyCreatedArray;
          }
          let updatedInfo;
          console.log(rel);
          databaseContentArray.forEach(function(doc) {
               console.log(doc.id);
               if(doc.id === rel.split("/")[0]) {
                    doc.taskList.forEach(function(task, index, taskList) {
                         console.log(task.id);
                         if(task.id === rel.split("/")[1]) {
                              if(isIncomplete) {
                                   updatedInfo = {"status" : "complete"};
                                   taskList[index].status = "complete";
                              }
                              else {
                                   updatedInfo = {"status" : "incomplete"};
                                   taskList[index].status = "incomplete";
                              }
                         }
                    });
               }
          });
          $.ajax({
               type : "PUT",
               data : updatedInfo,
               url : `/project/changestatusprojecttask/` + rel,
               dataType : "JSON"
          }).done(function(response) {
               if (response.msg === '') {
                    console.log("ajax call successful");
                    console.log($(`#${elementId} #pastTask button`).attr("class"));
                    that.populateDivs();
               }
               else {
                    console.log(`ERROR ${JSON.stringify(response.msg)}`);
               }
          }); 
     }
}