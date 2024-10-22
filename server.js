const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();  // To load environment variables

const app = express();
const port = process.env.PORT || 3000;  // Use the port provided by Heroku or default to 3000 for local development

// Middleware
app.use(bodyParser.json());
app.use(cors());  // Allow cross-origin requests

// Serve static files from the root directory (adjust if necessary)
app.use(express.static(path.join(__dirname)));

// Route to serve index.html for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to handle GPT requests
app.post('/api/generate', async (req, res) => {
    const { conversation } = req.body;
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4o-mini', 
            messages: conversation,
            max_tokens: 200,  
            temperature: 0.7,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        res.json({ response: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Error generating GPT response:", error.message);
        res.status(500).json({ error: "Error generating GPT response" });
    }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
