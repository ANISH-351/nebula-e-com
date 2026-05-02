const db = require('../config/db');



exports.addCategory = (req, res) => {
    const { name } = req.body;

    db.query(
        'INSERT INTO category (name) VALUES (?)',
        [name],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send('Category added');
        }
    );
};


exports.getCategory = (req, res) => {
    db.query('SELECT * FROM category', (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
};


exports.updateCategory = (req, res) => {
    const id = req.params.id;
    const { name } = req.body;

    db.query(
        'UPDATE category SET name = ? WHERE id = ?',
        [name, id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send('Category updated');
        }
    );
};



exports.deleteCategory = (req, res) => {
    const id = req.params.id;

    db.query(
        'DELETE FROM category WHERE id = ?',
        [id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send('Category deleted');
        }
    );
};