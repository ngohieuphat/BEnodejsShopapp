const router = require('express').Router();
const cartController = require('../controllers/cartController');
const {verifyToken} = require('../middleware/verifyToken');

router.post('/',verifyToken, cartController.addCart);
router.get('/find/',verifyToken, cartController.getCart);
router.delete('/:cartItem',verifyToken, cartController.deleteCartItem);

module.exports = router