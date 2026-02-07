import type { QuizDTO } from "../../models/quizzes/QuizDTO";
import { Info } from "../admin/users/UserHelpers";

interface UserQuizCardProps {
    quiz: QuizDTO;
    onPlay: (id: number) => void;
}

export const UserQuizCard = ({ quiz, onPlay }: UserQuizCardProps) => {
    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 bg-white border border-[#E6E6FA] shadow-xl rounded-2xl px-10 py-8 mb-8 transition hover:shadow-2xl">

            {/* Icon */}
            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-[#f3f3f3] border border-gray-300 mb-4 md:mb-0">
                <img
                    src="brain.png"
                    alt="General"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Quiz Data */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-4 w-full">
                <Info label="Quiz name" value={quiz.name} />
                <Info label="Author" value={quiz.author} />
                <Info label="Category" value={quiz.category} />
                <Info label="Duration" value={`${quiz.duration} min`} />
                <Info label="Questions" value={quiz.numOfQuestions.toString()} />
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center gap-4 ml-0 md:ml-4">
                <button
                    className="px-6 py-2 rounded-xl bg-[#4451A4] text-white font-semibold hover:bg-[#2f397f] transition"
                    onClick={() => onPlay(quiz.id)}
                >
                    Play Quiz
                </button>
            </div>
        </div>
    );
};
