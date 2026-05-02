const db = require('../config/db');

// REGISTER
exports.signup = (req, res) => {

    const { name, email, password } = req.body;

    db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, password],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Error in signup');
            } else {
                res.send('Signup successful');
            }
        }
    );
};


exports.login = (req, res) => {

    const { email, password } = req.body;

    db.query(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).send('Login error');
            }

            if (result.length === 0) {
                return res.status(401).send('Invalid credentials');
            }

            res.send('Login successful');
        }
    );
};