import { useState } from "react";
import toast from "react-hot-toast";
import type { QuestionDTO } from "../../models/questions/QuestionDTO";
import type { AnswerDTO } from "../../models/answers/AnswerDTO";

interface AddAnswersFormProps {
    questions: QuestionDTO[];
    onNext: (answers: Record<number, AnswerDTO[]>) => void;
}

export function AddAnswersForm({ questions, onNext }: AddAnswersFormProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, AnswerDTO[]>>({});
    
    const [currentAnswerText, setCurrentAnswerText] = useState("");
    const [currentAnswerCorrect, setCurrentAnswerCorrect] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswers = answers[currentQuestion.ID_Question] || [];

    const handleAddAnswer = () => {
        if (!currentAnswerText.trim()) {
            toast.error("Answer text cannot be empty!");
            return;
        }

        // Provera da li već postoji tačan odgovor
        if (currentAnswerCorrect && currentAnswers.some(a => a.Is_Correct)) {
            toast.error("There is already a correct answer for this question!");
            return;
        }

        const newAnswer: AnswerDTO = {
            ID_Answer: Date.now(),
            Answer_Text: currentAnswerText,
            Is_Correct: currentAnswerCorrect
        };

        setAnswers({
            ...answers,
            [currentQuestion.ID_Question]: [...currentAnswers, newAnswer]
        });

        setCurrentAnswerText("");
        setCurrentAnswerCorrect(false);
        toast.success("Answer added!");
    };

    const handleRemoveAnswer = (answerId: number) => {
        setAnswers({
            ...answers,
            [currentQuestion.ID_Question]: currentAnswers.filter(a => a.ID_Answer !== answerId)
        });
        toast.success("Answer removed!");
    };

    const handleNextQuestion = () => {
        // Validacija: minimum 2 odgovora
        if (currentAnswers.length < 2) {
            toast.error("Add at least 2 answers!");
            return;
        }

        // Validacija: mora postojati tačan odgovor
        if (!currentAnswers.some(a => a.Is_Correct)) {
            toast.error("Mark at least one answer as correct!");
            return;
        }

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            onNext(answers);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    return (
        <div
            className="flex-1 w-full pt-20 pb-16 flex flex-col items-center"
            style={{ background: "linear-gradient(135deg, #C3FDB8 0%, #FFF8C6 50%, #BDEDFF 100%)" }}
        >
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-4xl">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    Add Answers
                </h2>

                {/* Progress */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                        <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-blue-500 h-3 rounded-full transition-all"
                            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Trenutno pitanje */}
                <div className="bg-blue-50 p-6 rounded-xl mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {currentQuestion.Question_Text}
                    </h3>
                    <p className="text-sm text-gray-600">
                        Points: {currentQuestion.Question_Points}
                    </p>
                </div>

                {/* Input za novi odgovor */}
                <div className="bg-green-50 p-6 rounded-xl mb-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Answer Text
                            </label>
                            <input
                                type="text"
                                value={currentAnswerText}
                                onChange={(e) => setCurrentAnswerText(e.target.value)}
                                placeholder="Enter answer..."
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="correct"
                                checked={currentAnswerCorrect}
                                onChange={(e) => setCurrentAnswerCorrect(e.target.checked)}
                                className="w-5 h-5 text-green-500 border-gray-300 rounded focus:ring-green-500"
                            />
                            <label htmlFor="correct" className="ml-3 text-sm font-semibold text-gray-700">
                                This is the correct answer
                            </label>
                        </div>

                        <button
                            onClick={handleAddAnswer}
                            className="w-full py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition"
                        >
                            + Add Answer
                        </button>
                    </div>
                </div>

                {/* Lista dodanih odgovora */}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">
                        Answers ({currentAnswers.length})
                    </h3>

                    {currentAnswers.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                            No answers added yet. Add at least 2 answers.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {currentAnswers.map((a, idx) => (
                                <div
                                    key={a.ID_Answer}
                                    className={`flex justify-between items-center p-4 rounded-xl border-2 ${
                                        a.Is_Correct
                                            ? "bg-green-50 border-green-500"
                                            : "bg-gray-50 border-gray-200"
                                    }`}
                                >
                                    <div className="flex-1">
                                        <span className="font-semibold text-gray-700">
                                            {idx + 1}.
                                        </span>{" "}
                                        <span className="text-gray-600">{a.Answer_Text}</span>
                                        {a.Is_Correct && (
                                            <span className="ml-3 text-sm text-green-600 font-bold">
                                                ✓ Correct
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleRemoveAnswer(a.ID_Answer)}
                                        className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Navigation buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={handlePrevQuestion}
                        disabled={currentQuestionIndex === 0}
                        className={`flex-1 py-3 font-semibold rounded-xl transition ${
                            currentQuestionIndex === 0
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-gray-500 text-white hover:bg-gray-600"
                        }`}
                    >
                        Previous
                    </button>

                    <button
                        onClick={handleNextQuestion}
                        className="flex-1 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition"
                    >
                        {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next Question"}
                    </button>
                </div>
            </div>
        </div>
    );
}