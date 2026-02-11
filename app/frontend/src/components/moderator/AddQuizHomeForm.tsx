import { useState } from "react";
import toast from "react-hot-toast";

interface AddQuizHomeFormProps {
    onNext: (quizData: { name: string; category: string; duration: number }) => void;
}

export function AddQuizHomeForm({ onNext }: AddQuizHomeFormProps) {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [duration, setDuration] = useState(10);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Quiz name is required!");
            return;
        }

        if (!category.trim()) {
            toast.error("Category is required!");
            return;
        }

        if (duration < 1) {
            toast.error("Duration must be at least 1 minute!");
            return;
        }

        onNext({ name, category, duration });
    };

    return (
        <div
            className="flex-1 w-full pt-20 pb-16 flex flex-col items-center"
            style={{ background: "linear-gradient(135deg, #C3FDB8 0%, #FFF8C6 50%, #BDEDFF 100%)" }}
        >
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    Create New Quiz
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Quiz Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Quiz Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter quiz name"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Select category</option>
                            <option value="Math">Math</option>
                            <option value="Science">Science</option>
                            <option value="History">History</option>
                            <option value="Geography">Geography</option>
                            <option value="Programming">Programming</option>
                            <option value="General Knowledge">General Knowledge</option>
                        </select>
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Duration (minutes)
                        </label>
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            min="1"
                            max="180"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Next Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition"
                    >
                        Next: Add Questions
                    </button>
                </form>
            </div>
        </div>
    );
}