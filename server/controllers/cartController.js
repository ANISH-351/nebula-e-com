const db = require('../config/db');

// ADD TO CART (no quantity)
exports.addCart = (req, res) => {
    const { user_id, product_id } = req.body;

    db.query(
        'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
        [user_id, product_id],
        (err, result) => {
            if (err) return res.status(500).send(err);

            // Already exists
            if (result.length > 0) {
                return res.status(400).send('Already in cart');
            }

            // Insert new item
            db.query(
                'INSERT INTO cart (user_id, product_id) VALUES (?, ?)',
                [user_id, product_id],
                (err) => {
                    if (err) return res.status(500).send(err);
                    res.send('Added to cart');
                }
            );
        }
    );
};

// INCREASE QUANTITY
exports.increaseQuantity = (req, res) => {
    const id = req.params.id;

    db.query(
        'UPDATE cart SET quantity = quantity + 1 WHERE id = ?',
        [id],
        (err, result) => {
            if (err) return res.status(500).send(err);

            res.send('Quantity increased');
        }
    );
};



// DECREASE QUANTITY
exports.decreaseQuantity = (req, res) => {
    const id = req.params.id;

    db.query(
        'SELECT quantity FROM cart WHERE id = ?',
        [id],
        (err, result) => {
            if (err) return res.status(500).send(err);

            if (result.length === 0) {
                return res.status(404).send('Item not found');
            }

            if (result[0].quantity <= 1) {
                // 👉 If quantity is 1 → remove item
                db.query(
                    'DELETE FROM cart WHERE id = ?',
                    [id],
                    (err) => {
                        if (err) return res.status(500).send(err);
                        res.send('Item removed from cart');
                    }
                );
            } else {
                // 👉 Decrease quantity
                db.query(
                    'UPDATE cart SET quantity = quantity - 1 WHERE id = ?',
                    [id],
                    (err) => {
                        if (err) return res.status(500).send(err);
                        res.send('Quantity decreased');
                    }
                );
            }
        }
    );
};


// GET CART
exports.getCart = (req, res) => {
    const user_id = req.params.user_id;

    db.query(
        `SELECT cart.id, product.name, product.price, product.image
         FROM cart
         JOIN product ON cart.product_id = product.id
         WHERE cart.user_id = ?`,
        [user_id],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.json(result);
        }
    );
};


// DELETE CART
exports.deleteCart = (req, res) => {
    const id = req.params.id;

    db.query(
        'DELETE FROM cart WHERE id = ?',
        [id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send('Removed');
        }
    );
};