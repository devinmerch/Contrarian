const express = require('express');
const axios = require('axios');  // Import axios for making HTTP requests
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();  // To load environment variables

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());  // Allow cross-origin requests

// Route to handle GPT-4o-mini requests
app.post('/api/generate', async (req, res) => {
    const { conversation } = req.body;  // Get the conversation history from the frontend
  
    try {
      // Make the request to GPT-4o mini or another model
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4o-mini',  // Or another model you're using
        messages: conversation,
        max_tokens: 200,  // You can adjust this based on your needs
        temperature: 0.7,
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
  
      // Send the GPT response back to the frontend
      res.json({ response: response.data.choices[0].message.content });
    } catch (error) {
      console.error("Error generating GPT response:", error.message);
      res.status(500).json({ error: "Error generating GPT response" });
    }
  });
  
// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
