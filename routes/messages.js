var express = require("express");
var router = express.Router();


require("../models/connection");
const {Match, Message} = require("../models/matchs");
const {Profil} = require("../models/profils");
const { checkBody } = require("../modules/checkbody");

// récuperer tous les messages d'un match
router.get("/:matchId", async (req, res) => {
  const matchId = req.params.matchId;

  Match.find({_id: matchId })
  .populate("petsitter_id")
  .populate("messages")
  .then((data)=> {
    res.json({result: true, match: data});
  })
});

router.post('/newMessage/:matchId/:userId', async (req, res) => {

  const matchId = req.params.matchId;
  const userId = req.params.userId;
  console.log(matchId, userId)
    if (
        !checkBody(req.body, [
          "content",
        ])
      ) {
        res.json({ result: false, error: "empty message field" });
        return;
      };

      const newMessage = new Message({
        tokenAuthor: req.params.userId,
        content: req.body.content,
        created_at: new Date,
        createdBy: userId

        });
      
        // newMessage.save().then((newDoc) => {
          Match.updateOne({_id: matchId}, {$push: {messages: newMessage}})
          .then(()=> {
             res.json({ result: true, message: 'message added'});
          })
        // });
});


// route pour supprimer un message à finir apres
// router.delete('/deleteMessage/:matchId/:messageId', async(req, res) => {

//     const matchId = req.params.matchId;
//     const messageId = req.params.messageId;
//     const messages = await Match.findById(matchId).populate('messages')
//     const message = messages.includes(messageId)

//   Match.updateOne(
//     { _id: matchId },
//     { $pull: { messages: message } }
//   ).then(() => {
//     res.json({ result: true, message: 'message deleted'});
//   })
// });




module.exports = router;