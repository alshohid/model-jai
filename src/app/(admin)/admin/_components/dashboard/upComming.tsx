"use client"

import UpcomingStreamSection, { UpcomingPlayer } from "./UpcomingStreamSection";
const players: UpcomingPlayer[] = [
    { id: "p1", label: "Player 1", name: "Camellio William", avatar: "/images/home/pro_1.jpg" },
    { id: "p2", label: "Player 2", name: "James Fabinihio", avatar: "/images/home/pro_2.jpg" },
];
const UpComming = () => {
    return (
        <div>
            <UpcomingStreamSection
                players={players}
                onConfirmWinner={() => console.log("confirm winner")}
                onUpdateLiveLink={() => console.log("update live link")}
                onViewPlayer={(id) => console.log("view", id)}
                onEditPlayer={(id) => console.log("edit", id)}
                onDeletePlayer={(id) => console.log("delete", id)}
            />
        </div>
    )
}
export default UpComming;