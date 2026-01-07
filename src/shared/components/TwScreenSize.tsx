

export function isDevEnv() {
    // return process.env.NODE_ENV === "development";
    return true
}


export const TwScreenSize = () => {
    if (!isDevEnv()) {
        return null;
    }

    return (
        <div className="fixed right-3 bottom-3 z-50 h-8 w-8 text-center text-base leading-8 text-white *:absolute *:inset-0 *:rounded-sm *:bg-red-500">
            <span>NIL</span>
            <span className="xs:block hidden">xs</span>
            <span className="hidden sm:block">sm</span>
            <span className="hidden md:block">md</span>
            <span className="hidden lg:block">lg</span>
            <span className="hidden xl:block">xl</span>
            <span className="hidden 2xl:block">2xl</span>
            <span className="3xl:block hidden">3xl</span>
            <span className="4xl:block hidden">4xl</span>
            <span className="5xl:block hidden">5xl</span>
        </div>
    );
};