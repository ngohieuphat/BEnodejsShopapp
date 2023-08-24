const Orders = require('../models/Order');

module.exports = {
    getUserOrders: async (req, res) =>{
        const userId = req.user.id;
        try{
            const userOrders = await Orders.finad({userId})
            .populate({
                path: 'productId',
                select: '-sizes -oldPrice -description -category'
            }).exec();
            res.status(200).json(userorders);
        } catch(err){
            res.status(500).json({message: "Failed to get orders"});
        }
    }
}