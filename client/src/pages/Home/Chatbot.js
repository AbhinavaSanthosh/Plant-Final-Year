import { GoogleGenerativeAI } from "@google/generative-ai";
import React, { useState } from "react";

const Chatbot = ({ selectedPlant }) => {
  const [response, setResponse] = useState([]); // Stores the chatbot response
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Initialize OpenAI client
  // console.log(process.env.REACT_APP_OPENAI_API_KEY)

  const key = "AIzaSyDgpkOpIGCuZif3BU9lcrrFOkY-onE263E";
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const parseAIResponse = (text) => {
    const lines = text.split("\n").filter(line => line.trim() !== ""); // Remove empty lines
    const parsedData = [];

    lines.forEach((line) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        // Extracting headings (e.g., **Description:**)
        parsedData.push({ type: "heading", text: line.replace(/\*\*/g, "") });
      } else if (line.startsWith("* **")) {
        // Extracting bullet points with bold titles (e.g., * **Wound Healing:** ...)
        const match = line.match(/\*\*([^*]+)\*\*:\s*(.+)/);
        if (match) {
          parsedData.push({ type: "bullet", title: match[1], description: match[2] });
        }
      } else if (line.startsWith("*")) {
        // Extracting regular bullet points (e.g., * Some text here.)
        parsedData.push({ type: "bullet", title: "", description: line.replace("* ", "") });
      } else {
        // Regular paragraphs
        parsedData.push({ type: "paragraph", text: line });
      }
    });

    return parsedData;
  };

  // Fetch plant information from OpenAI
  const fetchPlantInfo = async (plantName) => {
    setIsLoading(true);
    try {
      const prompt = `Tell me about the plant "${plantName}". Include its benefits, description, and any interesting facts.`;
      const result = await model.generateContent(prompt);
      setResponse(parseAIResponse(result.response.text()));
    } catch (error) {
      setResponse("Sorry, I couldn't fetch the information. Please try again.");
      console.error("Error fetching plant info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch plant info when a new plant is selected
  React.useEffect(() => {
    if (selectedPlant) {
      fetchPlantInfo(selectedPlant.name);
    }
  }, [selectedPlant]);

  return (
    <div className="w-80 max-h-96 bg-white shadow-lg rounded-lg p-5 h-full flex flex-col">
  <h2 className="text-xl font-semibold text-gray-800 mb-4">Plant Chatbot</h2>
  
  <div className="flex-1 overflow-y-auto max-h-60 pr-2">
    {isLoading ? (
      <p className="text-sm text-gray-600">Loading...</p>
    ) : (
      <div className="text-sm text-gray-700 whitespace-pre-wrap">
        {response.map((item, index) => {
          if (item.type === "heading") {
            return <h2 key={index} className="text-xl font-bold mt-4">{item.text}</h2>;
          } else if (item.type === "bullet") {
            return (
              <ul key={index} className="list-disc ml-6">
                {item.title ? (
                  <li>
                    <strong>{item.title}:</strong> {item.description}
                  </li>
                ) : (
                  <li>{item.description}</li>
                )}
              </ul>
            );
          } else {
            return <p key={index} className="mt-2">{item.text}</p>;
          }
        })}
      </div>
    )}
  </div>
</div>

  );
};

export default Chatbot;