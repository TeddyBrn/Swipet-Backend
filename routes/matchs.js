var express = require("express");
var router = express.Router();

require("../models/connection");
const { checkBody } = require("../modules/checkbody");

// Get all matchs
router.get("/matchs", (req, res) => {
  matchs
    .find()
    .then((data) => {
      res.json({ result: true, data });
    })
    .catch((error) => {
      res.json({ result: false, error: error.message });
    });
});

router.post("/match", async (req, res) => {
  const { user_id, petsitter_id } = req.body;

  const existingMatch = await Match.findOne({ user_id, petsitter_id });
  if (existingMatch) {
    return res.status(400).json({ message: "Match already exists." });
  }

  const newMatch = new Match({ user_id, petsitter_id });
  await newMatch.save();
  res.status(201).json(newMatch);
});

router.get("/matches/:userId", async (req, res) => {
  const userId = req.params.userId;
  const matches = await Match.find({
    $or: [{ user_id: userId }, { petsitter_id: userId }],
  })
    .populate("user_id")
    .populate("petsitter_id")
    .populate("messages.sender");
  res.json(matches);
});

// NE PAS SUPPRIMER LA ROUTE DU DESSOUS ELLE EST EN CHANTIER

// router.post("/like", async (req, res) => {
//   const user = await Profil.findById(req.body.userId);
//   const likedUser = await Profil.findById(req.body.likedUserId);

//   user.like.push(likedUserId);

//   let match = false;
//   if (likedUser.like.includes(userId)) {
//     user.likeReceived.push(likedUserId);
//     likedUser.likeReceived.push(userId);
//     match = true;
//   }
//   if (match) {
//     Profil.updateOne(
//       {
//         _id: req.body.userId,
//       },
//       {
//         $push: {

//         },
//       }
//     );
//   }

//   await user.save();
//   await likedUser.save();

//   res.json({ match });
// });

module.exports = router;
