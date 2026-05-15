import Image from "next/image";

export default function ContactPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <Image
          src="/images/woman-planting.jpg"
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
              Connect
            </span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl text-cream mb-6 leading-tight">
            Let&rsquo;s Grow Together
          </h1>
          <p className="text-base md:text-lg text-sand/50 max-w-xl mx-auto leading-relaxed">
            Whether you&rsquo;re a plant parent, a society secretary, or a school
            principal — we&rsquo;d love to hear from you.
          </p>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="py-20 border-t border-moss/20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="font-serif text-3xl text-cream mb-6">
                Reach Out
              </h2>
              <div className="space-y-6 text-sand/50">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gold/60 mb-1">
                    Email
                  </p>
                  <p className="text-sm">hello@ekva.in</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gold/60 mb-1">
                    Location
                  </p>
                  <p className="text-sm">India</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gold/60 mb-1">
                    For Bulk &amp; Institutional Inquiries
                  </p>
                  <p className="text-sm">societies@ekva.in</p>
                </div>
              </div>
            </div>

            <div className="border border-moss/30 rounded-2xl p-8 bg-moss/5">
              <h2 className="font-serif text-xl text-cream mb-6">
                Send a Message
              </h2>
              <form className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs uppercase tracking-wider text-sand/40 mb-2"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full bg-charcoal border border-moss/30 rounded-lg px-4 py-3 text-sm text-sand placeholder-sand/20 focus:outline-none focus:border-gold/40 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs uppercase tracking-wider text-sand/40 mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full bg-charcoal border border-moss/30 rounded-lg px-4 py-3 text-sm text-sand placeholder-sand/20 focus:outline-none focus:border-gold/40 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs uppercase tracking-wider text-sand/40 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full bg-charcoal border border-moss/30 rounded-lg px-4 py-3 text-sm text-sand placeholder-sand/20 focus:outline-none focus:border-gold/40 transition-colors resize-none"
                    placeholder="Tell us about your garden..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 px-8 py-3.5 rounded-lg text-sm uppercase tracking-widest transition-all cursor-pointer"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
