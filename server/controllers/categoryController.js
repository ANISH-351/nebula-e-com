const db = require('../config/db');
const fs = require('fs');
const path = require('path');


// ADD CATEGORY
exports.addCategory = (req, res) => {

    const { name } = req.body;

    const image = req.file.path;

    db.query(
        'INSERT INTO category (name, image) VALUES (?, ?)',
        [name, image],
        (err) => {

            if (err) return res.status(500).send(err);

            res.send('Category added');
        }
    );
};


// GET CATEGORY
exports.getCategory = (req, res) => {

    db.query(
        'SELECT * FROM category',
        (err, result) => {

            if (err) return res.status(500).send(err);

            res.json(result);
        }
    );
};


// UPDATE CATEGORY
exports.updateCategory = (req, res) => {

    const id = req.params.id;

    const { name } = req.body;

    let image;

   if (req.file) {
    image = req.file.path;
}

    let query;
    let values;

    if (image) {

        query = `
            UPDATE category
            SET name = ?, image = ?
            WHERE id = ?
        `;

        values = [name, image, id];

    } else {

        query = `
            UPDATE category
            SET name = ?
            WHERE id = ?
        `;

        values = [name, id];
    }

    db.query(query, values, (err) => {

        if (err) return res.status(500).send(err);

        res.send('Category updated');
    });
};

exports.deleteCategory = (req, res) => {
    const id = req.params.id;

    db.query(
        'DELETE FROM category WHERE id = ?',
        [id],
        (err) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.status(200).json({
                success: true,
                message: 'Category deleted'
            });
        }
    );
};