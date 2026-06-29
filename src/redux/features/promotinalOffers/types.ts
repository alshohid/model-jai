/* eslint-disable @typescript-eslint/no-empty-object-type */

export interface IPromotionalOffersData {
  prize: number;
  list: string[];
}

export interface IPromotionalOffersBaseResponse {
  success: boolean;
  message: string;
}
export interface IPromotionalOffersListResponse extends IPromotionalOffersBaseResponse {
  data: IPromotionalOffersData;
}
export interface IAddPromotionalOffersResponse extends IPromotionalOffersListResponse {}
export interface IAddPromotionalOffersParams {
  prize: number;
  list: string[];
}
