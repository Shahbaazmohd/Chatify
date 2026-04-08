// //const express = require('express');
// const dotenv = require('dotenv');
// dotenv.config();

// // import path from 'path';
// const express = require('express');

// const express = require('express');
// const authRoutes = require('./routes/auth.route.js');
// const messageRoutes = require('./routes/message.route.js');

// const app = express();
// const __dirname = path.resolve();


// const PORT = process.env.PORT || 3000;

// app.use('/api/auth', authRoutes);
// app.use('/api/messages', messageRoutes);

// //make ready for deployment
// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, '../frontend/dist')));

//     app.get('*', (req, res) => {
//         res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
//     });
// }

// app.listen(PORT, () => {
//     console.log('Server is running on port ' + PORT);
// });




// const dotenv = require('dotenv');
// dotenv.config();

// const express = require('express');
// const path = require('path');

// const authRoutes = require('./routes/auth.route.js');
// const messageRoutes = require('./routes/message.route.js');

// const app = express();

// //const __dirname = path.resolve();
// const PORT = process.env.PORT || 3000;

// app.use('/api/auth', authRoutes);
// app.use('/api/messages', messageRoutes);

// // serve frontend
// app.use(express.static(path.join(__dirname, '../frontend/dist')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
// });

// app.listen(PORT, () => {
//     console.log('Server is running on port ' + PORT);
// });




const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const path = require('path');

const authRoutes = require('./routes/auth.route.js');
const messageRoutes = require('./routes/message.route.js');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());


const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));


app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// serve frontend
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});