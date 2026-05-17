import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="/images/monstera-leaf.jpg"
          alt=""
          fill
          className="object-cover opacity-30"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-moss/50 via-charcoal/70 to-charcoal" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-moss/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-terracotta/20 rounded-full blur-3xl" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center py-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-xs uppercase tracking-[0.25em] text-gold/70">
              3.5 Acres &middot; 60 Vermi Beds &middot; Owned & Operated
            </span>
          </div>

          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-cream mb-6 tracking-tight">
            Ekva
          </h1>
          <p className="font-serif text-xl md:text-2xl text-gold/80 mb-4 italic">
            The Unified Care
          </p>
          <p className="max-w-xl mx-auto text-base md:text-lg text-sand/50 leading-relaxed mb-12">
            Premium plant wellness rooted in the philosophy of Oneness. From our
            living soil to your urban sanctuary — we keep your garden thriving.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 px-8 py-3.5 rounded-full text-sm uppercase tracking-widest transition-all"
            >
              Explore Aadhar-Vati
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 border border-sand/20 text-sand/60 hover:text-sand hover:border-sand/40 px-8 py-3.5 rounded-full text-sm uppercase tracking-widest transition-all"
            >
              The Land
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="w-5 h-5 text-gold/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* ── PHILOSOPHY ── */}
      <section className="relative py-28 md:py-36 border-t border-moss/20 overflow-hidden">
        <Image
          src="/images/hands-plant.jpg"
          alt=""
          fill
          className="object-cover opacity-10"
          sizes="100vw"
        />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="mb-6">
            <span className="text-xs uppercase tracking-[0.3em] text-gold/50">
              Ek Omkar
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-cream mb-8 leading-tight">
            One Truth, Infinite Expressions
          </h2>
          <p className="text-base md:text-lg text-sand/50 leading-relaxed max-w-2xl mx-auto mb-12">
            The plant is not separate from you. The soil is not separate from
            the tech. We believe in the sacred oneness of all life — where
            ancient wisdom meets modern care.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              {
                sanskrit: "Prithvi",
                meaning: "The Earth",
                desc: "Our 3.5 acres of living soil is the foundation. Healthy soil grows healthy plants.",
              },
              {
                sanskrit: "Prana",
                meaning: "The Life Force",
                desc: "Every product we make carries the life energy of 60 thriving vermi beds.",
              },
              {
                sanskrit: "Samyoga",
                meaning: "The Union",
                desc: "Where ancestral farming wisdom meets precision care — a union of worlds.",
              },
            ].map((item) => (
              <div
                key={item.sanskrit}
                className="border border-moss/30 rounded-2xl p-6 hover:border-gold/20 transition-colors bg-moss/5 backdrop-blur-sm"
              >
                <p className="text-gold text-sm font-serif mb-1">
                  {item.sanskrit}
                </p>
                <p className="text-cream text-sm mb-3 font-serif italic">
                  [{item.meaning}]
                </p>
                <p className="text-sand/40 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE LAND ── */}
      <section className="relative py-28 md:py-36 border-t border-moss/20 bg-moss/5 overflow-hidden">
        <Image
          src="/images/garden-aerial.jpg"
          alt=""
          fill
          className="object-cover opacity-5"
          sizes="100vw"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-4">
                <span className="text-xs uppercase tracking-[0.3em] text-gold/50">
                  The Source
                </span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-cream mb-6 leading-tight">
                We Don&rsquo;t Source. We Grow.
              </h2>
              <p className="text-sand/50 leading-relaxed mb-8">
                On 3.5 acres of dedicated land, we operate 60 vermicompost beds
                — each one a living ecosystem. We own the process from worm to
                bag, ensuring every gram of our Aadhar-Vati is pure, potent, and
                alive.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { number: "3.5", label: "Acres of Land" },
                  { number: "60", label: "Vermi Beds" },
                  { number: "100%", label: "Owned & Operated" },
                  { number: "Zero", label: "Middlemen" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="font-serif text-3xl text-gold">{stat.number}</p>
                    <p className="text-xs uppercase tracking-wider text-sand/40 mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-moss/30">
              <Image
                src="/images/composting.jpg"
                alt="Vermicomposting beds"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCT ── */}
      <section className="py-28 md:py-36 border-t border-moss/20" id="product">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative aspect-[4/5] rounded-2xl overflow-hidden border border-gold/10">
              <Image
                src="/images/seedling-soil.jpg"
                alt="Aadhar-Vati premium vermicompost"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div className="order-1 md:order-2">
              <div className="mb-4">
                <span className="text-xs uppercase tracking-[0.3em] text-gold/50">
                  Flagship Product
                </span>
              </div>
              <p className="text-gold text-sm font-serif mb-2">Aadhar-Vati</p>
              <p className="text-cream/40 text-sm mb-6 font-serif italic">
                [The Foundation Dose]
              </p>
              <h2 className="font-serif text-4xl md:text-5xl text-cream mb-6 leading-tight">
                Black Gold from Living Soil
              </h2>
              <p className="text-sand/50 leading-relaxed mb-8">
                Premium fortified vermicompost. Each batch is carefully
                monitored, fully decomposed, and weed-seed free. No fillers. No
                chemicals. Just the concentrated life force of 60 beds.
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  "Sieved to perfection — fine, dark, and odorless",
                  "Fortified blends: Vermi-Neem, Vermi-Coco variants",
                  "Traceable from bed to bag with batch QR code",
                  "14-day visible results or we haven't done our job",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-sand/50">
                    <span className="mt-1.5 h-1 w-3 bg-gold/50 rounded-full shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 px-8 py-3.5 rounded-full text-sm uppercase tracking-widest transition-all"
              >
                View Full Range
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── BLENDS ── */}
      <section className="py-28 md:py-36 border-t border-moss/20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-gold/50">
              The Range
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-cream mt-4 mb-4 leading-tight">
              Fortified for Your Garden
            </h2>
            <p className="text-sand/50 max-w-xl mx-auto">
              Pure vermicompost, enhanced for specific needs. Every blend starts
              with our 60-bed foundation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Aadhar-Vati",
                sanskrit: "The Foundation",
                desc: "Pure, unadulterated vermicompost. The essential base for every plant parent.",
                tag: "Pure",
              },
              {
                name: "Aadhar-Vati Neem",
                sanskrit: "The Shield",
                desc: "Fortified with neem cake for natural pest resistance. Ideal for indoor gardens.",
                tag: "Vermi-Neem",
              },
              {
                name: "Aadhar-Vati Coco",
                sanskrit: "The Light Base",
                desc: "Blended with cocopeat for lightweight pots and balcony gardens.",
                tag: "Vermi-Coco",
              },
            ].map((blend) => (
              <div
                key={blend.name}
                className="border border-moss/30 rounded-2xl p-8 hover:border-gold/20 transition-all bg-moss/5 group"
              >
                <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-gold/50 border border-gold/20 rounded-full px-3 py-1 mb-6">
                  {blend.tag}
                </span>
                <p className="text-lg text-cream font-serif mb-1">{blend.name}</p>
                <p className="text-xs text-cream/30 mb-4 font-serif italic">
                  [{blend.sanskrit}]
                </p>
                <p className="text-sm text-sand/40 leading-relaxed">
                  {blend.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VAIDYA PROMO ── */}
      <section className="py-28 md:py-36 border-t border-moss/20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-4">
                <span className="text-xs uppercase tracking-[0.3em] text-gold/50">
                  Vaidiya
                </span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-cream mb-6 leading-tight">
                Your Plant&rsquo;s Personal Doctor
              </h2>
              <p className="text-sand/50 leading-relaxed mb-6">
                Take a photo. Our AI analyzes leaf health, cross-references your
                local weather, humidity, and temperature — and tells you exactly
                if your plant needs water.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Real-time weather &amp; humidity analysis",
                  "Computer vision leaf health assessment",
                  "Ayurvedic care tips for your specific plant",
                  "No hardware needed — just your phone",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-sand/50"
                  >
                    <span className="mt-1.5 h-1 w-3 bg-gold/50 rounded-full shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/vaidiya"
                className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 px-8 py-3.5 rounded-full text-sm uppercase tracking-widest transition-all"
              >
                Try the Plant Doctor
              </Link>
            </div>

            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-moss/30">
              <Image
                src="/images/woman-planting.jpg"
                alt="Plant care diagnosis"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-charcoal/80 backdrop-blur-sm rounded-xl p-4 border border-gold/20">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💧</span>
                  <div>
                    <p className="text-sm text-cream font-serif">
                      Needs Watering
                    </p>
                    <p className="text-[10px] text-sand/40">
                      32&deg;C &middot; 28% Humidity &middot; 87% confidence
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 md:py-36 border-t border-moss/20 bg-gradient-to-b from-moss/5 to-charcoal">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-gold/50">
            Join the Movement
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-cream mt-4 mb-6 leading-tight">
            Ready to Transform Your Garden?
          </h2>
          <p className="text-sand/50 mb-10 max-w-lg mx-auto">
            Be among the first to experience the foundation of living soil. Our
            first batch is limited and pre-selling now.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 px-8 py-3.5 rounded-full text-sm uppercase tracking-widest transition-all"
            >
              Pre-Order Aadhar-Vati
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-sand/20 text-sand/60 hover:text-sand hover:border-sand/40 px-8 py-3.5 rounded-full text-sm uppercase tracking-widest transition-all"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
