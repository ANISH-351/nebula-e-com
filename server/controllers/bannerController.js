const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// ADD BANNER
exports.addBanner = (req, res) => {

    const { title } = req.body;

    const image = req.file.path;

    db.query(
        'INSERT INTO banner (title, image) VALUES (?, ?)',
        [title, image],
        (err) => {

            if (err) return res.status(500).send(err);

            res.send('Banner added');
        }
    );
};


// GET BANNERS
exports.getBanners = (req, res) => {

    db.query(
        'SELECT * FROM banner',
        (err, result) => {

            if (err) return res.status(500).send(err);

            res.json(result);
        }
    );
};


// UPDATE BANNER
exports.updateBanner = (req, res) => {

    const id = req.params.id;

    const { title } = req.body;

    let image;

    if (req.file) {
        image = req.file.path;
    }

    let query;
    let values;

    if (image) {

        query = `
            UPDATE banner
            SET title = ?, image = ?
            WHERE id = ?
        `;

        values = [title, image, id];

    } else {

        query = `
            UPDATE banner
            SET title = ?
            WHERE id = ?
        `;

        values = [title, id];
    }

    db.query(query, values, (err) => {

        if (err) return res.status(500).send(err);

        res.send('Banner updated');
    });
};


// DELETE BANNER
exports.deleteBanner = (req, res) => {

    const id = req.params.id;

    db.query(
        'SELECT image FROM banner WHERE id=?',
        [id],
        (err, result) => {

            if (err) return res.status(500).send(err);

            if (result.length === 0) {
                return res.send('Banner not found');
            }

            const image = result[0].image;

            const fileName = image.split('/uploads/')[1];

            const imagePath = path.join(__dirname, '..', 'uploads', fileName);

            db.query(
                'DELETE FROM banner WHERE id=?',
                [id],
                (err) => {

                    if (err) return res.status(500).send(err);

                    fs.unlink(imagePath, (err) => {

                        if (err) {
                            console.log('Image delete error:', err);
                        }
                    });

                    res.send('Banner deleted');
                }
            );
        }
    );
};