import mistral from "../services/mistralServices.js";
import { ANALYSIS_PROMPT } from "../prompts/analysisPrompts.js";
import Assessment from "../models/Assessment.js";

export const analyze = async (req, res) => {
  try {
   console.log("===== ANALYZE HIT =====");
   
    console.log("REQ USER:", req.user);
    console.log("REQ BODY:", req.body);

    const messages = req.body.messages;

    const conversation = messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    const prompt = `
${ANALYSIS_PROMPT}

PATIENT CONVERSATION:
${conversation}
`;

    console.log("Prompt:", prompt);

    const response = await mistral.chat.complete({
      model: "mistral-small-latest",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

 

    const text = response.choices[0].message.content;

    console.log("AI RAW RESPONSE:");
    console.log(text);

const cleaned = text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

console.log("RAW AI RESPONSE:");
console.log(cleaned);

let data;

try {
  data = JSON.parse(cleaned);
} catch (error) {
  console.error("INVALID JSON FROM AI:");
  console.log(cleaned);

  return res.status(500).json({
    error: "AI returned invalid JSON",
  });
}

console.log("PARSED DATA:", data);

const { condition, risk, specialist } = data;

// User comes from JWT middleware
const userId = req.user.id;

console.log("Saving assessment for user:", userId);

await Assessment.create({
  messages,
  condition,
  risk,
  specialist,
  userId,
});
console.log("Assessment saved successfully");

res.json(data);
  }catch (error) {
  console.error("ANALYSIS ERROR:");
  console.error(error);

  res.status(500).json({
    error: "AI Analysis Failed",
    details: error.message,
  });
}
};

export const getAssessments = async (req, res) => {
  try {
    const userId = req.user.id;

    const assessments = await Assessment.find({
      userId,
    }).sort({ createdAt: -1 });

    res.json(assessments);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch assessments",
    });
  }
};