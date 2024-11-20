const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Class = require('../models/Class');  // Assuming this is your class model

// GET endpoint to retrieve all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST endpoint to create a new course
router.post('/', async (req, res) => {
    const { courseid, day_of_week, time, duration, capacity, price, type, description } = req.body;

    const existingCourse = await Course.findOne({ courseid });
    if (existingCourse) {
        return res.status(400).json({ message: 'courseid already exists' });
    }

    const newCourse = new Course({
        courseid,
        day_of_week,
        time,
        duration,
        capacity,
        price,
        type,
        description
    });

    try {
        const savedCourse = await newCourse.save();
        res.status(201).json(savedCourse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT endpoint to update a course
router.put('/:courseid', async (req, res) => {
    const { courseid } = req.params;
    const { day_of_week, time, duration, capacity, price, type, description } = req.body;

    try {
        const updatedCourse = await Course.findOneAndUpdate(
            { courseid },
            { day_of_week, time, duration, capacity, price, type, description },
            { new: true } // This option returns the updated document
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json(updatedCourse);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE endpoint to delete a course and all associated classes
router.delete('/:courseid', async (req, res) => {
    const { courseid } = req.params;

    try {
        // Delete all classes associated with this course
        await Class.deleteMany({ courseid });

        // Delete the course
        const deletedCourse = await Course.findOneAndDelete({ courseid });

        if (!deletedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json({ message: 'Course and all associated classes deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;