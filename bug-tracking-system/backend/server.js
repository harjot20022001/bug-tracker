const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config({ path: './config/config.env' });

connectDB();

const auth = require('./routes/auth');
const projects = require('./routes/projects');
const tickets = require('./routes/tickets');
const users = require('./routes/users');

const app = express();

app.use(express.json());

app.use(cors());

app.use('/api/v1/auth', auth);
app.use('/api/v1/projects', projects);
app.use('/api/v1/tickets', tickets);
app.use('/api/v1/users', users);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT);
