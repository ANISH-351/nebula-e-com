const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// ADD PRODUCT
exports.addProduct = (req, res) => {
    const { name, price, description, category_id } = req.body;
    const image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    db.query(
        'INSERT INTO product (name, price, image, description,  category_id) VALUES (?, ?, ?, ?, ?)',
        [name, price, image, description,  category_id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send('Product added');
        }
    );
};

// GET PRODUCT
exports.getProducts = (req, res) => {

    const category_id = req.params.id;

    let query = `
        SELECT 
            product.id,
            product.name,
            product.price,
            product.image,
            product.description,
            product.category_id,
            category.name AS category_name
        FROM product
        LEFT JOIN category 
        ON product.category_id = category.id
    `;

    let values = [];

    // only add WHERE if id exists
    if (category_id) {
        query += ` WHERE product.category_id = ?`;
        values.push(category_id);
    }

    db.query(query, values, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
};


// UPDATE PRODUCT
exports.updateProduct = (req, res) => {
    const id = req.params.id;
    const { name, price, description, category_id } = req.body;

    let image;
    if (req.file) {
        const image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    let query, values;

    if (image) {
        query = `
            UPDATE product 
            SET name=?, price=?, image=?, description=?, category_id=? 
            WHERE id=?
        `;
        values = [name, price, image, description, category_id, id];
    } else {
        query = `
            UPDATE product 
            SET name=?, price=?, description=?, category_id=? 
            WHERE id=?
        `;
        values = [name, price, description, category_id, id];
    }

    db.query(query, values, (err) => {
        if (err) return res.status(500).send(err);
        res.send('Product updated');
    });
};

// DELETE PRODUCT
exports.deleteProduct = (req, res) => {
    const id = req.params.id;

    db.query('SELECT image FROM product WHERE id=?', [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length === 0) return res.send('Not found');

        const image = result[0].image;
        const imagePath = path.join(__dirname, '..', 'uploads', image);

        db.query('DELETE FROM product WHERE id=?', [id], (err) => {
            if (err) return res.status(500).send(err);

            fs.unlink(imagePath, () => {});
            res.send('Deleted');
        });
    });
};


exports.getFeaturedProducts = (req, res) => {

    db.query(
        'SELECT * FROM product WHERE featured = 1',
        (err, result) => {

            if (err) return res.status(500).send(err);

            res.json(result);
        }
    );
};



// MAKE FEATURED
exports.makeFeatured = (req, res) => {

    const id = req.params.id;

    db.query(
        'UPDATE product SET featured = 1 WHERE id = ?',
        [id],
        (err) => {

            if (err) return res.status(500).send(err);

            res.send('Product marked as featured');
        }
    );
};



// GET NEW ARRIVALS
exports.getNewArrivals = (req, res) => {

    db.query(
        `SELECT * FROM product
         ORDER BY created_at DESC
         LIMIT 10`,
        (err, result) => {

            if (err) return res.status(500).send(err);

            res.json(result);
        }
    );
};


exports.getRelatedProducts = (req, res) => {

    const { id, category_id } = req.params;

    db.query(
        `
        SELECT *
        FROM product
        WHERE category_id = ?
        AND id != ?
        `,
        [category_id, id],
        (err, result) => {

            if (err) return res.status(500).send(err);

            res.json(result);
        }
    );
};