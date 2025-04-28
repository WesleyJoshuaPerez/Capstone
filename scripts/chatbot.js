function toggleChatbot() {
  var popup = document.getElementById("chatbotPopup");
  var button = document.getElementById("chatToggle");
  var chatIcon = document.getElementById("chatIcon");

  // Toggle the visibility of the chatbot popup
  if (popup.style.display === "none" || popup.style.display === "") {
    popup.style.display = "block"; // Show the chatbot popup
    button.style.display = "none"; // Hide the button when chatbot is opened
  } else {
    popup.style.display = "none"; // Hide the chatbot popup
    button.style.display = "block"; // Show the button again when chatbot is closed
  }
}

function closeChatbot() {
  var popup = document.getElementById("chatbotPopup");
  var button = document.getElementById("chatToggle");

  popup.style.display = "none"; // Close the popup
  button.style.display = "block"; // Show the button again when chatbot is closed
}
