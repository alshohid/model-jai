export default function BrandMark() {
    return (
        <div className="w-[278px] h-[42px] flex items-center">
            <span
                className={[
                    "font-heading font-bold",
                    "text-[32px] leading-[132%] tracking-[0px]",
                    "bg-gradient-to-r from-brandGradStart to-brandGradEnd bg-clip-text text-transparent",
                ].join(" ")}
            >
                Model Boss Offers
            </span>
        </div>
    );
}
