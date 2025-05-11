const express = require("express");
const router = express.Router();
const Note = require("../models/Notes");

const authMiddleware = require("../middlewares/authMiddleware");

router.get("/my-notes", authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// // Get All Notes
// router.get("/", async (req, res) => {
//   try {
//     const notes = await Note.find();
//     res.status(200).json(notes);
//   } catch (err) {
//     res.status(500).json({ message: "An error occurred", error: err });
//   }
// });


// Get all notes for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notes", error: err });
  }
});

// Create Note
// router.post("/", async (req, res) => {
//   try {
//     const note = new Note(req.body);
//     const savedNote = await note.save();
//     res.status(200).json(savedNote);
//   } catch (err) {
//     res.status(500).json({ message: "An error occurred", error: err });
//   }
// });

router.post("/", authMiddleware, async (req, res) => {
  try {
    const noteData = {
      title: req.body.title,
      content: req.body.content,
      user: req.user._id, // ← نربط الـ note بالمستخدم
    };

    const note = new Note(noteData);
    const savedNote = await note.save();
    res.status(200).json(savedNote);
  } catch (err) {
    res.status(500).json({ message: "An error occurred", error: err });
  }
});

// // Update Note
// router.put("/:id", async (req, res) => {
//   try {
//     const updatedNote = await Note.findByIdAndUpdate(
//       req.params.id,
//       {
//         $set: req.body,
//       },
//       { new: true } // عشان يرجع النوت بعد التحديث
//     );

//     if (!updatedNote) {
//       return res.status(404).json({ message: "Note not found" });
//     }

//     res.json(updatedNote);
//   } catch (err) {
//     res.status(500).json({ message: "An error occurred", error: err });
//   }
// });

// Update Note
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, // نضمن إنها نوت تخص المستخدم
      req.body,
      { new: true } // يرجّع النوت بعد التعديل
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ message: "Failed to update note", error: err });
  }
});

// // Delete Note
// router.delete("/:id", async (req, res) => {
//   try {
//     await Note.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "Note deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "An error occurred", error: err });
//   }
// });

// Delete Note
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete note", error: err });
  }
});


// Search Notes
router.get("/search", async (req, res) => {
  const query = req.query.q;

  try {
    const results = await Note.find({
      $or: [
        { title: { $regex: query, $options: "i" } }, // البحث في العنوان
        { content: { $regex: query, $options: "i" } }, // البحث في المحتوى
      ],
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
