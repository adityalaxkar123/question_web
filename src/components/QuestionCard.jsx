export default function QuestionCard({
    question,
    questionIndex,
    totalQuestions,
    selectedAnswer,
    isMarked,
    onSelectAnswer,
    onClearAnswer,
    onToggleReview,
    darkMode,
}) {
    const optionLabels = ['A', 'B', 'C', 'D'];

    return (
        <div className="anim-fadeInUp">
            {/* Question Header Pill */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs shadow-md">
                        {question.id}
                    </span>
                    <span className={`text-xs font-medium ${darkMode ? 'text-white/40' : 'text-slate-400'}`}>
                        {questionIndex + 1} / {totalQuestions}
                    </span>
                </div>
                {isMarked && (
                    <span className="px-2.5 py-1 bg-purple-500/15 text-purple-400 text-[10px] font-semibold rounded-full">
                        📌 समीक्षा
                    </span>
                )}
            </div>

            {/* Question Text */}
            <div className={`rounded-2xl p-4 mb-4 ${darkMode ? 'bg-white/5' : 'bg-white shadow-sm'}`} style={{ border: darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)' }}>
                <p className={`text-[15px] leading-relaxed font-medium ${darkMode ? 'text-white/90' : 'text-slate-800'}`}>
                    {question.question}
                </p>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
                {question.options.map((option, idx) => {
                    const isSelected = selectedAnswer === option;

                    return (
                        <button
                            key={idx}
                            onClick={() => onSelectAnswer(option)}
                            className={`w-full flex items-center gap-3 p-3.5 rounded-2xl text-left transition-all duration-200 press-effect ${isSelected
                                    ? darkMode
                                        ? 'bg-indigo-500/20 shadow-md shadow-indigo-500/10'
                                        : 'bg-indigo-50 shadow-md shadow-indigo-500/10'
                                    : darkMode
                                        ? 'bg-white/5 active:bg-white/10'
                                        : 'bg-white active:bg-slate-50'
                                }`}
                            style={{
                                border: isSelected
                                    ? darkMode ? '1.5px solid rgba(129,140,248,0.5)' : '1.5px solid rgba(99,102,241,0.4)'
                                    : darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
                            }}
                        >
                            <span
                                className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-bold shrink-0 transition-all ${isSelected
                                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm'
                                        : darkMode
                                            ? 'bg-white/10 text-white/50'
                                            : 'bg-slate-100 text-slate-500'
                                    }`}
                            >
                                {optionLabels[idx]}
                            </span>
                            <span className={`flex-1 text-sm leading-snug ${isSelected
                                    ? darkMode ? 'text-indigo-300 font-semibold' : 'text-indigo-700 font-semibold'
                                    : darkMode ? 'text-white/70' : 'text-slate-600'
                                }`}>
                                {option}
                            </span>
                            {isSelected && (
                                <span className="text-indigo-500 shrink-0">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
                <button
                    onClick={onClearAnswer}
                    disabled={!selectedAnswer}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold press-effect transition-all ${selectedAnswer
                            ? darkMode ? 'bg-white/10 text-white/70 active:bg-white/15' : 'bg-slate-100 text-slate-600 active:bg-slate-200'
                            : 'opacity-30 cursor-not-allowed bg-slate-200 text-slate-400'
                        }`}
                >
                    🗑️ हटाएं
                </button>
                <button
                    onClick={onToggleReview}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold press-effect transition-all ${isMarked
                            ? 'bg-purple-500/20 text-purple-400'
                            : darkMode ? 'bg-white/10 text-white/70 active:bg-white/15' : 'bg-slate-100 text-slate-600 active:bg-slate-200'
                        }`}
                >
                    {isMarked ? '📌 चिह्नित ✓' : '📌 समीक्षा'}
                </button>
            </div>
        </div>
    );
}
