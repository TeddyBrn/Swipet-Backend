var express = require("express");
var router = express.Router();

require("../models/connection");
const { checkBody } = require("../modules/checkbody");

router.get('/matchs', (req, res) => {
    matchs.find()
      .then((data) => {
        res.json({ result: true, data});
      })
      .catch((error) => {
        res.json({ result: false, error: error.message });
      });
  });
  
  module.exports = router;