import { useState } from "react";
import type { QuestionDTO } from "../../../models/questions/QuestionDTO";

interface QuizGradingFormProps {
    questions: QuestionDTO[];
    onFinish: (approved: boolean, reason?: string) => void;
}

export const QuizGradingForm = ({ questions, onFinish }: QuizGradingFormProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [decision, setDecision] = useState<"approve" | "reject" | null>(null);
    const [rejectReason, setRejectReason] = useState("");

    const currentQuestion = questions[currentIndex];

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
    };
    const prevQuestion = () => {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    };

    const handleFinish = () => {
        if (!decision) return;
        onFinish(decision === "approve", decision === "reject" ? rejectReason : undefined);
    };

    return (
        <div className="flex flex-col items-center p-6 font-poppins">
            {/* Pitanje */}
            {currentQuestion && (
                <div className="w-full max-w-2xl p-4 border rounded shadow mb-4">
                    <div className="font-semibold mb-2">
                        Pitanje {currentIndex + 1} / {questions.length}
                    </div>
                    <div className="mb-4">{currentQuestion.question_text}</div>

                    {/* Odgovori */}
                    <div className="flex flex-col gap-2">
                        {currentQuestion.answers?.map(a => (
                            <div
                                key={a.answer_id}
                                className={`p-2 border rounded flex justify-between items-center ${a.answer_is_correct ? "bg-green-100 border-green-500" : "bg-gray-50"
                                    }`}
                            >
                                <span>{a.answer_text}</span>
                                {a.answer_is_correct && <span className="text-green-600 font-bold">✔</span>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Navigacija kroz pitanja */}
            <div className="flex gap-4 mb-6">
                <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={prevQuestion}
                    disabled={currentIndex === 0}
                >
                    Prethodno
                </button>
                <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={nextQuestion}
                    disabled={currentIndex === questions.length - 1}
                >
                    Sledeće
                </button>
            </div>

            {/* Odobri / odbij */}
            {currentIndex === questions.length - 1 && (
                <div className="w-full max-w-2xl flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <label>
                            <input
                                type="radio"
                                name="decision"
                                value="approve"
                                checked={decision === "approve"}
                                onChange={() => setDecision("approve")}
                            />
                            Odobri
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="decision"
                                value="reject"
                                checked={decision === "reject"}
                                onChange={() => setDecision("reject")}
                            />
                            Odbij
                        </label>
                    </div>

                    {/* Razlog za odbijanje */}
                    {decision === "reject" && (
                        <textarea
                            className="w-full p-2 border rounded"
                            placeholder="Unesi razlog za odbijanje kviza..."
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                        />
                    )}

                    {/* Finish */}
                    <button
                        className={`px-6 py-2 rounded font-semibold text-white ${decision ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
                            }`}
                        onClick={handleFinish}
                        disabled={!decision}
                    >
                        Finish
                    </button>
                </div>
            )}
        </div>
    );
};
