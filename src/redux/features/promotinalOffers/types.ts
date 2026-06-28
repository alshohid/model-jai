

export interface IPromotinalOffersData {
    prize: number,
    list: []
}

export interface IPromotinalOffersBaseResponse {
    success: boolean,
    message: string,

}
export interface IPromotinalOffersListResponse extends IPromotinalOffersBaseResponse {
    data: IPromotinalOffersData
}
export interface IAddPromotinalOffersResponse extends IPromotinalOffersListResponse { }
export interface IAddPromotinalOffersParams {
    prize: number,
    list: []
}