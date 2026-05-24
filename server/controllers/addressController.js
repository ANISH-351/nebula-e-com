const db = require('../config/db');

// CREATE ADDRESS
exports.addAddress = (req, res) => {

    const {
        user_id,
        full_name,
        phone,
        pincode,
        city,
        state,
        country,
        address_line
    } = req.body;

    db.query(
        `INSERT INTO address 
        (user_id, full_name, phone, pincode, city, state, country, address_line)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            user_id,
            full_name,
            phone,
            pincode,
            city,
            state,
            country,
            address_line
        ],
        (err, result) => {

            if (err) return res.status(500).send(err);

            res.send('Address added');
        }
    );
};


// GET ADDRESS
exports.getAddress = (req, res) => {

    const id = req.params.id;

    db.query(
        'SELECT * FROM address WHERE id = ?',
        [id],
        (err, result) => {

            if (err) return res.status(500).send(err);

            res.json(result);
        }
    );
};



// UPDATE ADDRESS
exports.updateAddress = (req, res) => {

    const id = req.params.id;

    const {
        full_name,
        phone,
        pincode,
        city,
        state,
        country,
        address_line
    } = req.body;

    db.query(
        `UPDATE address 
         SET full_name = ?, 
             phone = ?, 
             pincode = ?, 
             city = ?, 
             state = ?, 
             country = ?, 
             address_line = ?
         WHERE id = ?`,
        [
            full_name,
            phone,
            pincode,
            city,
            state,
            country,
            address_line,
            id
        ],
        (err, result) => {

            if (err) return res.status(500).send(err);

            res.send('Address updated');
        }
    );
};



// DELETE ADDRESS
exports.deleteAddress = (req, res) => {

    const id = req.params.id;

    db.query(
        'DELETE FROM address WHERE id = ?',
        [id],
        (err, result) => {

            if (err) return res.status(500).send(err);

            res.send('Address deleted');
        }
    );
};