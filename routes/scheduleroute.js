const express = require("express");
const router = express.Router();

router.use(function(req, res, next) {
     if (req.session.userId) {
          next();
     }
     else {
          res.redirect("/");
     }
});
router.get('/', function(req, res) {
     res.render("schedule.pug");
});

module.exports = router;