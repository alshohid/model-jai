export interface IGameCreateResponse {
  status: boolean;
  message: string;
  data: IGame;
}
export interface IGame {
  id: number;
  name: string;
  category_id: string;
  image: string;
  created_at: string;
  updated_at: string;
  category: IGameCategory;
}
export interface IGameCategory {
  id: number;
  name: string;
}
export interface IGameListResponse {
  status: boolean;
  message: string;
  data: IGame[];
}

export interface IGameSingleResponse {
  status: boolean;
  message: string;
  data: IGame;
}

export interface IGameCreateParams {
  name: string;
  image: File;
  category_id: number;
}
