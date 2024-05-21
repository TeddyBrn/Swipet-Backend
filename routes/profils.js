var express = require("express");
var router = express.Router();

require("../models/connection");
const Profil = require("../models/profils");
const { checkBody } = require("../modules/checkbody");
const bcrypt = require("bcrypt");
const uid2 = require("uid2");

router.post("/signup", (req, res) => {
  if (
    !checkBody(req.body, [
      "firstname",
      "lastname",
      "email",
      "password",
      "role",
      "city",
      // "birthDate",
    ])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  Profil.findOne({
    email: { $regex: new RegExp(req.body.email, "i") },
  }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newProfil = new Profil({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        city: req.body.city,
        // birthDate: req.body.birthDate,
        role: req.body.role,
        password: hash,
        token: uid2(32),
      });

      newProfil.save().then((newDoc) => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      res.json({ result: false, error: "User already exists" });
    }
  });
});

router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  Profil.findOne({ email: req.body.email }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({
        result: true,
        token: data.token,
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
        city: data.city,
      });
    } else {
      res.json({ result: false, error: "User not found or wrong password" });
    }
  });
});

// router.post("/signup/animal", (req, res) => {
//   if (
//     !checkBody(req.body, [
//       "name",
//       "birthDate",
//       "animalType",
//       "gender",
//       "bio",
//       "detail",
//     ])
//   ) {
//     res.json({ result: false, error: "Missing or empty fields" });
//     return;
//   }

//   Profil.updateOne({
//     email: { $regex: new RegExp(req.body.email, "i") },
//   }).then((data) => {
//     if (data === null) {
//       const hash = bcrypt.hashSync(req.body.password, 10);

//       const newProfilAnimal = new Profil({
//         name: req.body.name,
//         birthDate: req.body.birthDate,
//         animalType: req.body.animalType,
//         gender: req.body.gender,
//         bio: req.body.bio,
//         detail: req.body.detail,
//         photo: req.body.photo,
//       });

//       newProfilAnimal.save().then((newDoc) => {
//         res.json({ result: true, token: newDoc.token });
//       });
//     } else {
//       res.json({ result: false, error: "User already exists" });
//     }
//   });
// });

module.exports = router;
