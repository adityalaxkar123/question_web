export default function QuestionPalette({ questions, currentQuestion, getQuestionStatus, onNavigate, darkMode }) {
    const answeredCount = questions.filter((q) => {
        const s = getQuestionStatus(q.id);
        return s === 'answered' || s === 'answered-marked';
    }).length;
    const markedCount = questions.filter((q) => {
        const s = getQuestionStatus(q.id);
        return s === 'marked' || s === 'answered-marked';
    }).length;

    return (
        <div>
            {/* Legend */}
            <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                    { color: 'bg-emerald-500', label: 'उत्तर', count: answeredCount },
                    { color: 'bg-purple-500', label: 'समीक्षा', count: markedCount },
                    { color: darkMode ? 'bg-white/15' : 'bg-slate-200', label: 'शेष', count: questions.length - answeredCount },
                    { color: 'bg-indigo-500 ring-2 ring-indigo-300', label: 'वर्तमान', count: '' },
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                        <div className={`w-3 h-3 rounded ${item.color}`}></div>
                        <span className={`text-[10px] ${darkMode ? 'text-white/50' : 'text-slate-500'}`}>
                            {item.label}{item.count !== '' ? ` (${item.count})` : ''}
                        </span>
                    </div>
                ))}
            </div>

            {/* Question Grid */}
            <div className="grid grid-cols-6 gap-2">
                {questions.map((q, index) => {
                    const status = getQuestionStatus(q.id);
                    const isCurrent = index === currentQuestion;

                    const colors = {
                        answered: 'bg-emerald-500 text-white',
                        marked: 'bg-purple-500 text-white',
                        'answered-marked': 'bg-purple-500 text-white ring-2 ring-emerald-400',
                        unattempted: darkMode ? 'bg-white/8 text-white/40' : 'bg-slate-100 text-slate-500',
                    };

                    return (
                        <button
                            key={q.id}
                            onClick={() => onNavigate(index)}
                            className={`aspect-square flex items-center justify-center rounded-xl text-xs font-bold transition-all press-effect ${isCurrent
                                    ? 'bg-indigo-500 text-white scale-110 shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-300'
                                    : colors[status]
                                }`}
                        >
                            {q.id}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
