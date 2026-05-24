const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// routes
app.use('/', require('./routes/productRoutes'));
app.use('/', require('./routes/cartRoutes'));
app.use('/', require('./routes/usersRoutes'));
app.use('/', require('./routes/categoryRoutes'));
app.use('/', require('./routes/wishlistRoutes'));

app.use('/', require('./routes/profileRoutes'))
app.use('/', require('./routes/addressRoutes'))
app.use('/',require('./routes/bannerRoutes'));

app.get('/', (req, res) => {
    res.send('API running');
});

app.listen(5000, () => {
    console.log('Server running on 5000');
});