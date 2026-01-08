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
            </main>
        </div>
    );
}