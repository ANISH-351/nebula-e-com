const db = require('../config/db');

// REGISTER
exports.signup = (req, res) => {

    const { name, email, password } = req.body;

    db.query(
        'SELECT id FROM users WHERE email = ?',
        [email],
        (err, result) => {

            if (err) return res.status(500).send(err);

            if (result.length > 0) {
                return res.status(409).send('Email already exists');
            }

            db.query(
                'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                [name, email, password],
                (err) => {

                    if (err) return res.status(500).send(err);

                    res.send('Signup successful');
                }
            );
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

            res.json({
    message: 'Login successful',
    user: result[0]
});
        }
    );
};