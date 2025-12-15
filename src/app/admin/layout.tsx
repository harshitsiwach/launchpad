export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            {/* TODO: Add Admin Sidebar or Navbar here */}
            <main>
                {children}
            </main>
        </div>
    );
}
