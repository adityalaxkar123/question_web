import { useExam } from '../context/ExamContext';

export default function Timer({ darkMode }) {
    const { state } = useExam();

    const minutes = Math.floor(state.timeRemaining / 60);
    const seconds = state.timeRemaining % 60;
    const isLow = state.timeRemaining <= 300;
    const isCritical = state.timeRemaining <= 60;

    return (
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${isCritical
                ? 'bg-red-500/20 text-red-400 animate-pulse'
                : isLow
                    ? 'bg-amber-500/20 text-amber-400'
                    : darkMode
                        ? 'bg-white/10 text-white/80'
                        : 'bg-indigo-50 text-indigo-600'
            }`}>
            <span className="text-[10px]">⏱</span>
            <span className="tabular-nums">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
        </div>
    );
}
