import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { NavbarForm } from "../../components/navbar/NavBarForm";
import { LeaderBoardForm } from "../../components/game/LeaderBoardForm";
import { GameAPIService } from "../../api_services/games/GameAPIService";

import type { GameDTO } from "../../models/games/GameDTO";

export default function LeaderBoardPage() {
    const token = localStorage.getItem("token") || "";
    const { quizId } = useParams<{ quizId: string }>();

    const [games, setGames] = useState<GameDTO[]>([]);
    const [navBarUser, setNavBarUser] = useState<any>(null);
    const [currentUserId, setCurrentUserId] = useState<number>();

    useEffect(() => {
        if (!token || !quizId) return;

        try {
            const decoded: any = jwtDecode(token);
            setNavBarUser({ username: decoded.username, role: decoded.role });
            setCurrentUserId(decoded.id);
        } catch {
            setNavBarUser({ username: "", role: "user" });
        }

        const fetchLeaderboard = async () => {
            try {
                const data = await GameAPIService.get_games_from_quiz(
                    token,
                    Number(quizId)
                );
                setGames(data);
            } catch (err) {
                console.error("Failed to fetch leaderboard:", err);
            }
        };

        fetchLeaderboard();
    }, [token, quizId]);

    return (
        <div className="min-h-screen font-poppins flex flex-col">

            <NavbarForm
                user={navBarUser}
                onLogout={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                }}
            />

            <div
                className="flex-1 w-full flex justify-center items-start pt-20 pb-16"
                style={{
                    background:
                        "linear-gradient(135deg, #C3FDB8 0%, #FFF8C6 50%, #BDEDFF 100%)",
                }}
            >
                <LeaderBoardForm
                    games={games}
                    currentUserId={currentUserId} token={""}                />
            </div>
        </div>
    );
}
