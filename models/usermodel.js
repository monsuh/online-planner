const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

/**
 * Module for User database model. 
 * @module
 */

 /**
  * Class representing the database document structure of a user.
  * @class
  * @param {String} email - This is the email of the user (will be a public instance variable).
  * @param {String} password - This is the hashed password of the user (will be a public instance variable).
  */
const UserSchema = new Schema({
     email: {type: String, required: true, unique: true},
     password: {type: String, required: true}
});

/**
 * Hashes password before saving to database.
 * 
 * @param {String} action - This is the database action before which the function will be executed.
 * @param {Function} preFunction - This is the function that occurs before the action.
 */
UserSchema.pre("validate", function(next) {
     let user = this;
     bcrypt.hash(user.password, 10, function(err, hash) {
          if (err) throw err;
          else {
               user.password = hash;
               next();
          }
     });
});

/**
 * Checks inputted password against hashed password in database.
 * 
 * @param {String} inputtedPassword - This is the password inputted by the website user.
 * @returns {Promise} Promise that resolves to boolean which states whether inputted password matches password in database.
 */
UserSchema.methods.checkPassword = function(inputtedPassword) {
     let that = this;
     return checkPassword = new Promise (function(resolve, reject) {
          bcrypt.compare(inputtedPassword, that.password, function(err, isCorrect) {
               if (err) throw err;
               else {
                    resolve(isCorrect);
               }
          });
     });
};

module.exports = mongoose.model("User", UserSchema, "users");
