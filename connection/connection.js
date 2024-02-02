const {connect, connection} = require('mongoose');
require('dotenv').config('.env');

connect(process.env.MONGODB_URI).catch(err => console.log(err));

module.exports = connection;