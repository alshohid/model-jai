type Props = {
    title: string;
    className?: string;
};

export default function SectionHeading({ title, className = "" }: Props) {
    return (
        <h2
            className={[
                "text-white font-heading font-extrabold",
                "text-[28px] text-center sm:text-[40px] lg:text-[52px]",
                "leading-[120%] tracking-[0.5px]",
                className,
            ].join(" ")}
        >
            {title}
        </h2>
    );
}
