import { useState } from "react";
import toast from "react-hot-toast";
import type { QuizQuestionsDTO } from "../../models/quizzes/QuizQuestionDTO";
import type { QuestionDTO } from "../../models/questions/QuestionDTO";

interface ModeratorEditFormProps {
    quizName: string;
    questions: QuizQuestionsDTO[]; // niz kvizova sa pitanjima (obično jedan kviz)
    onFinish: (updatedQuestions: { id: number; text: string; points: number }[]) => void;
}

export const ModeratorEditForm: React.FC<ModeratorEditFormProps> = ({ quizName, questions, onFinish }) => {
    // Flatten pitanja u lokalni state za edit
    const [editedQuestions, setEditedQuestions] = useState(
        questions.flatMap(q => q.Questions.map((ques: QuestionDTO) => ({
            id: ques.ID_Question,
            text: ques.Question_Text,
            points: ques.Question_Points
        })))
    );

    const handleChange = (id: number, field: "text" | "points", value: string) => {
        setEditedQuestions(prev =>
            prev.map(q =>
                q.id === id ? { ...q, [field]: field === "points" ? Number(value) : value } : q
            )
        );
    };

    const handleFinish = () => {
        if (!editedQuestions.length) return;
        if (confirm("Are you sure you want to finish editing this quiz?")) {
            onFinish(editedQuestions);
            toast.success("Quiz edited successfully!");
        }
    };

    return (
        <div className="flex flex-col items-center p-6 font-poppins">
            <h2 className="text-2xl font-bold mb-6">{quizName} - Edit Questions</h2>

            {editedQuestions.map((q, index) => (
                <div key={q.id} className="w-full max-w-3xl p-6 border rounded shadow mb-6">
                    <div className="font-semibold mb-2 text-lg">Question {index + 1}</div>
                    <input
                        type="text"
                        value={q.text}
                        onChange={e => handleChange(q.id, "text", e.target.value)}
                        className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="number"
                        value={q.points}
                        min={1}
                        onChange={e => handleChange(q.id, "points", e.target.value)}
                        className="w-32 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
            ))}

            <button
                className="px-6 py-2 mt-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition"
                onClick={handleFinish}
            >
                Finish Editing
            </button>
        </div>
    );
};
