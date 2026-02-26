import { useState } from 'react';
import { useExam } from '../context/ExamContext';
import { useTheme } from '../context/ThemeContext';

export default function ReviewPage() {
    const { state, questions, dispatch } = useExam();
    const { darkMode } = useTheme();
    const [filter, setFilter] = useState('all');

    const getFilteredQuestions = () => {
        return questions.filter((q) => {
            const ua = state.answers[q.id];
            if (filter === 'correct') return ua === q.answer;
            if (filter === 'wrong') return ua && ua !== q.answer;
            if (filter === 'unattempted') return !ua;
            return true;
        });
    };

    const filtered = getFilteredQuestions();
    const correctCount = questions.filter((q) => state.answers[q.id] === q.answer).length;
    const wrongCount = questions.filter((q) => state.answers[q.id] && state.answers[q.id] !== q.answer).length;
    const unCount = questions.filter((q) => !state.answers[q.id]).length;

    const bg = darkMode ? 'bg-[#0f0c29]' : 'bg-slate-50';

    return (
        <div className={`min-h-[100dvh] ${bg} safe-top safe-bottom`}>
            {/* Sticky Header */}
            <header className={`sticky top-0 z-30 px-4 pt-3 pb-2 ${darkMode ? 'bg-[#0f0c29]/95' : 'bg-slate-50/95'} backdrop-blur-xl safe-top`} style={{ borderBottom: darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.05)' }}>
                <div className="flex items-center justify-between mb-3">
                    <h1 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>📖 उत्तर समीक्षा</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={() => (window.location.hash = '#result')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium press-effect ${darkMode ? 'bg-white/10 text-white/70' : 'bg-white text-slate-600 shadow-sm'}`}
                        >
                            ← परिणाम
                        </button>
                        <button
                            onClick={() => dispatch({ type: 'RESET_EXAM' })}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 text-white press-effect"
                        >
                            🔄 पुनः
                        </button>
                    </div>
                </div>

                {/* Filter Pills */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {[
                        { key: 'all', label: 'सभी', count: questions.length, emoji: '📋' },
                        { key: 'correct', label: 'सही', count: correctCount, emoji: '✅' },
                        { key: 'wrong', label: 'गलत', count: wrongCount, emoji: '❌' },
                        { key: 'unattempted', label: 'छोड़े', count: unCount, emoji: '⭕' },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap press-effect transition-all ${filter === tab.key
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                                    : darkMode
                                        ? 'bg-white/8 text-white/40'
                                        : 'bg-white text-slate-500 shadow-sm'
                                }`}
                        >
                            {tab.emoji} {tab.count}
                        </button>
                    ))}
                </div>
            </header>

            {/* Questions List */}
            <div className="px-4 py-3 space-y-3">
                {filtered.map((q) => {
                    const userAnswer = state.answers[q.id];
                    const isCorrect = userAnswer === q.answer;
                    const isUnattempted = !userAnswer;
                    const optLabels = ['A', 'B', 'C', 'D'];

                    return (
                        <div
                            key={q.id}
                            className={`rounded-2xl overflow-hidden anim-fadeInUp ${darkMode ? 'bg-white/5' : 'bg-white shadow-sm'}`}
                            style={{ border: darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)' }}
                        >
                            {/* Q Header */}
                            <div className={`px-3 py-2 flex items-center gap-2 ${isUnattempted
                                    ? darkMode ? 'bg-white/5' : 'bg-slate-50'
                                    : isCorrect
                                        ? darkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'
                                        : darkMode ? 'bg-red-500/10' : 'bg-red-50'
                                }`}>
                                <span className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold text-white ${isUnattempted ? 'bg-slate-400' : isCorrect ? 'bg-emerald-500' : 'bg-red-500'
                                    }`}>
                                    {q.id}
                                </span>
                                <span className={`text-[11px] font-semibold ${isUnattempted ? (darkMode ? 'text-white/30' : 'text-slate-400')
                                        : isCorrect ? 'text-emerald-500' : 'text-red-500'
                                    }`}>
                                    {isUnattempted ? '⭕ अनुत्तरित' : isCorrect ? '✅ सही' : '❌ गलत'}
                                </span>
                            </div>

                            {/* Q Text */}
                            <div className="px-3 py-2.5">
                                <p className={`text-sm font-medium leading-relaxed ${darkMode ? 'text-white/85' : 'text-slate-800'}`}>
                                    {q.question}
                                </p>
                            </div>

                            {/* Options */}
                            <div className="px-3 pb-3 space-y-1.5">
                                {q.options.map((opt, idx) => {
                                    const isThisCorrect = opt === q.answer;
                                    const isThisSelected = opt === userAnswer;

                                    let style = '';
                                    if (isThisCorrect) {
                                        style = darkMode
                                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                                            : 'bg-emerald-50 border-emerald-300 text-emerald-800';
                                    } else if (isThisSelected) {
                                        style = darkMode
                                            ? 'bg-red-500/15 border-red-500/30 text-red-300'
                                            : 'bg-red-50 border-red-300 text-red-800';
                                    } else {
                                        style = darkMode
                                            ? 'bg-white/3 border-white/6 text-white/40'
                                            : 'bg-slate-50 border-slate-100 text-slate-400';
                                    }

                                    return (
                                        <div key={idx} className={`flex items-center gap-2 p-2.5 rounded-xl border ${style}`}>
                                            <span className={`w-5 h-5 flex items-center justify-center rounded text-[9px] font-bold ${isThisCorrect ? 'bg-emerald-500 text-white'
                                                    : isThisSelected ? 'bg-red-500 text-white'
                                                        : darkMode ? 'bg-white/10 text-white/30' : 'bg-slate-200 text-slate-400'
                                                }`}>
                                                {optLabels[idx]}
                                            </span>
                                            <span className="flex-1 text-xs leading-snug">{opt}</span>
                                            {isThisCorrect && <span className="text-[10px]">✅</span>}
                                            {isThisSelected && !isThisCorrect && <span className="text-[10px]">❌</span>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Scroll to top */}
            <div className="text-center py-6">
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className={`px-5 py-2.5 rounded-xl text-xs font-medium press-effect ${darkMode ? 'glass text-white/60' : 'bg-white text-slate-500 shadow-sm'}`}
                >
                    ⬆️ ऊपर जाएं
                </button>
            </div>
        </div>
    );
}
