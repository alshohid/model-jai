import NavbarWithRouteRules from "./_components/publicNavbar/NavbarWithRouteRules";

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            
            <main >
                <NavbarWithRouteRules />
                {children}
            </main>
        </div>
    );
}