import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { navItems } from "./site-data";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur lg:top-4 lg:mx-auto lg:w-[calc(100%-2rem)] lg:max-w-[1180px] lg:rounded-full lg:border lg:shadow-[0_12px_32px_-8px_rgba(49,22,63,0.18)]">
        <div className="section-x flex h-[68px] items-center gap-6">
          <a href="/" className="flex shrink-0 items-center">
            <Logo variant="dark" className="h-7 w-auto" />
          </a>

          <nav className="ml-auto hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <div key={item.label} className="group relative">
                <button className="flex cursor-pointer items-center gap-1 rounded-md px-3 py-2 text-[15px] font-medium text-foreground/85 transition-colors hover:text-brand">
                  {item.label}
                  <ChevronDown className="size-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="invisible absolute left-0 top-full w-72 translate-y-1 rounded-2xl border border-border bg-popover p-2 opacity-0 shadow-card transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {item.items.map((sub) => (
                    <a
                      key={sub}
                      href="#offerings"
                      className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      {sub}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="hidden items-center gap-6 lg:flex">
            <a
              href="#login"
              className="text-[15px] font-medium text-foreground/85 hover:text-brand"
            >
              Login
            </a>
            <Button variant="brand" size="pillSm" asChild>
              <a href="#quote">Get Quote</a>
            </Button>
          </div>

          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="ml-auto cursor-pointer rounded-md p-2 text-foreground lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-border bg-background lg:hidden">
            <div className="section-x space-y-4 py-5">
              {navItems.map((item) => (
                <div key={item.label}>
                  <p className="text-sm font-semibold text-ink">{item.label}</p>
                  <div className="mt-1 space-y-1">
                    {item.items.map((sub) => (
                      <a
                        key={sub}
                        href="#offerings"
                        className="block text-sm text-muted-foreground"
                      >
                        {sub}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
              <Button variant="brand" size="pill" className="w-full" asChild>
                <a href="#quote">Get Quote</a>
              </Button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
