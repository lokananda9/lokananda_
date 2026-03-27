import { AdminPage } from "./components/admin-page";
import { BackgroundVideo } from "./components/background-video";
import { Hero } from "./components/hero";
import { Navbar } from "./components/navbar";
import { PortfolioSections } from "./components/portfolio-sections";
import { PortfolioContentProvider } from "./lib/content-store";

function App() {
  const isAdminRoute = window.location.pathname.startsWith("/admin");

  return (
    <PortfolioContentProvider>
      <div className="relative min-h-screen overflow-x-hidden bg-background">
        <BackgroundVideo />

        <div className="relative z-10">
          {isAdminRoute ? (
            <AdminPage />
          ) : (
            <>
              <Navbar />
              <main className="pb-16">
                <Hero />
                <PortfolioSections />
              </main>
            </>
          )}
        </div>
      </div>
    </PortfolioContentProvider>
  );
}

export default App;
