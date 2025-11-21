import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TASKS } from '../data/tasks';
import { Task, ExamState } from '../types';
import { CountdownTimer } from '../components/CountdownTimer';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { generateExaminerQuestions, evaluateSession } from '../services/geminiService';
import { FaMicrophone, FaStop, FaBrain, FaUserTie, FaImage, FaFileAlt, FaArrowRight } from 'react-icons/fa';

export const ExamSession: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const recorder = useVoiceRecorder();
  
  // State Machine
  const [state, setState] = useState<ExamState['status']>('idle');
  const [task, setTask] = useState<Task | null>(null);
  const [monologueTranscript, setMonologueTranscript] = useState('');
  const [part2Transcript, setPart2Transcript] = useState('');
  
  // Interaction State
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [interactionHistory, setInteractionHistory] = useState<{question: string, answer: string}[]>([]);

  // Loading States
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
    setMonologueTranscript(recorder.transcript);
    
    // Special Logic for Tarea 3: Go to Part 2 immediately, NO examiner
    if (task?.type === 'TAREA_3') {
        setState('recording_part2');
        // Short delay to ensure recording is stopped and ready to start again
        setTimeout(() => {
            recorder.startRecording();
        }, 500);
        return;
    }
    
    // Logic for Tarea 1 & 2: Go to Examiner
    setState('analyzing_monologue');
    setIsProcessing(true);

    try {
      await new Promise(r => setTimeout(r, 1000));
      const finalTranscript = recorder.transcript;
      setMonologueTranscript(finalTranscript);

      const questions = await generateExaminerQuestions(
          task!.promptText, 
          finalTranscript, 
          task!.examinerNotes,
          task!.type // Pass task type to determine question strategy
      );
      setFollowUpQuestions(questions);
      setIsProcessing(false);
      setState('interaction');
      setCurrentQIndex(0);
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
    }
  };

  const finishPart2 = async () => {
      recorder.stopRecording();
      await new Promise(r => setTimeout(r, 500));
      setPart2Transcript(recorder.transcript);
      
      // Tarea 3 finishes here -> Grading
      handleGrading(monologueTranscript, recorder.transcript, []);
  };

  const startAnsweringQuestion = () => {
    recorder.startRecording();
  };

  const finishAnsweringQuestion = async () => {
    recorder.stopRecording();
    await new Promise(r => setTimeout(r, 500));
    const answer = recorder.transcript;
    
    const newHistory = [...interactionHistory, {
      question: followUpQuestions[currentQIndex],
      answer: answer
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
      const result = await evaluateSession(task!.promptText, mono, history, part2);
      navigate('/feedback', { state: { result, task } });
  };

  if (!task) return null;

  // Dynamic Image Renderer based on State for Tarea 3
  const TaskImage = () => {
    let src = task.imageUrl;
    if (task.type === 'TAREA_3') {
        if (state === 'recording_part2') src = task.part2ImageUrl;
        else src = task.part1ImageUrl; // Prep and Part 1
    }

    if (!src) return null;

    return (
      <div className="mb-6 w-full flex justify-center">
        <div className="relative group max-w-2xl w-full">
           <img 
             src={src} 
             alt="Task visual context" 
             className="rounded-lg shadow-md w-full object-contain bg-white border border-gray-200" 
             style={{ maxHeight: '400px' }}
           />
           <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 text-xs rounded flex items-center">
             <FaImage className="mr-1" /> Visual Prompt
           </div>
        </div>
      </div>
    );
  };

  const Tarea1UI = () => (
    <div className="space-y-6">
       {task.readingText && (
         <div className="bg-white border-l-4 border-blue-500 p-6 shadow-sm rounded-r-lg">
            <div className="flex items-center text-blue-500 mb-2">
                <FaFileAlt className="mr-2" /> <span className="font-bold uppercase text-xs tracking-wider">Reading Article</span>
            </div>
            <p className="text-gray-800 leading-relaxed text-justify">{task.readingText}</p>
         </div>
       )}
       
       <div className="bg-gray-50 p-6 rounded-xl">
          <p className="font-bold text-gray-900 mb-4">{task.promptText}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {task.promptPoints.map((p, i) => (
               <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 rounded-tr-[20px] relative">
                 <div className="absolute -left-2 top-4 w-0 h-0 border-t-[10px] border-t-transparent border-r-[10px] border-r-white border-b-[10px] border-b-transparent"></div>
                 <p className="text-sm text-gray-700 italic">"{p}"</p>
               </div>
             ))}
          </div>
       </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Progress Bar */}
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

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 min-h-[400px] flex flex-col">
        
        <div className="mb-6 border-b pb-4">
          <div className="flex items-center justify-between">
             <h2 className="text-2xl font-bold text-gray-800">{task.title}</h2>
             {state === 'recording_part2' && <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold">Part 2: Comparison</span>}
          </div>
          <p className="text-gray-500">{task.description}</p>
        </div>

        {state === 'prep' && (
          <div className="flex-1 flex flex-col space-y-6">
            <TaskImage />
            
            {task.type === 'TAREA_1' ? <Tarea1UI /> : (
              <div className="bg-blue-50 p-6 rounded-xl text-blue-900">
                <h3 className="font-bold mb-2 text-lg">Instructions:</h3>
                <p className="mb-4 font-medium">{task.promptText}</p>
                <ul className="list-disc list-inside space-y-2 text-sm text-blue-800">
                  {task.promptPoints.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
            )}

            <div className="text-center pt-4">
              <p className="text-sm text-gray-500 mb-2">Preparation Time</p>
              <CountdownTimer seconds={task.prepTimeSeconds} onComplete={handlePrepComplete} isActive={true} />
            </div>
            <div className="flex justify-center">
              <button onClick={handlePrepComplete} className="px-8 py-3 bg-dele-red text-white rounded-full font-bold shadow-md hover:bg-red-700 transition-transform active:scale-95">
                Start Recording
              </button>
            </div>
          </div>
        )}

        {state === 'recording_monologue' && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
             {task.type === 'TAREA_3' && (
               <div className="w-full bg-blue-50 p-4 rounded-lg text-center border border-blue-100 mb-4">
                 <h3 className="font-bold text-blue-800 text-lg">Parte 1: Encuesta Personal</h3>
                 <p className="text-sm text-blue-600">Answer based on your own situation.</p>
               </div>
             )}
             
             <TaskImage />
             
             {task.type === 'TAREA_1' && (
               <div className="w-full text-left max-h-60 overflow-y-auto border p-4 rounded-lg mb-4 bg-gray-50">
                  <p className="font-bold text-gray-700 mb-2 sticky top-0 bg-gray-50 pb-2 border-b">Topics (Propuestas):</p>
                  <div className="space-y-3">
                    {task.promptPoints.map((p, i) => (
                      <div key={i} className="text-sm text-gray-600 pl-2 border-l-2 border-gray-300 block">
                        {p}
                      </div>
                    ))}
                  </div>
               </div>
             )}

             <div className="relative">
               <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
               <div className="relative bg-white p-6 rounded-full border-4 border-red-500 shadow-xl">
                 <FaMicrophone className="text-red-500 text-3xl" />
               </div>
             </div>
             
             <div className="text-center w-full">
               <h3 className="text-xl font-bold text-gray-800">Recording...</h3>
               <div className="h-20 w-full bg-gray-50 rounded-lg p-3 mt-2 overflow-y-auto text-left text-xs font-mono text-gray-600">
                 {recorder.transcript || "Listening..."}
               </div>
             </div>

             <div className="flex items-center space-x-6">
               <CountdownTimer seconds={task.speakTimeSeconds} onComplete={finishMonologue} isActive={true} label="Limit" />
               <button onClick={finishMonologue} className="flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800">
                 <FaStop /> <span>{task.type === 'TAREA_3' ? 'Next Part' : 'Finish'}</span>
               </button>
             </div>
          </div>
        )}

        {state === 'recording_part2' && task.type === 'TAREA_3' && (
           <div className="flex-1 flex flex-col items-center justify-center space-y-6">
             <div className="w-full bg-purple-50 p-4 rounded-lg text-center border border-purple-100 mb-4">
                 <h3 className="font-bold text-purple-800 text-lg">Parte 2: Comparación de Datos</h3>
                 <p className="text-sm text-purple-600 whitespace-pre-line">
                 {task.secondaryPrompt}
                 </p>
             </div>
             
             <TaskImage />

             <div className="relative">
               <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-20"></div>
               <div className="relative bg-white p-6 rounded-full border-4 border-purple-500 shadow-xl">
                 <FaMicrophone className="text-purple-500 text-3xl" />
               </div>
             </div>

             <div className="h-20 w-full bg-gray-50 rounded-lg p-3 mt-2 overflow-y-auto text-left text-xs font-mono text-gray-600">
                 {recorder.transcript || "Listening..."}
             </div>

             <button onClick={finishPart2} className="px-8 py-3 bg-gray-900 text-white rounded-lg font-bold">
                Finish Exam
             </button>
           </div>
        )}

        {state === 'analyzing_monologue' && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center">
            <FaBrain className="text-6xl text-purple-500 animate-bounce" />
            <h3 className="text-2xl font-bold text-gray-800">The Examiner is thinking...</h3>
          </div>
        )}

        {state === 'interaction' && (
          <div className="flex-1 flex flex-col space-y-6">
             <div className="flex items-start space-x-4 bg-purple-50 p-6 rounded-xl border border-purple-100">
                <div className="bg-purple-200 p-3 rounded-full">
                  <FaUserTie className="text-purple-700 text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-purple-900 text-sm uppercase mb-1">Examiner Question {currentQIndex + 1}</h4>
                  <p className="text-lg text-gray-800 font-medium">"{followUpQuestions[currentQIndex]}"</p>
                </div>
             </div>

             <div className="flex-1 flex flex-col items-center justify-end space-y-4">
                {recorder.isRecording ? (
                  <>
                    <div className="text-red-500 font-bold animate-pulse">Recording Answer...</div>
                    <div className="h-20 w-full bg-gray-50 rounded p-3 text-sm">{recorder.transcript}</div>
                    <button onClick={finishAnsweringQuestion} className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold">Done</button>
                  </>
                ) : (
                  <button onClick={startAnsweringQuestion} className="w-full py-4 bg-dele-red text-white rounded-xl font-bold flex items-center justify-center space-x-2">
                    <FaMicrophone /> <span>Record Answer</span>
                  </button>
                )}
             </div>
          </div>
        )}

        {state === 'grading' && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center">
             <div className="w-16 h-16 border-4 border-dele-yellow border-t-dele-red rounded-full animate-spin"></div>
             <h3 className="text-2xl font-bold text-gray-800">Grading Session...</h3>
          </div>
        )}
      </div>
    </div>
  );
};