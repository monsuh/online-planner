/**
 * @classdesc This is the class used to create the schedule
 * @class
 */

class Schedule {

     /**
      * This function is the constructor function for a Schedule object.
      * @constructor
      * 
      * @param {Array} databaseContentArray - This is the array where all retrieved content will be saved (will be a public instance variable).
      * @param {Float} windowHeight - This is the height of the browser window (will be a public instance variable).
      * @param {Float} windowWidth - This is the width of the browser window (will be a public instance variable).
      */
     constructor(databaseContentArray, windowHeight, windowWidth, canvas = "", mostRecentSunday = "") {
          this.databaseContentArray = databaseContentArray;
          this.windowHeight = windowHeight;
          this.windowWidth = windowWidth;
          this.canvas = canvas;
          this.mostRecentSunday = mostRecentSunday;
     }

     /**
      * Creates the schedule grid on the webpage.
      */
     initialize() {
          let windowHeight = this.windowHeight;
          let windowWidth = this.windowWidth;
          this.canvas = new fabric.Canvas("schedule-canvas");
          let canvas = this.canvas;
          console.log(windowWidth);
          canvas.setDimensions({width: windowWidth + 2, height: windowHeight});
          let scheduleGridWidth = windowWidth/7;
          let scheduleGridHeight = windowHeight/13;
          let lineProperties = {stroke: "grey", strokeWidth: 1, selectable: false};
          let currentDate = new Date();
          if(currentDate.getDay() === "0") {
               this.mostRecentSunday = currentDate; 
          }
          else {
               this.mostRecentSunday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
          }
          let mostRecentSunday = this.mostRecentSunday;
          for(let i = 0; i < 7; i++) {
               let gridLine = new fabric.Line([0 + scheduleGridWidth*i, 0, 0 + scheduleGridWidth*i, windowHeight], lineProperties);
               let date = new Date(mostRecentSunday);
               date.setDate(date.getDate() + i);
               let fullDateText = date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
               let dayText = fullDateText.split(" ")[0].slice(0, -1);
               let dayTextLength = dayText.length;
               let dateText = `${fullDateText.split(" ")[1]} ${fullDateText.split(" ")[2].slice(0,-1)}`;
               let dateTextLength = dateText.length;
               let dayTextCanvas = new fabric.Text(dayText, {
                    left: (scheduleGridWidth/2 + scheduleGridWidth*i) - (dayTextLength*scheduleGridWidth/46), 
                    top: scheduleGridHeight/10,
                    fontSize: scheduleGridWidth/12,
                    selectable: false
               });
               let dateTextCanvas = new fabric.Text(dateText, {
                    left: (scheduleGridWidth/2 + scheduleGridWidth*i) - (dateTextLength*scheduleGridWidth/48), 
                    top: scheduleGridHeight/10 + scheduleGridHeight/2.5,
                    fontSize: scheduleGridWidth/12,
                    selectable: false
               });
               canvas.add(gridLine);
               canvas.add(dayTextCanvas);
               canvas.add(dateTextCanvas);
          }
          let finalGridLine = new fabric.Line([windowWidth, 0, windowWidth, windowHeight], lineProperties);
          let dateLine = new fabric.Line([0, scheduleGridHeight, windowWidth, scheduleGridHeight], lineProperties);
          canvas.add(finalGridLine);
          canvas.add(dateLine);
     }
     
     /**
      * Retrieves user events, projects, and tasks for the current week.
      */
     retrieveUserInfo() {
          let databaseContentArray = this.databaseContentArray;
          return new Promise(function(resolve, reject) {
               $.getJSON("/project/userinfo", function(docs) {
                    docs[2].forEach(function(doc) {
                         if (doc.type === "project") {
                              let projectTaskArray = doc.taskList;
                              projectTaskArray.forEach(async function(projectTask) {
                                   let projectTaskHTML = new ProjectTaskHTML(projectTask.name, new Date(projectTask.deadline), 0, projectTask._id, projectTask.status , doc._id);
                                   databaseContentArray.push(projectTaskHTML);
                              });
                         }
                         else if (doc.type === "task"){
                              let taskHTML = new TaskHTML(doc.name, new Date(doc.deadline), 0, doc._id, doc.status);
                              databaseContentArray.push(taskHTML);
                         }
                         else if (doc.type === "event") {
                              let eventHTML = new EventHTML(doc.name, new Date(doc.deadline), new Date(doc.endTime), doc._id);
                              databaseContentArray.push(eventHTML);
                         }
                    });
                    resolve();
               });
          });
     }

     /**
      * Fills the schedule grid with tasks at appropriate dates.
      */
     populate() {
          let windowHeight = this.windowHeight;
          let windowWidth = this.windowWidth;
          let databaseContentArray = this.databaseContentArray;
          let canvas = this.canvas;
          let mostRecentSunday = this.mostRecentSunday;
          console.log(databaseContentArray.length);
          databaseContentArray.forEach(async function(content) {
               let taskDate = content.deadline;
               console.log("creating div for " + content.name);
               console.log(`task deadline: ${taskDate}`);
               content.createDiv("#day0");
          });
     }
}