
import { Order, OrderDetail, Pay, Product, Users } from "../module/index.js";
import sequelize from "../config/connectDB.js";
import { Op } from "sequelize";
export async function createOrder(req, res) {
    const transaction = await sequelize.transaction();
    try {

        const { id_user, id_pay, id_adress, notes, status, date_order, orderItems } = req.body;

        const newOrder = await Order.create({ id_user, id_pay, id_adress, notes, status, date_order }, { transaction });
        // total_price
        let total_price = 0;
        // const stock  =req.body;
        for (const item of orderItems) {
            const { id_product, qty } = item;
            let itemtotalprice = 0;

            if (id_product) {
                const product = await Product.findByPk(id_product, { transaction });
                if (!product) {
                    await transaction.rollback();
                    return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
                }

                if (product.stock < qty) {

                    await transaction.rollback();
                    console.log('Số lượng tồn kho không đủ:', product.stock);
                    return res.status(404).json({ success: false, message: 'Số lượng tồn kho không đủ', stock: product.stock });

                }
                // console.log(stock);
                itemtotalprice = product.price * qty;
                await product.update({ stock: product.stock - qty }, { transaction });
            }

            total_price += itemtotalprice;
            await OrderDetail.create({
                id_order: newOrder.id_order,
                id_product,
                qty,
                total_amount: itemtotalprice
            }, { transaction });

        }
        await newOrder.update({ total_price }, { where: { id_order: newOrder.id_order }, transaction });
        await transaction.commit();
        res.send({ orderId: newOrder.id_order, total_price: total_price });
    }
    catch (error) {
        await transaction.rollback();
        console.error(error);
        if (error.message.includes('Số lượng tồn kho không đủ')) {
            const product = await Product.findByPk(id_product); // Lấy thông tin sản phẩm để lấy stock
            if (product) {
                return res.status(404).json({ success: false, message: error.message, stock: product.stock });
            }
        }
        res.status(500).json({ success: false, message: 'Internal server error' });
    }


}



