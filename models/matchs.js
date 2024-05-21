const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    namePetsitter: [{ type: mongoose.Schema.Types.ObjectId, ref: 'profils' }],
    content: String,
    created_at: Date,
});

const proposalSchema = mongoose.Schema({
    name: String,
    startDate: Date,
    endDate: Date,
    price: Number,
    infos: String,
});


const matchSchema = mongoose.Schema({
    user_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'profils' }],
    petsitter_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'profils' }],
    messages: [messageSchema],
    proposal: [proposalSchema],
});

const Match = mongoose.model('matches', matchSchema);

module.exports = Match;