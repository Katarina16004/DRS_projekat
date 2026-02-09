import type { GameDTO } from "../../models/games/GameDTO";

export interface IGameAPIService{
    get_all_games(token:string):Promise<GameDTO[]>;
    get_game(token:string, ID_Game:number):Promise<GameDTO>;
    get_games_from_player(token:string,ID_Player:number):Promise<GameDTO[]>
    get_n_highest_scores(token: string, n:number):Promise<GameDTO[]>
    get_games_from_quiz(token:string, ID_Quiz:number):Promise<GameDTO[]>
}