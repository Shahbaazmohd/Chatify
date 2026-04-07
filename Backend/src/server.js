//const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const authRoutes = require('./routes/auth.route.js');
const messageRoutes = require('./routes/message.route.js');

const app = express();

const PORT = process.env.PORT || 3000;

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});