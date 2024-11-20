const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseid: { type: Number, required: true, unique: true },
    day_of_week: { type: String, required: true },
    time: { type: String, required: true },
    duration: { type: Number, required: true },
    capacity: { type: Number, required: true },
    price: { type: Number, required: true },
    type: { type: String, required: true },
    description: { type: String, required: false }
});

module.exports = mongoose.model('Course', courseSchema);