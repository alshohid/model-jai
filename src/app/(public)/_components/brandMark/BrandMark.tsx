export default function BrandMark() {
    return (
        <div className=" h-[42px]  flex items-center">
            <span
                className={[
                    "font-heading font-bold",
                    " text-[1.2rem] md:text-[2rem] leading-[132%] tracking-[0px]",
                    "bg-gradient-to-r from-brandGradStart to-brandGradEnd bg-clip-text text-transparent",
                ].join(" ")}
            >
                Model Bet Offers
            </span>
        </div>
    );
}
