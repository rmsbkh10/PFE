const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware"); // ton middleware d’auth
const Rule = require("../models/Rule"); // ton modèle Mongoose

// GET : récupérer toutes les règles
router.get("/", auth, async (req, res) => {
  try {
    const rules = await Rule.find();
    res.status(200).json(rules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST : créer une nouvelle règle
router.post("/", auth, async (req, res) => {
  try {
    const newRule = new Rule(req.body);
    const savedRule = await newRule.save();
    res.status(201).json(savedRule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT : mettre à jour une règle existante
router.put("/:id", auth, async (req, res) => {
  try {
    const updatedRule = await Rule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedRule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE : supprimer une règle
router.delete("/:id", auth, async (req, res) => {
  try {
    await Rule.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Rule deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
