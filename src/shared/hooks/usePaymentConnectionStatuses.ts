import { useMemo } from "react";

import { useGetPaymentStatusQuery } from "@/redux/features/pointstore/buypoint";
import {
    getPaymentMethodIdentifier,
    PAYMENT_METHODS,
} from "@/shared/constants/paymentMethods";
import { PaymentMethodId } from "@/types/user/point";

type UsePaymentConnectionStatusesOptions = {
    enabled?: boolean;
};

export function usePaymentConnectionStatuses(
    options: UsePaymentConnectionStatusesOptions = {}
) {
    const { enabled = true } = options;

    const paypalQuery = useGetPaymentStatusQuery("paypal", { skip: !enabled });
    const moncashQuery = useGetPaymentStatusQuery("moncash", { skip: !enabled });
    const bitpayQuery = useGetPaymentStatusQuery("bitpay", { skip: !enabled });
    const stripeQuery = useGetPaymentStatusQuery("stripe", { skip: !enabled });

    return useMemo(() => {
        const queryMap = {
            paypal: paypalQuery,
            moncash: moncashQuery,
            bitpay: bitpayQuery,
            stripe: stripeQuery,
        };

        const allMethods = PAYMENT_METHODS.map((method) => {
            const query = queryMap[method.id];
            const status = query.data;
            const connected = Boolean(status?.connected);

            return {
                method,
                status,
                connected,
                identifier: getPaymentMethodIdentifier(method.id, status),
                isLoading: query.isLoading,
                isFetching: query.isFetching,
                refetch: query.refetch,
            };
        });

        const connectedMethods = allMethods.filter((item) => item.connected);
        const connectedMethodIds = connectedMethods.map(
            (item) => item.method.id
        ) as PaymentMethodId[];

        return {
            allMethods,
            connectedMethods,
            connectedMethodIds,
            hasConnectedMethods: connectedMethods.length > 0,
            isLoadingAny: allMethods.some(
                (item) => item.isLoading || item.isFetching
            ),
        };
    }, [bitpayQuery, moncashQuery, paypalQuery, stripeQuery]);
}
