const express = require('express');
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const cardRoutes = require('./routes/routesCards');
const playersRoutes = require('./routes/routesPlayers');

const app = express();

app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', gameRoutes);
app.use('/api', cardRoutes);
app.use('/api', playersRoutes);

module.exports = app;