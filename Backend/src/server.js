const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth.route.js');
const messageRoutes = require('./routes/message.route.js');

dotenv.config();

const app = express();

// middleware
app.use(cors({
  origin: [
    "https://chatify-app1-21iphuooy-shahbaazmohd08-7596s-projects.vercel.app",
    "https://chatify-app1.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000"
  ],
  credentials: true
}));
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('DB Error:', err));

// serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
  });
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});