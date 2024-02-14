const express = require('express');
const path = require('path');
const fileRoute = require('./routes/file');
const cors = require('cors')
const mongoose = require('mongoose');


mongoose.connect("mongodb://127.0.0.1:27017/logite")

const app = express();
app.use(cors())
app.use(express.static(path.join(__dirname, '..', 'build')));
app.use(fileRoute);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

app.listen(3001, () => {
  console.log('server started on port 3001');
});