



export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <main className="py-6 ">
            
                {children}
            
            </main>
        </div>
    );
}