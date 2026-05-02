const db = require('../config/db');

// ADD TO CART
exports.addCart = (req, res) => {
    const { user_id, product_id } = req.body;

    db.query(
        'INSERT INTO cart (user_id, product_id) VALUES (?, ?)',
        [user_id, product_id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send('Added to cart');
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