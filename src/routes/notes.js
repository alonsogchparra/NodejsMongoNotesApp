const express = require('express');
const router = express.Router();

// Models
const Note = require('../models/Note');
// Helpers
const { isAuthenticated } = require('../helpers/auth');

// New Note
router.get('/notes/add', isAuthenticated, (req, res) => {
  res.render('notes/new-note');
});

router.post('/notes/new-note', isAuthenticated, async (req, res) => {
  const { title, description } = req.body;
  let errors = [];

  if (!title) {
    errors.push({ text: 'Please insert Title.' });
  }

  if (!description) {
    errors.push({ text: 'Please insert a description' });
  }

  if (errors.length > 0) {
    res.render('notes/new-note', { 
      errors, 
      title, 
      description 
    }); 
  } else {
    const newNote = new Note({ title, description });
    await newNote.save();
    req.flash('success_msg', 'Note added successfully');
    res.redirect('/notes');
  }

});

// Get all Notes
router.get('/notes', isAuthenticated, async (req, res) => {
  const notes = await Note.find().sort({date: 'desc'});
  res.render('notes/all-notes', { notes });
});

// Edit Notes
router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
  const note = await Note.findById(req.params.id);
  res.render('notes/edit-note', { note });
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
  const { title, description } = req.body;
  await Note.findByIdAndUpdate(req.params.id, { title, description });
  req.flash('success_msg', 'Note Updated Successfully');
  res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async (req,res) => {
  await Note.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Note Deleted Successfully');
  res.redirect('/notes');
});

module.exports = router;