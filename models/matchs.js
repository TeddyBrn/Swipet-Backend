const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    tokenAuthor: String,
    content: String,
    created_at: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'profils' }
});

const proposalSchema = mongoose.Schema({
    // name: String,
    keptAnimal:[{ type: mongoose.Schema.Types.ObjectId, ref: 'animals' }],
    startDate: Date,
    endDate: Date,
    price: Number,
    infos: String,
    
});


const matchSchema = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'profils' },
    petsitter_id: { type: mongoose.Schema.Types.ObjectId, ref: 'profils' },
    messages: [messageSchema],
    proposal: [proposalSchema],
});

const Match = mongoose.model('matches', matchSchema);
const Message = mongoose.model('messages', messageSchema);
const Proposal = mongoose.model('proposals', proposalSchema);

module.exports = {Match, Message, Proposal};