import PublicNavbar from "@/app/(public)/_components/publicNavbar/PublicNavbar";
import TransactionsContainer from "@/shared/components/transactions/TransactionsContainer";

export default function TransactionsPage() {
    return <div>
        <PublicNavbar />
        <div className="container w-full py-6 sm:px-6 min-w-0">
            <TransactionsContainer />
        </div>
    </div>;
}