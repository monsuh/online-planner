const Project = require("../models/projectmodel.js");
const Task = require("../models/taskmodel.js");
const Event = require("../models/eventmodel.js");

//COMPLEXITY ANALYSIS FOR SORTING AND SEARCHING: https://docs.google.com/document/d/1P6Kpfnf3AwNhnoPpdZoM59Q_JPdpgb_FKw3xHkHnlO4/edit?usp=sharing

/**
 * Module with functions related to manipulating event, project, and task information in the database. 
 * @module
 */

/**
 * @classdesc This is the class used to manipulate project and task information in the database.
 * @class
 */
module.exports = class DatabaseController {

     /**
      * This function is the constructor function for a database object.
      * @constructor
      * 
      * @param {Request} req - This is the request object from the user (will be a public instance variable)
      * @param {Response} res - This is the response object to the user (will be a public instance variable) 
      * @param {Response} collectionName - This is the name of the collection the user is searching through (will be a public instance variable) 
      */
     constructor(req, res, collectionName) {
          this.req = req;
          this.res = res;
          this.collectionName = collectionName;
     }

     /**
      * Retrieves all info in collection from database as a promise.
      * 
      * @returns {Promise} This is the array of all project and task objects.
      */
     retrieveAll() {
          let req = this.req;
          let res = this.res;
          let collectionName = this.collectionName;
          return new Promise(function(resolve, reject) {
               Project.find({user : req.session.userId}, function(err, projects) {
                    if (err) throw err;
                    else {
                         let docsArray = [];
                         for(let i = 0; i < projects.length; i++) {
                              docsArray.push(projects[i]);
                              for(let j = 0; j < projects[i].taskList.length; j++) {
                                   let projectTask = projects[i].taskList[j];
                                   docsArray.push({ "_id" : projectTask._id,"type" : projectTask.type, "name" : projectTask.name, "deadline" : projectTask.deadline, "projectId" : projects[i]._id, "projectName" : projects[i].name, "projectDeadline" : projects[i].deadline});
                              }
                         }
                         Task.find({user : req.session.userId}, function (err, tasks) {
                              if (err) throw err;
                              else {
                                   console.log("task documents retrieved");
                                   for (let i = 0; i < tasks.length; i++) {
                                        docsArray.push(tasks[i]);
                                   }
                                   Event.find({user : req.session.userId}, function (err, events) {
                                        if (err) throw err;
                                        else {
                                             console.log("event documents retrieved");
                                             for (let i = 0; i < events.length; i++) {
                                                  docsArray.push(events[i]);
                                             }
                                             resolve(docsArray);
                                        }
                                   });
                              }
                         });
                    }
               });
          }).catch(function(err) {
               console.log(err);
          });
     }

     /**
      * Retrieves all project/task data within relevant date range (one day before, two weeks after current) for specific user from database as a promise.
      * 
      * @returns {Promise} This is the array of all project and task objects for a specific user from the relevant date range.
      */
     retrieveUpcoming() {
          /**
           * Adds a certain number of days to a given date.
           * 
           * @param {Date} date - This is the date that days will be added to (will be a private instance variable).
           * @param {Integer} days - This is number of days to add (will be a private instance variable).
           * @returns {Date} This is the new date that has had days added to it.
           */
          function addDays(date, days) {
               let addDate = new Date(date);
               addDate.setDate(addDate.getDate() + days);
               addDate.setHours(0,0,0,0);
               return addDate;
          }   
          let req = this.req;
          let res = this.res;
          let that = this;
          let today = new Date();
          let minDate = addDays(today, -3);
          let maxDate = addDays(today, 14);
          console.log(minDate);
          console.log(maxDate);
          return new Promise(function(resolve, reject) {
               Project.find({deadline : {$gte: minDate, $lte: maxDate}, user : req.session.userId}, function(err, projects) {
                    if (err) throw err;
                    else {
                         console.log("project documents retrieved");
                         Project.find({$or: [{deadline: {$lt: minDate}}, {deadline: {$gt: maxDate}}], user : req.session.userId, "taskList.deadline": {$gte: minDate, $lte: maxDate}}, function(err, projectsWithGoodTaskDate) {
                              if (err) throw err;
                              else {
                                   console.log("project with good task dates documents retrieved");
                                   for (let i = 0; i < projectsWithGoodTaskDate.length; i++) {
                                        projects.push(projectsWithGoodTaskDate[i]);
                                   }
                                   Task.find({deadline : {$gte: minDate, $lte: maxDate}, user : req.session.userId}, function (err, tasks) {
                                        if (err) throw err;
                                        else {
                                             console.log("task documents retrieved");
                                             for (let i = 0; i < tasks.length; i++) {
                                                  projects.push(tasks[i]);
                                             }
                                             Event.find({deadline : {$gte: minDate, $lte: maxDate}, user : req.session.userId}, function(err, events) {
                                                  if (err) throw err;
                                                  else {
                                                       console.log("event documents retrieved");
                                                       for (let i = 0; i < events.length; i++) {
                                                            projects.push(events[i]);
                                                       }
                                                       resolve(projects);
                                                  }
                                             }).limit(20);
                                        }
                                   }).limit(20);
                              }
                         }).limit(20);
                    }
               }).limit(20);
          }).catch(function(err) {
               console.log(err);
          });
     }

     /**
      * Retrieves up to four of the most recently created project/task docs.
      * 
      * @returns {Promise} This is the array of up to six of the most recently created project and task objects for a specific user.
      */
     retrieveRecentlyCreated() {
          let req = this.req;
          let res = this.res;
          let that = this;
          return new Promise(function(resolve, reject) {
               Project.find({user : req.session.userId}, null, {sort: {"_id" : -1}}, function(err, projects) {
                    if (err) throw err;
                    else {
                         console.log("project documents retrieved");
                         Task.find({user : req.session.userId}, null, {sort: {"_id" : -1}}, async function(err, tasks) {
                              if (err) throw err;
                              else {
                                   console.log("task documents retrieved");
                                   for (let i = 0; i < tasks.length; i++) {
                                        projects.push(tasks[i]);
                                   }
                                   Event.find({user : req.session.userId}, null, {sort: {"_id" : -1}}, async function(err, events) {
                                        if (err) throw err;
                                        else {
                                             console.log("event documents retrieved");
                                             for (let i = 0; i < events.length; i++) {
                                                  projects.push(events[i]);
                                             }
                                             resolve(projects);
                                        }
                                   }).limit(4);
                              }
                         }).limit(4);
                    }
               }).limit(4);
          }).catch(function(err) {
               console.log(err);
          });
     }

     /**
      * Retrieves up to forty of the tasks due this week.
      * 
      * @returns {Promise} This is the array of all tasks that occur within the current week.
      */
     retrieveWeekly() {
          function findMostRecentSunday(date) {
               let mostRecentSunday;
               if(date.getDay() === "0") {
                    mostRecentSunday = date; 
               }
               else {
                    mostRecentSunday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
               }
               return mostRecentSunday;
          }   
          let req = this.req;
          let res = this.res;
          let that = this;
          let today = new Date();
          let minDate = findMostRecentSunday(today);
          let maxDate = new Date(minDate);
          maxDate.setDate(maxDate.getDate() + 6);
          maxDate.setHours(23,59);
          console.log(minDate);
          console.log(maxDate);
          return new Promise(function(resolve, reject) {
               Project.find({"taskList.deadline" : {$gte: minDate, $lte: maxDate}, user : req.session.userId}, function(err, projects) {
                    if (err) throw err;
                    else {
                         console.log("project documents retrieved");
                         projects.forEach(function(project, index, array) {
                              project.taskList = project.taskList.filter(task => (task.deadline > minDate && task.deadline < maxDate));
                              array[index].taskList = project.taskList;
                         });
                         Task.find({deadline : {$gte: minDate, $lte: maxDate}, user : req.session.userId}, async function (err, tasks) {
                              if (err) throw err;
                              else {
                                   console.log("task documents retrieved");
                                   for (let i = 0; i < tasks.length; i++) {
                                        projects.push(tasks[i]);
                                   }
                                   Event.find({deadline : {$gte: minDate, $lte: maxDate}, user : req.session.userId}, async function (err, events) {
                                        if (err) throw err;
                                        else {
                                             for (let i = 0; i < events.length; i++) {
                                                  projects.push(events[i]);
                                             }
                                             resolve(projects);
                                        }
                                   });
                              }
                         }).limit(20);
                    }
               }).limit(20);
          }).catch(function(err) {
               console.log(err);
          });
     }

     /**
      * @async
      * Sorts array with insertion sort.
      */
     /* async insertionSort() {
          let req = this.req;
          let res = this.res;
          let projectAndTaskArray = await this.retrieveAll();
          for (let i = 1; i < projectAndTaskArray.length; i++) {
               for (let j = i; j > 0; j--) {
                    if (projectAndTaskArray[j].name < projectAndTaskArray[j - 1].name) {
                         let tempStorage = projectAndTaskArray[j - 1];
                         projectAndTaskArray[j - 1] = projectAndTaskArray[j];
                         projectAndTaskArray[j] = tempStorage;
                    }
                    else if (projectAndTaskArray[j].name >= projectAndTaskArray[j - 1].name) {
                         break;
                    }
               }
          }
          console.log("project/task list insertion sorted");
          res.json(projectAndTaskArray);
     } */
     
     /**
      * @async
      * Sorts array with bubble sort.
      */
     /* async bubbleSort() {
          let req = this.req;
          let res = this.res;
          let projectAndTaskArray = await this.retrieveAll();
          let hasSwapped = true;
          do {
               hasSwapped = false;
               for (let i = 1; i < projectAndTaskArray.length; i++) {
                    if (projectAndTaskArray[i-1].name > projectAndTaskArray[i].name) {
                         let tempStorage = projectAndTaskArray[i-1];
                         projectAndTaskArray[i-1] = projectAndTaskArray[i];
                         projectAndTaskArray[i] = tempStorage;
                         hasSwapped = true;
                    }
               }
          }
          while (hasSwapped);
          console.log("project/task list bubble sorted");
          res.json(projectAndTaskArray);
     } */

     /**
      * @async
      * Sorts array according to date with built-in .sort() (Timsort).
      * 
      * @param {Array} projectAndTaskArray - This is the array to be sorted.
      * 
      * @returns {Array} - This is the sorted array.
      */
     async sortByDate(projectAndTaskArray) {
          try {
               projectAndTaskArray.sort(function (a,b) {
                    let paramA;
                    let paramB;
                    if (a.type === "project" && a.taskList.length !== 0) {
                         for(let i = 0; i < a.taskList.length; i++){
                              if(a.taskList[i].status === "incomplete") {
                                   paramA = a.taskList[i]["deadline"];
                                   break;
                              }
                         }
                    }
                    else {
                         paramA = a["deadline"];
                    }
                    if (b.type === "project" && b.taskList.length !== 0) {
                         for(let i = 0; i < b.taskList.length; i++){
                              if(b.taskList[i].status === "incomplete") {
                                   paramB = b.taskList[i]["deadline"];
                                   break;
                              }
                         }
                    }
                    else {
                         paramB = b["deadline"];
                    }
                    if (paramA < paramB) {
                         return -1;
                    }
                    if (paramA > paramB) {
                         return 1;
                    }
                    return 0;
               });
               return projectAndTaskArray
          } 
          catch(err) {
               console.log(err);
          }
     }

     /**
      * @async
      * Sorts array according to user-provided parameter with built-in .sort() (Timsort).
      * 
      * @param {String} param - This is the user-provided search parameter.
      * @param {Array} projectAndTaskArray - This is the array to be sorted.
      * 
      * @returns {Array} - This is the sorted array.
      */
     async sortByParam(param, projectAndTaskArray) {
          try {
               projectAndTaskArray.sort(function(a,b) {
                    let paramA = a[param];
                    let paramB = b[param];
                    if (paramA < paramB) {
                         return -1;
                    }
                    if (paramA > paramB) {
                         return 1;
                    }
                    return 0;
               });
               return projectAndTaskArray;
          }
          catch(err) {
               console.log(err);
          }
     }

     /**
      * @async
      * Retrieves and sorts information needed for user display
      */
     async retrieveForUser() {
          try {
               let res = this.res;
               let recentlyCreatedArray = await this.retrieveRecentlyCreated();
               let projectAndTaskArray = await this.retrieveUpcoming();
               let scheduleArray = await this.retrieveWeekly();
               await this.sortByParam("_id", recentlyCreatedArray);
               await this.sortByDate(projectAndTaskArray);
               await this.sortByDate(scheduleArray);
               recentlyCreatedArray = recentlyCreatedArray.reverse().slice(0,4);
               res.json([projectAndTaskArray, recentlyCreatedArray, scheduleArray]);
          }
          catch (err) {
               this.res.send({msg : err});
          }
     }

     /**
      * @async
      * Searches through all items in an array of objects linearly.
      */
/*      async linearSearch() {
          let req = this.req;
          let res = this.res;
          let searchTerm = req.params.searchTerm;
          console.log(searchTerm);
          let projectsTaskArray = [];
          console.log(`searching for term ${searchTerm}`);
          let searchProjectsTaskArray = await this.retrieveAll();
          console.log("project and task array received");
          let searchTermFound = false;
          for (let i = 0; i < searchProjectsTaskArray.length; i++) {
               if (searchProjectsTaskArray[i].name === searchTerm) {
                    searchTermFound = true;
                    res.send({msg : '', searchResult : searchProjectsTaskArray[i]});
               }
          }
          if (!searchTermFound) {
               res.send({msg : "UNABLE TO BE FOUND"});
          }
     } */

     /**
      * @async
      * Searches through all items in an array of objects by sorting it then using binary search.
      */
     async binarySearch() {
          try {
               let req = this.req;
               let res = this.res;
               let that = this;
               let searchTerm = req.params.searchTerm;
               let searchType = req.params.searchType;
               console.log(`searching for term ${searchTerm}`);
               let searchProjectsTaskArray = await this.sortByParam(searchType, await this.retrieveAll());
               console.log("project and task array received");
               let max = searchProjectsTaskArray.length - 1;
               let min = 0;
               while (max > min) {
                    let average = Math.floor((max + min)/2);
                    if (searchProjectsTaskArray[average][searchType] < searchTerm) {
                         min = average + 1;
                    }
                    else {
                         max = average;
                    }
               }
               if (min === max && searchProjectsTaskArray[min][searchType] === searchTerm) {
                    console.log("found");
                    res.send({msg : '', searchResult : searchProjectsTaskArray[min]});
               }
               else {
                    console.log("cannot be found");
                    res.send({msg : "UNABLE TO BE FOUND"});
               }
          }
          catch (err) {
               this.res.send({msg : err});
          }
     }
     
     /**
      * Adds new document as specified by user to database.
      */
     add() {
          let req = this.req;
          let res = this.res;
          let collectionName = this.collectionName;
          let models = {"project" : Project, "task" : Task, "event" : Event};
          let project;
          if (collectionName !== "event") {
               project = new models[collectionName]({"name" : req.body.name, "deadline" : req.body.deadline, "user" : req.session.userId});
          }
          else {
               project = new models[collectionName]({"name" : req.body.name, "deadline" : req.body.deadline, "endTime": req.body.endTime,"user" : req.session.userId});
          }
          project.save(function (err) {
               if (err) {
                    res.send({msg: err});
               }
               else {
                    console.log(`${collectionName} document added`);
                    res.send({msg:''});
               }
          });
     }

     /**
      * Updates user-specified document in database.
      */
     update() {
          let req = this.req;
          let res = this.res;
          let collectionName = this.collectionName;
          let models = {"project" : Project, "task" : Task, "event" : Event};
          let docId = req.params.id;
          let updateInfo;
          if (collectionName !== "event") {
               updateInfo = {"name" : req.body.name, "deadline" : req.body.deadline};
          }
          else {
               updateInfo = {"name" : req.body.name, "deadline" : req.body.deadline, "endTime" : req.body.endTime};
          }
          models[collectionName].findOneAndUpdate({_id: docId}, updateInfo, function (err) {
               if (err) {
                    res.send({msg: err});
               }
               else {
                    console.log(`${collectionName} document updated`);
                    res.send({msg:''});
               }
          });
     }

     /**
      * Deletes user-specified document from database.
      */
     delete() {
          let req = this.req;
          let res = this.res;
          let collectionName = this.collectionName;
          let models = {"project" : Project, "task" : Task, "event" : Event};
          let projectId = req.params.id;
          models[collectionName].findOneAndDelete({_id: projectId}, function (err) {
               if (err) {
                    res.send({msg: err});
               }
               else {
                    console.log(`${collectionName} document deleted`);
                    res.send({msg:''});
               }
          });
     }
}