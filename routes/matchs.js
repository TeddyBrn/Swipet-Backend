var express = require("express");
var router = express.Router();

require("../models/connection");
const { checkBody } = require("../modules/checkbody");
const {Profil} = require("../models/profils");
const {Match} = require('../models/matchs')

// Get all matchs
router.get("/matchs", (req, res) => {
  Match.find().then((data) => {
      res.json({ result: true, data });
    })
    .catch((error) => {
      res.json({ result: false, error: error.message });
    });
});

//Récuperer tous les matchs d'un user
router.get("/:userToken", async (req, res) => {

  const userToken = req.params.userToken;
  const user = await Profil.findOne({token: userToken});
  console.log(user)
  const userId = user._id;
  const matches = await Match.find({ user_id: userId
    // $or: [{ user_id: userId }, { petsitter_id: userId }],
  })
    .populate("user_id")
    .populate("petsitter_id")
    .populate("messages");
  res.json({result: true, matches: matches});
  // console.log(matches)
});

router.post("/like/:userToken/:likedUserId", async (req, res) => {
  const userToken = req.params.userToken;
  const likedUserId = req.params.likedUserId
console.log(userToken)
  console.log(likedUserId, userToken)
  
  const user = await Profil.findOne({token: userToken});
  const userId = user._id;
  const likedUser = await Profil.findById(likedUserId);
  console.log('console', user)
  console.log('log', likedUser)

  // un if pour éviter de liker deux fois la meme personne
  if (!user.like.includes(likedUserId)) {
     await Profil.updateOne({_id: userId}, { $push: { like: likedUserId } })
     await Profil.updateOne({_id: likedUserId}, { $push: { likeReceived: userId } })
   } 
  // else {
  // //   res.json({result: false, message: 'like already exist'})
  // // };
 

  user.like.push(likedUserId);
  likedUser.likeReceived.push(userId)
  // console.log(user.like)

  // création de match
  if (likedUser.like.includes(userId) && likedUser.likeReceived.includes(userId) ) {
    // if (Match.find({user_id: userId, petsitter_id: likedUserId})) {
    //   res.json({result: false, message: 'match already exist'})
    //     } else {
        // match = true;
          const newMatch = new Match({
            user_id: userId,
            petsitter_id: likedUserId,
            messages: [],
            proposal: [],
          })
          
          newMatch.save().then((newDoc) => {
            // console.log('console log newMatch', newDoc)
            res.json({ result: true, message: 'new match created!' });
          });
        // }
  } else {
    res.json({result: true, message: 'like created'})
  }
});

// créer un nouveau match

// router.post('newmatchs/:userId', async (req,res)=> {
//   const likes = []
//   const liked = []
//   Profil.find({user_id: req.params.userId})
//   .populate('like')
//   .then((data) => {
//     likes = data
//   })
//   Profil.find({user_id: req.params.userId})
//   .populate('likereceived')
//   .then((data) => {
//     liked = data
//   })
//   const matched = likes.filter(e => liked.includes(e));

//   matched.map ((data, i) => {

//   })

//   new Match = 





// } )







// router.post("/match", async (req, res) => {
//   const { user_id, petsitter_id } = req.body;

//   const existingMatch = await Match.findOne({ user_id, petsitter_id });
//   if (existingMatch) {
//     return res.status(400).json({ message: "Match already exists." });
//   }

//   const newMatch = new Match({ user_id, petsitter_id });
//   await newMatch.save();
//   res.status(201).json(newMatch);
// });



// NE PAS SUPPRIMER LA ROUTE DU DESSOUS ELLE EST EN CHANTIER



//     user.likeReceived.push(likedUserId);
//     likedUser.likeReceived.push(userId);

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
