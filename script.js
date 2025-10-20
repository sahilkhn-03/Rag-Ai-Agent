// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const questionInput = document.getElementById('questionInput');
const sendBtn = document.getElementById('sendBtn');
const statusText = document.getElementById('status-text');
const exampleQuestions = document.querySelectorAll('.example-questions li');

// API Configuration
const API_URL = 'http://localhost:5000/ask'; // We'll create a Flask backend

// Event Listeners
sendBtn.addEventListener('click', sendQuestion);
questionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendQuestion();
    }
});

// Handle example questions
exampleQuestions.forEach(question => {
    question.addEventListener('click', () => {
        questionInput.value = question.textContent.replace(/"/g, '');
        sendQuestion();
    });
});

// Send Question Function
async function sendQuestion() {
    const question = questionInput.value.trim();
    
    if (!question) return;
    
    // Add user message
    addMessage(question, 'user');
    questionInput.value = '';
    
    // Show loading
    const loadingId = addLoadingMessage();
    updateStatus('Thinking...', 'loading');
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: question })
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        // Remove loading message
        removeMessage(loadingId);
        
        // Add bot response
        addMessage(data.response, 'bot');
        updateStatus('Ready', 'ready');
        
    } catch (error) {
        console.error('Error:', error);
        removeMessage(loadingId);
        addMessage('Sorry, I encountered an error. Please make sure the backend server is running and try again.', 'bot', true);
        updateStatus('Error - Check console', 'error');
    }
}

// Add Message to Chat
function addMessage(text, sender, isError = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (isError) {
        contentDiv.style.color = '#ef4444';
    }
    
    contentDiv.innerHTML = formatMessage(text);
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return messageDiv;
}

// Format Message (for better display)
function formatMessage(text) {
    // Convert line breaks
    text = text.replace(/\n/g, '<br>');
    
    // Highlight video references
    text = text.replace(/video (\d+)/gi, '<strong style="color: #6366f1;">Video $1</strong>');
    text = text.replace(/(\d+:\d+)/g, '<strong style="color: #ec4899;">$1</strong>');
    
    return text;
}

// Add Loading Message
function addLoadingMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    messageDiv.id = 'loading-message';
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div>';
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return 'loading-message';
}

// Remove Message
function removeMessage(messageId) {
    const message = document.getElementById(messageId);
    if (message) {
        message.remove();
    }
}

// Update Status
function updateStatus(text, status) {
    statusText.textContent = text;
    const statusDot = document.querySelector('.status-dot');
    
    switch(status) {
        case 'ready':
            statusDot.style.background = '#10b981';
            break;
        case 'loading':
            statusDot.style.background = '#f59e0b';
            break;
        case 'error':
            statusDot.style.background = '#ef4444';
            break;
    }
}

// Smooth Scroll for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.about-card, .workflow-step, .info-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});
