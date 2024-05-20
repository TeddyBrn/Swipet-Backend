const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({
    url: String,
    created_at: Date,
});

const profilAnimalSchema = mongoose.Schema({
    name: String,
    age: Number,
    animalType: String,
    gender: String,
    bio: String,
    detail: String,
    photo: [photoSchema],
 });

 const avisSchema = mongoose.Schema({
    note: Number,
    content: String,
    created_at: Date,
    user_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'profils' }]
 });

 const historiqueSchema = mongoose.Schema({
    url: String,
    name: String,
    Statue: String,
 });

const profilSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  token: String,
  created_at: Date,
  city: String,
  role: String,
  profilAnimal: [profilAnimalSchema],
  avis: [avisSchema],
  historique: [historiqueSchema],
  like: [{ type: mongoose.Schema.Types.ObjectId, ref: 'profils' }],
  likeReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'profils' }]
});

const Profil = mongoose.model('profils', profilSchema);

module.exports = Profil;