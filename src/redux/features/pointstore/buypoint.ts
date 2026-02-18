import { baseApi } from "@/redux/api/baseApi";
import { ApiResponse } from "@/types/common/api";

import { IBuyPointParams, IBuyPointResponse } from "@/types/user/point";

const BuyPointApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    buyPoint: builder.mutation<ApiResponse<IBuyPointResponse>, IBuyPointParams>(
      {
        query: (body) => ({
          url: "/checkout",
          method: "POST",
          body,
        }),
      },
    ),
  }),
  overrideExisting: false,
});

export const { useBuyPointMutation } = BuyPointApi;
export default BuyPointApi;
