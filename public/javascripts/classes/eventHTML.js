/**
 * @classdesc This is the class used to create HTML for events.
 * @class
 */
class EventHTML {

     /**
      * This is the constructor function for an EventHTML object.
      * @constructor
      * @param {string} name - This is the name of the event (will be a public instance variable)
      * @param {Date} deadline - This is when the event occurs (will be a public instance variable)
      * @param {Date} endTime - This is when the event ends (will be a public instance variable)
      * @param {string} id - This is the id of the event (will be a public instance variable)
      */
     constructor(name, deadline, endTime, id) {
          this.name = name;
          this.deadline = deadline;
          this.endTime = endTime;
          this.id = id;
     }

     /**
      * Creates divs to display each document.
      * 
      *  @param {String} toAppend - This is the id of the element the document is appended to
      *  @param {String} classNameAddition - This is the string that will be added to the end of a class name.
      */
     createDiv(toAppend, classNameAddition = "") {
          let that = this;
          return new Promise (function(resolve, reject) {
               console.log("event createDiv accessed");
               let nameNoSpace = that.name.replace(/\s+/g, '');
               let startMinutes;
               let endMinutes;
               if (that.deadline.getMinutes() < 10) {
                    startMinutes = "0" + that.deadline.getMinutes();
               }
               else {
                    startMinutes = that.deadline.getMinutes();
               }
               if (that.endTime.getMinutes() < 10) {
                    endMinutes = "0" + that.endTime.getMinutes();
               }
               else {
                    endMinutes = that.endTime.getMinutes();
               }
               let html = 
               `<div id=event${that.id.slice(4,11)} class=event${classNameAddition}>
                    <div id=eventInfo>
                         <p id=${nameNoSpace}title class=projectTitle>${that.name}</p>`
               if (classNameAddition === "") {
                    html = html +  `
                    <p id=${nameNoSpace}date class=date>${that.deadline.getFullYear()}/${that.deadline.getMonth() + 1}/${that.deadline.getDate()}</p>`
               }
               html = html +  
                         `<p id=${nameNoSpace}time class=time>${that.deadline.getHours()}:${startMinutes} - ${that.endTime.getHours()}:${endMinutes}</p>
                         <a href=# rel=${that.id} class=linkDeleteEvent>delete</a>
                         <a href=# rel=${that.id} class=linkUpdateEvent>update</a>
                    </div>
               </div>`;
               $(toAppend).append(html);
               resolve();
          });

     }
}