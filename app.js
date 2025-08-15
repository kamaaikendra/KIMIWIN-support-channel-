// Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZ-znvqufe3kTB_sPxQUiOdmbjXm00D8c",
  authDomain: "customerchat-88407.firebaseapp.com",
  databaseURL: "https://customerchat-88407-default-rtdb.firebaseio.com",
  projectId: "customerchat-88407",
  storageBucket: "customerchat-88407.firebasestorage.app",
  messagingSenderId: "1094190373370",
  appId: "1:1094190373370:web:9ef8834bb5c1d7f84c2c43",
  measurementId: "G-H4ZZTQQ2W9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// DOM elements
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const quickIssues = document.getElementById('quick-issues');
const issueButtons = document.getElementById('issue-buttons');

// Common issues and responses
const commonIssues = {
    "Withdrawl pending": "Withdrawls are usually processed within minutes. it may sometimes take upto 7days for the amount to reflect in your bank account die to some banks internal matter ,if happens manytimes with single account please visit your branch for more details ",
    "Game not loading": "Please check your Internet/wifi connection and other app settings by clicking the appinfo option and check for minor permissions if disabled then enable the permission options like storage and other permission on your device for KIMI WIN app. If the issue persists, please describe your problem in more detail.",
    "Payment issues": "please provide your transaction ID with the issue that you are facing our team will help you within 24hours",
    "Deposit problem": "Deposit amounts are usually credited within seconds after the payment is done. tips:to make it more faster please close the app and reopen the app and the amount will be credited instantly.if the issue persists dont worry you can leave a message here with the 12 digit UTR code and the recharge amount and our team will look after it and your amount will be credited/refunded",
    "Withdrawal amount not received": "Withdrawls are typically processed within 3-5 minutes. If it's been longer, please provide your transaction ID.",
    "App crashing": "Please make sure you have updated to the latest version of the app installed. If the problem continues, let us know your device model and OS version.",
    "Login issues": "Please ensure you're entering the correct email id and password. If you're not receiving the email links, check your Spam folder or try again after 2 minutes. For account recovery, please contact support.",
    "Account blocked": "If your account is temporarily blocked, please wait 24 hours or contact customer support with your registered details for resolution.",
    "Password reset link not received": "please check your gmail spam folder for the email that has been sent. You can request reset link again after 2 minutes or try using a different email.",
    "Bonus not credited": "Bonuses are usually applied immediately. If not visible, please restart the app. Ensure you've met all bonus terms. Provide transaction details if issue persists.",
    "Game results dispute": "All game outcomes are randomly generated and verified. If you suspect an error, please provide game ID and screenshot for investigation.",
    "Slow app performance": "Clear app cache from device settings, close background apps, and ensure you have at least 1GB free storage space for optimal performance.",
    "Forgot password": "Use the 'Forgot Password' option on login screen. You'll receive OTP to reset. Ensure new password has 8+ characters with letters and numbers.",
    "Verification link not recieved": "verification links are usually marked as spam due to network marketing activities. please Ensure to check your email spam folder and mark the email as not spam for faster and safe logins in future.",
    "Transaction history missing": "Some transactions may take time to reflect. Pull down to refresh or check after 1 hour. If still missing, provide approximate time/amount.",
    "Referral bonus issue": "Ensure your friend completed signup with your referall code and using your referral link. note that Both accounts must be verified. Provide friend's registered email if bonus missing."
};

// Generate or retrieve user token
let userToken = localStorage.getItem('userToken');
if (!userToken) {
    userToken = generateToken();
    localStorage.setItem('userToken', userToken);
}

// Generate a 12-digit crypto-like token
function generateToken() {
    const array = new Uint32Array(3);
    crypto.getRandomValues(array);
    return Array.from(array, dec => ('0000000000' + dec.toString(16)).slice(-10)).join('').slice(0, 12);
}

// Reference to user's chat in Firebase
const userChatRef = database.ref('chats/' + userToken);

// Load chat history
userChatRef.on('value', (snapshot) => {
    const messages = snapshot.val() || {};
    displayMessages(messages);
});

