const path = require("path");
const express = require("express");
const SortController = require("../controllers/sortcontroller.js");
const DatabaseController = require("../controllers/databasecontroller.js");
const router = express.Router();

router.get('/', async function(req, res) {
     let projects = await new DatabaseController(req, res, "project").retrieveAll();
     new SortController(projects).insertionSort();
});

module.exports = router;