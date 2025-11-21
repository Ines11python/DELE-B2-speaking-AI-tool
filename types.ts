export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'TAREA_1' | 'TAREA_2' | 'TAREA_3';
  promptText: string;
  promptPoints: string[];
  secondaryPrompt?: string; // For Tarea 3 Part 2 (Comparison)
  readingText?: string; // For Tarea 1 article
  prepTimeSeconds: number;
  speakTimeSeconds: number;
  imageUrl?: string; // For Tarea 2
  part1ImageUrl?: string; // For Tarea 3 Part 1
  part2ImageUrl?: string; // For Tarea 3 Part 2
  dataVisuals?: string; // Description of charts/graphs for Tarea 3
  examinerNotes?: string; // Context for the AI examiner
  examId: string; // e.g., "exam-1"
  examTitle: string; // e.g., "Examen 1: Individuo, alimentación..."
}

export interface ExamState {
  status: 'idle' | 'prep' | 'recording_monologue' | 'recording_part2' | 'analyzing_monologue' | 'interaction' | 'grading' | 'results';
  currentTask: Task | null;
  monologueTranscript: string;
  part2Transcript?: string; // For Tarea 3 Part 2
  monologueAudioBlob: Blob | null;
  followUpQuestions: string[];
  currentQuestionIndex: number;
  interactionTranscripts: string[];
  interactionAudioBlobs: Blob[];
  feedback: FeedbackResult | null;
}

export interface FeedbackResult {
  scores: {
    accuracy: number;     // Corrección (0-6)
    coherence: number;    // Coherencia y Cohesión (0-6)
    fluency: number;      // Fluidez (0-6)
    vocabulary: number;   // Amplitud Léxica (0-6)
    interaction: number;  // Interacción (0-6)
  };
  totalScore: number; // 0-30
  band: 'APTO' | 'NO APTO';
  strengths: string[];
  improvements: string[];
  corrections: {
    original: string;
    correction: string;
    explanation: string;
  }[];
  error?: string;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
