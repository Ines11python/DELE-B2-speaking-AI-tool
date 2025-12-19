
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { FeedbackResult } from '../types';

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }
  return new GoogleGenAI({ apiKey });
};

async function retryOperation<T>(
  operation: () => Promise<T>, 
  retries = 2, 
  delay = 1500
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries <= 0) throw error;
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
  
  const prompt = `
    Eres un examinador del DELE B2. El candidato ha terminado su monólogo.
    Contexto de la tarea: ${taskPrompt}
    Lo que dijo el candidato: "${userMonologue || "No se detectó audio."}"
    
    Genera 2 preguntas de seguimiento en español que sean naturales y desafiantes para el nivel B2.
    ${taskType === 'TAREA_2' ? 'Enfócate en la descripción de la imagen y experiencias personales.' : 'Cuestiona sus argumentos de la Tarea 1.'}
    
    OUTPUT JSON ARRAY ONLY: ["Pregunta 1", "Pregunta 2"]
  `;

  try {
    const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
        }
      }
    }));

    const text = response.text;
    if (!text) throw new Error("Empty response");
    
    const questions = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
    return Array.isArray(questions) && questions.length > 0 ? questions : throwError();
  } catch (error) {
    console.error("Examiner Generation Error:", error);
    return taskType === 'TAREA_2' 
      ? ["¿Ha vivido alguna vez una situación parecida?", "¿Cómo cree que terminará esta escena?"]
      : ["¿Por qué piensa eso exactamente?", "¿No cree que hay otras soluciones mejores para este problema?"];
  }
};

function throwError(): never { throw new Error("Invalid output format"); }

export const evaluateSession = async (
  taskPrompt: string,
  monologue: string,
  interactions: { question: string; answer: string }[],
  part2Transcript?: string
): Promise<FeedbackResult> => {
  const ai = getAI();

  let fullTranscript = part2Transcript 
    ? `PART 1:\n${monologue}\n\nPART 2 (COMPARISON):\n${part2Transcript}`
    : `MONOLOGUE:\n${monologue}\n\nINTERACTION:\n${interactions.map(i => `Ex: ${i.question}\nCan: ${i.answer}`).join('\n')}`;

  const prompt = `Evalúa este examen DELE B2 Speaking. Contexto: ${taskPrompt}. Transcripción: ${fullTranscript}`;

  try {
    const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction: "Eres un examinador certificado del Instituto Cervantes para el nivel DELE B2.",
        responseMimeType: "application/json",
        responseSchema: {
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
            band: { type: Type.STRING },
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
                }
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
        },
      }
    }));

    return JSON.parse(response.text.replace(/```json/g, '').replace(/```/g, '').trim()) as FeedbackResult;
  } catch (error: any) {
    return {
      scores: { accuracy: 0, coherence: 0, fluency: 0, vocabulary: 0, interaction: 0 },
      totalScore: 0,
      band: "NO APTO",
      strengths: [],
      improvements: [],
      corrections: [],
      error: "Error en la evaluación de IA."
    };
  }
};
