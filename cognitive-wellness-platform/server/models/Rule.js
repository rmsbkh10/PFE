const mongoose = require("mongoose");
const Assessment = require("./Assessment"); // <-- on importe le modèle Assessment, on ne le recrée pas

const ruleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, enum: ["sleep", "stress", "nutrition"], required: true },
    condition: { type: String, required: true },
    recommendation: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rule", ruleSchema);
