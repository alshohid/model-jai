import React from "react";

const WalletIcon = ({ className }: { className?: string }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className={className}
        >
            <path
                d="M2.78809 13.4974L13.4789 2.80664M15.5263 9.21242L13.6934 11.0453M12.1291 12.591L11.3135 13.4066"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M2.6454 13.4503C1.34021 12.1451 1.34021 10.0289 2.6454 8.72377L8.72426 2.64491C10.0294 1.33972 12.1456 1.33972 13.4508 2.64491L17.3543 6.54844C18.6595 7.85363 18.6595 9.96977 17.3543 11.2749L11.2754 17.3538C9.97026 18.659 7.85412 18.659 6.54893 17.3538L2.6454 13.4503Z"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <path
                d="M3.3335 18.334H16.6668"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
};

export default WalletIcon;
