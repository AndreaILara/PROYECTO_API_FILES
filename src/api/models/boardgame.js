const mongoose = require('mongoose');

const boardgameSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    img: [{ type: String, trim: true }],
    numberOfPlayers: [Number],
    publisher: {
      type: mongoose.Types.ObjectId,
      ref: 'Publisher'
    }
  },
  { timestamps: true, collection: 'boardgames' }
);

const Boardgame = mongoose.model('Boardgame', boardgameSchema);

module.exports = Boardgame;