const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

require('./Models/db-connection');

app.use('/api/auth',       require('./Routes/auth-routes'));
app.use('/api/user',       require('./Routes/user-routes'));
app.use('/api/summarizer', require('./Routes/summarizer-routes'));
app.use('/api/scheduler',  require('./Routes/schedule-routes'));
app.use('/api/quiz',       require('./Routes/quiz-routes'));
app.use('/api/dashboard',  require('./Routes/dashboard-routes'));

app.get('/', (_req, res) => res.send('<h1>StudyAI API is running</h1>'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
