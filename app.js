// Store the selected perspective
const prompts = {
  Democratic: `You’re an expert in political science with a focus on Democratic values. Your goal is to align with progressive liberal beliefs such as social equality and economic fairness. 
  When someone presents an idea, briefly acknowledge the central belief in a natural tone in one sentence, then follow with a question that critiques or counters their belief in a way that encourages reflection. Make the question engaging, clear, and designed to stimulate further thought.`,

  Republican: `You’re an expert in political science with a focus on conservative Republican values like individual freedom and small government. 
  When someone presents an idea, briefly acknowledge the central belief in a natural tone in one sentence, then follow with a question that critiques or counters their belief in a way that encourages reflection. Make the question engaging, clear, and designed to stimulate further thought.`,

  Liberal: `You’re an expert on liberal ideology, focusing on civil rights and government support for marginalized communities. 
  When someone presents an idea, briefly acknowledge the central belief in a natural tone in one sentence, then follow with a question that critiques or counters their belief in a way that encourages reflection. Make the question engaging, clear, and designed to stimulate further thought.`,

  Conservative: `You’re an expert in conservative ideology with a focus on tradition and limited government intervention. 
  When someone presents an idea, briefly acknowledge the central belief in a natural tone in one sentence, then follow with a question that critiques or counters their belief in a way that encourages reflection. Make the question engaging, clear, and designed to stimulate further thought.`,

  Libertarian: `You specialize in libertarian values, focusing on individual freedom and minimal government.
  When someone presents an idea, briefly acknowledge the central belief in a natural tone in one sentence, then follow with a question that critiques or counters their belief in a way that encourages reflection. Make the question engaging, clear, and designed to stimulate further thought.`,

  Progressive: `You’re an expert in progressive politics, advocating for social justice, economic reform, and sustainability. 
  When someone presents an idea, briefly acknowledge the central belief in a natural tone in one sentence, then follow with a question that critiques or counters their belief in a way that encourages reflection. Make the question engaging, clear, and designed to stimulate further thought.`,
};

// Variable to store the selected perspective and conversation history
let selectedPerspective = '';
let conversationHistory = [];

const apiBaseUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://desolate-escarpment-44645.herokuapp.com';


// Handle chip selection (only one can be active, or deselect if already selected)
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', function () {
    if (this.classList.contains('bg-gray-800')) {
      this.classList.remove('bg-gray-800', 'text-white');
      selectedPerspective = '';  // Reset the selected perspective
    } else {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('bg-gray-800', 'text-white'));
      this.classList.add('bg-gray-800', 'text-white');
      selectedPerspective = this.getAttribute('data-perspective');
      conversationHistory = [];  // Clear conversation history when a new perspective is selected
    }
  });
});

// Handle form submission
document.getElementById('submitBtn').addEventListener('click', async function () {
  const userPrompt = document.getElementById('userPrompt').value;
  const apiResponseBox = document.getElementById('apiResponse');

  if (!selectedPerspective) {
    apiResponseBox.innerHTML = `<p class="text-red-500">Please select a perspective first.</p>`;
    return;
  }

  if (!userPrompt.trim()) {
    apiResponseBox.innerHTML = `<p class="text-red-500">Please enter your prompt.</p>`;
    return;
  }

  // Add the user prompt to the conversation history
  conversationHistory.push({ role: 'user', content: userPrompt });

  // Show a centered spinning loader while waiting for the response
  apiResponseBox.innerHTML = `
    <div class="loader-container">
      <div class="loader"></div>
    </div>
  `;

  // Prepare the prompt to send to GPT, including the entire conversation history
  const conversation = [
    { role: 'system', content: prompts[selectedPerspective] },
    ...conversationHistory
  ];

  try {
    // Send the conversation to your backend API
    const response = await fetch(`${apiBaseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversation }),
    });

    const data = await response.json();

    // Add the model's response to the conversation history
    conversationHistory.push({ role: 'assistant', content: data.response });

    // Clear the input field
    document.getElementById('userPrompt').value = '';

    // Delay for 1-2 seconds before showing the response
    setTimeout(() => {
      // Ensure the entire response is displayed with larger text
      apiResponseBox.innerHTML = data.response
        .split('. ')
        .map((sentence) => `<p class="text-2xl">${sentence}</p>`)
        .join('');
    }, 1500); // 1.5 seconds delay
  } catch (error) {
    console.error(error);
    apiResponseBox.innerHTML = `<p class="text-red-500">Error fetching the response</p>`;
  }
});

// Handle reset button
document.getElementById('resetBtn').addEventListener('click', function () {
    // Reset all variables and UI elements
    conversationHistory = [];
    selectedPerspective = '';
  
    // Clear any active chip selection
    document.querySelectorAll('.chip').forEach(chip => chip.classList.remove('bg-gray-800', 'text-white'));
  
    // Clear the input field
    document.getElementById('userPrompt').value = '';
  
    // Clear the response box and set the default message
    document.getElementById('apiResponse').innerHTML = '<p class="text-gray-500 text-2xl">AI Responses will show up here...</p>';
  
    // Optionally log a message for debugging
    console.log("Conversation has been reset.");
  });
  