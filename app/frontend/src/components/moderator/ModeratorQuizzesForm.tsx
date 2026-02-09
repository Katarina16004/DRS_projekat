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
        <div className="flex-1 pt-6 pb-16 px-6 bg-gray-50">
            {/* Dugme za kreiranje kviza */}
            <div className="flex justify-end mb-6">
                <button
                    onClick={onCreate}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                    Create New Quiz
                </button>
            </div>

            {/* Lista kvizova */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz) => (
                    <div key={quiz.ID_Quiz} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
                        <h3 className="font-semibold text-lg">{quiz.Name}</h3>
                        <p>Category: {quiz.Category}</p>
                        <p>Duration: {quiz.Quiz_length} min</p>
                        <p>
                            Status:{" "}
                            {quiz.Is_Accepted === 1
                                ? "Accepted"
                                : quiz.Is_Accepted === 0
                                    ? "Pending"
                                    : "Rejected"}
                        </p>
                        {quiz.Rejection_Reason && (
                            <p className="text-red-500 text-sm">Reason: {quiz.Rejection_Reason}</p>
                        )}

                        {/* Dugmad */}
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => onEdit(quiz.ID_Quiz)}
                                className="flex-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(quiz.ID_Quiz)}
                                className="flex-1 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
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
