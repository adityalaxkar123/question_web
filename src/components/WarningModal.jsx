import { useExam } from '../context/ExamContext';

export default function WarningModal({ type, darkMode }) {
    const { state, dispatch } = useExam();
    const isTabWarning = type === 'tab';

    const handleDismiss = () => {
        dispatch({ type: isTabWarning ? 'DISMISS_TAB_WARNING' : 'DISMISS_TIME_WARNING' });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm anim-fadeIn">
            <div className={`w-full max-w-sm rounded-3xl overflow-hidden anim-scaleIn ${darkMode ? 'bg-[#1a1640]' : 'bg-white'}`}>
                {/* Icon */}
                <div className={`py-6 text-center ${isTabWarning ? 'bg-gradient-to-br from-orange-500 to-red-500' : 'bg-gradient-to-br from-amber-400 to-orange-500'}`}>
                    <div className="text-5xl mb-1 anim-float">{isTabWarning ? '🚨' : '⏰'}</div>
                </div>

                <div className="p-5 text-center">
                    <h2 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                        {isTabWarning ? 'चेतावनी!' : 'समय कम है!'}
                    </h2>

                    {isTabWarning ? (
                        <>
                            <p className={`text-sm mb-1 ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>
                                टैब बदलना प्रतिबंधित है!
                            </p>
                            <p className="text-xs text-red-400 font-semibold mt-2">
                                कुल टैब स्विच: {state.tabSwitchCount}
                            </p>
                        </>
                    ) : (
                        <p className={`text-sm ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>
                            केवल 5 मिनट शेष! जल्दी पूर्ण करें।
                        </p>
                    )}
                </div>

                <div className="px-5 pb-5">
                    <button
                        onClick={handleDismiss}
                        className={`w-full py-3.5 font-bold text-sm rounded-xl text-white press-effect shadow-lg ${isTabWarning
                                ? 'bg-gradient-to-r from-orange-500 to-red-500 shadow-red-500/25'
                                : 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-500/25'
                            }`}
                    >
                        समझ गया ✓
                    </button>
                </div>
            </div>
        </div>
    );
}
