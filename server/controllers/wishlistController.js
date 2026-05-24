const db = require('../config/db')


// ADD TO WISHLIST
exports.addWishlist = (req, res) => {
    const { user_id, product_id } = req.body;

    db.query(
        'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?',
        [user_id, product_id],
        (err, result) => {
            if (err) return res.status(500).send(err);

            if (result.length > 0) {
                return res.status(409).send('Already in wishlist');
            }

            db.query(
                'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
                [user_id, product_id],
                (err) => {
                    if (err) return res.status(500).send(err);
                    res.send('Added to wishlist');
                }
            );
        }
    );
};


exports.getWishlist = (req, res) => {
    const user_id = req.params.user_id;

   db.query(
    `SELECT wishlist.id, product.name, product.price, product.image
     FROM wishlist
     JOIN product ON wishlist.product_id = product.id
     WHERE wishlist.user_id = ?`,
    [user_id],
    (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    }
);
};


// DELETE WISHLIST
exports.deleteWishlist = (req, res) => {
    const id = req.params.id;

    db.query(
        'DELETE FROM wishlist WHERE id = ?',
        [id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send('Removed from wishlist');
        }
    );
};