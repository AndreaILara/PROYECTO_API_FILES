const { isLogedIn, isAdmin } = require('../../middlewares/auth');
const { upload } = require('../../middlewares/uploadFile');
const { getBoardgames, getBoardgameByNumberOfPlayers, postBoardgame, editBoardgame, deleteBoardgame } = require('../controllers/boardgame');

const boardgameRouter = require('express').Router();

boardgameRouter.get('/', getBoardgames);
boardgameRouter.get('/:players', getBoardgameByNumberOfPlayers);
boardgameRouter.post('/', isLogedIn, upload.array('img'), postBoardgame);
boardgameRouter.put('/:id', isLogedIn, upload.single('img'), editBoardgame);
boardgameRouter.delete('/:id', isLogedIn, isAdmin, deleteBoardgame);

module.exports = boardgameRouter;