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
  examinerNotes?: string,
  taskType?: string
): Promise<string[]> => {
  const ai = getAI();
  
  let specificInstruction = "";
  
  if (taskType === 'TAREA_2') {
      // Specific logic for Tarea 2 (Photo Description)
      specificInstruction = `
      The task is DELE B2 Tarea 2 (Photo Description).
      Your goal is to ask 2-3 follow-up questions based on the photo context and the user's monologue.
      
      CRITICAL RULES FOR TAREA 2 QUESTIONS:
      1. ONE question MUST be about the candidate's PERSONAL EXPERIENCE related to the situation in the photo (e.g., "¿Ha vivido alguna vez una situación como la de la foto?", "¿Qué haría usted en esa situación?").
      2. The other questions should ask for specific details about the feelings, atmosphere, or future outcome of the scene in the photo.
      3. Do NOT ask abstract advantages/disadvantages questions (that is for Tarea 1).
      `;
  } else {
      // Default/Tarea 1 logic (Debate/Opinion)
      specificInstruction = `
      The task is DELE B2 Tarea 1 (Argumentation/Opinion).
      The questions should challenge the candidate's opinion expressed in the monologue or ask for clarification on specific points.
      `;
  }

  const systemInstruction = `You are a strict DELE B2 Spanish examiner. 
  The user has just completed a monologue.
  ${specificInstruction}
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
    if (!text) return ["¿Ha vivido alguna situación similar?", "¿Qué cree que pasará después?"];
    
    // Clean potential markdown code blocks
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating questions:", error);
    return ["¿Podría explicar eso con más detalle?", "¿Tiene alguna experiencia personal relacionada con esto?"];
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
  let modelAnswerContext = "";
  
  if (part2Transcript) {
      // TAREA 3 Structure
      fullTranscript = `PART 1 (SURVEY):\n${monologue}\n\nPART 2 (DATA COMPARISON):\n${part2Transcript}`;
      modelAnswerContext = "Generate a model response for Part 2 (Data Comparison).";
  } else {
      // TAREA 1 & 2 Structure
      const interactionText = interactions.map((i, idx) => `Examiner: ${i.question}\nCandidate: ${i.answer}`).join('\n');
      fullTranscript = `MONOLOGUE:\n${monologue}\n\nINTERACTION PART:\n${interactionText}`;
      modelAnswerContext = "Generate a model answer for each examiner question asked in the interaction part.";
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
    
    INSTRUCTIONS FOR CORRECTIONS:
    - Identify mistakes in the user's speech.
    - In the 'correction' field, provide the corrected sentence.
    - IMPORTANT: Wrap the specific words you changed or corrected in **double asterisks** (e.g., "Es **obvio** que hay...").
    
    INSTRUCTIONS FOR MODEL ANSWERS (IMPORTANT):
    1. 'modelMonologue': 
       - If the user provided a substantial response: Polish their ideas into a high-quality B2/C1 level Spanish response. Improve their vocabulary and structure but keep their sentiment.
       - If the user's response is empty, very short, or irrelevant: Generate a fresh, perfect example monologue (approx 100-150 words) that fully answers the prompt.
       - You can use **double asterisks** to highlight advanced vocabulary or key connectors in your model answer.
    2. 'modelAnswers': 
       - ${modelAnswerContext}
       - Follow the same logic: Improve the user's answer if it exists; otherwise, provide an ideal answer.
       - You can use **double asterisks** for emphasis.
  `;

  // Schema for structured feedback
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
      },
      modelMonologue: { type: Type.STRING },
      modelAnswers: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            answer: { type: Type.STRING }
          }
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
      modelMonologue: "",
      modelAnswers: [],
      error: error.message || "Could not connect to AI service"
    };
  }
};