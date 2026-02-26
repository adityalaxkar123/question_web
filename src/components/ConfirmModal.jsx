import { useExam } from '../context/ExamContext';

export default function ConfirmModal({ darkMode }) {
    const { state, dispatch, questions } = useExam();

    const answeredCount = Object.keys(state.answers).length;
    const unattemptedCount = questions.length - answeredCount;
    const markedCount = state.markedForReview.length;

    const handleConfirm = () => {
        dispatch({ type: 'SUBMIT_EXAM' });
        dispatch({ type: 'HIDE_SUBMIT_CONFIRM' });
        try { document.exitFullscreen?.(); } catch (e) { }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm anim-fadeIn">
            <div className={`w-full max-w-lg rounded-t-3xl overflow-hidden anim-slideUp ${darkMode ? 'bg-[#1a1640]' : 'bg-white'}`}>
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-1">
                    <div className={`w-10 h-1 rounded-full ${darkMode ? 'bg-white/20' : 'bg-slate-300'}`}></div>
                </div>

                {/* Icon + Title */}
                <div className="text-center px-6 pt-2 pb-4">
                    <div className="text-4xl mb-2">⚠️</div>
                    <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                        परीक्षा सबमिट करें?
                    </h2>
                </div>

                {/* Stats */}
                <div className="px-4 space-y-2">
                    <div className={`flex justify-between items-center p-3 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-emerald-50'}`}>
                        <span className={`text-sm ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>✅ उत्तर दिए</span>
                        <span className="text-sm font-bold text-emerald-500">{answeredCount}</span>
                    </div>
                    <div className={`flex justify-between items-center p-3 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                        <span className={`text-sm ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>⭕ अनुत्तरित</span>
                        <span className={`text-sm font-bold ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>{unattemptedCount}</span>
                    </div>
                    <div className={`flex justify-between items-center p-3 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-purple-50'}`}>
                        <span className={`text-sm ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>📌 समीक्षा</span>
                        <span className="text-sm font-bold text-purple-500">{markedCount}</span>
                    </div>

                    {unattemptedCount > 0 && (
                        <div className={`p-3 rounded-xl text-xs text-center ${darkMode ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
                            ⚠️ {unattemptedCount} प्रश्न अभी अनुत्तरित हैं!
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className="p-4 pt-5 flex gap-3 safe-bottom">
                    <button
                        onClick={() => dispatch({ type: 'HIDE_SUBMIT_CONFIRM' })}
                        className={`flex-1 py-3.5 rounded-xl font-semibold text-sm press-effect ${darkMode ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'}`}
                    >
                        ← वापस
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 py-3.5 bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold text-sm rounded-xl press-effect shadow-lg shadow-red-500/25"
                    >
                        ✅ सबमिट
                    </button>
                </div>
            </div>
        </div>
    );
}
