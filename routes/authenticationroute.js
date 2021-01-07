const path = require("path");
const express = require("express");
const AuthenticationController = require("../controllers/authenticationcontroller.js");
const router = express.Router();

router.get("/", function(req, res) {
     res.render("layout.pug");
});

router.get("/signin", function(req, res) {
     res.render("login.pug");
});

router.post("/register", function(req, res) {
     new AuthenticationController(req, res).addUser();
}); 

router.post("/login", function(req, res) {
     new AuthenticationController(req, res).checkUser();
});

router.post("/logout", function(req, res) {
     new AuthenticationController(req, res).logOutUser();
})

router.get("/isauthorized", function(req, res) {
     if (req.session.userId) {
          res.send({msg : ""});
     }
     else {
          res.send({msg : "NOT LOGGED IN"});
     }
});

module.exports = router;