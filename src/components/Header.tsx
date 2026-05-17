import { Link } from "react-router-dom";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/vaidiya", label: "Plant Doctor" },
  { href: "/about", label: "The Land" },
  { href: "/products", label: "Products" },
  { href: "/admin", label: "Admin" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-charcoal/90 backdrop-blur-md border-b border-moss/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full border border-gold/60 flex items-center justify-center group-hover:border-gold transition-colors">
              <span className="text-gold text-xs font-serif">Ek</span>
            </div>
            <span className="font-serif text-lg tracking-wider text-cream">
              Ekva
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm tracking-wider text-sand/70 hover:text-gold transition-colors uppercase"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/products"
              className="text-sm tracking-wider uppercase bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 px-5 py-2 rounded-full transition-all"
            >
              Get Aadhar-Vati
            </Link>
          </nav>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span
              className={`block h-px w-6 bg-sand transition-all ${open ? "rotate-45 translate-y-[3px]" : ""}`}
            />
            <span
              className={`block h-px w-6 bg-sand transition-all ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-px w-6 bg-sand transition-all ${open ? "-rotate-45 -translate-y-[3px]" : ""}`}
            />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-moss/30 bg-charcoal/95 backdrop-blur-md">
          <div className="px-6 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setOpen(false)}
                className="block text-sm tracking-wider text-sand/70 hover:text-gold transition-colors uppercase"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/products"
              onClick={() => setOpen(false)}
              className="block text-sm tracking-wider uppercase bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 px-5 py-2.5 rounded-full text-center transition-all"
            >
              Get Aadhar-Vati
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
