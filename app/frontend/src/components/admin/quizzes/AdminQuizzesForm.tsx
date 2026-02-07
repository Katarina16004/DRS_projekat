import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
    FaFilePdf,
    FaEye,
    FaTrash,
    FaCheck,
    FaTimes
} from "react-icons/fa";
import type { QuizStatus } from "../../../enums/quiz/QuizStatus";

interface AdminQuiz {
    id: number;
    name: string;
    category: string;
    duration: number;
    numOfQuestions: number;
    author: string;
    status: QuizStatus;
}

interface Props {
    quizzes: AdminQuiz[];
    onDelete: (id: number) => void;
    onApprove: (id: number) => void;
    onReject: (id: number) => void;
    onDownloadPdf: (id: number) => void;
}

const StatusBadge = ({ status }: { status: QuizStatus }) => {
    const map: Record<QuizStatus, string> = {
        pending: "bg-yellow-100 text-yellow-700",
        approved: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-700",
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status]}`}>
            {status}
        </span>
    );
};

export const AdminQuizzesForm = ({
    quizzes,
    onDelete,
    onApprove,
    onReject,
    onDownloadPdf,
}: Props) => {
    const [statusFilter, setStatusFilter] = useState<QuizStatus | "all">("all");

    const filteredQuizzes =
        statusFilter === "all"
            ? quizzes
            : quizzes.filter(q => q.status === statusFilter);

    return (
        <div className="flex flex-col gap-4">

            {/* FILTER */}
            <div className="flex items-center gap-4 ml-auto">
                <span className="text-sm font-medium text-gray-600">Filter:</span>
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value as any)}
                    className="px-4 py-2 rounded-xl border border-gray-300 bg-white
                   text-sm font-medium cursor-pointer"
                >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            {/* LISTA */}
            {filteredQuizzes.map(quiz => (
                <div
                    key={quiz.id}
                    className="bg-white rounded-xl shadow-sm px-5 py-4
               hover:shadow-md transition flex flex-col gap-3"
                >
                    {/* 1️⃣ INFO */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            {quiz.name}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                            {quiz.category} • {quiz.duration} min • {quiz.numOfQuestions} questions
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                            Author: {quiz.author}
                        </p>
                    </div>

                    {/* 2️⃣ STATUS */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 font-medium">
                            Status:
                        </span>
                        <StatusBadge status={quiz.status} />
                    </div>

                    {/* 3️⃣ ACTIONS */}
                    <div className="flex justify-end gap-2 pt-2 border-t">
                        <button
                            title="Download PDF report"
                            onClick={() => onDownloadPdf(quiz.id)}
                            className="p-2 rounded-lg border hover:bg-gray-100 transition"
                        >
                            <FaFilePdf />
                        </button>

                        <NavLink
                            to={`/admin/quizzes/${quiz.id}/preview`}
                            title="Preview quiz"
                            className="p-2 rounded-lg border hover:bg-blue-50 text-blue-600 transition"
                        >
                            <FaEye />
                        </NavLink>

                        {quiz.status === "pending" && (
                            <>
                                <button
                                    title="Approve quiz"
                                    onClick={() => onApprove(quiz.id)}
                                    className="p-2 rounded-lg border hover:bg-green-50 text-green-600 transition"
                                >
                                    <FaCheck />
                                </button>

                                <button
                                    title="Reject quiz"
                                    onClick={() => onReject(quiz.id)}
                                    className="p-2 rounded-lg border hover:bg-yellow-50 text-yellow-600 transition"
                                >
                                    <FaTimes />
                                </button>
                            </>
                        )}

                        <button
                            title="Delete quiz"
                            onClick={() => onDelete(quiz.id)}
                            className="p-2 rounded-lg border hover:bg-red-50 text-red-600 transition"
                        >
                            <FaTrash />
                        </button>
                    </div>
                </div>
            ))}


            {filteredQuizzes.length === 0 && (
                <p className="text-gray-500 text-center mt-10">
                    No quizzes with selected status.
                </p>
            )}
        </div>
    );
};
