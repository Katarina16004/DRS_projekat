import axios from "axios";
import type { GameDTO } from "../../models/games/GameDTO";
import type { IGameAPIService } from "./IGameAPIService";

const API_URL = import.meta.env.VITE_SERVER

export const GameAPIService: IGameAPIService = {
    async get_all_games(token: string): Promise<GameDTO[]> {
        try {
            const res = await axios.get<GameDTO[]>(
                `${API_URL}games/all`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            return res.data
        }
        catch (error) {
            console.error("Error while trying to finish Quiz", error)
            throw error
        }
    },
    async get_game(token: string, ID_Game: number): Promise<GameDTO> {
        try {
            const res = await axios.get<GameDTO>(
                `${API_URL}games/${ID_Game}/game`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            return res.data
        }
        catch (error) {
            console.error("Error while trying to finish Quiz", error)
            throw error
        }
    },
    async get_games_from_player(token: string, ID_Player: number): Promise<GameDTO[]> {
        try {
            const res = await axios.get<GameDTO[]>(
                `${API_URL}games/${ID_Player}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            return res.data
        }
        catch (error) {
            console.error("Error while trying to finish Quiz", error)
            throw error
        }
    },
    async get_n_highest_scores(token: string, n: number): Promise<GameDTO[]> {
        try {
            const res = await axios.get<GameDTO[]>(
                `${API_URL}/games/highest/${n}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            return res.data
        }
        catch (error) {
            console.error("Error while trying to finish Quiz", error)
            throw error
        }
    },

    async get_games_from_quiz(token: string, ID_Quiz: number): Promise<GameDTO[]> {
        try {
            const res = await axios.get<GameDTO[]>(
                `${API_URL}games/quiz/${ID_Quiz}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            return res.data
        }
        catch (error) {
            console.error("Error while trying to finish Quiz", error)
            throw error
        }
    }
}
