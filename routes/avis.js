var express = require('express');
var router = express.Router();

require('../models/connection');
const {Profil, Avis} = require('../models/profils');

const { checkBody } = require('../modules/checkbody');


router.post("/:userToken/:petsitterId", async (req, res) => {
    const userToken = req.params.userToken;
    const petsitterId = req.params.petsitterId

    const user = await Profil.findOne({token: userToken});
    const userId = user._id;

    if (
        !checkBody(req.body, [
            'note',
            'content',
        ])
      ) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return;
      }

    const newAvis= new Avis({
        note: req.body.note,
        content: req.body.content,
        created_at: new Date,
        user_id: userId,
    })
    Profil.updateOne({_id: petsitterId}, {$push: {avis: newAvis}})
    .then(()=> {
       res.json({ result: true, message: 'avis added'});
    })

})


module.exports = router;