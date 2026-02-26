import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { questions } from '../data/questions';

const ExamContext = createContext();

const TOTAL_TIME = 120 * 60; // 120 minutes in seconds

const getInitialState = () => {
    const saved = localStorage.getItem('examState');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.examStarted && !parsed.examSubmitted) {
                return parsed;
            }
        } catch (e) {
            // ignore
        }
    }
    return {
        answers: {},
        markedForReview: [],
        currentQuestion: 0,
        examStarted: false,
        examSubmitted: false,
        timeRemaining: TOTAL_TIME,
        startTime: null,
        tabSwitchCount: 0,
        showTabWarning: false,
        showTimeWarning: false,
        showSubmitConfirm: false,
    };
};

function examReducer(state, action) {
    switch (action.type) {
        case 'START_EXAM':
            return {
                ...state,
                examStarted: true,
                startTime: Date.now(),
                timeRemaining: TOTAL_TIME,
            };

        case 'SELECT_ANSWER':
            return {
                ...state,
                answers: {
                    ...state.answers,
                    [action.questionId]: action.answer,
                },
            };

        case 'CLEAR_ANSWER': {
            const newAnswers = { ...state.answers };
            delete newAnswers[action.questionId];
            return {
                ...state,
                answers: newAnswers,
            };
        }

        case 'TOGGLE_REVIEW': {
            const isMarked = state.markedForReview.includes(action.questionId);
            return {
                ...state,
                markedForReview: isMarked
                    ? state.markedForReview.filter((id) => id !== action.questionId)
                    : [...state.markedForReview, action.questionId],
            };
        }

        case 'NAVIGATE':
            return {
                ...state,
                currentQuestion: action.index,
            };

        case 'TICK_TIMER': {
            const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
            const remaining = Math.max(0, TOTAL_TIME - elapsed);
            return {
                ...state,
                timeRemaining: remaining,
                showTimeWarning: remaining <= 300 && remaining > 0,
            };
        }

        case 'SUBMIT_EXAM':
            return {
                ...state,
                examSubmitted: true,
                examStarted: false,
            };

        case 'TAB_SWITCH':
            return {
                ...state,
                tabSwitchCount: state.tabSwitchCount + 1,
                showTabWarning: true,
            };

        case 'DISMISS_TAB_WARNING':
            return {
                ...state,
                showTabWarning: false,
            };

        case 'DISMISS_TIME_WARNING':
            return {
                ...state,
                showTimeWarning: false,
            };

        case 'SHOW_SUBMIT_CONFIRM':
            return {
                ...state,
                showSubmitConfirm: true,
            };

        case 'HIDE_SUBMIT_CONFIRM':
            return {
                ...state,
                showSubmitConfirm: false,
            };

        case 'RESET_EXAM':
            localStorage.removeItem('examState');
            return {
                answers: {},
                markedForReview: [],
                currentQuestion: 0,
                examStarted: false,
                examSubmitted: false,
                timeRemaining: TOTAL_TIME,
                startTime: null,
                tabSwitchCount: 0,
                showTabWarning: false,
                showTimeWarning: false,
                showSubmitConfirm: false,
            };

        default:
            return state;
    }
}

export function ExamProvider({ children }) {
    const [state, dispatch] = useReducer(examReducer, null, getInitialState);

    // Persist state to localStorage
    useEffect(() => {
        if (state.examStarted && !state.examSubmitted) {
            localStorage.setItem('examState', JSON.stringify(state));
        }
    }, [state]);

    // Timer
    useEffect(() => {
        if (!state.examStarted || state.examSubmitted) return;

        const interval = setInterval(() => {
            dispatch({ type: 'TICK_TIMER' });
        }, 1000);

        return () => clearInterval(interval);
    }, [state.examStarted, state.examSubmitted]);

    // Auto submit when time ends
    useEffect(() => {
        if (state.timeRemaining <= 0 && state.examStarted && !state.examSubmitted) {
            dispatch({ type: 'SUBMIT_EXAM' });
        }
    }, [state.timeRemaining, state.examStarted, state.examSubmitted]);

    // Tab switch detection
    useEffect(() => {
        if (!state.examStarted || state.examSubmitted) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                dispatch({ type: 'TAB_SWITCH' });
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [state.examStarted, state.examSubmitted]);

    // Anti-cheat: prevent right click, copy, cut
    useEffect(() => {
        if (!state.examStarted || state.examSubmitted) return;

        const preventAction = (e) => e.preventDefault();
        document.addEventListener('contextmenu', preventAction);
        document.addEventListener('copy', preventAction);
        document.addEventListener('cut', preventAction);
        document.addEventListener('paste', preventAction);

        return () => {
            document.removeEventListener('contextmenu', preventAction);
            document.removeEventListener('copy', preventAction);
            document.removeEventListener('cut', preventAction);
            document.removeEventListener('paste', preventAction);
        };
    }, [state.examStarted, state.examSubmitted]);

    const calculateResult = useCallback(() => {
        let correct = 0;
        let wrong = 0;
        let unattempted = 0;

        questions.forEach((q) => {
            const userAnswer = state.answers[q.id];
            if (!userAnswer) {
                unattempted++;
            } else if (userAnswer === q.answer) {
                correct++;
            } else {
                wrong++;
            }
        });

        const score = correct * 2 - wrong * 0.66;
        const maxScore = 200;
        const percentage = (score / maxScore) * 100;

        let performanceMessage = '';
        let performanceLevel = '';
        if (percentage >= 90) {
            performanceMessage = '🏆 Excellent! Outstanding Performance!';
            performanceLevel = 'excellent';
        } else if (percentage >= 70) {
            performanceMessage = '🎯 Selection Zone! Great Job!';
            performanceLevel = 'selection';
        } else if (percentage >= 50) {
            performanceMessage = '📈 Good! Keep Improving!';
            performanceLevel = 'improve';
        } else {
            performanceMessage = '💪 Need More Practice!';
            performanceLevel = 'practice';
        }

        const passed = percentage >= 50;

        return {
            correct,
            wrong,
            unattempted,
            score: Math.max(0, parseFloat(score.toFixed(2))),
            maxScore,
            percentage: Math.max(0, parseFloat(percentage.toFixed(2))),
            passed,
            performanceMessage,
            performanceLevel,
        };
    }, [state.answers]);

    const getQuestionStatus = useCallback(
        (questionId) => {
            const isAnswered = state.answers[questionId] !== undefined;
            const isMarked = state.markedForReview.includes(questionId);
            if (isMarked && isAnswered) return 'answered-marked';
            if (isMarked) return 'marked';
            if (isAnswered) return 'answered';
            return 'unattempted';
        },
        [state.answers, state.markedForReview]
    );

    const value = {
        state,
        dispatch,
        questions,
        calculateResult,
        getQuestionStatus,
    };

    return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
}

export function useExam() {
    const context = useContext(ExamContext);
    if (!context) {
        throw new Error('useExam must be used within ExamProvider');
    }
    return context;
}
