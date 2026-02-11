import { useState } from "react";
import toast from "react-hot-toast";
import type { QuestionDTO } from "../../models/questions/QuestionDTO";

interface AddQuestionsFormProps {
    onNext: (questions: QuestionDTO[]) => void;
}

export function AddQuestionsForm({ onNext }: AddQuestionsFormProps) {
    const [questions, setQuestions] = useState<QuestionDTO[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState("");
    const [currentPoints, setCurrentPoints] = useState(10);

    const handleAddQuestion = () => {
        if (!currentQuestion.trim()) {
            toast.error("Question text cannot be empty!");
            return;
        }

        if (currentPoints < 1) {
            toast.error("Points must be at least 1!");
            return;
        }

        const newQuestion: QuestionDTO = {
            ID_Question: Date.now(), // temp ID
            Question_Text: currentQuestion,
            Question_Points: currentPoints,
            Answers: []
        };

        setQuestions([...questions, newQuestion]);
        setCurrentQuestion("");
        setCurrentPoints(10);
        toast.success("Question added!");
    };

    const handleRemoveQuestion = (id: number) => {
        setQuestions(questions.filter(q => q.ID_Question !== id));
        toast.success("Question removed!");
    };

    const handleNext = () => {
        if (questions.length === 0) {
            toast.error("Add at least one question!");
            return;
        }

        onNext(questions);
    };

    return (
        <div
            className="flex-1 w-full pt-20 pb-16 flex flex-col items-center"
            style={{ background: "linear-gradient(135deg, #C3FDB8 0%, #FFF8C6 50%, #BDEDFF 100%)" }}
        >
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-4xl">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    Add Questions
                </h2>

                {/* Input za novo pitanje */}
                <div className="bg-blue-50 p-6 rounded-xl mb-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Question Text
                            </label>
                            <textarea
                                value={currentQuestion}
                                onChange={(e) => setCurrentQuestion(e.target.value)}
                                placeholder="Enter your question here..."
                                rows={3}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Points
                            </label>
                            <input
                                type="number"
                                value={currentPoints}
                                onChange={(e) => setCurrentPoints(Number(e.target.value))}
                                min="1"
                                max="100"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <button
                            onClick={handleAddQuestion}
                            className="w-full py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition"
                        >
                            + Add Question
                        </button>
                    </div>
                </div>

                {/* Lista dodanih pitanja */}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">
                        Questions ({questions.length})
                    </h3>

                    {questions.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                            No questions added yet. Add your first question above.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {questions.map((q, idx) => (
                                <div
                                    key={q.ID_Question}
                                    className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border-2 border-gray-200"
                                >
                                    <div className="flex-1">
                                        <span className="font-semibold text-gray-700">
                                            Q{idx + 1}:
                                        </span>{" "}
                                        <span className="text-gray-600">{q.Question_Text}</span>
                                        <span className="ml-4 text-sm text-blue-600 font-semibold">
                                            ({q.Question_Points} pts)
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveQuestion(q.ID_Question)}
                                        className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Next Button */}
                <button
                    onClick={handleNext}
                    disabled={questions.length === 0}
                    className={`w-full py-3 font-semibold rounded-xl transition ${
                        questions.length === 0
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                >
                    Next: Add Answers
                </button>
            </div>
        </div>
    );
}