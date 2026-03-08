export interface IGallery {
  id: number;
  short_video: string;
  short_video_thumb: string;
  description: string;
  is_featured: boolean;
  created_at: string;
}

export interface IGalleryMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface IGalleryListResponse {
  success: boolean;
  message: string;
  data: IGallery[];
  meta: IGalleryMeta;
}

export interface IGallerySingleResponse {
  success: boolean;
  message: string;
  data: IGallery;
}

export interface ICreateGalleryPayload {
  short_video: File;
  short_video_thumb: File;
  description: string;
  is_featured: number;
}

export interface IGalleryCreateResponse {
  success: boolean;
  message: string;
  data: IGallery;
}

export interface IUpdateGalleryPayload {
  id: number;
  short_video?: File;
  short_video_thumb?: File;
  description?: string;
  is_featured?: number;
}

export interface IGalleryUpdateResponse {
  success: boolean;
  message: string;
  data: IGallery;
}

export interface IDeleteGalleryResponse {
  success: boolean;
  message: string;
  data: [];
}
