"use client";

import { useState } from "react";
import Image from "next/image";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, message })
      });

      const data = await res.json();
      if (res.ok && data.status === "success") {
        setSuccess(true);
        setName("");
        setEmail("");
        setMessage("");
      } else {
        throw new Error(data.message || "Failed to deliver inquiry.");
      }
    } catch (err: any) {
      console.error("Error submitting contact form:", err);
      setErrorMsg(err.message || "Server offline. Make sure the database and Node.js API server are active on port 8000!");
    } finally {
      setLoading(false);
    }
  };

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

            <div className="border border-moss/30 rounded-2xl p-8 bg-moss/5 relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/[0.02] rounded-full blur-xl pointer-events-none" />
              
              <h2 className="font-serif text-xl text-cream mb-6">
                Send a Message
              </h2>

              {/* SUCCESS STATE */}
              {success && (
                <div className="border border-green-800/40 rounded-xl p-4 bg-green-950/[0.08] mb-6 space-y-2 animate-fadeIn select-none">
                  <div className="flex items-center gap-2 text-green-400 font-serif font-bold text-sm uppercase tracking-wider">
                    <span>🌿</span> Message Delivered!
                  </div>
                  <p className="text-xs text-sand/60 leading-relaxed">
                    Thank you for reaching out to Ekva. Your inquiry has been stored securely in our database and will be reviewed by our horticulture experts shortly.
                  </p>
                </div>
              )}

              {/* ERROR STATE */}
              {errorMsg && (
                <div className="border border-terracotta/40 rounded-xl p-4 bg-terracotta/[0.04] mb-6 space-y-2 animate-fadeIn select-none">
                  <div className="flex items-center gap-2 text-terracotta font-serif font-bold text-sm uppercase tracking-wider">
                    <span>⚠️</span> Delivery Failed
                  </div>
                  <p className="text-xs text-sand/60 leading-relaxed">
                    {errorMsg}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
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
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-charcoal border border-moss/30 rounded-lg px-4 py-3 text-sm text-sand placeholder-sand/20 focus:outline-none focus:border-gold/40 transition-colors resize-none"
                    placeholder="Tell us about your garden..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 disabled:opacity-50 px-8 py-3.5 rounded-lg text-sm uppercase tracking-widest transition-all cursor-pointer font-bold shrink-0"
                >
                  {loading ? "Sending Message..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
