import { AdminPage } from "./components/admin-page";
import { BackgroundVideo } from "./components/background-video";
import { Hero } from "./components/hero";
import { Navbar } from "./components/navbar";
import { PortfolioSections } from "./components/portfolio-sections";
import { isLocalAdminEnabled } from "./lib/admin-api";
import { PortfolioContentProvider } from "./lib/content-store";

function App() {
  const isAdminRoute = window.location.pathname.startsWith("/admin");
  const localAdminEnabled = isLocalAdminEnabled();

  return (
    <PortfolioContentProvider>
      <div className="relative min-h-screen overflow-x-hidden bg-background">
        <BackgroundVideo />

        <div className="relative z-10">
          {isAdminRoute && localAdminEnabled ? (
            <AdminPage />
          ) : isAdminRoute ? (
            <main className="px-6 py-10 md:px-12 lg:px-20">
              <section className="mx-auto max-w-3xl rounded-[2rem] border border-background/70 bg-background/76 p-8 backdrop-blur-xl">
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  Admin Disabled
                </p>
                <h1 className="mt-3 font-display text-4xl tracking-tight text-foreground md:text-5xl">
                  The admin page works only on your local dev server
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Run the project locally with <code>npm run dev</code>, open
                  <code> /admin</code>, save your changes, then commit the
                  updated files and push to Git. The deployed Vercel site stays
                  public and read-only.
                </p>
                <div className="mt-6">
                  <a
                    href="/"
                    className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Back To Portfolio
                  </a>
                </div>
              </section>
            </main>
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
