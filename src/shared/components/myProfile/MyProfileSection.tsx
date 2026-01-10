
"use client"
import MyProfilePanel from "./MyProfilePanel"

const MyProfileSection = () => {
    return (
        <div className="container py-5 md:py-10">
            <MyProfilePanel
                profile={{
                    name: "Michael Rohan",
                    email: "michael@gmail.com",
                    contact: "+636514165165",
                    nationality: "Nigerian",
                    avatar: "/images/home/profile_1.png",
                    posts: 125,
                    followers: "115k",
                    following: "225k",
                }}
                stats={[
                    { label: "Total Earnings", value: "$ 245,000",icon:'/images/home/stat_button.png' },
                    { label: "Total Referral Earnings", value: "$ 8,400", icon: '/images/home/stat_button_2.png' },
                    { label: "Total Tip Recieved", value: "$ 1,311", icon: '/images/home/stat_button_3.png' },
                ]}
                onEditProfile={() => console.log("edit")}
                onSendMoney={() => console.log("send")}
                onReferralLink={() => console.log("ref")}
                onWithdrawRequest={() => console.log("withdraw")}
            />
        </div>

    )
}
export default MyProfileSection;