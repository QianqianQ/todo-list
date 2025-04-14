import { AzureOpenAI } from "openai/index.mjs";

// Not secure to use api key in client side

const apiKey = "";
const apiVersion = "2024-04-01-preview";
const endpoint = "";
const modelName = "gpt-4o-mini";
const deployment = "gpt-4o-mini";
const options = { endpoint, apiKey, deployment, apiVersion }

const client = new AzureOpenAI(options);

export const chatCompletion = async (message: string): Promise<string | null> => {
    try {
        const response = await client.chat.completions.create({
            messages: [
              { role:"user", content: message }
            ],
            max_tokens: 4096,
              temperature: 1,
              top_p: 1,
              model: modelName
          });
          return response.choices[0].message.content;
    } catch (error) {
        console.error('Error sending message to chat API:', error);
        throw error; // Rethrow the error for handling in the component
    }
}

// chatCompletion().catch((err) => {
//   console.error("The sample encountered an error:", err);
// });
