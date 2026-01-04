import MatchCard from "../card/MatchCard";




export default function MatchesGrid() {
    return (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <MatchCard
                status="Upcoming"
                title="ShadowR vs Phoenix Force"
                dateText="November 1, 2024"
                timeText="4:30 pm"
                gameLogoSrc="/images/home/gameLogoSrc.png"
                leftPlayerImg="/images/home/leftPlayerImg.png"
                rightPlayerImg="/images/home/rightPlayerImg.png"
                watchHref="/matches/1"
                voteRequired
                versusImg="/images/home/versus.png"
            />
        </div>
    );
}
