import React, { useState } from "react";
import type { QuestionDTO } from "../../models/questions/QuestionDTO";

interface Props {
    onNext: (questions: QuestionDTO[]) => void; // poziva se kada klikne "Dalje"
}

export const AddQuestionsForm: React.FC<Props> = ({ onNext }) => {
    const [questions, setQuestions] = useState<QuestionDTO[]>([
        { question_text: "", question_points: 0, answers: [] },
        { question_text: "", question_points: 0, answers: [] },
    ]);

    const handleChange = (index: number, field: keyof QuestionDTO, value: any) => {
        const updated = [...questions];
        updated[index] = { ...updated[index], [field]: value };
        setQuestions(updated);
    };

    const addQuestion = () => {
        setQuestions([...questions, { question_text: "", question_points: 0, answers: [] }]);
    };

    const handleNext = () => {
        onNext(questions);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4 gap-6">
            <h2 className="text-2xl font-semibold text-gray-800">Add Questions</h2>

            {questions.map((q, idx) => (
                <div
                    key={idx}
                    className="bg-white shadow-md rounded-xl p-4 w-full max-w-3xl flex flex-col gap-3"
                >
                    <h3 className="font-semibold text-gray-700">Question {idx + 1}</h3>

                    <textarea
                        value={q.question_text || ""}
                        onChange={(e) => handleChange(idx, "question_text", e.target.value)}
                        placeholder="Enter question text"
                        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                        rows={3}
                    />

                    <div className="flex gap-4">
                        <input
                            type="number"
                            min={0}
                            value={q.question_points || 0}
                            onChange={(e) => handleChange(idx, "question_points", parseInt(e.target.value))}
                            placeholder="Points"
                            className="border rounded px-3 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <input
                            type="number"
                            min={1}
                            value={q.answers?.length || 1}
                            onChange={(e) =>
                                handleChange(idx, "answers", new Array(parseInt(e.target.value)).fill({ answer_text: "", is_correct: true }))
                            }
                            placeholder="Number of correct answers"
                            className="border rounded px-3 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>
                </div>
            ))}

            {/* Dugme za dodavanje pitanja */}
            <button
                onClick={addQuestion}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
            >
                + Add Question
            </button>

            {/* Dugme za dalje */}
            <button
                onClick={handleNext}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
            >
                Dalje
            </button>
        </div>
    );
};
