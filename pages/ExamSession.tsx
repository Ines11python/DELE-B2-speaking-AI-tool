
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TASKS } from '../data/tasks';
import { Task, ExamState } from '../types';
import { CountdownTimer } from '../components/CountdownTimer';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { generateExaminerQuestions, evaluateSession } from '../services/geminiService';
import { FaMicrophone, FaStop, FaBrain, FaUserTie, FaImage, FaFileAlt } from 'react-icons/fa';

export const ExamSession: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const recorder = useVoiceRecorder();
  
  const [state, setState] = useState<ExamState['status']>('idle');
  const [task, setTask] = useState<Task | null>(null);
  const [monologueTranscript, setMonologueTranscript] = useState('');
  const [part2Transcript, setPart2Transcript] = useState('');
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [interactionHistory, setInteractionHistory] = useState<{question: string, answer: string}[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const foundTask = TASKS.find(t => t.id === taskId);
    if (!foundTask) {
      navigate('/');
      return;
    }
    setTask(foundTask);
    setState('prep');
  }, [taskId, navigate]);

  const handlePrepComplete = () => {
    setState('recording_monologue');
    recorder.startRecording();
  };

  const finishMonologue = async () => {
    recorder.stopRecording();
    // 等待一小会儿确保录音转录完成
    await new Promise(r => setTimeout(r, 1000));
    
    const finalTranscript = recorder.transcript.trim();
    setMonologueTranscript(finalTranscript);
    
    if (task?.type === 'TAREA_3') {
        setState('recording_part2');
        setTimeout(() => recorder.startRecording(), 500);
        return;
    }
    
    setState('analyzing_monologue');
    setIsProcessing(true);

    try {
      const questions = await generateExaminerQuestions(
          task!.promptText, 
          finalTranscript || "El candidato no habló.", 
          task!.examinerNotes,
          task!.type
      );
      
      setFollowUpQuestions(questions);
      setState('interaction');
      setCurrentQIndex(0);
    } catch (e) {
      console.error("Monologue analysis failed:", e);
      // 强制兜底，避免卡在“思考中”
      const fallback = task!.type === 'TAREA_2' 
        ? ["¿Ha vivido una situación similar?", "¿Qué pasará después?"]
        : ["¿Por qué piensa así?", "¿No cree que hay otras opciones?"];
      setFollowUpQuestions(fallback);
      setState('interaction');
      setCurrentQIndex(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const finishPart2 = async () => {
      recorder.stopRecording();
      await new Promise(r => setTimeout(r, 1000));
      const transcript = recorder.transcript.trim();
      setPart2Transcript(transcript);
      handleGrading(monologueTranscript, transcript, []);
  };

  const startAnsweringQuestion = () => recorder.startRecording();

  const finishAnsweringQuestion = async () => {
    recorder.stopRecording();
    await new Promise(r => setTimeout(r, 800));
    const answer = recorder.transcript.trim();
    
    const newHistory = [...interactionHistory, {
      question: followUpQuestions[currentQIndex],
      answer: answer || "(Sin respuesta)"
    }];
    setInteractionHistory(newHistory);

    if (currentQIndex < followUpQuestions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      handleGrading(monologueTranscript, "", newHistory);
    }
  };

  const handleGrading = async (mono: string, part2: string, history: any[]) => {
      setState('grading');
      setIsProcessing(true);
      try {
        const result = await evaluateSession(task!.promptText, mono, history, part2);
        navigate('/feedback', { state: { result, task } });
      } catch (err) {
        navigate('/feedback', { state: { result: { error: "Failed to grade session." }, task } });
      }
  };

  if (!task) return null;

  const TaskImage = () => {
    let src = task.imageUrl;
    if (task.type === 'TAREA_3') {
        src = state === 'recording_part2' ? task.part2ImageUrl : task.part1ImageUrl;
    }
    if (!src) return null;
    return (
      <div className="mb-6 w-full flex justify-center">
        <div className="relative group max-w-2xl w-full">
           <img src={src} alt="Task visual" className="rounded-lg shadow-md w-full object-contain bg-white border border-gray-200" style={{ maxHeight: '400px' }} />
           <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 text-xs rounded flex items-center">
             <FaImage className="mr-1" /> Visual Prompt
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div className="bg-dele-red h-2.5 rounded-full transition-all duration-500" 
             style={{ width: 
               state === 'prep' ? '20%' : 
               state === 'recording_monologue' ? '40%' : 
               state === 'recording_part2' ? '60%' : 
               state === 'analyzing_monologue' ? '70%' :
               state === 'interaction' ? '80%' : '100%' 
             }}></div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 min-h-[450px] flex flex-col">
        <div className="mb-6 border-b pb-4">
          <div className="flex items-center justify-between">
             <h2 className="text-2xl font-bold text-gray-800">{task.title}</h2>
             {state === 'recording_part2' && <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold">Parte 2: Comparación</span>}
          </div>
          <p className="text-gray-500">{task.description}</p>
        </div>

        {state === 'prep' && (
          <div className="flex-1 flex flex-col space-y-6">
            <TaskImage />
            <div className="bg-blue-50 p-6 rounded-xl text-blue-900">
                <h3 className="font-bold mb-2">Instrucciones:</h3>
                <p className="mb-4">{task.promptText}</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {task.promptPoints.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
            </div>
            <div className="flex flex-col items-center">
              <CountdownTimer seconds={task.prepTimeSeconds} onComplete={handlePrepComplete} isActive={true} />
              <button onClick={handlePrepComplete} className="mt-4 px-8 py-3 bg-dele-red text-white rounded-full font-bold shadow-md hover:bg-red-700 transition-all">
                Empezar Examen
              </button>
            </div>
          </div>
        )}

        {state === 'recording_monologue' && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
             <TaskImage />
             <div className="relative">
               <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
               <div className="relative bg-white p-6 rounded-full border-4 border-red-500 shadow-xl">
                 <FaMicrophone className="text-red-500 text-3xl" />
               </div>
             </div>
             <div className="text-center w-full">
               <h3 className="text-xl font-bold text-gray-800">Grabando...</h3>
               <div className="h-24 w-full bg-gray-50 rounded-lg p-3 mt-4 overflow-y-auto text-left text-sm font-mono text-gray-600 border border-gray-200">
                 {recorder.transcript || "Escuchando..."}
               </div>
             </div>
             <div className="flex items-center space-x-6">
               <CountdownTimer seconds={task.speakTimeSeconds} onComplete={finishMonologue} isActive={true} label="Límite" />
               <button onClick={finishMonologue} className="flex items-center space-x-2 px-8 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-black transition-colors">
                 <FaStop /> <span>{task.type === 'TAREA_3' ? 'Siguiente Parte' : 'Terminar'}</span>
               </button>
             </div>
          </div>
        )}

        {state === 'recording_part2' && (
           <div className="flex-1 flex flex-col items-center justify-center space-y-6">
             <div className="w-full bg-purple-50 p-4 rounded-lg text-center border border-purple-100 mb-4">
                 <h3 className="font-bold text-purple-800 text-lg">Comparación</h3>
                 <p className="text-sm text-purple-600 italic whitespace-pre-line">{task.secondaryPrompt}</p>
             </div>
             <TaskImage />
             <div className="relative">
               <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-20"></div>
               <div className="relative bg-white p-6 rounded-full border-4 border-purple-500 shadow-xl"><FaMicrophone className="text-purple-500 text-3xl" /></div>
             </div>
             <div className="h-24 w-full bg-gray-50 rounded-lg p-3 mt-4 overflow-y-auto text-left text-sm font-mono text-gray-600 border border-gray-200">
                 {recorder.transcript || "Escuchando..."}
             </div>
             <button onClick={finishPart2} className="px-10 py-4 bg-gray-900 text-white rounded-lg font-bold shadow-lg hover:bg-black">
                Finalizar Examen
             </button>
           </div>
        )}

        {state === 'analyzing_monologue' && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center">
            <FaBrain className="text-7xl text-purple-500 animate-pulse" />
            <h3 className="text-2xl font-bold text-gray-800">El examinador está pensando...</h3>
            <p className="text-gray-500">Analizando tu respuesta para generar las preguntas de interacción.</p>
          </div>
        )}

        {state === 'interaction' && (
          <div className="flex-1 flex flex-col space-y-8">
             <div className="flex items-start space-x-4 bg-purple-50 p-8 rounded-2xl border border-purple-100 shadow-sm">
                <div className="bg-purple-200 p-4 rounded-full"><FaUserTie className="text-purple-700 text-2xl" /></div>
                <div>
                  <h4 className="font-bold text-purple-900 text-sm uppercase tracking-widest mb-2">Pregunta {currentQIndex + 1}</h4>
                  <p className="text-xl text-gray-800 font-medium leading-relaxed italic">"{followUpQuestions[currentQIndex]}"</p>
                </div>
             </div>
             <div className="flex-1 flex flex-col items-center justify-end space-y-6">
                {recorder.isRecording ? (
                  <>
                    <div className="text-red-500 font-bold animate-pulse flex items-center space-x-2">
                       <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                       <span>Grabando respuesta...</span>
                    </div>
                    <div className="h-24 w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm italic">{recorder.transcript}</div>
                    <button onClick={finishAnsweringQuestion} className="w-full py-5 bg-gray-900 text-white rounded-2xl font-bold shadow-xl">Terminar Respuesta</button>
                  </>
                ) : (
                  <button onClick={startAnsweringQuestion} className="w-full py-6 bg-dele-red text-white rounded-2xl font-bold flex items-center justify-center space-x-3 text-lg shadow-lg hover:bg-red-700 transition-all active:scale-95">
                    <FaMicrophone /> <span>Grabar Respuesta</span>
                  </button>
                )}
             </div>
          </div>
        )}

        {state === 'grading' && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center">
             <div className="w-20 h-20 border-4 border-dele-yellow border-t-dele-red rounded-full animate-spin"></div>
             <h3 className="text-2xl font-bold text-gray-800">Generando Evaluación...</h3>
             <p className="text-gray-500 max-w-sm">Esto puede tardar unos segundos mientras la IA analiza tu nivel de español.</p>
          </div>
        )}
      </div>
    </div>
  );
};
