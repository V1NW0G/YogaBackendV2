const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    classid: { type: Number, required: true, unique: true },
    courseid: { type: Number, required: true },  // Course this class belongs to
    date: { type: String, required: true },
    teacher: { type: String, required: true },
    comment: { type: String, required: false }
});

module.exports = mongoose.model('Class', classSchema);