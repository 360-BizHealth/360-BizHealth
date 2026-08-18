import Header from "@/components/Header";
import Footer from "@/components/Footer";
import logoImg from "@/assets/logo.png";

export default function NotFound({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={onNavigate} />

      <main className="mx-auto max-w-7xl px-6 pt-28 pb-24 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <span className="text-9xl font-extrabold text-primary">404</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Page Not Found
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Sorry, the page you're looking for doesn't exist. Let's get you back on track.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a 
              href="/" 
              onClick={(e) => { e.preventDefault(); onNavigate("/"); }}
              className="rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/30 transition hover:scale-[1.02]"
            >
              Back to Home
            </a>
            <a 
              href="/contact" 
              onClick={(e) => { e.preventDefault(); onNavigate("/contact"); }}
              className="rounded-full border border-border bg-card px-7 py-3.5 text-sm font-semibold transition hover:bg-surface"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
