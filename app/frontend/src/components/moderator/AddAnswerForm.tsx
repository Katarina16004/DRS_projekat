import React, { useState } from "react";
import type { AnswerDTO } from "../../models/answers/AnswerDTO";
import type { QuestionDTO } from "../../models/questions/QuestionDTO";

interface AddAnswersFormProps {
    questions: QuestionDTO[];
    onNext: (answers: Record<number, AnswerDTO[]>) => void;
}

export const AddAnswersForm: React.FC<AddAnswersFormProps> = ({ questions, onNext }) => {
    // Čuvamo odgovore po pitanju: { question_index: [answers] }
    const [allAnswers, setAllAnswers] = useState<Record<number, AnswerDTO[]>>(
        () => {
            const initial: Record<number, AnswerDTO[]> = {};
            questions.forEach((q, idx) => {
                initial[idx] = [
                    { answer_id: 1, answer_text: "", answer_is_correct: false },
                    { answer_id: 2, answer_text: "", answer_is_correct: false },
                ];
            });
            return initial;
        }
    );

    const handleAnswerChange = (qIdx: number, aIdx: number, field: keyof AnswerDTO, value: any) => {
        setAllAnswers(prev => {
            const updated = { ...prev };
            updated[qIdx][aIdx] = { ...updated[qIdx][aIdx], [field]: value };
            return updated;
        });
    };

    const addAnswer = (qIdx: number) => {
        setAllAnswers(prev => {
            const updated = { ...prev };
            const newId = prev[qIdx].length + 1;
            updated[qIdx] = [...updated[qIdx], { answer_id: newId, answer_text: "", answer_is_correct: false }];
            return updated;
        });
    };

    return (
        <div className="max-w-3xl mx-auto p-6 flex flex-col gap-8">
            {questions.map((q, qIdx) => (
                <div key={qIdx} className="border p-4 rounded-md bg-white shadow-sm flex flex-col gap-4">
                    <h3 className="font-semibold text-gray-700">
                        {q.question_text || `Pitanje ${qIdx + 1}`}
                    </h3>

                    {allAnswers[qIdx].map((a, aIdx) => (
                        <div key={a.answer_id} className="flex items-center gap-4">
                            <input
                                type="text"
                                placeholder={`Odgovor ${aIdx + 1}`}
                                className="flex-1 border rounded px-2 py-1"
                                value={a.answer_text}
                                onChange={e => handleAnswerChange(qIdx, aIdx, "answer_text", e.target.value)}
                            />
                            <label className="flex items-center gap-1">
                                <input
                                    type="checkbox"
                                    checked={a.answer_is_correct}
                                    onChange={e => handleAnswerChange(qIdx, aIdx, "answer_is_correct", e.target.checked)}
                                />
                                Tačan
                            </label>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => addAnswer(qIdx)}
                        className="self-start px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                        + Dodaj odgovor
                    </button>
                </div>
            ))}

            <button
                type="button"
                onClick={() => onNext(allAnswers)}
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
                Dalje
            </button>
        </div>
    );
};
