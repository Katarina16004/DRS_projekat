import React from "react";
import type { QuizDTO } from "../../models/quizzes/QuizDTO";

interface Props {
    quizzes: QuizDTO[];
    onEdit: (quizId: number) => void;
    onDelete: (quizId: number) => void;
    onCreate: () => void;
}

export const ModeratorQuizzesForm: React.FC<Props> = ({ quizzes, onEdit, onDelete, onCreate }) => {
    return (
        <div className="flex-1 pt-6 pb-16 px-6">
            {/* Dugme za kreiranje kviza */}
            <div className="flex justify-end mb-6">
                <button
                    onClick={onCreate}
                    className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition cursor-pointer"
                >
                    <span className="text-xl font-bold">+</span> Create Quiz
                </button>
            </div>

            {/* Lista kvizova */}
            <div className="flex flex-col gap-6">
                {quizzes.map((quiz) => (
                    <div
                        key={quiz.ID_Quiz}
                        className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 bg-white border border-gray-200 shadow-md rounded-2xl px-10 py-8 transition hover:shadow-xl"
                    >
                        {/* Icon */}
                        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-[#f3f3f3] border border-gray-300 mb-4 md:mb-0">
                            <img
                                src="/brain.png"
                                alt="Quiz"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Quiz Data */}
                        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-4 w-full">
                            <div>
                                <p className="text-gray-500 text-sm">Quiz Name</p>
                                <p className="font-semibold text-gray-800">{quiz.Name}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Category</p>
                                <p className="font-semibold text-gray-800">{quiz.Category}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Duration</p>
                                <p className="font-semibold text-gray-800">{quiz.Quiz_length} min</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Status</p>
                                <p className={`font-semibold ${quiz.Is_Accepted === 1
                                        ? "text-green-600"
                                        : quiz.Is_Accepted === 0
                                            ? "text-yellow-600"
                                            : "text-red-600"
                                    }`}>
                                    {quiz.Is_Accepted === 1
                                        ? "Accepted"
                                        : quiz.Is_Accepted === 0
                                            ? "Pending"
                                            : "Rejected"}
                                </p>
                                {quiz.Rejection_Reason && (
                                    <p className="text-red-500 text-sm mt-1">Reason: {quiz.Rejection_Reason}</p>
                                )}
                            </div>
                        </div>

                        {/* Dugmad */}
                        <div className="flex flex-col md:flex-row items-center gap-3 mt-4 md:mt-0">
                            <button
                                onClick={() => onEdit(quiz.ID_Quiz)}
                                className="px-6 py-2 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition cursor-pointer"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(quiz.ID_Quiz)}
                                className="px-6 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {quizzes.length === 0 && (
                    <p className="text-gray-500 col-span-full text-center mt-10">
                        You have not created any quizzes yet.
                    </p>
                )}
            </div>
        </div>
    );
};
