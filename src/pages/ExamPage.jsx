import { useState } from 'react';
import { useExam } from '../context/ExamContext';
import { useTheme } from '../context/ThemeContext';
import Timer from '../components/Timer';
import QuestionPalette from '../components/QuestionPalette';
import QuestionCard from '../components/QuestionCard';
import ConfirmModal from '../components/ConfirmModal';
import WarningModal from '../components/WarningModal';

export default function ExamPage() {
    const { state, dispatch, questions, getQuestionStatus } = useExam();
    const { darkMode, toggleDarkMode } = useTheme();
    const [showPalette, setShowPalette] = useState(false);

    const currentQ = questions[state.currentQuestion];
    const answeredCount = Object.keys(state.answers).length;
    const progressPercent = (answeredCount / questions.length) * 100;

    const handleNext = () => {
        if (state.currentQuestion < questions.length - 1)
            dispatch({ type: 'NAVIGATE', index: state.currentQuestion + 1 });
    };

    const handlePrev = () => {
        if (state.currentQuestion > 0)
            dispatch({ type: 'NAVIGATE', index: state.currentQuestion - 1 });
    };

    const bg = darkMode
        ? 'bg-[#0f0c29]'
        : 'bg-gradient-to-b from-slate-100 to-indigo-50';

    return (
        <div className={`min-h-[100dvh] flex flex-col no-select ${bg} safe-top`}>
            {/* ===== STICKY TOP BAR ===== */}
            <header className={`sticky top-0 z-40 ${darkMode ? 'bg-[#1a1640]/95' : 'bg-white/90'} backdrop-blur-xl safe-top`} style={{ borderBottom: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)' }}>
                <div className="px-4 pt-2 pb-1">
                    {/* Row 1: Title, Timer, Actions */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                            <span className="text-base">📝</span>
                            <span className={`text-xs font-bold truncate ${darkMode ? 'text-white/80' : 'text-slate-700'}`}>
                                PTI Mock Test
                            </span>
                        </div>

                        <Timer darkMode={darkMode} />

                        <div className="flex items-center gap-1.5">
                            <button onClick={toggleDarkMode} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm press-effect ${darkMode ? 'bg-white/10' : 'bg-slate-100'}`}>
                                {darkMode ? '☀️' : '🌙'}
                            </button>
                            <button
                                onClick={() => setShowPalette(true)}
                                className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm press-effect relative"
                            >
                                📋
                                {answeredCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full text-[9px] font-bold flex items-center justify-center text-white">
                                        {answeredCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2 mb-1">
                        <div className={`h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-slate-200'}`}>
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-700 ease-out"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-0.5">
                            <span className={`text-[10px] ${darkMode ? 'text-white/40' : 'text-slate-400'}`}>
                                {answeredCount}/{questions.length} उत्तर
                            </span>
                            <span className={`text-[10px] ${darkMode ? 'text-white/40' : 'text-slate-400'}`}>
                                {Math.round(progressPercent)}%
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* ===== QUESTION AREA ===== */}
            <main className="flex-1 px-4 py-3">
                <QuestionCard
                    question={currentQ}
                    questionIndex={state.currentQuestion}
                    totalQuestions={questions.length}
                    selectedAnswer={state.answers[currentQ.id]}
                    isMarked={state.markedForReview.includes(currentQ.id)}
                    onSelectAnswer={(answer) => dispatch({ type: 'SELECT_ANSWER', questionId: currentQ.id, answer })}
                    onClearAnswer={() => dispatch({ type: 'CLEAR_ANSWER', questionId: currentQ.id })}
                    onToggleReview={() => dispatch({ type: 'TOGGLE_REVIEW', questionId: currentQ.id })}
                    darkMode={darkMode}
                />
            </main>

            {/* ===== STICKY BOTTOM NAV ===== */}
            <nav className={`sticky bottom-0 z-40 px-4 py-3 safe-bottom ${darkMode ? 'bg-[#1a1640]/95' : 'bg-white/90'} backdrop-blur-xl`} style={{ borderTop: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)' }}>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrev}
                        disabled={state.currentQuestion === 0}
                        className={`flex-1 py-3 rounded-xl font-semibold text-sm press-effect transition-all ${state.currentQuestion === 0
                                ? 'opacity-30 cursor-not-allowed bg-slate-300 text-slate-500'
                                : darkMode
                                    ? 'bg-white/10 text-white active:bg-white/20'
                                    : 'bg-slate-100 text-slate-700 active:bg-slate-200'
                            }`}
                    >
                        ← पिछला
                    </button>

                    <button
                        onClick={() => dispatch({ type: 'SHOW_SUBMIT_CONFIRM' })}
                        className="px-4 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold text-sm press-effect shadow-lg shadow-red-500/25"
                    >
                        📤
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={state.currentQuestion === questions.length - 1}
                        className={`flex-1 py-3 rounded-xl font-semibold text-sm press-effect transition-all ${state.currentQuestion === questions.length - 1
                                ? 'opacity-30 cursor-not-allowed bg-slate-300 text-slate-500'
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                            }`}
                    >
                        अगला →
                    </button>
                </div>
            </nav>

            {/* ===== QUESTION PALETTE OVERLAY ===== */}
            {showPalette && (
                <div className="fixed inset-0 z-50 flex flex-col anim-fadeIn">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPalette(false)} />
                    <div className={`absolute bottom-0 left-0 right-0 max-h-[80dvh] rounded-t-3xl overflow-y-auto anim-slideUp ${darkMode ? 'bg-[#1a1640]' : 'bg-white'}`}>
                        {/* Handle */}
                        <div className="sticky top-0 z-10 flex justify-center pt-3 pb-2" style={{ background: 'inherit' }}>
                            <div className={`w-10 h-1 rounded-full ${darkMode ? 'bg-white/20' : 'bg-slate-300'}`}></div>
                        </div>
                        <div className="px-4 pb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>प्रश्न पैलेट</h3>
                                <button onClick={() => setShowPalette(false)} className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-white/10 text-white/60' : 'bg-slate-100 text-slate-500'}`}>✕</button>
                            </div>
                            <QuestionPalette
                                questions={questions}
                                currentQuestion={state.currentQuestion}
                                getQuestionStatus={getQuestionStatus}
                                onNavigate={(index) => { dispatch({ type: 'NAVIGATE', index }); setShowPalette(false); }}
                                darkMode={darkMode}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            {state.showSubmitConfirm && <ConfirmModal darkMode={darkMode} />}
            {state.showTabWarning && <WarningModal type="tab" darkMode={darkMode} />}
            {state.showTimeWarning && <WarningModal type="time" darkMode={darkMode} />}
        </div>
    );
}
