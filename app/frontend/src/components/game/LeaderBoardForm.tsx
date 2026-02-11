import { useEffect, useState } from "react";
import { userApi } from "../../api_services/users/UserAPIService";
import type { GameDTO } from "../../models/games/GameDTO";

interface LeaderBoardFormProps {
    games: GameDTO[];
    currentUserId?: number;
    token: string;
}

export const LeaderBoardForm: React.FC<LeaderBoardFormProps> = ({
    games,
    currentUserId,
    token
}) => {
    const [usernames, setUsernames] = useState<Record<number, string>>({});

    useEffect(() => {
        const fetchUsernames = async () => {
            const map: Record<number, string> = {};
            for (const game of games) {
                if (!map[game.ID_Player]) {
                    try {
                        const user = await userApi.getProfile(token, game.ID_Player);
                        map[game.ID_Player] = `${user.First_Name ?? "Unknown"} ${user.Last_Name ?? ""}`.trim();
                    } catch {
                        map[game.ID_Player] = "Unknown";
                    }
                }
            }
            setUsernames(map);
        };

        fetchUsernames();
    }, [games, token]);


    const sortedGames = [...games].sort((a, b) => b.Score - a.Score);

    return (
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-10">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                🏆 Leaderboard
            </h2>

            <div className="flex flex-col gap-4">
                {sortedGames.map((game, index) => {
                    const isCurrentUser = game.ID_Player === currentUserId;
                    const username = usernames[game.ID_Player] || "Loading...";

                    return (
                        <div
                            key={game.ID_Game}
                            className={`flex justify-between items-center px-6 py-4 rounded-2xl shadow-md 
                ${index === 0 ? "bg-yellow-200" :
                                    index === 1 ? "bg-gray-200" :
                                        index === 2 ? "bg-orange-200" :
                                            "bg-blue-100"} 
                ${isCurrentUser ? "ring-4 ring-green-500" : ""}`}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-xl font-bold">#{index + 1}</span>
                                <span className="font-semibold">{username}</span>
                            </div>

                            <div className="font-bold text-lg">{game.Score} pts</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
