import React, { useState } from "react";

interface Props {
    onNext: (quizData: { name: string; category: string; duration: number }) => void;
}

export const AddQuizHomeForm: React.FC<Props> = ({ onNext }) => {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [duration, setDuration] = useState(10); // neki default 10 min

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !category || duration <= 0) {
            alert("Please fill all fields correctly");
            return;
        }

        onNext({ name, category, duration });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-4"
            >
                <h2 className="text-2xl font-semibold text-gray-800 text-center">Create New Quiz</h2>

                <div className="flex flex-col">
                    <label htmlFor="name" className="mb-1 font-medium text-gray-700">
                        Quiz Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                        placeholder="Enter quiz name"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="category" className="mb-1 font-medium text-gray-700">
                        Category
                    </label>
                    <input
                        type="text"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                        placeholder="Enter category"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="duration" className="mb-1 font-medium text-gray-700">
                        Duration (minutes)
                    </label>
                    <input
                        type="number"
                        id="duration"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                        min={1}
                    />
                </div>

                <button
                    type="submit"
                    className="mt-4 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
                >
                    Next: Add Questions
                </button>
            </form>
        </div>
    );
};
