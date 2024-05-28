var express = require('express');
var router = express.Router();

require("../models/connection");
const {Profil} = require("../models/profils");
const Animal = require("../models/animals");
const cloudinary = require("cloudinary").v2;
const uniqid = require("uniqid");
const fs = require("fs");

router.post('/addanimal/:token', async (req, res) => {
  try {
    const { name, age, animalType, gender, bio, detail } = req.body;

    const userId = req.params.token;

    const photoPath = `./tmp/${uniqid()}.jpg`;
    await req.files.photoUrl.mv(photoPath);
    const cloudinaryResponse = await cloudinary.uploader.upload(photoPath);
    const photoUrl = cloudinaryResponse.secure_url;
    fs.unlinkSync(photoPath);

    // Création d'un nouvel animal
    const newAnimal = new Animal({
      name,
      age,
      animalType,
      gender,
      bio,
      detail,
      photoUrl
    });

    const savedAnimal = await newAnimal.save();

    // Mise à jour du profil utilisateur
    await Profil.updateOne(
      { token: userId },
      { $push: { profilAnimal: {id :savedAnimal._id} } },
      { new: true }
    );
    if (!Profil) {
      return res
        .status(404)
        .json({ success: false, message: 'Profil utilisateur non trouvé' });
    }
    res.status(201).json({ success: true, animalId: savedAnimal._id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
