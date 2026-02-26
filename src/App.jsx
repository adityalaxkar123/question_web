import { useState, useEffect } from 'react';
import { ExamProvider, useExam } from './context/ExamContext';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import ExamPage from './pages/ExamPage';
import ResultPage from './pages/ResultPage';
import ReviewPage from './pages/ReviewPage';

function ExamRouter() {
  const { state } = useExam();
  const [page, setPage] = useState('home');

  // Handle hash-based routing for result/review navigation
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#review') setPage('review');
      else if (hash === '#result') setPage('result');
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Determine which page to show based on exam state
  useEffect(() => {
    if (!state.examStarted && !state.examSubmitted) {
      setPage('home');
      window.location.hash = '';
    } else if (state.examStarted && !state.examSubmitted) {
      setPage('exam');
      window.location.hash = '';
    } else if (state.examSubmitted) {
      if (window.location.hash === '#review') {
        setPage('review');
      } else {
        setPage('result');
        window.location.hash = '#result';
      }
    }
  }, [state.examStarted, state.examSubmitted]);

  switch (page) {
    case 'exam':
      return <ExamPage />;
    case 'result':
      return <ResultPage />;
    case 'review':
      return <ReviewPage />;
    default:
      return <HomePage />;
  }
}

export default function App() {
  return (
    <ThemeProvider>
      <ExamProvider>
        <ExamRouter />
      </ExamProvider>
    </ThemeProvider>
  );
}
