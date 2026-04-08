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
const cors = require('cors');
const path = require('path');
const mongoose = require("mongoose");

const authRoutes = require('./routes/auth.route.js');
const messageRoutes = require('./routes/message.route.js');

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

// serve frontend
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// ✅ ONLY ONE LISTEN
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});