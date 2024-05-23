var express = require("express");
var router = express.Router();

require("../models/connection");
const { Profil, Animal } = require("../models/profils");
const { checkBody } = require("../modules/checkbody");

// Edit user profile in settings
router.put("/editprofile/:token", (req, res) => {
  if (
    !checkBody(req.body, [
      "firstname",
      "lastname",
      "email",
      "city",
    ])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  Profil.updateOne(
    {
      token: req.params.token,
    },
    {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      city: req.body.city,
      email: req.body.email,
    }
  ).then((data) => {
    console.log(data);
    if (data.modifiedCount > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
});

// Edit animal profile in settings
router.put("/editanimal/:token/:animalname", (req, res) => {
  if (
    !checkBody(req.body, [
      "name",
      "detail",
      "bio",
    ])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  Profil.updateOne(
    {
      token: req.params.token,
      // 'profilAnimal._id': req.params.animalId
    },
    {
      $set: {
        "profilAnimal.$.name": req.body.name,
        "profilAnimal.$.detail": req.body.detail,
        "profilAnimal.$.bio": req.body.bio,
        // "profilAnimal.photo": req.body.photo,
      },
    }
  ).then((data) => {
    console.log(data);
    if (data.modifiedCount > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
});

module.exports = router;