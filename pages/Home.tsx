import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TASKS } from '../data/tasks';
import { FaArrowRight, FaBookOpen, FaComments, FaCamera, FaChevronDown, FaChevronUp } from 'react-icons/fa';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  // Initialize state from localStorage if available, default to 'exam-1'
  const [expandedExam, setExpandedExam] = useState<string | null>(() => {
    return localStorage.getItem("lastExpandedExam") || "exam-1";
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'TAREA_1': return <FaBookOpen className="text-blue-500" />;
      case 'TAREA_2': return <FaCamera className="text-green-500" />;
      case 'TAREA_3': return <FaComments className="text-purple-500" />;
      default: return <FaBookOpen />;
    }
  };

  // Group tasks by Exam
  const exams = Array.from(new Set(TASKS.map(t => t.examId))).map(examId => {
    const examTasks = TASKS.filter(t => t.examId === examId);
    return {
      id: examId,
      title: examTasks[0].examTitle,
      tasks: examTasks
    };
  });

  // Toggle exam visibility and save preference to localStorage
  const toggleExam = (id: string) => {
    const newState = expandedExam === id ? null : id;
    setExpandedExam(newState);

    if (newState) {
      localStorage.setItem("lastExpandedExam", newState);
    } else {
      localStorage.removeItem("lastExpandedExam");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="text-center space-y-4 py-8">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
          Preparación <span className="text-dele-red">DELE B2</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
          Official practice tasks with AI examiner feedback.
        </p>
      </header>

      <div className="space-y-4">
        {exams.map((exam) => (
          <div key={exam.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300">
            <button 
              onClick={() => toggleExam(exam.id)}
              className="w-full px-6 py-5 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors text-left"
            >
              <div>
                <h2 className="text-xl font-bold text-gray-800">{exam.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{exam.tasks.length} Tasks</p>
              </div>
              {expandedExam === exam.id ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
            </button>
            
            {expandedExam === exam.id && (
              <div className="p-6 bg-gray-50 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
                {exam.tasks.map((task) => (
                  <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
                    <div className="p-5 flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-600 uppercase tracking-wider">
                          {task.type.replace('_', ' ')}
                        </span>
                        <div className="p-1.5 bg-gray-50 rounded-full border border-gray-100">
                          {getIcon(task.type)}
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2 leading-snug">{task.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">{task.description}</p>
                    </div>
                    <div className="p-4 pt-0 mt-auto">
                      <button
                        onClick={() => navigate(`/exam/${task.id}`)}
                        className="w-full flex items-center justify-center space-x-2 bg-white border-2 border-dele-red text-dele-red hover:bg-dele-red hover:text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                      >
                        <span>Start Task</span>
                        <FaArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};