const db = require('../config/db');

// PLACE ORDER — called after successful Razorpay payment
exports.placeOrder = (req, res) => {
    const { user_id, address_id, payment_id, razorpay_order_id, total_amount, items } = req.body;
    // items: [{ product_id, quantity, price }]

    db.query(
        `INSERT INTO orders (user_id, address_id, payment_id, razorpay_order_id, total_amount, status)
         VALUES (?, ?, ?, ?, ?, 'confirmed')`,
        [user_id, address_id, payment_id, razorpay_order_id, total_amount],
        (err, result) => {
            if (err) return res.status(500).send(err);

            const order_id = result.insertId;

            // Insert all order items
            const values = items.map((i) => [order_id, i.product_id, i.quantity, i.price]);

            db.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?`,
                [values],
                (err) => {
                    if (err) return res.status(500).send(err);

                    // Clear cart after order
                    db.query(
                        'DELETE FROM cart WHERE user_id = ?',
                        [user_id],
                        (err) => {
                            if (err) return res.status(500).send(err);
                            res.json({ message: 'Order placed', order_id });
                        }
                    );
                }
            );
        }
    );
};


// GET ALL ORDERS FOR A USER
exports.getOrders = (req, res) => {
    const user_id = req.params.user_id;

    db.query(
        `SELECT 
            orders.id AS order_id,
            orders.payment_id,
            orders.razorpay_order_id,
            orders.total_amount,
            orders.status,
            orders.created_at,
            address.full_name,
            address.address_line,
            address.city,
            address.state,
            address.pincode,
            address.country
         FROM orders
         LEFT JOIN address ON orders.address_id = address.id
         WHERE orders.user_id = ?
         ORDER BY orders.created_at DESC`,
        [user_id],
        (err, orders) => {
            if (err) return res.status(500).send(err);

            if (orders.length === 0) return res.json([]);

            // Get items for each order
            const orderIds = orders.map((o) => o.order_id);

            db.query(
                `SELECT 
                    order_items.order_id,
                    order_items.quantity,
                    order_items.price,
                    product.id AS product_id,
                    product.name,
                    product.image
                 FROM order_items
                 JOIN product ON order_items.product_id = product.id
                 WHERE order_items.order_id IN (?)`,
                [orderIds],
                (err, items) => {
                    if (err) return res.status(500).send(err);

                    // Attach items to each order
                    const result = orders.map((order) => ({
                        ...order,
                        items: items.filter((i) => i.order_id === order.order_id),
                    }));

                    res.json(result);
                }
            );
        }
    );
};