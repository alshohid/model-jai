
"use client"
import MyProfilePanel from "./MyProfilePanel"

const MyProfileSection = () => {
    return (
        <MyProfilePanel
            profile={{
                name: "Michael Rohan",
                email: "michael@gmail.com",
                contact: "+636514165165",
                nationality: "Nigerian",
                avatar: "/images/home/profile_big.jpg",
                posts: 125,
                followers: "115k",
                following: "225k",
            }}
            stats={[
                { label: "Total Earnings", value: "$ 245,000" },
                { label: "Total Referral Earnings", value: "$ 8,400" },
                { label: "Total Tip Recieved", value: "$ 1,311" },
            ]}
            onEditProfile={() => console.log("edit")}
            onSendMoney={() => console.log("send")}
            onReferralLink={() => console.log("ref")}
            onWithdrawRequest={() => console.log("withdraw")}
        />

    )
}
export default MyProfileSection;