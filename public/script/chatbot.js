const chatbotContainer = document.querySelector('.chatbot-container');
const chatToggle = document.getElementById('chatbot-toggle');
const closeButton = document.getElementById('close-chatbot');
const chatInput = document.getElementById('chatbot-input-field');
const sendButton = document.getElementById('send-message'); 
const messagesContainer = document.querySelector('.chatbot-messages');

chatToggle.addEventListener('click', () => {
    chatbotContainer.classList.add('visible'); 
    chatToggle.classList.add('hidden');
});

closeButton.addEventListener('click', () => {
    chatbotContainer.classList.remove('visible'); 
    chatToggle.classList.remove('hidden');
});

sendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    chatInput.value = '';

    const loadingId = Date.now().toString();
    addMessage("Thinking...", 'bot', loadingId);

    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAbbapE0edChzDmtx6aNQ3AO3ZQk_N0iO8", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: message }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);
 
        removeMessage(loadingId);

        
        if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            const responseText = data.candidates[0].content.parts[0].text;
            addMessage(responseText, 'bot');
        } else {
            addMessage("Error: Unexpected response format from AI service.", 'bot');
        }
    } catch (error) {
        removeMessage(loadingId);
        addMessage("Error: Unable to reach AI service. Please try again later.", 'bot');
        console.error("Chatbot API Error:", error);
    }
}

function addMessage(content, sender, id = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    if (id) {
        messageDiv.id = id;
    }
    
    const timestamp = new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    messageDiv.innerHTML = `
        <div class="message-content">${content}</div>
        <div class="message-timestamp">${timestamp}</div>
    `;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeMessage(id) {
    const message = document.getElementById(id);
    if (message) {
        message.remove();
    }
}

