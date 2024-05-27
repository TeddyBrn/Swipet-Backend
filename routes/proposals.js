var express = require("express");
var router = express.Router();


require("../models/connection");
const {Match, Proposal} = require("../models/matchs");
const Profil = require("../models/profils");
const { checkBody } = require("../modules/checkbody");

// récuperer toutes les propositions d'un match
router.get("/:matchId", async (req, res) => {
    const matchId = req.params.matchId;

    Match.find({_id: matchId })
    .populate("proposal")
    .then((data)=> {
      res.json({proposals: data});
    })
  });

router.post('/newProposal/:matchId/:userId/', async (req, res) => {

    const matchId = req.params.matchId;
    const userId = req.params.userId;
    console.log(matchId, userId)
      if (
          !checkBody(req.body, [
            // 'keptAnimal',
            'startDate',
            'endDate',
            'price',
            'infos',
          ])
        ) {
          res.json({ result: false, error: "empty message field" });
          return;
        };
    const keptAnimals= []
    Profil.findById(userId)
    .populate('profilAnimal')
    .then((data) => {
        keptAnimals.push(data)
    })
    console.log(keptAnimals)
        const newProposal = new Proposal({
            keptAnimal : keptAnimals,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            price: req.body.price,
            infos: req.body.infos,
          });
        console.log(newProposal)
          // newProposal.save().then((newDoc) => {
            Match.updateOne({_id: matchId}, {$push: {proposal: newProposal}})
            .then(()=> {
               res.json({ result: true, message: 'proposal added'});
            })
          // });  
  });


module.exports = router;