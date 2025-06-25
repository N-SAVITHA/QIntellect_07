import express from 'express';
import axios from 'axios';
import nlp from 'compromise';

const router = express.Router();

// Full list of symptoms as per your model
const SYMPTOM_LIST = [
  "Chest Pain", "Shortness of Breath", "Irregular Heartbeat", "Fatigue", "Persistent Cough",
  "Wheezing", "Sputum Production", "Breathing Difficulty", "Headache", "Dizziness", "Numbness",
  "Memory Issues", "Speech Problems", "Abdominal Pain", "Nausea", "Vomiting", "Diarrhea", "Bloating",
  "Constipation", "Joint Pain", "Muscle Pain", "Back Pain", "Limited Mobility", "Bone Pain",
  "Skin Rash", "Itching", "Skin Discoloration", "Skin Growth", "Skin Dryness", "Excessive Thirst",
  "Frequent Urination", "Weight Change", "Cold/Heat Intolerance", "Blurred Vision", "Eye Pain",
  "Vision Loss", "Eye Redness", "Floaters", "Ear Pain", "Hearing Loss", "Ringing in Ears",
  "Sore Throat", "Nasal Congestion", "Urinary Frequency", "Urinary Incontinence", "Blood in Urine",
  "Erectile Dysfunction"
];

// Helper: map text to symptom object
function mapSymptomsFromText(text) {
  const lowerText = text.toLowerCase();
  const detected = {};
  SYMPTOM_LIST.forEach(sym => {
    // Simple match: check if symptom (lowercase, no punctuation) is in text
    const key = sym.toLowerCase().replace(/[^\w\s]/g, '');
    detected[sym] = lowerText.includes(key) ? 1.0 : 0.0;
  });
  return detected;
}

// POST /voice/manual-text
router.post('/manual-text', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, error: 'No text provided' });

    // 1. Build symptom object for model
    const symptomObj = mapSymptomsFromText(text);

    // 2. Call FastAPI department model
    const fastApiRes = await axios.post('http://localhost:8003/predict/', {
      symptoms: symptomObj
    });

    // 3. Return everything to frontend
    return res.json({
      success: true,
      symptoms: Object.entries(symptomObj).filter(([k, v]) => v === 1.0).map(([k]) => k),
      prediction: fastApiRes.data // Should include department and probabilities
    });
  } catch (err) {
    console.error(err?.response?.data || err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;