// Display messages
function displayMessages(messages) {
    chatMessages.innerHTML = '';
    
    Object.keys(messages).forEach(key => {
        const message = messages[key];
        addMessageToChat(message.text, message.sender, message.timestamp);
    });
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add a new message to the chat
function addMessageToChat(text, sender, timestamp = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    
    // Add timestamp if available
    if (timestamp) {
        const timeDiv = document.createElement('div');
        timeDiv.className = 'timestamp';
        timeDiv.textContent = formatTimestamp(timestamp);
        messageDiv.appendChild(timeDiv);
    }
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Format timestamp
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Show typing indicator
function showTypingIndicator(sender) {
    const typingDiv = document.createElement('div');
    typingDiv.className = `message ${sender}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'typing-indicator';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        contentDiv.appendChild(dot);
    }
    
    typingDiv.appendChild(contentDiv);
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return typingDiv;
}

// Hide typing indicator
function hideTypingIndicator(typingDiv) {
    if (typingDiv && typingDiv.parentNode) {
        typingDiv.parentNode.removeChild(typingDiv);
    }
}

// Send message
function sendMessage() {
    const text = messageInput.value.trim();
    if (text === '') return;
    
    const timestamp = Date.now();
    const message = {
        text,
        sender: 'user',
        timestamp
    };
    
    // Add to Firebase
    userChatRef.push(message);
    
    // Clear input
    messageInput.value = '';
    
    // Show typing indicator for bot
    const typingDiv = showTypingIndicator('app');
    
    // Process message (simulate bot response after delay)
    setTimeout(() => {
        hideTypingIndicator(typingDiv);
        processUserMessage(text, timestamp);
    }, 8000 + Math.random() * 20000); // Random delay between 1-3 seconds
}

// Process user message and generate response
function processUserMessage(text, userTimestamp) {
    const timestamp = Date.now();
    
    // Check if it's a common issue keyword
    let response = checkForCommonIssues(text);
    
    if (!response) {
        // Default responses
        const defaultResponses = [
            "Thanks for your message. Our support team will connect with you shortly.please check FAQs for more",
            "I've noted your concern. A support agent will respond soon.please check FAQs",
            "We appreciate your patience. Our team is reviewing your issue.please check FAQs for now",
            "Thank you for reaching out. We'll assist you as soon as possible.you can also check the FAQs "
        ];
        
        response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
    
    const botMessage = {
        text: response,
        sender: 'app',
        timestamp
    };
    
    // Add to Firebase
    userChatRef.push(botMessage);
    
    // Show quick issues if this is the first bot response
    if (Object.keys(commonIssues).length > 0) {
        showQuickIssues();
    }
}

// Check if message matches common issues
function checkForCommonIssues(text) {
    const lowerText = text.toLowerCase();
    
    for (const issue in commonIssues) {
        if (lowerText.includes(issue.toLowerCase())) {
            return commonIssues[issue];
        }
    }
    
    return null;
}

// Show quick issue buttons
function showQuickIssues() {
    issueButtons.innerHTML = '';
    
    for (const issue in commonIssues) {
        const button = document.createElement('button');
        button.className = 'issue-btn';
        button.textContent = issue;
        button.onclick = () => {
            // User selects a common issue
            const timestamp = Date.now();
            const userMessage = {
                text: issue,
                sender: 'user',
                timestamp
            };
            
            // Add to Firebase
            userChatRef.push(userMessage);
            
            // Show bot response
            const botMessage = {
                text: commonIssues[issue],
                sender: 'app',
                timestamp: Date.now()
            };
            
            userChatRef.push(botMessage);
        };
        
        issueButtons.appendChild(button);
    }
    
    quickIssues.style.display = 'block';
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Initial bot greeting
setTimeout(() => {
    const timestamp = Date.now();
    const greetingMessage = {
        text: "Hello! I'm your gaming support assistant. How can I help you today?",
        sender: 'app',
        timestamp
    };
    
    // Check if chat is empty before sending greeting
    userChatRef.once('value', (snapshot) => {
        if (!snapshot.val() || Object.keys(snapshot.val()).length === 0) {
            userChatRef.push(greetingMessage);
            showQuickIssues();
        }
    });
}, 1500);