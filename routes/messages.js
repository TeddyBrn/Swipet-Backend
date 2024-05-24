var express = require("express");
var router = express.Router();


require("../models/connection");
const { checkBody } = require("../modules/checkbody");

router.post('/newmessage/:matchid/:userid', async (req, res) => {

    if (
        !checkBody(req.body, [
          "content",
        ])
      ) {
        res.json({ result: false, error: "empty message field" });
        return;
      }

      Matchs.findOne({userId: userId, petsitterId: petsitterId})
      .then()

      const newMessage = new Message({
        namePetsitter: req.body.petsitter.firstname,
        content: req.body.content,
        created_at: new Date(req.body.date),
        createdBy: profil_id

        });
      
        newMessage.save().then((newDoc) => {
          res.json({ result: true, message: newDoc });
        })

  
});



module.exports = router;