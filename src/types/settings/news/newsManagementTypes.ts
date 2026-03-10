export type NewsStatus = "published" | "draft";

export interface INews {
  id: number;
  title: string;
  description: string;
  image: string | null;
  status: NewsStatus;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface INewsMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
  has_next?: boolean;
  has_prev?: boolean;
}

export interface INewsListResponse {
  success: boolean;
  message: string;
  data: INews[];
  meta: INewsMeta;
}

export interface INewsSingleResponse {
  success: boolean;
  message: string;
  data: INews;
}

export interface ICreateNewsPayload {
  title: string;
  description: string;
  status: NewsStatus;
  is_featured: boolean;
  image?: File;
}

export interface INewsCreateResponse {
  success: boolean;
  message: string;
  data: INews;
}

export interface IUpdateNewsPayload {
  id: number;
  title?: string;
  description?: string;
  status?: NewsStatus;
  is_featured?: boolean;
}

export interface INewsUpdateResponse {
  success: boolean;
  message: string;
  data: INews;
}

export interface IDeleteNewsResponse {
  success: boolean;
  message: string;
  data: [];
}
