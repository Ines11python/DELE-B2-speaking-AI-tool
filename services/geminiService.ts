import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { FeedbackResult } from '../types';

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key missing");
    throw new Error("API Key is missing. Please set REACT_APP_API_KEY or VITE_API_KEY.");
  }
  return new GoogleGenAI({ apiKey });
};

async function retryOperation<T>(
  operation: () => Promise<T>, 
  retries = 3, 
  delay = 1000
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries <= 0) throw error;
    console.warn(`Operation failed, retrying in ${delay}ms... (${retries} attempts left)`, error);
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryOperation(operation, retries - 1, delay * 2);
  }
}

export const generateExaminerQuestions = async (
  taskPrompt: string,
  userMonologue: string,
  examinerNotes?: string
): Promise<string[]> => {
  const ai = getAI();
  
  const systemInstruction = `You are a strict DELE B2 Spanish examiner. 
  The user has just completed a monologue based on a specific task.
  Your goal is to ask 2-3 follow-up questions (preguntas de interacción) based on what they said and the official examiner guidelines.
  The questions should challenge their opinion or ask for clarification.
  Return ONLY the questions in Spanish as a JSON array of strings.`;

  const prompt = `
    Task Prompt: ${taskPrompt}
    ${examinerNotes ? `Official Examiner Guidelines: ${examinerNotes}` : ''}
    User's Answer: "${userMonologue}"
    
    Generate 2 or 3 follow-up questions in JSON format: ["Question 1", "Question 2", "Question 3"].
  `;

  try {
    const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ text: prompt }] },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
        }
      }
    }));

    let text = response.text;
    if (!text) return ["¿Puede explicar eso con más detalle?", "¿Por qué piensa eso?"];
    
    // Clean potential markdown code blocks
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating questions:", error);
    return ["¿Podría aclarar su último punto?", "¿Tiene alguna experiencia personal con esto?"];
  }
};

export const evaluateSession = async (
  taskPrompt: string,
  monologue: string,
  interactions: { question: string; answer: string }[],
  part2Transcript?: string
): Promise<FeedbackResult> => {
  const ai = getAI();

  let fullTranscript = "";
  
  if (part2Transcript) {
      // TAREA 3 Structure
      fullTranscript = `PART 1 (SURVEY):\n${monologue}\n\nPART 2 (DATA COMPARISON):\n${part2Transcript}`;
  } else {
      // TAREA 1 & 2 Structure
      const interactionText = interactions.map((i, idx) => `Examiner: ${i.question}\nCandidate: ${i.answer}`).join('\n');
      fullTranscript = `MONOLOGUE:\n${monologue}\n\nINTERACTION PART:\n${interactionText}`;
  }

  const prompt = `
    Evaluate the following DELE B2 Speaking test attempt.
    
    Task Context: ${taskPrompt}
    
    Full Transcript:
    ${fullTranscript}

    ---
    SCORING RUBRIC (Official DELE B2):
    Score the candidate on 5 dimensions (0-6 each). Total 30. Pass > 15.
    
    Dimensions:
    1. Corrección (Accuracy): Grammar, complexity.
    2. Coherencia (Coherence): Logic, connectors.
    3. Fluidez (Fluency): Speed, pauses.
    4. Léxico (Vocabulary): Range, variety.
    5. Interacción (Interaction): Handling the task/questions. (If Tarea 3, judge on addressing both parts of the prompt).
    ---
  `;

  // Schema for structured feedback (Same as before)
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      scores: {
        type: Type.OBJECT,
        properties: {
          accuracy: { type: Type.NUMBER },
          coherence: { type: Type.NUMBER },
          fluency: { type: Type.NUMBER },
          vocabulary: { type: Type.NUMBER },
          interaction: { type: Type.NUMBER }
        },
        required: ["accuracy", "coherence", "fluency", "vocabulary", "interaction"]
      },
      totalScore: { type: Type.NUMBER },
      band: { type: Type.STRING, enum: ["APTO", "NO APTO"] },
      strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
      improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
      corrections: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            original: { type: Type.STRING },
            correction: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["original", "correction", "explanation"]
        }
      }
    },
    required: ["scores", "totalScore", "band", "strengths", "improvements", "corrections"]
  };

  try {
    const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ text: prompt }] },
      config: {
        systemInstruction: "You are a certified DELE B2 examiner.",
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    }));

    let text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(text) as FeedbackResult;
  } catch (error: any) {
    console.error("Error grading:", error);
    return {
      scores: { accuracy: 0, coherence: 0, fluency: 0, vocabulary: 0, interaction: 0 },
      totalScore: 0,
      band: "NO APTO",
      strengths: [],
      improvements: [],
      corrections: [],
      error: error.message || "Could not connect to AI service"
    };
  }
};
