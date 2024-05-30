var express = require('express');
var router = express.Router();

require('../models/connection');
const {Profil} = require('../models/profils');
const Animal = require('../models/animals');
const { checkBody } = require('../modules/checkbody');
const bcrypt = require('bcrypt');
const uid2 = require('uid2');
const cloudinary = require('cloudinary').v2;
const uniqid = require('uniqid');
const fs = require('fs');

router.post('/signup', (req, res) => {
  console.log('console log file', req.files);
  console.log('console log body', req.body);
  if (
    !checkBody(req.body, [
      'firstname',
      'email',
      'age',
      'password',
      'role',
      'city',
      'bio'
    ])
  ) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  Profil.findOne({
    email: { $regex: new RegExp(req.body.email, 'i') }
  }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      if (req.files) {
        const photoPath = `./tmp/${uniqid()}.jpg`;
        req.files.photoFromFront
          .mv(photoPath)
          .then((resultMove) => {
            if (resultMove) {
              res.json({ result: false, error: resultMove });
            } else {
              cloudinary.uploader.upload(photoPath).then((resultCloudinary) => {
                const url = resultCloudinary.secure_url;
                console.log(url);
                fs.unlinkSync(photoPath);

                const newProfil = new Profil({
                  firstname: req.body.firstname,
                  lastname: req.body.lastname,
                  email: req.body.email,
                  city: req.body.city,
                  age: req.body.age,
                  role: req.body.role,
                  bio: req.body.bio,
                  password: hash,
                  token: uid2(32),
                  photo: url || ''
                });

                newProfil
                  .save()
                  .then((newDoc) => {
                    console.log('console log newdoc', newDoc);
                    res.json({ result: true, newDoc: newDoc });
                  })
                  .catch((error) => console.log(error));
              });
            }
          })
          .catch((error) => console.log(error));
      } else {
        const newProfil = new Profil({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          city: req.body.city,
          age: req.body.age,
          role: req.body.role,
          bio: req.body.bio,
          password: hash,
          token: uid2(32)
        });
        newProfil.save().then((newDoc) => {
          res.json({ result: true, newDoc: newDoc });
        });
      }
    } else {
      res.json({ result: false, error: 'User already exists' });
    }
  });
});

router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  Profil.findOne({ email: req.body.email }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({result: true, data });
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  });
});

router.get('/swipe/:role', (req, res) => {
  if (req.params.role === 'faire garder') {
    Profil.find({ role: 'garder' })
      .then((data) => {
        res.json({ result: true, data });
      })
      .catch((error) => {
        res.json({ result: false, error: error.message });
      });
  } else if (req.params.role === 'garder') {
    Profil.find({ role: 'faire garder' })
      .then((data) => {
        res.json({ result: true, data });
      })
      .catch((error) => {
        res.json({ result: false, error: error.message });
      });
  }
});


// Get user infos depending on token
router.get('/infos/:token', (req, res) => {
  Profil.findOne({ token: req.params.token })
    .then((data) => {
      if(data.role === 'garder') {
        res.json({ result: true, data });
      } else if(data.role === 'faire garder') {
        console.log(data.profilAnimal[0])
        Animal.findOne({ _id: data.profilAnimal[0] }).then((data) => {
          res.json({ result: true, data });
        });
      }
    })
    .catch((error) => {
      res.json({ result: false, error: error.message });
    });
});

// Upload choosen image from front
router.put('/uploadphoto/:token', async (req, res) => {
  const photoPath = `./tmp/${uniqid()}.jpg`;
  const resultMove = await req.files.photoFromFront.mv(photoPath);

  if (resultMove) {
    res.json({ result: false, error: resultMove });
  } else {
    cloudinary.uploader.upload(photoPath).then((resultCloudinary) => {
      const url = resultCloudinary.secure_url;
      fs.unlinkSync(photoPath);
      Profil.updateOne({ token: req.params.token }, { photo: url }).then(
        (updateDoc) => {
          res.json({ result: true, token: updateDoc.token });
        }
      );
    });
  }
});

router.put('/updateprofil/:token', async (req, res) => {
  if (!checkBody(req.body, ['firstname', 'lastname', 'email', 'city'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  Profil.updateOne(
    { token: req.params.token },
    {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      city: req.body.city,
      email: req.body.email
    }
  ).then((updateDoc) => {
    res.json({ result: true, token: updateDoc.token });
  });
});

// // Add animal to our database, linked to the corresponding logged user
// router.post("/signup/animal/:token", async (req, res) => {
//   console.log(req.body);
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

//   const newProfilAnimal = new Animal({
//     name: req.body.name,
//     birthDate: new Date(req.body.birthDate),
//     animalType: req.body.animalType,
//     gender: req.body.gender,
//     bio: req.body.bio,
//     detail: req.body.detail,
//     // photoUrl: resultCloudinary.secure_url,
//   });
//   console.log(newProfilAnimal);

//   Profil.updateOne(
//     {
//       token: req.params.token,
//     },
//     { $push: { profilAnimal: newProfilAnimal } }
//   ).then((newDoc) => {
//     res.json({ result: true, token: newDoc.token });
//   });
// });

module.exports = router;
