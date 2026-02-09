import { useState, useEffect, type FC } from "react";
import type { QuestionDTO } from "../../models/questions/QuestionDTO";
import type { QuizDTO } from "../../models/quizzes/QuizDTO";

interface Props {
    quiz: QuizDTO;
    question: QuestionDTO;
    onAnswer: (selectedAnswerId: number) => void;
    remainingTime: number;
}

export const GameQuestionsForm: FC<Props> = ({ quiz, question, onAnswer, remainingTime }) => {
    const answers = question.answers || [];

    // Timer u sekundama
    const [ remainingTimeLocal, setRemainingTime] = useState(quiz.Quiz_length * 60);

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingTime(prev => {
                if (prev <= 0) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
            {/* Naslov kviza i tajmer */}
            <div className="w-full flex justify-between items-center max-w-3xl">
                <h1 className="text-3xl font-bold text-gray-800 text-center">{quiz?.ID_Quiz || "Quiz"}</h1> {/**ide ime posle kad se doda */}
                <div className="px-3 py-1 bg-gray-100 rounded-lg text-gray-700 font-medium">
                    Time: {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, "0")}
                </div>
            </div>

            {/* Pitanje */}
            <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl w-full flex flex-col items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-800 text-center">{question.question_text}</h3>
                <p className="text-sm text-gray-500 text-center">{question.question_points} points</p>

                {/* Opcije */}
                <div className="flex flex-col gap-3 mt-4 w-full">
                    {answers.map(ans => (
                        <button
                            key={ans.answer_id}
                            onClick={() => ans.answer_id && onAnswer(ans.answer_id)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 hover:bg-blue-50 transition text-gray-800 font-medium text-center"
                        >
                            {ans.answer_text}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
