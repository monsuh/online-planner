const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Module for Event database model. 
 * @module
 */

 /**
  * Class representing the database document structure of an event.
  * @class
  * 
  * @param {String} name - This is the name of the event (will be a public instance variable).
  * @param {Date} deadline - This is the start time of the event (will be a public instance variable).
  * @param {Date} endTime - This is the end time of the event (will be a public instance variable).
  * @param {String} user - This is the user who created the event (will be a public instance variable).
  * @param {String} type - This is the type of document (will be a public instance variable).
  */
const EventSchema = new Schema({
     name: String,
     deadline: Date,
     endTime: Date,
     user: String,
     type: {type: String, default: "event"}
});

module.exports = mongoose.model("Event", EventSchema, "events");