import { useState, useEffect, useRef, type ReactNode } from "react";
import {
  Menu as MenuIcon, X, ArrowRight, Camera, MapPin, Clock, Phone,
  MessageCircle, Calendar, Users, Leaf, Star, ChevronRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Page = "home" | "menu" | "about" | "reservations" | "events" | "contact";
type MenuTab = "bowls" | "matcha" | "drinks" | "cookies" | "pastries";

// ─── Photo registry ───────────────────────────────────────────────────────────
const PH = {
  hero:      "photo-1490474418585-ba9bad8fd0ea",
  bowl1:     "photo-1654923064926-be7e64267a31",
  bowl2:     "photo-1610441009633-b6ca9c6d4be2",
  bowl3:     "photo-1684403620650-81dc661a69db",
  bowl4:     "photo-1498507297833-5373e346b4e0",
  acaiClassic: "photo-1627308594190-a057cd4bfac8",
  acaiBerry:   "photo-1610441009633-b6ca9c6d4be2",
  acaiKyoto:   "photo-1684403620650-81dc661a69db",
  acaiSunrise: "photo-1684403731883-67a71a793d2d",
  acaiGolden:  "photo-1654923064926-be7e64267a31",
  acaiMinimal: "photo-1590288488147-f46142daf112",
  matcha1:   "photo-1755685068178-4b57210ddcd4",
  matcha2:   "photo-1565117711038-1e0a80eed005",
  matcha3:   "photo-1755685243305-c7a5d2986ecb",
  matcha4:   "photo-1565117798265-3ae28d47a6c3",
  matchaCeremony: "photo-1515823064-d6e0c04616a7",
  matchaLatte:    "photo-1631308491952-040f80133535",
  matchaIced:     "photo-1717398804998-ad2d48822518",
  matchaTonic:    "photo-1717398804885-a6c22b3e5c2f",
  hojichaLatte:   "photo-1717603545586-208c9d67fcbe",
  hojichaCream:   "photo-1749280447307-31a68eb38673",
  cafe1:     "photo-1583354608715-177553a4035e",
  cafe2:     "photo-1579341560277-4dfaddaf6e98",
  cafe3:     "photo-1685602729695-0664ea4e5c06",
  cafe4:     "photo-1565650839149-2c48a094196c",
  bar:       "photo-1726835498689-b4f6dbcdbdfb",
  wellness1: "photo-1501959915551-4e8d30928317",
  wellness2: "photo-1543668900-9124915a121f",
  wellness3: "photo-1557164928-61b165508987",
  wellness4: "photo-1555426524-d56fb852da79",
  coldBrew:       "photo-1514432324607-a09d9b4aefdd",
  coconutCoffee:  "photo-1495474472287-4d71bcdd2085",
  lemonade:       "photo-1570831739435-6601aa3fa4fb",
  hibiscusFizz:   "photo-1621263764928-df1444c5e859",
  tropicalJuice:  "photo-1589733955941-5eeaf752f6dd",
  coconutKefir:   "photo-1513558161293-cdaf765ed2fd",
  cookieChocolate: "photo-1634188023615-7e08901193b6",
  cookieMatcha:    "photo-1499636136210-6f4ee915583e",
  cookiePecan:     "photo-1558961363-fa8fdf82db35",
  cookieCacao:     "photo-1598839950984-034f6dc7b495",
  cookieCoconut:   "photo-1597733153203-a54d0fbc47de",
  cookieThumbprint:"photo-1583743089695-4b816a340f82",
  bagelCream:      "photo-1643049441000-3249ab096f2b",
  bananaPudding:   "photo-1605682563229-3abeaa20d87a",
  croissant:       "photo-1623334044303-241021148842",
  bananaBread:     "photo-1621994214182-f467e6999dc9",
  acaiTart:        "photo-1590288488147-f46142daf112",
  madeleines:      "photo-1681218079567-35aef7c8e7e4",
};

const u = (id: string, w = 800, h = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

const SERIF: React.CSSProperties = { fontFamily: "'Fraunces', Georgia, serif" };

// ─── Reveal animation ─────────────────────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = "" }: {
  children: ReactNode; delay?: number; className?: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// ─── Label ────────────────────────────────────────────────────────────────────
function Label({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <div className={`text-[9px] tracking-[0.4em] uppercase mb-4 ${light ? "text-[#9BA98C]" : "text-[#9BA98C]"}`}>
      {children}
    </div>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────
function Nav({ page, go }: { page: Page; go: (p: Page) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links: [string, Page][] = [
    ["Menu", "menu"], ["About", "about"], ["Events", "events"], ["Contact", "contact"],
  ];
  const solidNav = page !== "home" || scrolled || open;

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        solidNav ? "bg-[#FAF8F5]/95 backdrop-blur-sm border-b border-[#E2D6C4]" : ""
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-14 h-16 md:h-20 flex items-center justify-between">
        {/* Wordmark */}
        <button onClick={() => go("home")} className="flex flex-col leading-none gap-0.5">
          <span style={SERIF} className={`text-xl font-light italic tracking-wide transition-colors duration-500 ${solidNav ? "text-[#2C2C2C]" : "text-white"}`}>
            Saya
          </span>
          <span className={`text-[7px] tracking-[0.4em] uppercase transition-colors duration-500 ${solidNav ? "text-[#9BA98C]" : "text-white/50"}`}>
            Cafe · Accra
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-9">
          <button
            onClick={() => go("home")}
            className={`text-[9px] tracking-[0.25em] uppercase transition-colors duration-300 ${
              page === "home"
                ? (solidNav ? "text-[#5C4738]" : "text-white")
                : (solidNav ? "text-[#8A7968] hover:text-[#2C2C2C]" : "text-white/55 hover:text-white")
            }`}
          >
            Home
          </button>
          {links.map(([label, p]) => (
            <button
              key={p}
              onClick={() => go(p)}
              className={`text-[9px] tracking-[0.25em] uppercase transition-colors duration-300 ${
                page === p
                  ? (solidNav ? "text-[#5C4738]" : "text-white")
                  : (solidNav ? "text-[#8A7968] hover:text-[#2C2C2C]" : "text-white/55 hover:text-white")
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          <button
            onClick={() => go("reservations")}
            className={`text-[9px] tracking-[0.2em] uppercase px-6 py-2.5 rounded-full transition-all duration-300 ${
              solidNav
                ? "bg-[#5C4738] text-[#FAF8F5] hover:bg-[#2C2C2C]"
                : "border border-white/40 text-white hover:bg-white/10 backdrop-blur-sm"
            }`}
          >
            Reserve
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className={`md:hidden transition-colors duration-300 ${solidNav ? "text-[#2C2C2C]" : "text-white"}`}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <MenuIcon size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? "max-h-screen" : "max-h-0"}`}>
        <div className="bg-[#FAF8F5] border-t border-[#E2D6C4] px-6 py-8 space-y-5">
          {([["Home", "home"], ...links] as [string, Page][]).map(([label, p]) => (
            <button
              key={p}
              onClick={() => { go(p); setOpen(false); }}
              className="block text-[10px] tracking-[0.3em] uppercase text-[#2C2C2C] hover:text-[#5C4738] transition-colors"
            >
              {label}
            </button>
          ))}
          <div className="pt-4">
            <button
              onClick={() => { go("reservations"); setOpen(false); }}
              className="bg-[#5C4738] text-[#FAF8F5] text-[9px] tracking-[0.2em] uppercase px-7 py-3.5 rounded-full hover:bg-[#2C2C2C] transition-colors"
            >
              Reserve a Table
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ go }: { go: (p: Page) => void }) {
  const pages: Page[] = ["home", "menu", "about", "events", "reservations", "contact"];
  return (
    <footer className="bg-[#2C2C2C]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-14 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand column */}
          <div className="md:col-span-5">
            <div style={SERIF} className="text-3xl font-light italic text-[#EFE8DE] mb-1">Saya</div>
            <div className="text-[7px] tracking-[0.4em] uppercase text-[#5C4738] mb-6">Cafe · Matcha Bar · Accra</div>
            <p className="text-sm text-[#9BA98C]/70 leading-relaxed max-w-xs mb-8">
              A luxury specialty cafe and matcha bar in Accra, known for pure Brazilian acai, ceremonial Uji matcha, and refined everyday treats.
            </p>
            <div className="flex gap-3">
              {[Camera, MessageCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full border border-[#5C4738] flex items-center justify-center text-[#9BA98C] hover:border-[#9BA98C] hover:text-[#EFE8DE] transition-all duration-300"
                >
                  <Icon size={13} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav column */}
          <div className="md:col-span-3">
            <div className="text-[7px] tracking-[0.4em] uppercase text-[#5C4738] mb-6">Navigate</div>
            <div className="space-y-3">
              {pages.map(p => (
                <button
                  key={p}
                  onClick={() => go(p)}
                  className="block text-sm capitalize text-[#9BA98C]/70 hover:text-[#EFE8DE] transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Contact column */}
          <div className="md:col-span-4">
            <div className="text-[7px] tracking-[0.4em] uppercase text-[#5C4738] mb-6">Find Us</div>
            <div className="space-y-4 text-sm text-[#9BA98C]/70">
              <div className="flex gap-3 items-start">
                <MapPin size={13} className="mt-0.5 shrink-0 text-[#5C4738]" />
                <span>12 Liberation Road, Accra, Ghana</span>
              </div>
              <div className="flex gap-3 items-start">
                <Clock size={13} className="mt-0.5 shrink-0 text-[#5C4738]" />
                <span>Mon–Fri 7am–8pm<br />Sat–Sun 8am–9pm</span>
              </div>
              <div className="flex gap-3 items-start">
                <Phone size={13} className="mt-0.5 shrink-0 text-[#5C4738]" />
                <span>+233 24 000 0000</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#3A3A3A] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[8px] tracking-[0.25em] uppercase text-[#5C4738]">
          <span>© 2024 SAYA. All rights reserved.</span>
          <span>Crafted with authenticity · Accra, Ghana</span>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function HomePage({ go }: { go: (p: Page) => void }) {
  return (
    <div className="bg-[#FAF8F5]">
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[680px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#2C2C2C]">
          <img
            src={u(PH.hero, 1920, 1200)}
            alt="Pure Brazilian acai bowl with fresh fruit"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2C2C2C]/30 via-transparent to-[#2C2C2C]/60" />
        </div>

        <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
          <Reveal>
            <div className="text-[8px] tracking-[0.5em] uppercase text-white/50 mb-10">
              Est. 2024 · Accra, Ghana
            </div>
          </Reveal>
          <Reveal delay={150}>
            <h1 style={SERIF} className="text-5xl sm:text-7xl lg:text-[90px] font-light italic leading-[1.08] mb-8 text-white">
              Brazilian Açaí.<br />
              Uji Matcha.<br />
              Accra Calm.
            </h1>
          </Reveal>
          <Reveal delay={300}>
            <p className="text-base md:text-lg text-white/65 max-w-md mx-auto leading-relaxed mb-12 font-light tracking-wide">
              A luxury specialty cafe and matcha bar built around authentic ingredients, refined preparation, and quiet minimalist design.
            </p>
          </Reveal>
          <Reveal delay={450}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => go("menu")}
                className="bg-white text-[#2C2C2C] text-[9px] tracking-[0.3em] uppercase px-9 py-4 rounded-full hover:bg-[#EFE8DE] transition-colors"
              >
                View Menu
              </button>
              <button
                onClick={() => go("reservations")}
                className="border border-white/40 text-white text-[9px] tracking-[0.3em] uppercase px-9 py-4 rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                Reserve a Table
              </button>
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
          <div className="text-[7px] tracking-[0.4em] uppercase">Scroll</div>
          <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* ── Brand Story ─────────────────────────────────────────────────────── */}
      <section className="py-28 md:py-40 px-6 md:px-14 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-center">
          <Reveal>
            <div>
              <Label>Our Story</Label>
              <h2 style={SERIF} className="text-4xl md:text-5xl lg:text-6xl font-light italic text-[#2C2C2C] leading-[1.15] mb-8">
                "Crafted with<br />authenticity."
              </h2>
              <p className="text-sm md:text-base text-[#5C4738]/75 leading-relaxed mb-5">
                SAYA is a luxury specialty cafe and matcha bar in Accra, created to introduce authentic Brazilian acai bowls to the local market with the same care usually reserved for fine coffee and tea.
              </p>
              <p className="text-sm md:text-base text-[#5C4738]/75 leading-relaxed mb-10">
                Every detail is considered: pure Brazilian acai prepared to preserve its natural richness, ceremonial-grade matcha from Uji, Kyoto, and signature treats made for a calm, elevated cafe experience.
              </p>
              <button
                onClick={() => go("about")}
                className="inline-flex items-center gap-3 text-[9px] tracking-[0.3em] uppercase text-[#5C4738] hover:gap-5 transition-all duration-300 group"
              >
                Read Our Story <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="relative">
              <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-[#EFE8DE]">
                <img
                  src={u(PH.cafe2, 800, 1100)}
                  alt="SAYA cafe interior in Accra"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#9BA98C] text-white px-8 py-5 rounded-2xl shadow-lg hidden md:block">
                <div style={SERIF} className="text-2xl font-light italic">100%</div>
                <div className="text-[7px] tracking-[0.3em] uppercase mt-1 text-white/80">Ceremonial Grade</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Signature Bowls ─────────────────────────────────────────────────── */}
      <section className="py-28 md:py-40 bg-[#EFE8DE]">
        <div className="px-6 md:px-14 max-w-[1440px] mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <Label>Handcrafted</Label>
                <h2 style={SERIF} className="text-4xl md:text-5xl font-light italic text-[#2C2C2C] leading-tight">
                  Signature Bowls
                </h2>
              </div>
              <button
                onClick={() => go("menu")}
                className="inline-flex items-center gap-3 text-[9px] tracking-[0.3em] uppercase text-[#5C4738] hover:gap-5 transition-all duration-300 group self-start md:self-auto"
              >
                Full Menu <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { img: PH.bowl1, name: "The Saya Classic", desc: "Pure Brazilian acai, granola, honey drizzle, fresh blueberries", price: "₵85", delay: 0 },
              { img: PH.bowl2, name: "Tropical Bloom", desc: "Pure acai, mango, passionfruit, coconut flakes, macadamia, agave", price: "₵95", delay: 150 },
              { img: PH.bowl3, name: "Kyoto Bowl", desc: "Pure acai, black sesame, matcha granola, yuzu honey, fresh fig", price: "₵105", delay: 300 },
            ].map(item => (
              <Reveal key={item.name} delay={item.delay}>
                <div className="group cursor-pointer">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-5 bg-[#E2D6C4]">
                    <img
                      src={u(item.img, 600, 750)}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 style={SERIF} className="text-lg font-light text-[#2C2C2C] italic">{item.name}</h3>
                    <span className="text-sm text-[#5C4738] ml-3 mt-0.5 shrink-0">{item.price}</span>
                  </div>
                  <p className="text-xs text-[#5C4738]/65 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Matcha Experience ───────────────────────────────────────────────── */}
      <section className="bg-[#5C4738] py-28 md:py-40">
        <div className="px-6 md:px-14 max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div>
                <div className="text-[9px] tracking-[0.4em] uppercase text-[#9BA98C] mb-4">Uji, Kyoto</div>
                <h2 style={SERIF} className="text-4xl md:text-5xl lg:text-6xl font-light italic text-[#EFE8DE] leading-[1.15] mb-8">
                  The Matcha<br />and Hojicha<br />Bar
                </h2>
                <p className="text-sm md:text-base text-[#EFE8DE]/55 leading-relaxed mb-5">
                  At the heart of SAYA is ceremonial-grade matcha sourced from Uji, Kyoto, prepared with precision for a vivid, umami-rich cup. Our hojicha lattes bring the same quiet craft through roasted green tea, soft sweetness, and a rounded finish.
                </p>
                <p className="text-sm md:text-base text-[#EFE8DE]/55 leading-relaxed mb-10">
                  Every drink is measured, whisked, and served with restraint. No shortcuts, no over-sweetening, just high-quality ingredients and refined preparation.
                </p>
                <button
                  onClick={() => go("menu")}
                  className="inline-flex items-center gap-3 text-[9px] tracking-[0.3em] uppercase text-[#9BA98C] hover:gap-5 transition-all duration-300 group"
                >
                  Explore Matcha <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#4a3a2e]">
                  <img src={u(PH.matcha1, 400, 600)} alt="Matcha ceremony preparation" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#4a3a2e] mt-10">
                  <img src={u(PH.matcha3, 400, 600)} alt="Japanese matcha whisk and bowl" className="w-full h-full object-cover" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Menu Preview ────────────────────────────────────────────────────── */}
      <section className="py-28 md:py-40 px-6 md:px-14 max-w-[1440px] mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <Label>Taste</Label>
            <h2 style={SERIF} className="text-4xl md:text-5xl font-light italic text-[#2C2C2C]">
              From the Menu
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { img: PH.acaiClassic, name: "Pure Acai Bowl", price: "₵85" },
            { img: PH.matchaCeremony, name: "Ceremonial Matcha", price: "₵55" },
            { img: PH.cookieChocolate, name: "NYC Chocolate Cookie", price: "₵42" },
            { img: PH.bagelCream, name: "Montreal Bagel", price: "₵58" },
          ].map((item, i) => (
            <Reveal key={item.name} delay={i * 100}>
              <div className="group cursor-pointer">
                <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-[#EFE8DE]">
                  <img
                    src={u(item.img, 400, 400)}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div style={SERIF} className="text-sm font-light italic text-[#2C2C2C]">{item.name}</div>
                <div className="text-[10px] text-[#9BA98C] mt-1 tracking-wide">{item.price}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="text-center mt-14">
            <button
              onClick={() => go("menu")}
              className="bg-[#5C4738] text-[#FAF8F5] text-[9px] tracking-[0.3em] uppercase px-10 py-4 rounded-full hover:bg-[#2C2C2C] transition-colors"
            >
              View Full Menu
            </button>
          </div>
        </Reveal>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────────── */}
      <section className="py-28 md:py-40 bg-[#EFE8DE]">
        <div className="px-6 md:px-14 max-w-[1440px] mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <Label>Guests</Label>
              <h2 style={SERIF} className="text-4xl md:text-5xl font-light italic text-[#2C2C2C]">
                What They Say
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                quote: "The matcha is clean, vivid, and properly prepared. It feels rare to find something this refined and authentic in Accra.",
                author: "Abena K.", role: "Wellness Coach, East Legon", delay: 0,
              },
              {
                quote: "Every detail — the space, the acai bowls, the cookies, the service — communicates intention. SAYA is calm without feeling cold.",
                author: "Kofi A.", role: "Creative Director, Accra", delay: 150,
              },
              {
                quote: "The acai tastes pure and rich, and the banana pudding is exactly the kind of simple luxury I want with an afternoon coffee.",
                author: "Nana O.", role: "Food Journalist", delay: 300,
              },
            ].map(t => (
              <Reveal key={t.author} delay={t.delay}>
                <div className="bg-[#FAF8F5] rounded-2xl p-8 h-full flex flex-col">
                  <div style={SERIF} className="text-5xl text-[#9BA98C]/40 leading-none mb-4">&ldquo;</div>
                  <p className="text-sm text-[#5C4738]/75 leading-relaxed italic flex-1 mb-8">{t.quote}</p>
                  <div>
                    <div className="text-[10px] font-medium text-[#2C2C2C] tracking-wider uppercase">{t.author}</div>
                    <div className="text-[9px] text-[#9BA98C] tracking-wider mt-1 uppercase">{t.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Instagram Gallery ───────────────────────────────────────────────── */}
      <section className="py-28 md:py-40 px-6 md:px-14 max-w-[1440px] mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <Label>Instagram</Label>
            <h2 style={SERIF} className="text-4xl md:text-5xl font-light italic text-[#2C2C2C] mb-3">
              @sayaacai
            </h2>
            <p className="text-[9px] tracking-[0.3em] uppercase text-[#9BA98C]">Acai, matcha, cookies, and quiet cafe moments</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
          {[PH.bowl1, PH.matcha1, PH.cafe1, PH.wellness1, PH.bowl3, PH.matcha3].map((photo, i) => (
            <Reveal key={photo} delay={i * 70}>
              <div className="aspect-square rounded-lg md:rounded-xl overflow-hidden bg-[#EFE8DE] group cursor-pointer">
                <div className="relative w-full h-full">
                  <img
                    src={u(photo, 300, 300)}
                    alt={`SAYA Instagram — ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-[#2C2C2C]/0 group-hover:bg-[#2C2C2C]/35 transition-colors duration-300 flex items-center justify-center">
                    <Camera size={18} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Reservation Banner ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[#2C2C2C]">
          <img
            src={u(PH.cafe3, 1440, 700)}
            alt="SAYA cafe space"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative z-10 py-36 px-6 text-center">
          <Reveal>
            <div className="text-[9px] tracking-[0.4em] uppercase text-[#9BA98C] mb-5">Join Us</div>
            <h2 style={SERIF} className="text-4xl md:text-6xl font-light italic text-white mb-6 leading-tight">
              Reserve Your Table
            </h2>
            <p className="text-white/50 text-sm md:text-base mb-12 max-w-sm mx-auto leading-relaxed">
              Settle in for a focused work session, a quiet catch-up, or a refined cafe moment. Private events and group bookings available.
            </p>
            <button
              onClick={() => go("reservations")}
              className="bg-[#9BA98C] text-white text-[9px] tracking-[0.3em] uppercase px-10 py-4 rounded-full hover:bg-[#8a9878] transition-colors"
            >
              Make a Reservation
            </button>
          </Reveal>
        </div>
      </section>

      {/* ── Newsletter ──────────────────────────────────────────────────────── */}
      <section className="py-28 md:py-36 px-6">
        <Reveal className="max-w-lg mx-auto text-center">
          <Label>Stay Close</Label>
          <h2 style={SERIF} className="text-4xl md:text-5xl font-light italic text-[#2C2C2C] mb-4">
            The SAYA Journal
          </h2>
          <p className="text-sm text-[#5C4738]/65 leading-relaxed mb-10">
            Monthly notes on seasonal bowls, matcha bar specials, cookie drops, and new cafe moments.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-5 py-4 rounded-full border border-[#E2D6C4] bg-transparent text-sm text-[#2C2C2C] placeholder:text-[#9BA98C]/50 outline-none focus:border-[#9BA98C] transition-colors"
            />
            <button className="bg-[#5C4738] text-[#FAF8F5] text-[9px] tracking-[0.2em] uppercase px-6 py-4 rounded-full hover:bg-[#2C2C2C] transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MENU PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const MENU_DATA: Record<MenuTab, { name: string; desc: string; price: string; img: string; tag?: string }[]> = {
  bowls: [
    { img: PH.acaiClassic, name: "The Saya Classic", desc: "Pure Brazilian acai, banana, house granola, raw honey drizzle, fresh blueberries", price: "₵85", tag: "Signature" },
    { img: PH.acaiBerry, name: "Tropical Bloom", desc: "Pure acai, mango, passionfruit, coconut flakes, macadamia, agave nectar", price: "₵95" },
    { img: PH.acaiKyoto, name: "Kyoto Bowl", desc: "Pure acai, black sesame, matcha granola, yuzu honey, fresh fig, white chocolate shavings", price: "₵105", tag: "Chef's Pick" },
    { img: PH.acaiSunrise, name: "Sunrise Bowl", desc: "Pure acai, citrus segments, turmeric granola, bee pollen, hemp seeds", price: "₵88" },
    { img: PH.acaiGolden, name: "Golden Hour", desc: "Pure acai, pineapple, chia seeds, cacao nibs, cashew butter, coconut cream", price: "₵90" },
    { img: PH.acaiMinimal, name: "Minimalist Bowl", desc: "Pure acai, banana, strawberry, almond butter, toasted coconut, sea salt", price: "₵92" },
  ],
  matcha: [
    { img: PH.matchaCeremony, name: "Ceremonial Matcha", desc: "Uji, Kyoto ceremonial-grade matcha, stone-ground tencha, hand-whisked with water", price: "₵55", tag: "Signature" },
    { img: PH.matchaLatte, name: "Matcha Latte", desc: "Ceremonial matcha, organic oat milk, light raw honey, served warm or iced", price: "₵65" },
    { img: PH.matchaIced, name: "Iced Matcha", desc: "Ceremonial matcha, oat milk, slow-poured over ice for a clean layered finish", price: "₵65" },
    { img: PH.matchaTonic, name: "Matcha Tonic", desc: "Sparkling mineral water, ceremonial matcha, yuzu, fresh mint, light agave", price: "₵70", tag: "Seasonal" },
    { img: PH.hojichaLatte, name: "Hojicha Latte", desc: "Roasted Japanese green tea, oat milk, soft vanilla, served warm or iced", price: "₵68" },
    { img: PH.hojichaCream, name: "Iced Hojicha Cream", desc: "Roasted hojicha, cold milk, house cream float, light brown sugar", price: "₵72" },
  ],
  drinks: [
    { img: PH.coldBrew, name: "Cold Brew Espresso", desc: "Single-origin Ethiopian, 18-hour cold steep, served over ice", price: "₵60" },
    { img: PH.coconutCoffee, name: "Coconut Cold Brew", desc: "Cold brew, coconut cream, Madagascar vanilla, light agave", price: "₵70" },
    { img: PH.lemonade, name: "SAYA Lemonade", desc: "Fresh lemon, elderflower, sparkling water, and a clean citrus finish", price: "₵65", tag: "Signature" },
    { img: PH.hibiscusFizz, name: "Hibiscus Fizz", desc: "Organic hibiscus, sparkling mineral water, fresh ginger, honey, lemon", price: "₵60" },
    { img: PH.tropicalJuice, name: "Tropical Juice", desc: "Fresh-pressed passionfruit, mango, pineapple, lime, no added sugar", price: "₵55" },
    { img: PH.coconutKefir, name: "Coconut Water Kefir", desc: "Probiotic-rich coconut water kefir, fresh ginger, turmeric, lime", price: "₵58" },
  ],
  cookies: [
    { img: PH.cookieChocolate, name: "NYC Chocolate Chip Cookie", desc: "Thick NYC-style cookie, brown butter dough, dark chocolate pools, flaky salt", price: "₵42", tag: "Signature" },
    { img: PH.cookieMatcha, name: "Matcha White Chocolate Cookie", desc: "Soft-baked NYC-style cookie, Uji matcha, Belgian white chocolate, sea salt", price: "₵44" },
    { img: PH.cookiePecan, name: "Brown Butter Pecan Cookie", desc: "Brown butter dough, roasted pecans, dark chocolate chunks, caramel notes", price: "₵42" },
    { img: PH.cookieCacao, name: "Dark Cacao Tahini Cookie", desc: "Single-origin cacao, toasted sesame tahini, muscovado sugar, flaky salt", price: "₵40" },
    { img: PH.cookieCoconut, name: "Coconut Oat Cookie", desc: "Rolled oats, toasted coconut, Ghanaian honey, almond flour, vanilla bean", price: "₵38" },
    { img: PH.cookieThumbprint, name: "Acai Jam Thumbprint", desc: "Almond cookie, house acai berry jam, coconut sugar dust", price: "₵42", tag: "Seasonal" },
  ],
  pastries: [
    { img: PH.bagelCream, name: "Hand-Rolled Montreal Bagel", desc: "Honey-water boiled, sesame crust, served with cultured butter or cream cheese", price: "₵58", tag: "Signature" },
    { img: PH.bananaPudding, name: "Classic Banana Pudding", desc: "Vanilla custard, fresh banana, wafer crumb, softly whipped cream", price: "₵52", tag: "Popular" },
    { img: PH.croissant, name: "Matcha Croissant", desc: "House-made laminated dough, ceremonial matcha filling, white chocolate glaze", price: "₵45" },
    { img: PH.bananaBread, name: "Banana Bread", desc: "Dark cacao swirl, organic bananas, toasted walnut, oat crust", price: "₵40" },
    { img: PH.acaiTart, name: "Acai Tart", desc: "Almond shell pastry, coconut cream, fresh acai, seasonal berries", price: "₵55" },
    { img: PH.madeleines, name: "Yuzu Madeleines", desc: "Traditional French madeleines, fresh yuzu zest, light honey, box of 4", price: "₵48" },
  ],
};

function MenuPage() {
  const [tab, setTab] = useState<MenuTab>("bowls");
  const tabs: [MenuTab, string][] = [["bowls", "Acai Bowls"], ["matcha", "Matcha & Hojicha"], ["drinks", "Drinks"], ["cookies", "Cookies"], ["pastries", "Pastries"]];

  return (
    <div className="bg-[#FAF8F5] pt-20 md:pt-24">
      {/* Header */}
      <div className="bg-[#2C2C2C] py-24 md:py-32 px-6 text-center">
        <Reveal>
          <div className="text-[9px] tracking-[0.4em] uppercase text-[#9BA98C] mb-4">Our Offerings</div>
          <h1 style={SERIF} className="text-5xl md:text-7xl font-light italic text-white">
            The Menu
          </h1>
          <p className="text-white/45 text-sm md:text-base mt-6 max-w-sm mx-auto leading-relaxed">
            Brazilian acai, Uji matcha, NYC-style cookies, Montreal bagels, and simple luxuries prepared with restraint.
          </p>
        </Reveal>
      </div>

      {/* Category Tabs */}
      <div className="sticky top-16 md:top-20 bg-[#FAF8F5]/95 backdrop-blur-sm border-b border-[#E2D6C4] z-40">
        <div className="max-w-[1440px] mx-auto px-6 md:px-14">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {tabs.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`shrink-0 text-[9px] tracking-[0.3em] uppercase py-5 px-6 border-b-2 transition-all duration-300 ${
                  tab === key
                    ? "border-[#5C4738] text-[#5C4738]"
                    : "border-transparent text-[#8A7968] hover:text-[#2C2C2C]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-14 py-20 md:py-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {MENU_DATA[tab].map((item, i) => (
            <Reveal key={item.name} delay={i * 80}>
              <div className="group cursor-pointer">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-[#EFE8DE]">
                  <img
                    src={u(item.img, 600, 450)}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {item.tag && (
                    <div className="absolute top-4 left-4 bg-[#9BA98C] text-white text-[8px] tracking-[0.25em] uppercase px-3 py-1.5 rounded-full">
                      {item.tag}
                    </div>
                  )}
                </div>
                <div className="flex items-start justify-between mb-2">
                  <h3 style={SERIF} className="text-xl font-light italic text-[#2C2C2C]">{item.name}</h3>
                  <span className="text-base text-[#5C4738] ml-4 mt-0.5 shrink-0">{item.price}</span>
                </div>
                <p className="text-xs text-[#8A7968] leading-relaxed mb-4">{item.desc}</p>
                <button className="inline-flex items-center gap-2 text-[9px] tracking-[0.25em] uppercase text-[#9BA98C] hover:text-[#5C4738] transition-colors group/btn">
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center group-hover/btn:bg-[#5C4738] group-hover/btn:border-[#5C4738] group-hover/btn:text-white transition-all">
                    <span className="text-base leading-none mb-0.5">+</span>
                  </span>
                  Add to Order
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Allergen note */}
      <div className="bg-[#EFE8DE] py-10 px-6 text-center">
        <p className="text-[9px] tracking-[0.25em] uppercase text-[#9BA98C]">
          All items can be adapted for dietary requirements · Please inform our team of any allergies
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ABOUT PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function AboutPage() {
  return (
    <div className="bg-[#FAF8F5] pt-20 md:pt-24">
      {/* Hero */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden bg-[#2C2C2C]">
        <img
          src={u(PH.cafe4, 1440, 800)}
          alt="SAYA specialty cafe interior"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex items-end px-6 md:px-14 pb-16 md:pb-24 max-w-[1440px] mx-auto">
          <Reveal>
            <div className="text-[9px] tracking-[0.4em] uppercase text-[#9BA98C] mb-4">Our Story</div>
            <h1 style={SERIF} className="text-5xl md:text-7xl lg:text-8xl font-light italic text-white leading-tight max-w-3xl">
              A Specialty Cafe Built on Craft.
            </h1>
          </Reveal>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-28 md:py-40 px-6 md:px-14 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
          <Reveal className="lg:col-span-5">
            <div>
              <Label>Founded 2024</Label>
              <h2 style={SERIF} className="text-4xl md:text-5xl font-light italic text-[#2C2C2C] leading-[1.15] mb-8">
                The Idea of SAYA
              </h2>
              <p className="text-sm md:text-base text-[#5C4738]/75 leading-relaxed mb-5">
                SAYA is a luxury specialty cafe and matcha bar in Accra, Ghana, built around craftsmanship, authenticity, and calm design. It became known for introducing authentic Brazilian acai bowls to the local market.
              </p>
              <p className="text-sm md:text-base text-[#5C4738]/75 leading-relaxed">
                The cafe brings together pure Brazilian acai, ceremonial-grade Uji matcha, NYC-style cookies, hojicha lattes, Montreal bagels, and classic banana pudding in a setting that feels serene, minimal, and elevated.
              </p>
            </div>
          </Reveal>
          <Reveal delay={200} className="lg:col-span-7">
            <div className="aspect-[16/10] rounded-3xl overflow-hidden bg-[#EFE8DE]">
              <img src={u(PH.cafe1, 1200, 750)} alt="Café interior" className="w-full h-full object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Brazilian Inspiration */}
      <section className="py-28 md:py-40 bg-[#EFE8DE]">
        <div className="px-6 md:px-14 max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <Reveal>
              <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-[#E2D6C4]">
                <img src={u(PH.bowl3, 700, 900)} alt="Brazilian acai bowl inspiration" className="w-full h-full object-cover" />
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div>
                <div className="text-[9px] tracking-[0.4em] uppercase text-[#9BA98C] mb-4">Belém, Brazil</div>
                <h2 style={SERIF} className="text-4xl md:text-5xl font-light italic text-[#2C2C2C] leading-[1.15] mb-8">
                  Authentic Brazilian Acai
                </h2>
                <p className="text-sm md:text-base text-[#5C4738]/75 leading-relaxed mb-5">
                  Acai has been a staple in the Amazon for centuries, valued for its deep flavor and natural richness long before it became a global trend. At SAYA, it is treated as a craft ingredient, not a garnish.
                </p>
                <p className="text-sm md:text-base text-[#5C4738]/75 leading-relaxed">
                  Each bowl is prepared to preserve the fruit's pure character, then finished with considered textures, fruit, and house-made details that keep the experience generous but refined.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Japanese Matcha */}
      <section className="py-28 md:py-40 bg-[#5C4738]">
        <div className="px-6 md:px-14 max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <Reveal>
              <div>
                <div className="text-[9px] tracking-[0.4em] uppercase text-[#9BA98C] mb-4">Uji, Kyoto</div>
                <h2 style={SERIF} className="text-4xl md:text-5xl font-light italic text-[#EFE8DE] leading-[1.15] mb-8">
                  Uji Matcha and Hojicha
                </h2>
                <p className="text-sm md:text-base text-[#EFE8DE]/55 leading-relaxed mb-5">
                  Our ceremonial-grade matcha is sourced from Uji, Kyoto, where shade-grown tencha is prized for vivid color, sweetness, and umami. It anchors the matcha bar with clarity and depth.
                </p>
                <p className="text-sm md:text-base text-[#EFE8DE]/55 leading-relaxed">
                  Hojicha brings a softer roasted profile to the menu, especially in lattes that feel warm, balanced, and easy to return to. Both are prepared with precision and restraint.
                </p>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-[#4a3a2e]">
                <img src={u(PH.matcha1, 700, 900)} alt="Japanese matcha ceremony" className="w-full h-full object-cover" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-28 md:py-40 px-6 md:px-14 max-w-[1440px] mx-auto text-center">
        <Reveal className="max-w-3xl mx-auto">
          <Label>Philosophy</Label>
          <h2 style={SERIF} className="text-4xl md:text-6xl font-light italic text-[#2C2C2C] leading-[1.15] mb-10">
            Quality, Calm, and Intention
          </h2>
          <p className="text-base md:text-lg text-[#5C4738]/65 leading-relaxed mb-6">
            SAYA is designed for the moments between obligations: a focused work session, a quiet catch-up, or a refined cafe experience that does not ask to be rushed.
          </p>
          <p className="text-base md:text-lg text-[#5C4738]/65 leading-relaxed">
            The space is minimal, calm, and thoughtfully styled so the quality of the ingredients, preparation, and hospitality can hold the attention.
          </p>
        </Reveal>

        {/* 3 pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 mt-20">
          {[
            { icon: Leaf, title: "Authenticity", desc: "Brazilian acai and Uji matcha treated with respect for origin, flavor, and preparation." },
            { icon: Star, title: "Craft", desc: "Refined techniques, restrained sweetness, and a menu edited for quality over excess." },
            { icon: Users, title: "Atmosphere", desc: "A serene Accra cafe for work sessions, quiet catch-ups, and elevated everyday pauses." },
          ].map((p, i) => (
            <Reveal key={p.title} delay={i * 150}>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full border border-[#E2D6C4] flex items-center justify-center mx-auto mb-5">
                  <p.icon size={16} className="text-[#9BA98C]" />
                </div>
                <h3 style={SERIF} className="text-xl font-light italic text-[#2C2C2C] mb-3">{p.title}</h3>
                <p className="text-sm text-[#8A7968] leading-relaxed">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="pb-28 md:pb-40 px-6 md:px-14 max-w-[1440px] mx-auto">
        <Reveal>
          <div className="mb-12">
            <Label>Gallery</Label>
            <h2 style={SERIF} className="text-4xl md:text-5xl font-light italic text-[#2C2C2C]">The Space</h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[PH.cafe2, PH.cafe3, PH.matcha3, PH.bowl1, PH.wellness1, PH.matcha2].map((photo, i) => (
            <Reveal key={photo} delay={i * 80}>
              <div className={`rounded-2xl overflow-hidden bg-[#EFE8DE] ${i === 0 || i === 3 ? "aspect-[4/5]" : "aspect-square"}`}>
                <img src={u(photo, 500, 600)} alt={`SAYA gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// RESERVATIONS PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function ReservationsPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", time: "", guests: "2", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputCls = "w-full bg-transparent border border-[#E2D6C4] rounded-xl px-5 py-4 text-sm text-[#2C2C2C] placeholder:text-[#9BA98C]/50 outline-none focus:border-[#9BA98C] transition-colors";

  return (
    <div className="bg-[#FAF8F5] pt-20 md:pt-24">
      {/* Hero */}
      <div className="relative h-[55vh] min-h-[400px] overflow-hidden bg-[#2C2C2C]">
        <img src={u(PH.cafe1, 1440, 700)} alt="Reserve at SAYA" className="w-full h-full object-cover opacity-45" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <Reveal>
            <div className="text-[9px] tracking-[0.4em] uppercase text-[#9BA98C] mb-4">Reservations</div>
            <h1 style={SERIF} className="text-5xl md:text-7xl font-light italic text-white">
              Reserve Your Table
            </h1>
            <p className="text-white/45 text-sm mt-6 max-w-sm mx-auto leading-relaxed">
              Book a table for a focused work session, a quiet catch-up, or a refined cafe experience. Walk-ins are welcome based on availability.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Form + Hours */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-14 py-24 md:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Booking form */}
          <div className="lg:col-span-7">
            <Reveal>
              <Label>Book a Table</Label>
              <h2 style={SERIF} className="text-4xl font-light italic text-[#2C2C2C] mb-10">Make a Reservation</h2>
            </Reveal>

            {submitted ? (
              <Reveal>
                <div className="bg-[#EFE8DE] rounded-3xl p-12 text-center">
                  <div style={SERIF} className="text-5xl text-[#9BA98C] mb-4">✓</div>
                  <h3 style={SERIF} className="text-2xl font-light italic text-[#2C2C2C] mb-3">Reservation Received</h3>
                  <p className="text-sm text-[#8A7968] leading-relaxed">
                    Thank you, {form.name}. We'll confirm your booking at {form.email} within the hour. We look forward to welcoming you.
                  </p>
                </div>
              </Reveal>
            ) : (
              <Reveal delay={100}>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input required className={inputCls} placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    <input required type="email" className={inputCls} placeholder="Email Address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input className={inputCls} placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    <select className={inputCls} value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })}>
                      {["1", "2", "3", "4", "5", "6", "7", "8+"].map(n => (
                        <option key={n} value={n}>{n} {n === "1" ? "Guest" : "Guests"}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input required type="date" className={inputCls} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                    <select className={inputCls} value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}>
                      <option value="">Preferred Time</option>
                      {["7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    className={`${inputCls} resize-none h-28`}
                    placeholder="Special requests or dietary requirements (optional)"
                    value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#5C4738] text-[#FAF8F5] text-[9px] tracking-[0.3em] uppercase py-5 rounded-full hover:bg-[#2C2C2C] transition-colors mt-2"
                  >
                    Confirm Reservation
                  </button>
                </form>
              </Reveal>
            )}
          </div>

          {/* Sidebar info */}
          <div className="lg:col-span-5 space-y-8">
            <Reveal delay={200}>
              <div className="bg-[#EFE8DE] rounded-3xl p-8">
                <div className="text-[9px] tracking-[0.3em] uppercase text-[#9BA98C] mb-5">Opening Hours</div>
                <div className="space-y-3">
                  {[
                    ["Monday – Friday", "7:00 AM – 8:00 PM"],
                    ["Saturday", "8:00 AM – 9:00 PM"],
                    ["Sunday", "8:00 AM – 9:00 PM"],
                    ["Public Holidays", "9:00 AM – 6:00 PM"],
                  ].map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="text-[#5C4738]">{day}</span>
                      <span className="text-[#8A7968]">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="bg-[#5C4738] rounded-3xl p-8 text-[#EFE8DE]">
                <div className="text-[9px] tracking-[0.3em] uppercase text-[#9BA98C] mb-4">Private Events</div>
                <h3 style={SERIF} className="text-2xl font-light italic mb-4">Host Your Event at SAYA</h3>
                <p className="text-sm text-[#EFE8DE]/60 leading-relaxed mb-6">
                  Available for private bookings, brand activations, tastings, and intimate gatherings. Capacity up to 40 guests. Custom menus available.
                </p>
                <button className="inline-flex items-center gap-2 text-[9px] tracking-[0.25em] uppercase text-[#9BA98C] hover:gap-4 transition-all group">
                  Enquire <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div className="bg-[#EFE8DE] rounded-3xl p-8">
                <div className="text-[9px] tracking-[0.3em] uppercase text-[#9BA98C] mb-5">Location</div>
                <div className="flex gap-3 text-sm text-[#5C4738] mb-3">
                  <MapPin size={14} className="mt-0.5 shrink-0 text-[#9BA98C]" />
                  <span>12 Liberation Road, Accra, Ghana</span>
                </div>
                <div className="flex gap-3 text-sm text-[#8A7968]">
                  <Phone size={14} className="mt-0.5 shrink-0 text-[#9BA98C]" />
                  <span>+233 24 000 0000</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EVENTS PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const EVENTS = [
  {
    img: PH.matcha1, category: "Matcha Tasting", title: "Ceremonial Matcha Workshop",
    date: "Every Saturday", time: "9:00 AM – 11:00 AM",
    desc: "Explore ceremonial-grade Uji matcha, learn how we whisk and balance each cup, and taste the difference between matcha and hojicha. Limited to 8 guests.",
    price: "₵120 per person", tag: "Recurring",
  },
  {
    img: PH.bowl1, category: "Acai Tasting", title: "Brazilian Acai Morning",
    date: "Every Sunday", time: "8:00 AM – 10:00 AM",
    desc: "A focused tasting of pure Brazilian acai bowls, house toppings, and pairing notes with matcha, coffee, and fresh juice. Booking essential.",
    price: "₵150 per person", tag: "Recurring",
  },
  {
    img: PH.wellness2, category: "Cookie Drop", title: "NYC Cookie Friday",
    date: "Every Friday", time: "4:00 PM – 7:00 PM",
    desc: "A weekly release of thick NYC-style luxury cookies, including matcha white chocolate, brown butter pecan, and dark cacao tahini.",
    price: "From ₵38", tag: "Weekly",
  },
  {
    img: PH.cafe4, category: "Bagel Morning", title: "Montreal Bagel Brunch",
    date: "Saturdays", time: "10:00 AM – 1:00 PM",
    desc: "Hand-rolled Montreal bagels, simple spreads, cold brew, matcha, and a calm late-morning table for friends or focused work.",
    price: "From ₵58", tag: "Weekend",
  },
  {
    img: PH.matcha3, category: "Tasting Menu", title: "Matcha, Hojicha & Sweets",
    date: "Monthly", time: "12:00 PM – 3:00 PM",
    desc: "A small tasting menu pairing Uji matcha, hojicha lattes, NYC-style cookies, banana pudding, and seasonal cafe specials.",
    price: "₵250 per person", tag: "Exclusive",
  },
  {
    img: PH.wellness3, category: "Cafe Session", title: "Quiet Work Morning",
    date: "Weekdays", time: "7:30 AM – 11:00 AM",
    desc: "Reserved quiet seating, a signature bowl or bagel, and your choice of matcha, hojicha, or coffee for a slower start to the workday.",
    price: "₵120 per person", tag: "Weekday",
  },
];

function EventsPage() {
  return (
    <div className="bg-[#FAF8F5] pt-20 md:pt-24">
      {/* Header */}
      <div className="bg-[#EFE8DE] py-24 md:py-32 px-6 md:px-14 max-w-[1440px] mx-auto">
        <Reveal>
          <Label>At SAYA</Label>
          <h1 style={SERIF} className="text-5xl md:text-7xl font-light italic text-[#2C2C2C] mb-6">
            Events & Gatherings
          </h1>
          <p className="text-sm md:text-base text-[#8A7968] max-w-md leading-relaxed">
            Tastings, cookie drops, bagel mornings, and quiet cafe sessions built around quality, authenticity, and calm.
          </p>
        </Reveal>
      </div>

      {/* Events Grid */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-14 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {EVENTS.map((event, i) => (
            <Reveal key={event.title} delay={i * 80}>
              <div className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-[0_2px_20px_rgba(92,71,56,0.07)] hover:shadow-[0_8px_40px_rgba(92,71,56,0.12)] transition-shadow duration-500 h-full flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden bg-[#EFE8DE]">
                  <img
                    src={u(event.img, 600, 380)}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#9BA98C] text-white text-[8px] tracking-[0.25em] uppercase px-3 py-1.5 rounded-full">
                      {event.tag}
                    </span>
                  </div>
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <div className="text-[8px] tracking-[0.3em] uppercase text-[#9BA98C] mb-2">{event.category}</div>
                  <h3 style={SERIF} className="text-xl font-light italic text-[#2C2C2C] mb-3">{event.title}</h3>
                  <div className="flex gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-[9px] tracking-wide text-[#8A7968]">
                      <Calendar size={10} className="text-[#9BA98C]" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] tracking-wide text-[#8A7968]">
                      <Clock size={10} className="text-[#9BA98C]" />
                      {event.time}
                    </div>
                  </div>
                  <p className="text-xs text-[#8A7968] leading-relaxed mb-6 flex-1">{event.desc}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-[#EFE8DE]">
                    <span className="text-sm text-[#5C4738]">{event.price}</span>
                    <button className="inline-flex items-center gap-2 text-[8px] tracking-[0.25em] uppercase text-[#9BA98C] hover:text-[#5C4738] transition-colors group/btn">
                      Book <ChevronRight size={11} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Private events CTA */}
      <section className="bg-[#2C2C2C] py-24 md:py-32 px-6 text-center">
        <Reveal>
          <div className="text-[9px] tracking-[0.4em] uppercase text-[#9BA98C] mb-4">Private Bookings</div>
          <h2 style={SERIF} className="text-4xl md:text-5xl font-light italic text-white mb-6">Host Your Own Gathering</h2>
          <p className="text-white/45 text-sm max-w-sm mx-auto leading-relaxed mb-10">
            From tastings and brand activations to private cafe gatherings. Let us design an experience for your guests.
          </p>
          <button className="border border-white/30 text-white text-[9px] tracking-[0.3em] uppercase px-10 py-4 rounded-full hover:bg-white/10 transition-colors">
            Get in Touch
          </button>
        </Reveal>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTACT PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const inputCls = "w-full bg-transparent border border-[#E2D6C4] rounded-xl px-5 py-4 text-sm text-[#2C2C2C] placeholder:text-[#9BA98C]/50 outline-none focus:border-[#9BA98C] transition-colors";

  return (
    <div className="bg-[#FAF8F5] pt-20 md:pt-24">
      {/* Header */}
      <div className="py-24 md:py-32 px-6 md:px-14 max-w-[1440px] mx-auto">
        <Reveal>
          <Label>Contact</Label>
          <h1 style={SERIF} className="text-5xl md:text-7xl font-light italic text-[#2C2C2C] mb-6">
            Say Hello
          </h1>
          <p className="text-sm md:text-base text-[#8A7968] max-w-md leading-relaxed">
            We'd love to hear from you. Whether it's a reservation, a private tasting, a brand enquiry, or simply a hello — we respond to every message within a day.
          </p>
        </Reveal>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-14 pb-28 md:pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Contact Info */}
          <div className="lg:col-span-4 space-y-6">
            <Reveal>
              <div className="bg-[#EFE8DE] rounded-3xl p-8">
                <div className="text-[8px] tracking-[0.35em] uppercase text-[#9BA98C] mb-6">Visit Us</div>
                <div className="space-y-4 text-sm">
                  <div className="flex gap-3 items-start">
                    <MapPin size={14} className="mt-0.5 shrink-0 text-[#9BA98C]" />
                    <div>
                      <div className="text-[#2C2C2C] mb-0.5">12 Liberation Road</div>
                      <div className="text-[#8A7968]">Accra, Ghana</div>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <Clock size={14} className="mt-0.5 shrink-0 text-[#9BA98C]" />
                    <div className="text-[#8A7968]">
                      <div>Mon–Fri: 7:00 AM – 8:00 PM</div>
                      <div>Sat–Sun: 8:00 AM – 9:00 PM</div>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <Phone size={14} className="shrink-0 text-[#9BA98C]" />
                    <span className="text-[#5C4738]">+233 24 000 0000</span>
                  </div>
                  <div className="flex gap-3 items-center">
                    <MessageCircle size={14} className="shrink-0 text-[#9BA98C]" />
                    <span className="text-[#5C4738]">hello@sayaacai.com</span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Map placeholder */}
            <Reveal delay={150}>
              <div className="rounded-3xl overflow-hidden bg-[#EFE8DE] aspect-square relative">
                <img src={u(PH.cafe3, 500, 500)} alt="SAYA location map view" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="bg-[#5C4738] text-white rounded-full p-3 shadow-lg mb-2">
                    <MapPin size={20} />
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 text-xs text-[#2C2C2C] font-medium">
                    SAYA · Liberation Road
                  </div>
                </div>
              </div>
            </Reveal>

            {/* WhatsApp */}
            <Reveal delay={200}>
              <a
                href="https://wa.me/233240000000"
                className="flex items-center gap-4 bg-[#25D366]/10 border border-[#25D366]/20 rounded-2xl p-5 hover:bg-[#25D366]/15 transition-colors group"
              >
                <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center shrink-0">
                  <MessageCircle size={18} className="text-white" />
                </div>
                <div>
                  <div className="text-sm text-[#2C2C2C] font-medium">Chat on WhatsApp</div>
                  <div className="text-xs text-[#8A7968]">Quick responses, 7am – 9pm</div>
                </div>
                <ChevronRight size={16} className="text-[#9BA98C] ml-auto group-hover:translate-x-1 transition-transform" />
              </a>
            </Reveal>

            {/* Social */}
            <Reveal delay={250}>
              <div className="flex gap-3">
                <a href="#" className="flex-1 flex items-center justify-center gap-2 border border-[#E2D6C4] rounded-xl py-3.5 text-[9px] tracking-[0.25em] uppercase text-[#8A7968] hover:border-[#9BA98C] hover:text-[#5C4738] transition-colors">
                  <Camera size={13} /> Instagram
                </a>
              </div>
            </Reveal>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-8">
            <Reveal delay={100}>
              <Label>Message Us</Label>
              <h2 style={SERIF} className="text-4xl font-light italic text-[#2C2C2C] mb-10">Send a Message</h2>
            </Reveal>

            {sent ? (
              <Reveal>
                <div className="bg-[#EFE8DE] rounded-3xl p-14 text-center">
                  <div style={SERIF} className="text-5xl text-[#9BA98C] mb-4 italic">Thank you.</div>
                  <p className="text-sm text-[#8A7968] leading-relaxed">
                    Your message has been received. We'll be in touch within 24 hours, usually much sooner.
                  </p>
                </div>
              </Reveal>
            ) : (
              <Reveal delay={150}>
                <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input required className={inputCls} placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    <input required type="email" className={inputCls} placeholder="Email Address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <select className={inputCls} value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                    <option value="">Subject</option>
                    <option>General Enquiry</option>
                    <option>Reservation</option>
                    <option>Private Event</option>
                    <option>Press & Media</option>
                    <option>Partnership</option>
                    <option>Other</option>
                  </select>
                  <textarea
                    required
                    className={`${inputCls} resize-none h-40`}
                    placeholder="Your message..."
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#5C4738] text-[#FAF8F5] text-[9px] tracking-[0.3em] uppercase py-5 rounded-full hover:bg-[#2C2C2C] transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState<Page>("home");

  const go = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] font-sans">
      <Nav page={page} go={go} />

      {page === "home" && <HomePage go={go} />}
      {page === "menu" && <MenuPage />}
      {page === "about" && <AboutPage />}
      {page === "reservations" && <ReservationsPage />}
      {page === "events" && <EventsPage />}
      {page === "contact" && <ContactPage />}

      <Footer go={go} />
    </div>
  );
}
