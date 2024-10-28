const express = require('express');
const db = require('./database');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
app.use(cors())

app.use('/api/ligue', ligueRoute);
app.use('/api/user', userRoute)
