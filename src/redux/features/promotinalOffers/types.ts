/* eslint-disable @typescript-eslint/no-empty-object-type */

export interface IPromotionalOffersData {
  prize: number;
  list: [];
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
  list: [];
}
