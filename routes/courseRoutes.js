const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Class = require('../models/Class');  // Assuming this is your class model

// GET endpoint to retrieve all courses
router.get('/', async (req, res) => {
    console.log('GET /courses triggered');  // Log the action

    try {
        const courses = await Course.find();
        console.log('Courses retrieved:', courses);  // Log the retrieved data
        res.json(courses);
    } catch (err) {
        console.error('Error retrieving courses:', err.message);  // Log error
        res.status(500).json({ message: err.message });
    }
});

// POST endpoint to create a new course
router.post('/', async (req, res) => {
    const { courseid, day_of_week, time, duration, capacity, price, type, description } = req.body;

    console.log('POST /courses triggered with data:', req.body);  // Log the request data

    try {
        const existingCourse = await Course.findOne({ courseid });
        if (existingCourse) {
            console.log(`Course with ID ${courseid} already exists`);  // Log if the course already exists
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

        const savedCourse = await newCourse.save();
        console.log('Course created successfully:', savedCourse);  // Log the saved course
        res.status(201).json(savedCourse);
    } catch (err) {
        console.error('Error creating course:', err.message);  // Log error
        res.status(400).json({ message: err.message });
    }
});

// PUT endpoint to update a course
router.put('/:courseid', async (req, res) => {
    const { courseid } = req.params;
    const { day_of_week, time, duration, capacity, price, type, description } = req.body;

    console.log(`PUT /courses/${courseid} triggered with data:`, req.body);  // Log the request data

    try {
        const updatedCourse = await Course.findOneAndUpdate(
            { courseid },
            { day_of_week, time, duration, capacity, price, type, description },
            { new: true } // This option returns the updated document
        );

        if (!updatedCourse) {
            console.log(`Course with ID ${courseid} not found`);  // Log if course not found
            return res.status(404).json({ message: 'Course not found' });
        }

        console.log('Course updated successfully:', updatedCourse);  // Log the updated course
        res.status(200).json(updatedCourse);
    } catch (err) {
        console.error('Error updating course:', err.message);  // Log error
        res.status(500).json({ message: err.message });
    }
});

// DELETE endpoint to delete a course and all associated classes
router.delete('/:courseid', async (req, res) => {
    const { courseid } = req.params;

    console.log(`DELETE /courses/${courseid} triggered`);  // Log the action

    try {
        // Delete all classes associated with this course
        await Class.deleteMany({ courseid });
        console.log(`Classes for course ID ${courseid} deleted`);  // Log the deletion of classes

        // Delete the course
        const deletedCourse = await Course.findOneAndDelete({ courseid });

        if (!deletedCourse) {
            console.log(`Course with ID ${courseid} not found`);  // Log if course not found
            return res.status(404).json({ message: 'Course not found' });
        }

        console.log('Course and associated classes deleted successfully:', deletedCourse);  // Log the deleted course
        res.status(200).json({ message: 'Course and all associated classes deleted successfully' });
    } catch (err) {
        console.error('Error deleting course and classes:', err.message);  // Log error
        res.status(500).json({ message: err.message });
    }
});

router.delete('/courses', async (req, res) => {
    try {
        // Delete all courses and their associated classes
        await Course.deleteMany(); // Deletes all courses
        console.log("Detele all");  // Log the deletion of classes


        res.status(200).send({ message: "All courses and classes deleted." });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error deleting courses and classes" });
    }
});


module.exports = router;