import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-moss/30 bg-charcoal">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full border border-gold/60 flex items-center justify-center">
                <span className="text-gold text-xs font-serif">Ek</span>
              </div>
              <span className="font-serif text-lg tracking-wider text-cream">
                Ekva
              </span>
            </div>
            <p className="text-sm text-sand/50 max-w-md leading-relaxed">
              From our 3.5 acres of living soil to your urban sanctuary. We
              believe in the oneness of all life — plant, human, earth, and
              tech.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-gold/60 mb-4">
              Navigate
            </h4>
            <div className="space-y-2.5">
              <Link
                to="/"
                className="block text-sm text-sand/50 hover:text-sand transition-colors"
              >
                Home
              </Link>
              <Link
                to="/vaidiya"
                className="block text-sm text-sand/50 hover:text-sand transition-colors"
              >
                Plant Doctor
              </Link>
              <Link
                to="/about"
                className="block text-sm text-sand/50 hover:text-sand transition-colors"
              >
                The Land
              </Link>
              <Link
                to="/products"
                className="block text-sm text-sand/50 hover:text-sand transition-colors"
              >
                Products
              </Link>
              <Link
                to="/contact"
                className="block text-sm text-sand/50 hover:text-sand transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-gold/60 mb-4">
              Connect
            </h4>
            <div className="space-y-2.5 text-sm text-sand/50">
              <p>hello@ekva.in</p>
              <p>Instagram</p>
              <p>YouTube</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-moss/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-sand/30">
            &copy; {new Date().getFullYear()} Ekva. All rights reserved.
          </p>
          <p className="text-xs text-sand/20 font-serif italic">
            Ekam Sat Vipra Bahudha Vadanti
          </p>
        </div>
      </div>
    </footer>
  );
}
