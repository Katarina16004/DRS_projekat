import { useState } from "react";
import type { QuestionDTO } from "../../models/questions/QuestionDTO";
import type { AnswerDTO } from "../../models/answers/AnswerDTO";

interface FormQuizFormProps {
    questions: QuestionDTO[];
    answers: AnswerDTO[];
    onSubmitQuestion: (question: QuestionDTO, selectedAnswers: AnswerDTO[]) => void;
    onSendQuiz: () => void;
}

export const FormQuizForm = ({
    questions,
    answers,
    onSubmitQuestion,
    onSendQuiz
}: FormQuizFormProps) => {

    const [selectedQuestion, setSelectedQuestion] = useState<QuestionDTO | null>(null);
    const [selectedAnswers, setSelectedAnswers] = useState<AnswerDTO[]>([]);

    const isValid =
        selectedQuestion &&
        selectedAnswers.length >= 2 &&
        selectedAnswers.some(a => a.answer_is_correct);

    /* -------------------- ANSWERS -------------------- */

    const toggleAnswer = (answer: AnswerDTO) => {
        if (selectedAnswers.find(a => a.answer_id === answer.answer_id)) {
            setSelectedAnswers(prev =>
                prev.filter(a => a.answer_id !== answer.answer_id)
            );
        } else {
            setSelectedAnswers(prev => [...prev, answer]);
        }
    };

    const updateAnswerText = (id: number, text: string) => {
        const updated = selectedAnswers.map(a =>
            a.answer_id === id ? { ...a, answer_text: text } : a
        );
        setSelectedAnswers(updated);
    };

    /* -------------------- SUBMIT QUESTION -------------------- */

    const handleSubmitQuestion = () => {
        if (!selectedQuestion) return;
        onSubmitQuestion(selectedQuestion, selectedAnswers);
        setSelectedQuestion(null);
        setSelectedAnswers([]);
    };

    /* -------------------- UI -------------------- */

    return (
        <div className="flex gap-6 h-full p-4 font-poppins">

            {/* ---------------- LEFT PANEL – QUESTIONS ---------------- */}
            <div className="w-1/4 border-r border-gray-300 p-2 overflow-y-auto">
                <h3 className="font-semibold mb-2">Pitanja</h3>

                {questions.map(q => (
                    <div
                        key={q.question_id}
                        className={`p-2 mb-2 rounded cursor-pointer hover:bg-green-100 ${
                            selectedQuestion?.question_id === q.question_id
                                ? "bg-green-200"
                                : ""
                        }`}
                        onClick={() => setSelectedQuestion(q)}
                    >
                        {q.question_text || "Novo pitanje"}
                    </div>
                ))}

                {questions.length === 0 && (
                    <p className="text-gray-500">Nema pitanja</p>
                )}
            </div>

            {/* ---------------- CENTER PANEL – EDIT / PREVIEW ---------------- */}
            <div className="w-1/2 border-r border-gray-300 p-2 flex flex-col">
                <h3 className="font-semibold mb-2">Edit pitanja</h3>

                {selectedQuestion ? (
                    <>
                        {/* EDIT QUESTION TEXT */}
                        <input
                            className="border rounded p-2 mb-3 font-semibold"
                            value={selectedQuestion.question_text}
                            placeholder="Unesi tekst pitanja"
                            onChange={e =>
                                setSelectedQuestion({
                                    ...selectedQuestion,
                                    question_text: e.target.value
                                })
                            }
                        />

                        {/* PREVIEW ANSWERS */}
                        <div className="flex flex-col gap-2 mb-4">
                            {selectedAnswers.map(a => (
                                <div
                                    key={a.answer_id}
                                    className="p-2 border rounded flex items-center gap-2 bg-gray-100"
                                >
                                    <input
                                        className="flex-1 border rounded p-1"
                                        value={a.answer_text}
                                        onChange={e =>
                                            updateAnswerText(a.answer_id, e.target.value)
                                        }
                                    />

                                    {a.answer_is_correct && (
                                        <span className="text-green-600 font-bold">✔</span>
                                    )}
                                </div>
                            ))}
                        </div>

                        {!isValid && (
                            <div className="text-red-500 text-sm mb-2">
                                Izaberi minimum 2 odgovora i bar jedan tačan
                            </div>
                        )}

                        <button
                            className={`px-4 py-2 rounded text-white font-semibold ${
                                isValid
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "bg-gray-400 cursor-not-allowed"
                            }`}
                            disabled={!isValid}
                            onClick={handleSubmitQuestion}
                        >
                            Sačuvaj pitanje
                        </button>
                    </>
                ) : (
                    <p className="text-gray-500">Izaberi pitanje sa leve strane</p>
                )}
            </div>

            {/* ---------------- RIGHT PANEL – ANSWERS ---------------- */}
            <div className="w-1/4 p-2 overflow-y-auto">
                <h3 className="font-semibold mb-2">Odgovori</h3>

                {answers.map(a => (
                    <div
                        key={a.answer_id}
                        className={`p-2 mb-2 rounded cursor-pointer hover:bg-blue-100 ${
                            selectedAnswers.find(s => s.answer_id === a.answer_id)
                                ? "bg-blue-200"
                                : ""
                        }`}
                        onClick={() => toggleAnswer(a)}
                    >
                        {a.answer_text}
                        {a.answer_is_correct && (
                            <span className="text-green-600 font-bold ml-2">✔</span>
                        )}
                    </div>
                ))}

                <button
                    className="w-full mt-4 bg-indigo-600 text-white rounded py-2 font-semibold"
                    onClick={onSendQuiz}
                >
                    Pošalji kviz na pregled
                </button>
            </div>
        </div>
    );
};
