function toggleChatbot() {
  const chatWindow = document.getElementById("chatWindow");
  const chatToggle = document.getElementById("chatToggle");
  const chatBody = document.getElementById("chatBody");

  chatWindow.style.display = "block"; // Show chatbot window
  chatToggle.style.display = "none"; // Hide toggle button

  // Check if greeting has been added before
  if (!chatWindow.dataset.greeted) {
    chatWindow.dataset.greeted = "true"; // Mark as greeted

    const greetingMessage = document.createElement("div");
    greetingMessage.textContent = "Hello! How can I assist you today?";
    greetingMessage.style.padding = "0.625rem";
    greetingMessage.style.margin = "0.3125rem";
    greetingMessage.style.background = "#4cdcd4";
    greetingMessage.style.borderRadius = "0.3125rem";
    chatBody.appendChild(greetingMessage);
  }
}

function closeChatbot() {
  const chatWindow = document.getElementById("chatWindow");
  const chatToggle = document.getElementById("chatToggle");

  chatWindow.style.display = "none"; // Hide chatbot window
  chatToggle.style.display = "block"; // Show toggle button
}

// Function to get chatbot response
let previousMessage = ""; // Store previous user message

// Function to get chatbot response
let previousCategory = ""; // Store the last detected category

function normalizeMessage(message) {
  message = message.toLowerCase().trim(); // Normalize input

  if (message === "") return "empty"; // Handle empty input separately

  // Add spaces for common words (fixes "hellothere" -> "hello there")
  const commonWords = [
    "hi",
    "hello",
    "hey",
    "goodmorning",
    "goodafternoon",
    "goodevening",
    "howareyou",
    "whoareyou",
    "whatcanyoudo",
    "whatsyourname",
    "thankyou",
    "thanks",
    "internetissue",
    "slowinternet",
    "subscribe",
    "plan",
    "upgrade",
    "payment",
    "bill",
    "reminder",
    "smsnotification",
    "installation",
    "newconnection",
    "maintenance",
    "servicerequest",
    "slotavailability",
    "miscellaneousfee",
    "extracharges",
  ];

  commonWords.forEach((word) => {
    message = message.replace(
      new RegExp(word, "g"),
      word.split(/(?=[A-Z])/).join(" ")
    );
  });

  return message;
}

// Predefined chatbot responses mapped to keywords
const responses = {
  greetings: [
    "hello",
    "hi",
    "hey",
    "good morning",
    "good afternoon",
    "good evening",
  ],
  smallTalk: ["how are you", "how's it going"],
  identity: ["who are you", "what can you do"],
  name: ["what's your name"],
  thanks: ["thank", "thanks"],
  internetIssues: ["internet issue", "slow internet"],
  subscription: ["subscribe", "plan", "upgrade"],
  billing: ["payment", "bill"],
  reminders: ["reminder", "sms notification"],
  installation: ["installation", "new connection"],
  maintenance: ["maintenance", "service request"],
  slots: ["slot availability"],
  fees: ["miscellaneous fee", "extra charges"],
  noResponse: ["no", "nope", "nah", "nothing"], // Special case for "no" & "nothing"
  yesResponse: ["yes", "yep", "sure", "okay", "of course"], // Handles "yes"
  empty: ["empty"], // Special case for empty input
};

