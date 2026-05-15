import Image from "next/image";
import Link from "next/link";

const products = [
  {
    name: "Aadhar-Vati",
    sanskrit: "The Foundation Dose",
    tag: "Pure",
    description:
      "Our flagship vermicompost. Fully decomposed, triple-sieved, and alive with beneficial microbes. The essential foundation for every plant parent.",
    variants: ["1kg Refill Pouch", "5kg Bulk Bag"],
    price: "From ₹199",
  },
  {
    name: "Aadhar-Vati Neem",
    sanskrit: "The Shield",
    tag: "Vermi-Neem",
    description:
      "Fortified with cold-pressed neem cake for natural pest resistance. Perfect for indoor plants and urban balconies where chemical sprays aren't an option.",
    variants: ["1kg Refill Pouch", "5kg Bulk Bag"],
    price: "From ₹249",
  },
  {
    name: "Aadhar-Vati Coco",
    sanskrit: "The Light Base",
    tag: "Vermi-Coco",
    description:
      "Blended with high-quality cocopeat for lightweight pots and hanging baskets. Ideal for terrace gardens and balcony planters.",
    variants: ["1kg Refill Pouch", "5kg Bulk Bag"],
    price: "From ₹229",
  },
];

const upcoming = [
  {
    name: "Amrit-Ek",
    sanskrit: "The Weekly Nectar",
    description: "Liquid bio-enzyme plant feed — coming soon.",
  },
  {
    name: "Shuddhi-Ek",
    sanskrit: "The Leaf Elixir",
    description: "Organic leaf mist for cleansing and pest prevention — coming soon.",
  },
  {
    name: "Jeevan-Ek",
    sanskrit: "The Rescue Drops",
    description: "Root hormone and shock recovery concentrate — coming soon.",
  },
];

export default function ProductsPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <Image
          src="/images/indoor-plants.jpg"
          alt=""
          fill
          className="object-cover opacity-15"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-moss/30 to-charcoal" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="mb-4">
            <span className="text-xs uppercase tracking-[0.3em] text-gold/50">
              The Wellness Range
            </span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl text-cream mb-6 leading-tight">
            Plant Wellness, <br />
            <span className="text-gold">Rooted in Oneness</span>
          </h1>
          <p className="text-base md:text-lg text-sand/50 max-w-2xl mx-auto leading-relaxed">
            Every product is born from our 3.5 acres of living soil. Fortified,
            traceable, and crafted for the urban plant parent.
          </p>
        </div>
      </section>

      {/* ── CORE PRODUCTS ── */}
      <section className="py-20 border-t border-moss/20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-gold/50">
              Available Now
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-cream mt-4 leading-tight">
              The Aadhar-Vati Series
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.name}
                className="border border-moss/30 rounded-2xl p-8 hover:border-gold/20 transition-all bg-moss/5 flex flex-col"
              >
                <div className="relative w-full aspect-[3/2] rounded-xl overflow-hidden mb-6 border border-moss/20">
                  <Image
                    src="/images/seedling-soil.jpg"
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-gold/50 border border-gold/20 rounded-full px-3 py-1 mb-6 self-start">
                  {product.tag}
                </span>

                <p className="text-xl text-cream font-serif mb-1">
                  {product.name}
                </p>
                <p className="text-xs text-cream/30 mb-4 font-serif italic">
                  [{product.sanskrit}]
                </p>

                <p className="text-sm text-sand/40 leading-relaxed mb-6 flex-1">
                  {product.description}
                </p>

                <div className="border-t border-moss/20 pt-4 mb-6">
                  <p className="text-[10px] uppercase tracking-wider text-sand/30 mb-2">
                    Available in
                  </p>
                  {product.variants.map((v) => (
                    <p key={v} className="text-xs text-sand/50">
                      &bull; {v}
                    </p>
                  ))}
                </div>

                <p className="text-gold text-sm mb-4">{product.price}</p>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 px-6 py-2.5 rounded-full text-xs uppercase tracking-widest transition-all"
                >
                  Pre-Order Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPCOMING PRODUCTS ── */}
      <section className="py-20 border-t border-moss/20 bg-moss/5">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-gold/50">
              Coming Soon
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-cream mt-4 leading-tight">
              The Wellness Rituals
            </h2>
            <p className="text-sand/50 mt-4 max-w-lg mx-auto">
              Expanding the ecosystem. Liquids, mists, and rescue drops for the
              complete plant care ritual.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcoming.map((product) => (
              <div
                key={product.name}
                className="border border-dashed border-moss/30 rounded-2xl p-8 opacity-60"
              >
                <p className="text-lg text-cream font-serif mb-1">
                  {product.name}
                </p>
                <p className="text-xs text-cream/30 mb-4 font-serif italic">
                  [{product.sanskrit}]
                </p>
                <p className="text-sm text-sand/40 leading-relaxed">
                  {product.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
