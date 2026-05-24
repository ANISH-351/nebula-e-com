const db = require('../config/db');



// GET PROFILE
exports.getProfile = (req, res) => {

    const id = req.params.id;

    db.query(
        'SELECT id, name, email, phone FROM users WHERE id = ?',
        [id],
        (err, result) => {
            if (err) return res.status(500).send(err);

            if (result.length === 0) {
                return res.status(404).send('User not found');
            }

            res.json(result[0]);
        }
    );
};

// UPDATE PROFILE
exports.updateProfile = (req, res) => {

    const id = req.params.id;

    const { name, email, phone } = req.body;

    db.query(
        'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?',
        [name, email, phone, id],
        (err, result) => {
            if (err) return res.status(500).send(err);

            res.send('Profile updated');
        }
    );
};




// CHANGE PASSWORD
exports.changePassword = (req, res) => {

    const id = req.params.id;

    const { oldPassword, newPassword } = req.body;

    // Check current password
    db.query(
        'SELECT password FROM users WHERE id = ?',
        [id],
        (err, result) => {

            if (err) return res.status(500).send(err);

            if (result.length === 0) {
                return res.status(404).send('User not found');
            }

            // Check old password
            if (result[0].password !== oldPassword) {
                return res.status(400).send('Old password is incorrect');
            }

            // Update new password
            db.query(
                'UPDATE users SET password = ? WHERE id = ?',
                [newPassword, id],
                (err) => {

                    if (err) return res.status(500).send(err);

                    res.send('Password updated');
                }
            );

        }
    );
};