import mistral from "../services/mistralServices.js";
import { CHAT_PROMPT } from "../prompts/chatPrompts.js";
import { isEmergency }
from "../services/emergencyCheck.js";

export const chat = async (req, res) => {
  try {
    const messages = req.body.messages;
    console.log(
  "Messages received:",
  JSON.stringify(messages, null, 2)
);

    console.log("User Message:", messages);
   console.log(
  "Conversation:",
  JSON.stringify(messages, null, 2)
);
const latestMessage =
  messages[messages.length - 1].content;
  if (isEmergency(latestMessage)) {
  return res.json({
    reply:
      "⚠️ Your symptoms may indicate a medical emergency. Please seek immediate medical attention or contact emergency services 108."
  });
}
    const response = await mistral.chat.complete({
      model: "mistral-small-latest",
      messages: [
        {
          role: "system",
         content: CHAT_PROMPT
        },
        
        ...messages,
      ],
    });

    const reply = response.choices[0].message.content;

    console.log("AI Reply:", reply);

    res.json({
      reply,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Chat Failed",
    });
  }
  
};
