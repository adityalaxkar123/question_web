import { useExam } from '../context/ExamContext';
import { useTheme } from '../context/ThemeContext';

export default function ResultPage() {
    const { calculateResult, dispatch, questions } = useExam();
    const { darkMode } = useTheme();
    const result = calculateResult();

    const bg = darkMode
        ? 'bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e]'
        : 'bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-400';

    const levelEmoji = {
        excellent: '🏆', selection: '🎯', improve: '📈', practice: '💪',
    };

    const levelGradient = {
        excellent: 'from-emerald-400 to-green-500',
        selection: 'from-blue-400 to-indigo-500',
        improve: 'from-amber-400 to-orange-500',
        practice: 'from-red-400 to-rose-500',
    };

    // Circular progress
    const radius = 54;
    const circ = 2 * Math.PI * radius;
    const strokeOffset = circ - (Math.min(100, result.percentage) / 100) * circ;

    return (
        <div className={`min-h-[100dvh] ${bg} safe-top safe-bottom px-4 py-6`}>
            <div className="space-y-4 anim-fadeInUp">

                {/* Score Circle */}
                <div className="flex flex-col items-center pt-4">
                    <div className="relative w-36 h-36">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                            <circle
                                cx="60" cy="60" r={radius} fill="none"
                                stroke="url(#scoreGradient)" strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={circ}
                                strokeDashoffset={strokeOffset}
                                style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                            />
                            <defs>
                                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#818cf8" />
                                    <stop offset="100%" stopColor="#f472b6" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-white font-extrabold text-2xl">{result.score}</span>
                            <span className="text-white/40 text-xs">/ {result.maxScore}</span>
                        </div>
                    </div>
                    <div className="mt-3 text-center">
                        <span className="text-white/80 text-lg font-bold">{result.percentage}%</span>
                    </div>
                </div>

                {/* Performance Badge */}
                <div className={`mx-auto max-w-xs py-3 px-5 rounded-2xl text-center bg-gradient-to-r ${levelGradient[result.performanceLevel]} shadow-lg`}>
                    <span className="text-2xl">{levelEmoji[result.performanceLevel]}</span>
                    <p className="text-white font-bold text-sm mt-1">{result.performanceMessage}</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="glass rounded-2xl p-3 text-center">
                        <div className="text-2xl font-bold text-emerald-400">{result.correct}</div>
                        <div className="text-white/40 text-[10px] mt-0.5">✅ सही</div>
                        <div className="text-emerald-400 text-[10px] font-semibold">+{(result.correct * 2).toFixed(1)}</div>
                    </div>
                    <div className="glass rounded-2xl p-3 text-center">
                        <div className="text-2xl font-bold text-red-400">{result.wrong}</div>
                        <div className="text-white/40 text-[10px] mt-0.5">❌ गलत</div>
                        <div className="text-red-400 text-[10px] font-semibold">-{(result.wrong * 0.66).toFixed(2)}</div>
                    </div>
                    <div className="glass rounded-2xl p-3 text-center">
                        <div className="text-2xl font-bold text-white/40">{result.unattempted}</div>
                        <div className="text-white/40 text-[10px] mt-0.5">⭕ छोड़े</div>
                        <div className="text-white/30 text-[10px] font-semibold">0.00</div>
                    </div>
                </div>

                {/* Details */}
                <div className="glass rounded-2xl p-4 space-y-2">
                    {[
                        { label: 'कुल प्रश्न', value: questions.length, icon: '📋' },
                        { label: 'प्रयास', value: result.correct + result.wrong, icon: '✍️' },
                        { label: 'शुद्धता', value: result.correct + result.wrong > 0 ? `${((result.correct / (result.correct + result.wrong)) * 100).toFixed(1)}%` : '0%', icon: '🎯' },
                        { label: 'परिणाम', value: result.passed ? 'उत्तीर्ण ✅' : 'अनुत्तीर्ण ❌', icon: '📊' },
                    ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center py-1.5">
                            <span className="text-white/50 text-sm">{item.icon} {item.label}</span>
                            <span className="text-white font-semibold text-sm">{item.value}</span>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2">
                    <button
                        onClick={() => (window.location.hash = '#review')}
                        className="w-full py-3.5 rounded-2xl bg-white text-indigo-700 font-bold text-sm press-effect shadow-lg"
                    >
                        📖 उत्तर समीक्षा देखें
                    </button>
                    <button
                        onClick={() => dispatch({ type: 'RESET_EXAM' })}
                        className="w-full py-3.5 rounded-2xl glass text-white font-semibold text-sm press-effect"
                    >
                        🔄 पुनः परीक्षा दें
                    </button>
                </div>
            </div>
        </div>
    );
}
