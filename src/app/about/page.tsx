import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <Image
          src="/images/garden-aerial.jpg"
          alt=""
          fill
          className="object-cover opacity-20"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-moss/40 to-charcoal" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="mb-4">
            <span className="text-xs uppercase tracking-[0.3em] text-gold/50">
              The Source
            </span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl text-cream mb-6 leading-tight">
            3.5 Acres of Living Soil
          </h1>
          <p className="text-base md:text-lg text-sand/50 max-w-2xl mx-auto leading-relaxed">
            We don&rsquo;t source from farms we&rsquo;ve never seen. We own the
            land, the beds, and the process — from worm to bag.
          </p>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="py-20 border-t border-moss/20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-moss/30">
              <Image
                src="/images/seedling-tray.jpg"
                alt="Seedlings in soil trays"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-cream mb-6 leading-tight">
                From the Ground Up
              </h2>
              <div className="space-y-4 text-sand/50 leading-relaxed">
                <p>
                  Every great garden starts with great soil. That&rsquo;s why we
                  built our foundation on 3.5 acres of land dedicated to one
                  purpose: producing the finest vermicompost in India.
                </p>
                <p>
                  Our 60 beds are meticulously maintained, fed a carefully
                  balanced diet of organic waste, and monitored for moisture,
                  temperature, and microbial activity. The result is a
                  concentrated, living compost that urban soil has never
                  experienced.
                </p>
                <p>
                  We sieve it, fortify it, and pack it with a QR code that lets
                  you trace your batch back to the exact bed it came from.
                  No middlemen. No shortcuts. Just the oneness of healthy soil.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="relative py-20 border-t border-moss/20 bg-moss/5 overflow-hidden">
        <Image
          src="/images/portrait-plant.jpg"
          alt=""
          fill
          className="object-cover opacity-5"
          sizes="100vw"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-gold/50">
              Our Sankalp
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-cream mt-4 leading-tight">
              What We Stand For
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Ownership",
                desc: "We own the land, the beds, and the production. Every bag carries our name because we grew it ourselves.",
              },
              {
                title: "Transparency",
                desc: "Each batch is traceable. Scan the QR on your bag to see which bed your compost came from.",
              },
              {
                title: "Purity",
                desc: "No fillers, no chemicals, no shortcuts. Triple-sieved, fully decomposed, and alive with beneficial microbes.",
              },
            ].map((val) => (
              <div
                key={val.title}
                className="border border-moss/30 rounded-2xl p-8 hover:border-gold/20 transition-all"
              >
                <p className="text-gold text-lg font-serif mb-3">{val.title}</p>
                <p className="text-sand/40 text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 border-t border-moss/20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-serif text-3xl text-cream mb-4">
            Want to See the Land?
          </h2>
          <p className="text-sand/50 mb-8">
            We welcome visitors. Reach out and we&rsquo;ll arrange a walk through
            the beds.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 px-8 py-3.5 rounded-full text-sm uppercase tracking-widest transition-all"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}
