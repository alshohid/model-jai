"use client";

import { ReactNode, useState } from "react";
import MatchListToolbar from "../reusable/MatchListToolbar";
import ReuseAbleTable from "@/shared/UI/reusable/table/ReuseAbleTable";
import AppPagination from "../topComponent/AppPagination";
import { useClientPagination } from "../../hook/useClientPagination";
import { Button } from "@/components/ui/button";


type WithdrawRowItem = {
    id: number;
    user_name: string;
    withdraw_no: string;
    withdraw_amount: string; // keep string for "$312" format
    actions?: ""; // UI will render buttons
};

export const allItems: WithdrawRowItem[] = [
    { id: 1, user_name: "Cameron Williamson", withdraw_no: "sdagasgSDRG12513", withdraw_amount: "$312", actions: "" },
    { id: 2, user_name: "Leslie Alexander", withdraw_no: "asfasfdasf3251351", withdraw_amount: "$354", actions: "" },
    { id: 3, user_name: "Floyd Miles", withdraw_no: "afafaasfas351651", withdraw_amount: "$654", actions: "" },
    { id: 4, user_name: "Arlene McCoy", withdraw_no: "afafaasfas351651", withdraw_amount: "$913", actions: "" },
    { id: 5, user_name: "Jerome Bell", withdraw_no: "sdagasgSDRG12513", withdraw_amount: "$3254", actions: "" },
    { id: 6, user_name: "Ralph Edwards", withdraw_no: "sdagasgSDRG12513", withdraw_amount: "$156", actions: "" },
    { id: 7, user_name: "Guy Hawkins", withdraw_no: "asfasfdasf3251351", withdraw_amount: "$1022", actions: "" },
    { id: 8, user_name: "Eleanor Pena", withdraw_no: "asfasfdasf3251351", withdraw_amount: "$684", actions: "" },
    { id: 9, user_name: "Jacob Jones", withdraw_no: "afafaasfas351651", withdraw_amount: "$921", actions: "" },
    { id: 10, user_name: "Courtney Henry", withdraw_no: "asfasfdasf3251351", withdraw_amount: "$763", actions: "" },
    { id: 11, user_name: "Leslie Alexander", withdraw_no: "asfasfdasf3251351", withdraw_amount: "$354", actions: "" },
    { id: 12, user_name: "Floyd Miles", withdraw_no: "afafaasfas351651", withdraw_amount: "$654", actions: "" },
    { id: 13, user_name: "Arlene McCoy", withdraw_no: "afafaasfas351651", withdraw_amount: "$913", actions: "" },
    { id: 14, user_name: "Jerome Bell", withdraw_no: "sdagasgSDRG12513", withdraw_amount: "$3254", actions: "" },
    { id: 15, user_name: "Ralph Edwards", withdraw_no: "sdagasgSDRG12513", withdraw_amount: "$156", actions: "" },
    { id: 16, user_name: "Guy Hawkins", withdraw_no: "asfasfdasf3251351", withdraw_amount: "$1022", actions: "" },
    { id: 17, user_name: "Eleanor Pena", withdraw_no: "asfasfdasf3251351", withdraw_amount: "$684", actions: "" },
    { id: 18, user_name: "Jacob Jones", withdraw_no: "afafaasfas351651", withdraw_amount: "$921", actions: "" },
    { id: 19, user_name: "Courtney Henry", withdraw_no: "asfasfdasf3251351", withdraw_amount: "$763", actions: "" },
];


export default function WithdrawManagement() {
    const [matchType, setMatchType] = useState("all");
    const [limit] = useState(10);
    const tableHeader = ["User Name", "Withdraw No", "Withdraw Amount", "Actions"];
    const { currentItems, meta, setPage } = useClientPagination({
        items: allItems,
        limit,
        filterFn: (item) => {
            if (matchType === "all") return true;
            // TODO: item.type থাকবে তখন এখানে filter করবে
            return true;
        },
        resetKey: matchType,
    });

    const tableRowDataRenderers: ((item: WithdrawRowItem, index: number) => ReactNode)[] = [
        (item) => <span className="text-[#FFFFFF]">{item.user_name}</span>,
        (item) => <span className="text-[#FFFFFF]">{item.withdraw_no}</span>,
        (item) => <span className="text-[#FFFFFF]">{item.withdraw_amount}</span>,
        (item) => <span className="text-[#FFFFFF]">{
            <div className="flex items-center gap-2">
                <Button className="!bg-[#22CAAD] !text-white cursor-pointer">
                    Accept
                </Button>
                <Button className="!bg-[#EB3D4D] !text-white cursor-pointer">
                    Decline
                </Button>
            </div>
        }</span>,
    ];

    return (
        <div>
            <MatchListToolbar
                title="Withdraw List"
                ctaLabel="Create New User"
                showSelect={false}   
                onCreateMatch={() => console.log("create new User")}
            />

            <div className="py-10">
                <ReuseAbleTable
                    isLoadings={false}
                    currentItems={currentItems}
                    tableHeader={tableHeader}
                    tableRowDataRenderers={tableRowDataRenderers}
                    isBg={false}
                    minTableWidthPx={1320}
                    variant="rank-dark"
                />

                <div className="mt-6">
                    <AppPagination
                        meta={meta}
                        onPageChange={setPage}
                        showSummary={false}
                    />
                </div>
            </div>
        </div>
    );
}
