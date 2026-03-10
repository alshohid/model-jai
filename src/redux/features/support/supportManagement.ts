import { baseApi } from "@/redux/api/baseApi";
import { IBigBossSupporterResponse } from "@/types/support/supportmanagement";

const SupportManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBigBossSupporterRankingAllData: builder.query<
      IBigBossSupporterResponse,
      void
    >({
      query: () => ({
        url: `/bigboss-supporter`,
        method: "GET",
      }),
      providesTags: ["News"],
    }),
  }),

  overrideExisting: true,
});

export const { useGetBigBossSupporterRankingAllDataQuery } =
  SupportManagementApi;

export default SupportManagementApi;
