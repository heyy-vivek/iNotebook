const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');
const User = require('../models/User');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

//Route1 : Get All the Notes using : GET "/api/notes/getuser".Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
  try {
    // Fetch notes that are either owned by the user or shared with the user
    const notes = await Notes.find({
      $or: [
                { user: req.user.id },
                { sharedWith: req.user.id }
            ]
    });
    res.json(notes)

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }

})

//Route2 :Add new Notes using : POST "/api/notes/addnote".Login required
router.post('/addnote', fetchuser, [
  body('title', 'Enter a valid title').isLength({ min: 3 }),
  body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),], async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      const note = new Notes({
        title, description, tag, user: req.user.id
      })

      const savedNote = await note.save()
      res.json(savedNote)

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }

  })


//Route3 :Update existing Notes using : Put "/api/notes/updatenotes".Login required
router.put('/updatenotes/:id', fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    // Create a newNote object
    const newNote = {};
    if (title) { newNote.title = title };
    if (description) { newNote.description = description };
    if (tag) { newNote.tag = tag };

    //find the note to be updated and update it
    let note = await Notes.findById(req.params.id);
    if (!note) { return res.status(404).send("Not Found") }

    // Allow updation only if user owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }

})

//Route4 :Delete existing Notes using : delete "/api/notes/deletenotes".Login required
router.delete('/deletenotes/:id', fetchuser, async (req, res) => {
  try {
    //find the note to be deleted and delete it
    let note = await Notes.findById(req.params.id);
    if (!note) { return res.status(404).send("Not Found") }

    // Allow deletion only if user owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id)
    res.json({ "Success": "Note has been deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }

})

//Route5 :Share existing Notes using : put "/api/notes/sharenotes".Login required
router.put('/sharenotes/:id', fetchuser, async (req, res) => {
  try {
    const { emailId } = req.body;

    // Find the user to be shared with
    let sharedUser = await User.findOne({ email: emailId });
    if (!sharedUser) { return res.status(404).json({ success: false, error: "User not found" }) }

    // Find the note to be shared and check if the logged in user is the owner of the note
    let note = await Notes.findById(req.params.id);
    if (!note) { return res.status(404).json({ success: false, error: "Note not found" }) }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: "Not Allowed" });
    }

    // Add the user to the sharedWith array of the note
    if (!note.sharedWith) { note.sharedWith = []; }

    note.sharedWith.push(sharedUser._id);
    await note.save();

    res.json({ success: true, message: "Note shared successfully", note: note });
  } catch (error) {
    console.error(error.message);
    console.error("stack trace:", error.stack);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router