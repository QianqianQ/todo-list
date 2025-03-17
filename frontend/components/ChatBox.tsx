import { useState } from "react";
import { chatCompletion } from "@/services/api";

const ChatBox = () => {
  const [message, setMessage] = useState<string>("");
  const [response, setResponse] = useState<string | null>("");
  const [isLoading, setIsLoading] = useState(false); // Tracks loading state
  const [isOpen, setIsOpen] = useState(false); // Tracks chatbot visibility
//   const [chatHistory, setChatHistory] = useState([]);

  const handleSendMessage = async () => {
    if (!message || !message.trim() || isLoading) return;

    setIsLoading(true);

    // const userMessage = { sender: "User", text: message };
    // setChatHistory((prev) => [...prev, userMessage]);

    // try {
    //   const apiResponse = await chatCompletion(message);
    //   setResponse(apiResponse);
    // //   setChatHistory((prev) => [...prev, botMessage]);
    // } catch (error) {
    //   console.error("Error sending message:", error);
    // }

    try {
      const apiResponse = await chatCompletion(message);
      setResponse(apiResponse);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
      setMessage('');
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
        >
          Open Chat
        </button>
      )}
      <div className="fixed bottom-4 right-4 w-96 max-w-full z-50">
        {isOpen && (
          <div className="flex flex-col bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Chatbot</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white bg-transparent hover:bg-blue-600 rounded-full p-1 focus:outline-none"
              >
                &times;
              </button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto max-h-60">
              {response && (
                <div className="chat-message bot bg-gray-100 p-2 rounded-lg mb-2">
                  <strong>Bot:</strong> {response}
                </div>
              )}

            {/* Hint message for "Bot is typing..." */}
            {isLoading && (
              <div className="mb-3">
                <div className="bg-gray-200 text-gray-600 rounded-lg p-3 max-w-[80%] inline-block">
                  <strong>Bot is typing...</strong>
                </div>
              </div>
            )}
            </div>

            {/* Chat input area */}
            <div className="p-4 border-t border-gray-300 flex items-center">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-lg mr-2"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
  </>
  );
};

export default ChatBox;