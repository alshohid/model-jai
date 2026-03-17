import FooterSection from "@/shared/components/home/FooterSection";
import NavbarWithRouteRules from "./_components/publicNavbar/NavbarWithRouteRules";
import NotificationProvider from "@/shared/providers/NotificationProvider";


export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>

            <main >
                <NotificationProvider>
                    <NavbarWithRouteRules />
                    {children}
                    <FooterSection />
                </NotificationProvider>

            </main>
        </div>
    );
}