export interface IGameCategoryResponse {
  success: boolean;
  message: string;
  data: IGameCategoryData[];
  meta: {
    currentPage: number;
    from: number;
    lastPage: number;
    links: {
      url?: string;
      label: string;
      page?: number;
      active: boolean;
    }[];
    path: string;
    perPage: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface IGameCategorySingleResponse {
  success: boolean;
  message: string;
  data: IGameCategoryData;
}

export interface IGameCategoryData {
  id: number;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface IGameCategoryCreateParams {
  name: string;
  image: string;
}
