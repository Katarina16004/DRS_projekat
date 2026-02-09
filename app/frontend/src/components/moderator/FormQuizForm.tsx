import { useState, useEffect } from "react";
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

    // ✅ Validacija preview-a
    const isValid = selectedQuestion &&
        selectedAnswers.length >= 2 &&
        selectedAnswers.some(a => a.answer_is_correct);

    // Dodavanje odgovora u preview
    const toggleAnswer = (answer: AnswerDTO) => {
        if (selectedAnswers.find(a => a.answer_id === answer.answer_id)) {
            setSelectedAnswers(prev => prev.filter(a => a.answer_id !== answer.answer_id));
        } else {
            setSelectedAnswers(prev => [...prev, answer]);
        }
    };

    // Submit trenutnog pitanja
    const handleSubmitQuestion = () => {
        if (!selectedQuestion) return;
        onSubmitQuestion(selectedQuestion, selectedAnswers);
        setSelectedQuestion(null);
        setSelectedAnswers([]);
    };

    return (
        <div className="flex gap-6 h-full p-4 font-poppins">
            {/* Levi panel - pitanja */}
            <div className="w-1/4 border-r border-gray-300 p-2 overflow-y-auto">
                <h3 className="font-semibold mb-2">Ponuđena pitanja</h3>
                {questions.length === 0 && <p className="text-gray-500">Nema više pitanja</p>}
                {questions.map(q => (
                    <div
                        key={q.question_id}
                        className={`p-2 mb-2 rounded cursor-pointer hover:bg-green-100 ${selectedQuestion?.question_id === q.question_id ? "bg-green-200" : ""
                            }`}
                        onClick={() => setSelectedQuestion(q)}
                    >
                        {q.question_text || "Novo pitanje"}
                    </div>
                ))}
            </div>

            {/* Centralni panel - preview */}
            <div className="w-1/2 border-r border-gray-300 p-2 flex flex-col">
                <h3 className="font-semibold mb-2">Preview pitanja</h3>
                {selectedQuestion ? (
                    <>
                        <div className="mb-2 font-semibold">{selectedQuestion.question_text}</div>
                        <div className="flex flex-col gap-2 mb-4">
                            {selectedAnswers.map(a => (
                                <div
                                    key={a.answer_id}
                                    className="p-2 border rounded flex justify-between items-center bg-gray-100"
                                >
                                    <span>{a.answer_text}</span>
                                    {a.answer_is_correct && <span className="text-green-600 font-bold">✔</span>}
                                </div>
                            ))}
                        </div>
                        {!isValid && (
                            <div className="text-red-500 text-sm mb-2">
                                Izaberi najmanje 2 odgovora i bar jedan tačan
                            </div>
                        )}
                        <button
                            className={`px-4 py-2 rounded text-white font-semibold ${isValid ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
                                }`}
                            onClick={handleSubmitQuestion}
                            disabled={!isValid}
                        >
                            Submit Question
                        </button>
                    </>
                ) : (
                    <p className="text-gray-500">Izaberi pitanje sa leve strane</p>
                )}
            </div>

            {/* Desni panel - odgovori */}
            <div className="w-1/4 p-2 overflow-y-auto">
                <h3 className="font-semibold mb-2">Ponuđeni odgovori</h3>
                {answers.map(a => (
                    <div
                        key={a.answer_id}
                        className={`p-2 mb-2 rounded cursor-pointer hover:bg-blue-100 ${selectedAnswers.find(s => s.answer_id === a.answer_id) ? "bg-blue-200" : ""
                            }`}
                        onClick={() => toggleAnswer(a)}
                    >
                        {a.answer_text}
                        {a.answer_is_correct && <span className="text-green-600 font-bold ml-2">✔</span>}
                    </div>
                ))}
            </div>
        </div>
    );
};
