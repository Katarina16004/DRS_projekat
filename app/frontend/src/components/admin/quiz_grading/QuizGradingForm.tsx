import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { QuizQuestionsDTO } from "../../../models/quizzes/QuizQuestionDTO";

interface QuizGradingFormProps {
    quizName: string;
    questions: QuizQuestionsDTO[];
    onFinish: (approved: boolean, reason?: string) => void;
}

export const QuizGradingForm = ({ questions, onFinish }: QuizGradingFormProps) => {
    const [decision, setDecision] = useState<"approve" | "reject" | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const navigate = useNavigate();

    const handleFinish = () => {
        if (!decision) return;
        onFinish(decision === "approve", decision === "reject" ? rejectReason : undefined);
        navigate("/admin/quizzes");
    };

    return (
        <div className="flex flex-col items-center p-6 font-poppins">
            {questions.map((quiz) =>
                quiz.Questions.map((q, index) => (
                    <div key={q.ID_Question} className="w-full max-w-3xl p-6 border rounded shadow mb-6">
                        <div className="font-semibold mb-2 text-lg">
                            {index + 1}. {q.Question_Text}
                        </div>
                        <div className="flex flex-col gap-2">
                            {q.Answers?.map(a => (
                                <div
                                    key={a.ID_Answer}
                                    className={`p-3 border rounded flex justify-between items-center transition
                                        ${a.Is_Correct ? "bg-green-100 border-green-500" : "bg-gray-50 border-gray-200"}
                                    `}
                                >
                                    <span>{a.Answer_Text}</span>
                                    {a.Is_Correct && (
                                        <span className="text-green-600 font-bold">✔ Correct</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}

            {/* Approve / Reject */}
            <div className="w-full max-w-3xl flex flex-col gap-4 mt-4">
                <div className="flex items-center gap-6 mb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="decision"
                            value="approve"
                            checked={decision === "approve"}
                            onChange={() => setDecision("approve")}
                            className="accent-green-500"
                        />
                        <span className="font-semibold text-green-700">Approve</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="decision"
                            value="reject"
                            checked={decision === "reject"}
                            onChange={() => setDecision("reject")}
                            className="accent-red-500"
                        />
                        <span className="font-semibold text-red-700">Reject</span>
                    </label>
                </div>

                {decision === "reject" && (
                    <textarea
                        className="w-full p-3 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
                        placeholder="Unesi razlog za odbijanje kviza..."
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
                        rows={4}
                    />
                )}

                <button
                    className={`px-6 py-2 rounded font-semibold text-white transition
                        ${decision ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"}
                    `}
                    onClick={handleFinish}
                    disabled={!decision}
                >
                    Finish Review
                </button>
            </div>
        </div>
    );
};
