const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Path for the text file where the conversation is logged
const conversationFilePath = path.join(__dirname, "conversation_log.txt");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const prompt = `You are a supportive and empathetic mental health chatbot. Your role is to:
1. Have natural conversations with users about their mental health concerns.
2. Ask specific, relevant questions to assess their mood and stress levels numerically.
3. Encourage the user to express any feelings or experiences that might indicate mental health issues, such as anxiety, depression, or overwhelming stress.
4. Quantify the user's responses based on the assigned scores for stress and mood.
5. Provide brief, supportive feedback on their stress and mood levels.
6. Suggest helpful coping strategies based on their scores.
7. Remind users that you are not a substitute for professional help.

Important rules:
- Never diagnose conditions but provide information about common mental health issues based on user input.
- Use numerical scores to classify stress and mood levels.
- Maintain a warm, empathetic tone.
- Offer helpful advice without prescribing treatment.

Previous conversation context: ${JSON.stringify(chatHistory)}

User's message: ${userMessage}

Ask relevant questions, such as:
- "On a scale of 1 to 10, how would you rate your stress today?"
- "Can you describe what has been weighing on your mind lately?"
- "Have you noticed any changes in your mood or energy levels recently?"
- "Do you feel overwhelmed or anxious about anything specific?"

Calculate the scores for stress and mood levels, and provide thoughtful feedback, indicating if their responses suggest any common mental health issues like anxiety or depression.`;


function analyzeConversation() {
  // Read the entire conversation from the file
  const conversation = fs.readFileSync(conversationFilePath, "utf8");

  // Placeholder NLP analysis
  // Replace with actual NLP model for analyzing stress and mood levels
  let finalStressLevel = "Moderate";
  let finalMoodLevel = "Neutral";

  // Example logic to determine final scores (can be replaced with a real NLP model)
  if (conversation.includes("high stress")) {
    finalStressLevel = "High";
  } else if (conversation.includes("low stress")) {
    finalStressLevel = "Low";
  }

  if (conversation.includes("happy") || conversation.includes("positive")) {
    finalMoodLevel = "Positive";
  } else if (conversation.includes("sad") || conversation.includes("negative")) {
    finalMoodLevel = "Negative";
  }

  return {
    finalStressLevel,
    finalMoodLevel,
  };
}

app.post("/chat", async (req, res) => {
  try {
    const { message, chatHistory } = req.body;
    const response = await getChatResponse(message, chatHistory);
    
    res.json({ response });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    res.status(500).json({
      error: "An error occurred while processing your message",
      details: error.message,
    });
  }
});

app.get("/analyze", (req, res) => {
  try {
    // Analyze the entire conversation when the user is done
    const analysisResults = analyzeConversation();

    res.json({
      stressLevel: analysisResults.finalStressLevel,
      moodLevel: analysisResults.finalMoodLevel,
    });
  } catch (error) {
    console.error("Error in analyze endpoint:", error);
    res.status(500).json({
      error: "An error occurred while analyzing the conversation",
      details: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
