// import  type { FC } from "react";
// import type { QuestionDTO } from "../../models/questions/QuestionDTO";
// import type { QuizDTO } from "../../models/quizzes/QuizDTO";

// interface Props {
//     quiz: QuizDTO;
//     question: QuestionDTO;
//     onAnswer: (selectedAnswerId: number) => void;
// }

// export const GameQuestionsForm: FC<Props> = ({ quiz, question, onAnswer }) => {
//     const answers = question.Answers || [];

//     return (
//         <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
//             {/* Naslov kviza i tajmer */}
//             <div className="w-full flex justify-between items-center max-w-3xl">
//                 <h1 className="text-3xl font-bold text-gray-800 text-center">{quiz?.Name || "Quiz"}</h1> {/**ide ime posle kad se doda */}
//             </div>

//             {/* Pitanje */}
//             <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl w-full flex flex-col items-center gap-3">
//                 <h3 className="text-lg font-semibold text-gray-800 text-center">{question.Question_Text}</h3>
//                 <p className="text-sm text-gray-500 text-center">{question.Question_Points} points</p>

//                 {/* Opcije */}
//                 <div className="flex flex-col gap-3 mt-4 w-full">
//                     {answers.map(ans => (
//                         <button
//                             key={ans.ID_Answer}
//                             onClick={() => ans.ID_Answer && onAnswer(ans.ID_Answer)}
//                             className="w-full px-4 py-3 rounded-lg border border-gray-300 hover:bg-blue-50 transition text-gray-800 font-medium text-center"
//                         >
//                             {ans.Answer_Text}
//                         </button>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };
