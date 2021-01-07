const User = require("../models/usermodel.js");

/**
 * Module with functions related to accounts and authentication. 
 * @module
 */

/**
 * @classdesc This is the class used to manipulate user information in the database.
 * @class
 */
module.exports = class UserController {

     /**
      * This function is the constructor function for an authentication object.
      * @constructor
      * 
      * @param {Request} req - This is the request object from the user (will be a public instance variable)
      * @param {Response} res - This is the response object to the user (will be a public instance variable)  
      */
     constructor(req, res) {
          this.req = req;
          this.res = res;
     }

     /**
      * Adds new user to database.
      */
     addUser() {
          console.log("accessed add user function");
          let req = this.req;
          let res = this.res;
          let user = new User(req.body);
          user.save(function (err) {
               if (err) {
                    res.send({msg: err});
               }
               else {
                    console.log("user document added")
                    res.send({msg:''});
               }
          });
     }

     /**
      * Checks if inputted user information (email and password) are correct to create new session and grant access to account.
      */
     checkUser() {
          let req = this.req;
          let res = this.res;
          User.findOne({"email": req.body.email}, async function(err, user) {
               if (!user) {
                    res.send({msg: "USER NOT FOUND"});
               }
               else {
                    let isCorrect = await user.checkPassword(req.body.password);
                    if (isCorrect) {
                         console.log(`password match is ${isCorrect}`);
                         req.session.userId = user._id;
                         res.send({msg : ""});
                    }
                    else {
                         console.log(`password match is ${isCorrect}`);
                         res.send({msg : "NO LUCK JIMBO"});
                    }
               }
          });
     }

     /**
      * Destroys session information to log user out of account.
      */
     logOutUser() {
          let req = this.req;
          let res = this.res;
          req.session.destroy(function(err) {
               if(err) {
                    res.send({msg : `ERROR: ${err}`});
               }
               else {
                    res.send({msg : ""});
               }
          });
     }
}