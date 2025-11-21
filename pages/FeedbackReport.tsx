import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { FeedbackResult, Task } from '../types';
import { FaCheckCircle, FaExclamationTriangle, FaLightbulb, FaRedo, FaExclamationCircle } from 'react-icons/fa';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export const FeedbackReport: React.FC = () => {
  const location = useLocation();
  const state = location.state as { result: FeedbackResult; task: Task };

  if (!state) return <Navigate to="/" />;

  const { result, task } = state;

  // Check for API error
  if (result.error) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-lg border border-red-100 text-center">
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-red-50 rounded-full">
            <FaExclamationCircle className="text-red-500 text-4xl" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Failed</h2>
        <p className="text-gray-600 mb-6">
          We couldn't connect to the grading service to analyze your speech. This might be due to a network issue.
        </p>
        <div className="p-4 bg-gray-50 rounded-lg text-xs text-gray-500 font-mono mb-8 overflow-auto">
          Error details: {result.error}
        </div>
        <div className="flex justify-center space-x-4">
          <Link to="/" className="px-6 py-2 bg-gray-200 text-gray-800 font-bold rounded-full hover:bg-gray-300 transition-colors">
            Go Home
          </Link>
          <Link to={`/exam/${task.id}`} className="px-6 py-2 bg-dele-red text-white font-bold rounded-full hover:bg-red-700 transition-colors flex items-center">
            <FaRedo className="mr-2" /> Try Again
          </Link>
        </div>
      </div>
    );
  }

  const scoreData = [
    { name: 'Corrección', value: result.scores.accuracy, label: 'Accuracy' },
    { name: 'Coherencia', value: result.scores.coherence, label: 'Coherence' },
    { name: 'Fluidez', value: result.scores.fluency, label: 'Fluency' },
    { name: 'Léxico', value: result.scores.vocabulary, label: 'Vocabulary' },
    { name: 'Interacción', value: result.scores.interaction, label: 'Interaction' },
  ];

  // DELE B2 Pass mark is typically 60% overall, but per user request: "Over half is pass" (15/30)
  const isPass = result.totalScore >= 15;

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className={`p-8 text-center ${isPass ? 'bg-green-50' : 'bg-red-50'}`}>
          <h2 className="text-sm font-bold tracking-wider text-gray-500 uppercase mb-2">Overall Result</h2>
          <div className="flex items-center justify-center space-x-4 mb-4">
            <h1 className={`text-6xl font-extrabold ${isPass ? 'text-green-600' : 'text-red-600'}`}>
              {result.totalScore}
              <span className="text-2xl text-gray-400">/30</span>
            </h1>
            <div className={`px-4 py-2 rounded-lg font-bold text-xl border-2 ${isPass ? 'border-green-600 text-green-700' : 'border-red-600 text-red-700'}`}>
              {isPass ? 'APTO' : 'NO APTO'}
            </div>
          </div>
          <p className="text-gray-600">{task.title}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 border-t border-gray-100">
          {/* Chart */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Score Breakdown (Max 6 per category)</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreData} layout="vertical" margin={{ left: 40, right: 20 }}>
                  <XAxis type="number" domain={[0, 6]} hide />
                  <YAxis dataKey="name" type="category" width={80} style={{ fontSize: '12px', fontWeight: 600 }} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={25}>
                    {scoreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.value >= 4 ? '#166534' : entry.value >= 2 ? '#CA8A04' : '#DC2626'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex justify-center space-x-4 text-xs text-gray-500">
               <div className="flex items-center"><div className="w-3 h-3 bg-green-700 rounded mr-1"></div> B2 Level (4-6)</div>
               <div className="flex items-center"><div className="w-3 h-3 bg-yellow-600 rounded mr-1"></div> Struggles (2-3)</div>
               <div className="flex items-center"><div className="w-3 h-3 bg-red-600 rounded mr-1"></div> Fail (0-1)</div>
            </div>
          </div>

          {/* Feedback Lists */}
          <div className="space-y-6">
             <div>
               <h3 className="flex items-center text-green-700 font-bold mb-3">
                 <FaCheckCircle className="mr-2" /> Strengths
               </h3>
               <ul className="space-y-2">
                 {result.strengths.map((s, i) => (
                   <li key={i} className="text-sm text-gray-700 bg-green-50 p-2 rounded border-l-4 border-green-500">{s}</li>
                 ))}
               </ul>
             </div>
             <div>
               <h3 className="flex items-center text-orange-600 font-bold mb-3">
                 <FaExclamationTriangle className="mr-2" /> Improvements
               </h3>
               <ul className="space-y-2">
                 {result.improvements.map((s, i) => (
                   <li key={i} className="text-sm text-gray-700 bg-orange-50 p-2 rounded border-l-4 border-orange-400">{s}</li>
                 ))}
               </ul>
             </div>
          </div>
        </div>

        {/* Corrections Table */}
        <div className="p-8 bg-gray-50 border-t border-gray-200">
          <h3 className="flex items-center text-gray-800 font-bold mb-6 text-xl">
            <FaLightbulb className="text-dele-yellow mr-2" /> AI Corrections
          </h3>
          <div className="grid gap-4">
            {result.corrections.map((c, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-xs uppercase text-red-500 font-bold mb-1">You said:</p>
                    <p className="text-gray-800 line-through opacity-70 italic">"{c.original}"</p>
                  </div>
                  <div className="hidden md:block text-gray-300">➜</div>
                  <div className="flex-1">
                    <p className="text-xs uppercase text-green-600 font-bold mb-1">Better:</p>
                    <p className="text-gray-900 font-medium">"{c.correction}"</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
                  <span className="font-semibold">Why:</span> {c.explanation}
                </div>
              </div>
            ))}
            {result.corrections.length === 0 && (
               <p className="text-center text-gray-500 italic">No specific corrections found. Good job!</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <Link to="/" className="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-full hover:bg-gray-300 transition-colors">
          Back to Home
        </Link>
        <Link to={`/exam/${task.id}`} className="px-6 py-3 bg-dele-red text-white font-bold rounded-full hover:bg-red-700 transition-colors flex items-center">
          <FaRedo className="mr-2" /> Retry Task
        </Link>
      </div>
    </div>
  );
};