const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    location: String,
    description: String,
    date: Date,
    pax: Number,
    price: Number,
    total: Number,
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
