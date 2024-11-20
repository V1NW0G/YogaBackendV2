const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const Course = require('../models/Course');  // Assuming you want to check if the course exists for class association

// GET endpoint to retrieve all classes
router.get('/', async (req, res) => {
    console.log('GET /classes triggered'); // Log the action

    try {
        const classes = await Class.find().populate('courseid');  // Populate course data with class info
        console.log('Classes retrieved:', classes);  // Log the retrieved data
        res.json(classes);
    } catch (err) {
        console.error('Error retrieving classes:', err.message);  // Log error
        res.status(500).json({ message: err.message });
    }
});

// POST endpoint to create a new class
router.post('/', async (req, res) => {
    const { classid, courseid, date, teacher, comment } = req.body;
    console.log('POST /classes triggered with data:', req.body);  // Log the request data

    try {
        // Check if the course exists before adding a class
        const courseExists = await Course.findOne({ courseid });
        if (!courseExists) {
            console.log(`Course with ID ${courseid} does not exist`);  // Log if course doesn't exist
            return res.status(400).json({ message: 'Course does not exist' });
        }

        const newClass = new Class({
            classid,
            courseid,
            date,
            teacher,
            comment
        });

        const savedClass = await newClass.save();
        console.log('Class created successfully:', savedClass);  // Log the saved class
        res.status(201).json(savedClass);
    } catch (err) {
        console.error('Error creating class:', err.message);  // Log error
        res.status(400).json({ message: err.message });
    }
});

// PUT endpoint to update a specific class by classid and courseid
router.put('/:courseid/:classid', async (req, res) => {
    const { courseid, classid } = req.params;
    const { date, teacher, comment } = req.body;

    console.log(`PUT /classes/${courseid}/${classid} triggered with data:`, req.body);  // Log the request data

    try {
        const updatedClass = await Class.findOneAndUpdate(
            { classid, courseid },
            { date, teacher, comment },
            { new: true }  // This option returns the updated document
        );

        if (!updatedClass) {
            console.log(`Class with ID ${classid} and course ID ${courseid} not found or does not belong to this course`);  // Log when class not found
            return res.status(404).json({ message: 'Class not found or does not belong to this course' });
        }

        console.log('Class updated successfully:', updatedClass);  // Log the updated class
        res.status(200).json(updatedClass);
    } catch (err) {
        console.error('Error updating class:', err.message);  // Log error
        res.status(500).json({ message: err.message });
    }
});

// DELETE endpoint to delete a specific class by classid and courseid
router.delete('/:courseid/:classid', async (req, res) => {
    const { courseid, classid } = req.params;

    console.log(`DELETE /classes/${courseid}/${classid} triggered`);  // Log the action

    try {
        const deletedClass = await Class.findOneAndDelete({ classid, courseid });

        if (!deletedClass) {
            console.log(`Class with ID ${classid} and course ID ${courseid} not found or does not belong to this course`);  // Log if class not found
            return res.status(404).json({ message: 'Class not found or does not belong to this course' });
        }

        console.log('Class deleted successfully:', deletedClass);  // Log the deleted class
        res.status(200).json({ message: 'Class deleted successfully' });
    } catch (err) {
        console.error('Error deleting class:', err.message);  // Log error
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;