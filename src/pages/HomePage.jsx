import { useExam } from '../context/ExamContext';
import { useTheme } from '../context/ThemeContext';

export default function HomePage() {
    const { dispatch } = useExam();
    const { darkMode, toggleDarkMode } = useTheme();

    const handleStartExam = () => {
        dispatch({ type: 'START_EXAM' });
        try { document.documentElement.requestFullscreen?.(); } catch (e) { }
    };

    const bg = darkMode
        ? 'bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e]'
        : 'bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-400';

    return (
        <div className={`min-h-[100dvh] flex flex-col ${bg} safe-top safe-bottom`}>
            {/* Theme Toggle */}
            <button
                onClick={toggleDarkMode}
                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full glass flex items-center justify-center text-lg press-effect"
            >
                {darkMode ? '☀️' : '🌙'}
            </button>

            {/* Hero Section */}
            <div className="flex-1 flex flex-col items-center justify-center px-5 py-8">
                {/* Floating Icon */}
                <div className="anim-float mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl shadow-xl">
                        📝
                    </div>
                </div>

                <h1 className="text-2xl font-extrabold text-white text-center leading-tight anim-fadeInUp">
                    राजस्थान PTI
                    <br />
                    <span className="text-white/80 text-lg font-semibold">Mock Test Paper 2 • 2026</span>
                </h1>
                <p className="mt-2 text-white/60 text-sm text-center anim-fadeInUp" style={{ animationDelay: '0.1s' }}>
                    Physical Training Instructor — परीक्षा अभ्यास
                </p>
            </div>

            {/* Info Cards */}
            <div className="px-4 pb-4 space-y-3">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2 anim-fadeInUp" style={{ animationDelay: '0.15s' }}>
                    {[
                        { icon: '📋', label: 'प्रश्न', value: '100' },
                        { icon: '⏱️', label: 'समय', value: '120 मि.' },
                        { icon: '🏆', label: 'पूर्णांक', value: '200' },
                    ].map((item, i) => (
                        <div key={i} className="glass rounded-2xl p-3 text-center">
                            <div className="text-xl mb-1">{item.icon}</div>
                            <div className="text-white font-bold text-lg">{item.value}</div>
                            <div className="text-white/50 text-[11px]">{item.label}</div>
                        </div>
                    ))}
                </div>

                {/* Marking Scheme */}
                <div className="glass rounded-2xl p-4 anim-fadeInUp" style={{ animationDelay: '0.2s' }}>
                    <h3 className="text-white/90 text-sm font-semibold mb-3">📊 अंकन योजना</h3>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                <span className="text-white/70 text-sm">सही उत्तर</span>
                            </div>
                            <span className="text-emerald-400 font-bold text-sm">+2.00</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                                <span className="text-white/70 text-sm">गलत उत्तर</span>
                            </div>
                            <span className="text-red-400 font-bold text-sm">−0.66</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-white/30"></span>
                                <span className="text-white/70 text-sm">अनुत्तरित</span>
                            </div>
                            <span className="text-white/40 font-bold text-sm">0.00</span>
                        </div>
                    </div>
                </div>

                {/* Rules */}
                <div className="glass rounded-2xl p-4 anim-fadeInUp" style={{ animationDelay: '0.25s' }}>
                    <h3 className="text-white/90 text-sm font-semibold mb-2">⚠️ नियम</h3>
                    <ul className="space-y-1.5 text-white/60 text-xs">
                        <li className="flex gap-2"><span>•</span><span>टैब बदलने पर चेतावनी मिलेगी</span></li>
                        <li className="flex gap-2"><span>•</span><span>समय समाप्त = स्वतः सबमिट</span></li>
                        <li className="flex gap-2"><span>•</span><span>रीफ्रेश पर टाइमर जारी रहेगा</span></li>
                    </ul>
                </div>

                {/* Start Button */}
                <button
                    onClick={handleStartExam}
                    className="w-full py-4 rounded-2xl bg-white text-indigo-700 font-extrabold text-lg shadow-xl press-effect anim-fadeInUp relative overflow-hidden"
                    style={{ animationDelay: '0.3s' }}
                >
                    <span className="relative z-10">🚀 परीक्षा शुरू करें</span>
                    <div className="absolute inset-0 anim-shimmer"></div>
                </button>

                <p className="text-center text-white/30 text-[10px] pb-2">
                    © 2026 Rajasthan PTI Mock Test
                </p>
            </div>
        </div>
    );
}
