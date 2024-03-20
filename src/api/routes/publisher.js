const { isLogedIn, isAdmin } = require('../../middlewares/auth');
const { upload } = require('../../middlewares/uploadFile');
const { getPublisherByName, getPublishers, postPublisher, editPublisher, deletePublisher } = require('../controllers/publisher');

const publisherRouter = require('express').Router();

publisherRouter.get('/', getPublishers);
publisherRouter.get('/:name', getPublisherByName);
publisherRouter.post('/', isLogedIn, upload.single('img'), postPublisher);
publisherRouter.put('/:id', isLogedIn, upload.single('img'), editPublisher);
publisherRouter.delete('/:id', isLogedIn, isAdmin, deletePublisher);

module.exports = publisherRouter;