import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ExamSession } from './pages/ExamSession';
import { FeedbackReport } from './pages/FeedbackReport';

export const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exam/:taskId" element={<ExamSession />} />
          <Route path="/feedback" element={<FeedbackReport />} />
        </Routes>
      </Layout>
    </Router>
  );
};