// lấy tất cả order
export async function getAllOrders(req, res) {
    try {

        const orderDetails = await OrderDetail.findAll({

        })
        const data = await Order.findAll({
            where: {
                finished: 1,
                id_pay: {
                    [Op.or]: [2, 3, 5]
                },
                status: 1
            },
            include: [
                {
                    model: OrderDetail, // Assuming OrderDetail is the associated model
                    attributes: ['qty', 'total_amount', 'id_product'],
                    include: [
                        {
                            model: Product,
                            attributes: ['name', 'images']
                        },

                    ]
                },
                {
                    model: Users,
                    attributes: ['phone']
                }
            ],
        });
        res.status(200).send({
            success: true,
            message: 'Lấy order thành công',
            order: data,

        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// lấy tất cả order theo id user
export async function getAllOrdersbyIduser(req, res) {
    try {
        const { id_user } = req.params;
        const orderDetails = await OrderDetail.findAll({

        })
        const data = await Order.findAll({
            where: {
                id_user,
                finished: 1,
                id_pay: {
                    [Op.or]: [2, 3, 5]
                },
                status: 1
            },
            include: [
                {
                    model: OrderDetail, // Assuming OrderDetail is the associated model
                    attributes: ['qty', 'total_amount', 'id_product'],
                    include: [
                        {
                            model: Product,
                            attributes: ['name', 'images']
                        },

                    ]
                },
                {
                    model: Users,
                    attributes: ['phone']
                }
            ],
        });
        res.status(200).send({
            success: true,
            message: 'Lấy order thành công',
            order: data,

        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }

}

// lấy đơn chưa xác nhận thanh toán theo id user và id order
export async function getOrderByUserIdandOrderId(req, res) {

    try {
        const { id_order } = req.params;
        const { id_user } = req.params;
        // if (!id_order) {
        //     return res.status(400).json({ success: false, message: 'Invalid order ID' });
        // }

        const data = await Order.findAll({
            where: {
                id_user,
                id_order,
                status: 0
            },
            include: [
                {

                    model: OrderDetail,
                    where: { id_order },
                    include: [
                        {
                            model: Product,
                            attributes: ['name', "images"]
                        }
                    ]
                }
            ],
        });

        if (!data.length) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({
            success: true,
            message: `Lấy order của user ${id_user}`,
            order: data,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


//lấy mọi hóa đơn theo id order
export async function getOrderByOrderId(req, res) {

    try {
        const { id_order } = req.params;
        if (!id_order) {
            return res.status(400).json({ success: false, message: 'Invalid order ID' });
        }
        const orderDetails = await OrderDetail.findAll({})
        const data = await Order.findAll({
            where: {
                id_order,
            },
            include: [
                {
                    model: OrderDetail, // Assuming OrderDetail is the associated model
                    attributes: ['qty', 'total_amount', 'id_product'],
                    include: [
                        {
                            model: Product,
                            attributes: ['name', 'images']
                        },

                    ]
                },
                {
                    model: Users,
                    attributes: ['phone']
                }
            ],
        });
        if (!data.length) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).send({
            success: true,
            message: 'Lỗi order',
            order: data,
        }
        );
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


// lấy đơn theo user status = 0
export async function getOrderByStatus(req, res) {
    try {
        const { id_user } = req.params;
        if (!id_user) {
            return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }
        const orderDetails = await OrderDetail.findAll({

        })
        const data = await Order.findAll({
            where: {
                status: 0,
                id_user
            },
            include: [
                {
                    data: orderDetails,
                    model: OrderDetail,
                }
            ],
        });
        if (!data.length) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).send({
            success: true,
            message: 'Lỗi order',
            order: data,
        }
        );
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// lấy các đơn đã xác nhận thanh toán , hủy , xác nhận status = 1
export async function getOrderPay(req, res) {
    try {

        const orderDetails = await OrderDetail.findAll({

        })
        const data = await Order.findAll({
            order: [['id_pay', 'ASC',], ['finished', 'ASC']],
            where: {
                id_pay: {
                    [Op.in]: [1, 2, 5],
                },
                status: 1,
                finished: 0

            },

            include: [
                {
                    data: orderDetails,
                    model: OrderDetail,
                },
                {
                    model: Users,
                    attributes: ['phone']
                }

            ],
        });
        if (!data.length) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).send({
            success: true,
            message: 'Lỗi order',
            order: data,
        }
        );
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// lấy 1 đơn đã thanh toán
export async function getOneOrderPaybyUserID(req, res) {
    try {
        const { id_user } = req.params
        const orderDetails = await OrderDetail.findAll({

        })
        const data = await Order.findAll({
            order: [['id_pay', 'ASC',], ['finished', 'ASC']],
            where: {
                id_user,
                id_pay: {
                    [Op.in]: [1, 2, 5],
                },
                status: 1,
                finished: 0

            },

            include: [
                {
                    data: orderDetails,
                    model: OrderDetail,
                },
                {
                    model: Users,
                    attributes: ['phone']
                }

            ],
        });
        if (!data.length) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).send({
            success: true,
            message: 'Lỗi order',
            order: data,
        }
        );
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export async function getOrderFinished(req, res) {
    try {

        const orderDetails = await OrderDetail.findAll({

        })
        const data = await Order.findAll({
            order: [['id_pay', 'ASC',], ['finished', 'ASC']],
            where: {
                id_pay: {
                    [Op.in]: [2, 5, 3],
                },
                status: 1,
            },

            include: [
                {
                    data: orderDetails,
                    model: OrderDetail,
                },
                {
                    model: Users,
                    attributes: ['phone']
                }

            ],
        });
        if (!data.length) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).send({
            success: true,
            message: 'Lỗi order',
            order: data,
        }
        );
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


// lấy đơn có status =1 theo id_user và id_order
export async function getOneOrderPay(req, res) {
    try {
        const { id_order } = req.params;
        const { id_user } = req.params;
        if (!id_order) {
            return res.status(400).json({ success: false, message: 'Invalid order ID' });
        }
        const orderDetails = await OrderDetail.findOne({
            where: {
                id_order,
                status: 1,
            },

        })
        const data = await Order.findOne({
            where: {
                id_order,
                id_user
            },
            include: [
                {

                    model: OrderDetail,
                    where: { id_order },
                    include: [
                        {
                            model: Product,
                            attributes: ['name', "images"]
                        }
                    ]
                }
            ],
        });
        if (!orderDetails) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).send({
            success: true,
            message: 'data',
            order: data,
        }
        );
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


// xác nhận thanh toán
export async function updatepayOrderBypayIdandStatus(req, res) {
    try {
        const { id_pay } = req.body;
        const { id_adress } = req.body;
        const { id_order } = req.params;
        const parsedId = parseInt(id_order);

        // Kiểm tra id_order hợp lệ
        if (!id_order || isNaN(parsedId)) {
            return res.status(400).json({ success: false, message: 'Invalid order ID' });
        }

        // Tìm kiếm đơn hàng
        const order = await Order.findByPk(parsedId);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Cập nhật dữ liệu đơn hàng
        const updateData = {
            id_pay,
            id_adress,
            status: 1, // Luôn cập nhật status thành 1
        };

        await order.update(updateData);

        res.status(200).json({ success: true, message: 'Order paid successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// xác nhận đơn khi đã xác nhận thanh toán 
export async function updateOrderbyIdpay(req, res) {
    try {

        const { id_order } = req.params;
        const parsedId = parseInt(id_order);

        // Kiểm tra id_order hợp lệ
        if (!id_order || isNaN(parsedId)) {
            return res.status(400).json({ success: false, message: 'Invalid order ID' });
        }

        // Tìm kiếm đơn hàng
        const order = await Order.findByPk(parsedId);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Cập nhật dữ liệu đơn hàng
        const updateData = {
            id_pay: 2,
        }

        await order.update(updateData);
        res.status(200).json({ success: true, message: 'Order paid successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
//hủy đơn khi đã xác nhận thanh toán
export async function updateOrderbyIdpayhuy(req, res) {
    try {

        const { id_order } = req.params;
        const parsedId = parseInt(id_order);

        // Kiểm tra id_order hợp lệ
        if (!id_order || isNaN(parsedId)) {
            return res.status(400).json({ success: false, message: 'Invalid order ID' });
        }

        // Tìm kiếm đơn hàng
        const order = await Order.findByPk(parsedId);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Cập nhật dữ liệu đơn hàng
        const updateData = {
            id_pay: 5,
            finished: 0,
        }

        await order.update(updateData);
        res.status(200).json({ success: true, message: 'Order paid successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }

}
export async function getAllOrdersbyIdpay(req, res) {
    try {
        const { id_pay } = req.params;

        if (!id_pay) {
            return res.status(400).json({ success: false, message: 'Invalid pay ID' });
        }

        // Fetch all orders by id_pay
        const orders = await Order.findAll({
            where: { id_pay },
            include: [
                {

                    model: OrderDetail,
                    attributes: ['qty', 'total_amount']
                    ,
                    include: [
                        {
                            model: Product,
                            attributes: ['name', 'id_product',]
                        }
                    ]
                }
            ],
        });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ success: false, message: 'Orders not found' });
        }

        res.status(200).send({
            success: true,
            message: 'Orders retrieved successfully',
            orders: orders,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// cập nhật note thanh đơn 

export async function addNoteOrder(req, res) {
    try {
        const { note_pays } = req.body;
        const { id_order } = req.params;

        if (!id_order) {
            return res.status(400).json({ success: false, message: 'Invalid order ID' });
        }

        const order = await Order.findByPk(id_order);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.note_pays = note_pays;
        await order.save();

        return res.status(200).json({ success: true, message: 'Note added to order successfully' });
    } catch (error) {
        console.error('Error adding note to order:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// finished đơn hàng 
export async function finishedOrderThanhCong(req, res) {
    try {


        const { id_order } = req.params;
        const parsedId = parseInt(id_order);

        // Kiểm tra id_order hợp lệ
        if (!id_order || isNaN(parsedId)) {
            return res.status(400).json({ success: false, message: 'Invalid order ID' });
        }

        // Tìm kiếm đơn hang
        const order = await Order.findByPk(parsedId, {
            include: [{
                model: OrderDetail,
                attributes: ['id_product', 'qty'],
                include: [Product], // Include Product model to update stock
            }],
        });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Cập nhật dữ liệu đơn hang
        const updateData = {
            id_pay: 2,
            finished: 1
        }

        await order.update(updateData);
        res.status(200).json({ success: true, message: 'Order finished successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export async function finishedOrderHuy(req, res) {
    try {


        const { id_order } = req.params;
        const parsedId = parseInt(id_order);

        // Kiểm tra id_order hợp lệ
        if (!id_order || isNaN(parsedId)) {
            return res.status(400).json({ success: false, message: 'Invalid order ID' });
        }
        const order = await Order.findByPk(parsedId, {
            include: [{
                model: OrderDetail,
                include: [Product], // Include Product model to update stock
            }],
        });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Cập nhật lại số lượng sản phẩm trong kho
        const updateStockPromises = order.order_details.map(async (detail) => {
            const productId = detail.id_product;
            const quantity = detail.qty;

            // Tìm sản phẩm và cập nhật số lượng trong kho
            const product = await Product.findByPk(productId);

            if (!product) {
                console.error(`Product not found for id_product ${productId}`);
                return; // Bỏ qua nếu sản phẩm không tồn tại
            }

            const newStock = product.stock + quantity; // Đơn hàng bị hủy nên trả lại số lượng sản phẩm
            await product.update({ stock: newStock });
        });

        await Promise.all(updateStockPromises);
       

        // Cập nhật trạng thái của đơn hàng
        await order.update({
            finished: 1,
            id_pay: 5  
        });


        res.status(200).json({ success: true, message: 'Order finished successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}



export async function finishedOrderThatBai(req, res) {
    try {


        const { id_order } = req.params;
        const parsedId = parseInt(id_order);

        // Kiểm tra id_order hợp lệ
        if (!id_order || isNaN(parsedId)) {
            return res.status(400).json({ success: false, message: 'Invalid order ID' });
        }
        // Tìm kiếm đơn hàng
        const order = await Order.findByPk(parsedId, {
            include: [{
                model: OrderDetail,
                attributes: ['id_product', 'qty'],
                include: [Product], // Include Product model to update stock
            }],
        });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Cập nhật lại số lượng sản phẩm trong kho
        const updateStockPromises = order.order_details.map(async (detail) => {
            const productId = detail.id_product;
            const quantity = detail.qty;

            // Tìm sản phẩm và cập nhật số lượng trong kho
            const product = await Product.findByPk(productId);

            if (!product) {
                console.error(`Product not found for id_product ${productId}`);
                return; // Bỏ qua nếu sản phẩm không tồn tại
            }

            const newStock = product.stock + quantity; // Đơn hàng bị hủy nên trả lại số lượng sản phẩm
            await product.update({ stock: newStock });
        });

        await Promise.all(updateStockPromises);
        await order.update({
            finished: 1, 
            id_pay: 3,   
        });

        res.status(200).json({ success: true, message: 'Order finished successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
} 