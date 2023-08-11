import 'bootstrap/dist/css/bootstrap.min.css';
import 'globals.css';

export const metadata = {
    title: 'Logistic App',
    description: "best app to manage your orders",
    icons: "/images/icon.png"
}

export default Layout;

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            
            <body>
                {children}

                {/* credits */}
            </body>
        </html>
    );
}