// Predefined replies
const replies = {
  greetings: [
    "Hello! 😊 How can I assist you today?",
    "Hey there! How can I help?",
  ],
  smallTalk: ["I'm just a chatbot, but I'm feeling great! 😃 How about you?"],
  identity: [
    "I'm your friendly assistant for LYNX Fiber Internet! Ask me anything!",
  ],
  name: ["I'm the LYNX Fiber Internet chatbot! You can call me LynxBot. 😃"],
  thanks: [
    "You're very welcome! 😊 Let me know if there's anything else I can do for you.",
  ],
  internetIssues: [
    "I’m sorry to hear that! Have you tried restarting your modem?",
  ],
  subscription: [
    "We offer different subscription plans. Would you like me to guide you?",
  ],
  billing: ["You can pay your bill online via our portal. Need more details?"],
  reminders: ["We send SMS reminders for payments and maintenance schedules."],
  installation: [
    "Check available installation slots on our website. Need help?",
  ],
  maintenance: ["You can request maintenance through your account dashboard."],
  slots: ["We provide real-time slot availability checking on our website."],
  fees: ["Miscellaneous fees apply for extra services. Need specific details?"],
  noResponse: [
    "Alright! Let me know if you need anything else. 😊",
    "No problem! I'm here if you change your mind. 🙌",
    "Okay! Just let me know if you need help. 👍",
  ],
  yesResponse: ["Great! What do you need help with?"], // Default response for yes (gets replaced with context-based response)
  empty: [
    "Oops! It looks like you didn't type anything. Can I help you with something? 😊",
  ],
  default: ["That's an interesting question! 🤔 Let me know how I can assist!"],
};

// Function to get chatbot response
function getBotResponse(userMessage) {
  let normalizedMessage = normalizeMessage(userMessage);

  // Handle "nothing" separately
  if (normalizedMessage === "nothing") {
    return replies.noResponse[
      Math.floor(Math.random() * replies.noResponse.length)
    ];
  }

  // Handle "yes" based on previous context
  if (responses.yesResponse.includes(normalizedMessage)) {
    if (previousCategory === "subscription") {
      return "Awesome! You can check our available plans on the website. Would you like a direct link?";
    } else if (previousCategory === "billing") {
      return "Great! You can pay your bill online through our portal. Would you like payment instructions?";
    } else if (previousCategory === "installation") {
      return "Fantastic! I can guide you through the installation process. Do you need help booking a slot?";
    } else {
      return replies.yesResponse[
        Math.floor(Math.random() * replies.yesResponse.length)
      ];
    }
  }

  // Handle "no" separately
  if (responses.noResponse.includes(normalizedMessage)) {
    return replies.noResponse[
      Math.floor(Math.random() * replies.noResponse.length)
    ];
  }

  // Detect category and store it for context
  for (let category in responses) {
    if (
      responses[category].some((phrase) => normalizedMessage.includes(phrase))
    ) {
      previousCategory = category; // Store context
      return replies[category][
        Math.floor(Math.random() * replies[category].length)
      ];
    }
  }

  return replies.default[Math.floor(Math.random() * replies.default.length)]; // Default fallback response
}

// Function to send user message and get bot response
function sendMessage() {
  const chatBody = document.getElementById("chatBody");
  const chatInput = document.getElementById("chatInput");

  let userMessage = chatInput.value.trim();
  if (userMessage === "") return;

  // Create User Message
  const userMessageElement = document.createElement("div");
  userMessageElement.textContent = "You: " + userMessage;
  userMessageElement.style.padding = "0.625rem";
  userMessageElement.style.margin = "0.3125rem";
  userMessageElement.style.background = "#4cbca4";
  userMessageElement.style.color = "white";
  userMessageElement.style.borderRadius = "0.3125rem";
  userMessageElement.style.textAlign = "right";
  userMessageElement.style.alignSelf = "flex-end"; // Align to the right
  chatBody.appendChild(userMessageElement);

  // Get Bot Response
  let botReply = getBotResponse(userMessage);

  // Create Bot Message
  const botMessageElement = document.createElement("div");
  botMessageElement.textContent = "Chatbot: " + botReply;
  botMessageElement.style.padding = "0.625rem";
  botMessageElement.style.margin = "0.3125rem";
  botMessageElement.style.background = "#4cdcd4";
  botMessageElement.style.borderRadius = "0.3125rem";
  botMessageElement.style.textAlign = "left";
  botMessageElement.style.alignSelf = "flex-start"; // Align to the left
  chatBody.appendChild(botMessageElement);

  // Clear Input and Scroll to Bottom
  chatInput.value = "";
  chatBody.scrollTop = chatBody.scrollHeight;
}
// Send message when pressing Enter key
document
  .getElementById("chatInput")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent new line in input field
      sendMessage(); // Call the sendMessage function
    }
  });
