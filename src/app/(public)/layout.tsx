import FooterSection from "@/shared/components/home/FooterSection";
import NavbarWithRouteRules from "./_components/publicNavbar/NavbarWithRouteRules";


export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>

            <main >
                <NavbarWithRouteRules />
                {children}
                <FooterSection />

            </main>
        </div>
    );
}
