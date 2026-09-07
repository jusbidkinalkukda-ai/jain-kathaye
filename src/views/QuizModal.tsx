import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Trophy, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { JAIN_QUIZZES } from '../data/quizData';

export const QuizModal: React.FC = () => {
  const { isQuizOpen, setQuizOpen } = useApp();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  if (!isQuizOpen) return null;

  const currentQ = JAIN_QUIZZES[currentQuestionIndex];

  const handleOptionSelect = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQ.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < JAIN_QUIZZES.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizCompleted(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8F2018', '#E7B83D', '#216A43', '#FFF0B8'],
      });
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsQuizCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-jain-border">
        {/* Header */}
        <div className="bg-gradient-to-r from-jain-maroon to-[#731812] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-jain-gold">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">जैन ज्ञान पाठशाला क्विज़</h3>
              <p className="text-[11px] text-amber-200">धर्म ज्ञान • संस्कार परीक्षण</p>
            </div>
          </div>
          <button
            onClick={() => setQuizOpen(false)}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 bg-[#FFFDF8]">
          {!isQuizCompleted ? (
            <div>
              {/* Progress Indicator */}
              <div className="flex items-center justify-between text-xs font-semibold text-jain-muted mb-2">
                <span>प्रश्न {currentQuestionIndex + 1} / {JAIN_QUIZZES.length}</span>
                <span className="text-amber-700">स्कोर: {score} अंक</span>
              </div>
              <div className="w-full h-2 bg-jain-cream rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-jain-gold transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / JAIN_QUIZZES.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <h4 className="font-bold text-sm sm:text-base text-jain-text mb-4 leading-snug">
                {currentQ.question}
              </h4>

              {/* Options */}
              <div className="space-y-2.5 mb-5">
                {currentQ.options.map((opt, idx) => {
                  let btnStyle = 'bg-white border-jain-border text-jain-text hover:bg-jain-cream';

                  if (selectedOption === idx) {
                    btnStyle = 'bg-amber-50 border-jain-gold text-amber-900 ring-2 ring-jain-gold';
                  }

                  if (isAnswerSubmitted) {
                    if (idx === currentQ.correctAnswer) {
                      btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-400';
                    } else if (selectedOption === idx) {
                      btnStyle = 'bg-red-50 border-red-500 text-red-900 ring-2 ring-red-400';
                    } else {
                      btnStyle = 'bg-gray-50 border-gray-200 text-gray-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={isAnswerSubmitted}
                      className={`w-full text-left p-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-between gap-2 ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswerSubmitted && idx === currentQ.correctAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {isAnswerSubmitted && selectedOption === idx && idx !== currentQ.correctAnswer && (
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation after submission */}
              {isAnswerSubmitted && (
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 mb-4 text-xs text-amber-950">
                  <div className="font-bold flex items-center gap-1 text-amber-900 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>स्पष्टीकरण:</span>
                  </div>
                  <p>{currentQ.explanation}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-2.5">
                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className="px-5 py-2.5 rounded-xl bg-jain-maroon text-white text-xs sm:text-sm font-bold hover:bg-jain-maroon-dark disabled:opacity-40 disabled:pointer-events-none transition-all shadow-xs"
                  >
                    उत्तर जांचें
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-5 py-2.5 rounded-xl bg-jain-maroon text-white text-xs sm:text-sm font-bold hover:bg-jain-maroon-dark transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <span>{currentQuestionIndex < JAIN_QUIZZES.length - 1 ? 'अगला प्रश्न' : 'परिणाम देखें'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Result Screen */
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-jain-gold mx-auto flex items-center justify-center text-amber-700 mb-3 shadow-md">
                <Trophy className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-jain-maroon">उत्कृष्ट स्वाध्याय प्रयास!</h4>
              <p className="text-xs text-jain-muted mt-1">
                आपने {JAIN_QUIZZES.length} में से {score} सही उत्तर दिए।
              </p>

              <div className="my-5 p-4 rounded-2xl bg-jain-cream border border-jain-border text-xs text-jain-text leading-relaxed">
                {score >= 4
                  ? '🌟 अद्भुत ज्ञान! आप पाठशाला के मेधावी स्वाध्यायी हैं।'
                  : '📖 बहुत सुंदर प्रयास! निरंतर कथा पठन से आपका धर्म ज्ञान और समृद्ध होगा।'}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRestart}
                  className="flex-1 py-2.5 rounded-xl bg-white border border-jain-border text-xs font-bold text-jain-text hover:bg-jain-cream flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>पुनः खेलें</span>
                </button>
                <button
                  onClick={() => setQuizOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-jain-maroon text-white text-xs font-bold hover:bg-jain-maroon-dark shadow-xs"
                >
                  समाप्त करें
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
