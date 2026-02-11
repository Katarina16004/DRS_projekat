import { useState } from "react";
import { FaFilePdf, FaEye, FaTrash } from "react-icons/fa";
import type { QuizDTO } from "../../../models/quizzes/QuizDTO";

interface Props {
    quizzes: QuizDTO[];
    onDelete: (id: number) => void;
    onDownloadPdf: (id: number) => void;
    onPreview: (id: number) => void;
}

const StatusBadge = ({ status }: { status: number }) => {
    const map: Record<number, { text: string; className: string }> = {
        0: { text: "Pending", className: "bg-yellow-100 text-yellow-700" },
        1: { text: "Approved", className: "bg-green-100 text-green-700" },
        2: { text: "Rejected", className: "bg-red-100 text-red-700" },
    };

    const badge = map[status] || { text: "Unknown", className: "bg-gray-100 text-gray-700" };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.className}`}>
            {badge.text}
        </span>
    );
};

export const AdminQuizzesForm = ({ quizzes, onDelete, onDownloadPdf, onPreview }: Props) => {
    const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

    const filteredQuizzes = quizzes.filter(q => {
        if (statusFilter === "all") return true;
        const map: Record<string, number> = { pending: 0, approved: 1, rejected: 2 };
        return q.Is_Accepted === map[statusFilter];
    });

    return (
        <div className="flex flex-col gap-4">
            {/* FILTER */}
            <div className="flex items-center gap-4 ml-auto">
                <span className="text-sm font-medium text-gray-600">Filter:</span>
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value as any)}
                    className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-sm font-medium cursor-pointer"
                >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            {/* LIST */}
            {filteredQuizzes.map(quiz => (
                <div
                    key={quiz.ID_Quiz}
                    className="bg-white rounded-xl shadow-sm px-5 py-4 hover:shadow-md transition flex flex-col gap-3"
                >
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">{quiz.Name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {quiz.Category} • {quiz.Quiz_length} min • {quiz.Number_Of_Questions} questions
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Author: {quiz.ID_User}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 font-medium">Status:</span>
                        <StatusBadge status={quiz.Is_Accepted} />
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-2 pt-2 border-t">
                        <button
                            title="Download PDF report"
                            onClick={() => onDownloadPdf(quiz.ID_Quiz)}
                            className="p-2 rounded-lg border hover:bg-gray-100 transition"
                        >
                            <FaFilePdf />
                        </button>

                        {quiz.Is_Accepted === 0 && (
                            <button
                                title="Review quiz"
                                onClick={() => onPreview(quiz.ID_Quiz)}
                                className="p-2 rounded-lg border hover:bg-blue-50 text-blue-600 transition"
                            >
                                <FaEye />
                            </button>
                        )}

                        <button
                            title="Delete quiz"
                            onClick={() => onDelete(quiz.ID_Quiz)}
                            className="p-2 rounded-lg border hover:bg-red-50 text-red-600 transition"
                        >
                            <FaTrash />
                        </button>
                    </div>
                </div>
            ))}

            {filteredQuizzes.length === 0 && (
                <p className="text-gray-500 text-center mt-10">No quizzes with selected status.</p>
            )}
        </div>
    );
};
