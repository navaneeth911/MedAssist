import { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// ─── Animation Variants ───────────────────────────────────────────────────────
import { Variants } from "framer-motion";
const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};
const stagger = (delay = 0.1) => ({
  hidden: {},
  visible: { transition: { staggerChildren: delay } },
});

// ─── Scroll Reveal Wrapper ────────────────────────────────────────────────────
interface RevealProps {
  children: React.ReactNode;
  variant?: any;
  delay?: number;
  className?: string;
}
function Reveal({
  children,
  variant = fadeInUp,
  delay = 0,
  className = "",
}: RevealProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      variants={variant}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
interface CounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
}

function Counter({
  target,
  suffix = "",
  prefix = "",
}: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(Math.round(start));
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  const display =
    target >= 1000
      ? (count / 1000).toFixed(count >= target ? 1 : 0) + "K"
      : count;

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
  onClick={() => navigate("/")}
  className="flex items-center gap-2.5 cursor-pointer"
>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
            M
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">
            MedAssist <span className="text-blue-600">AI</span>
          </span>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8 list-none">
          {["Features", "How It Works", "Doctors", "Contact"].map((link) => (
            <li key={link}>
              <a
                href="#"
                className="text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
  {token ? (
    <>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
          window.location.reload();
        }}
        className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:border-red-400 hover:text-red-600 transition-all duration-200"
      >
        Sign Out
      </button>

      <button
        onClick={() => navigate("/dashboard")}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
      >
        Go to Dashboard
      </button>
    </>
  ) : (
    <>
      <button
        onClick={() => navigate("/login")}
        className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:border-blue-400 hover:text-blue-600 transition-all duration-200"
      >
        Sign In
      </button>

      <button
        onClick={() => navigate("/register")}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
      >
        Get Started
      </button>
    </>
  )}
</div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-slate-700"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 px-6 pb-6"
          >
            <ul className="flex flex-col gap-4 pt-4 list-none">
              {["Features", "How It Works", "Dashboard", "Contact"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-slate-600 font-medium text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 mt-6">
              <button className="w-full py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium">
                Sign In
              </button>
              <button className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold">
                Get Started Free
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function Hero() {
  const navigate = useNavigate();
  return (
    <section 
    id = "home"
        className="relative min-h-screen bg-slate-50 overflow-hidden flex items-center">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[700px] h-[700px] bg-blue-500 rounded-full opacity-[0.07] blur-[100px] -top-48 -right-32" />
        <div className="absolute w-[500px] h-[500px] bg-sky-400 rounded-full opacity-[0.07] blur-[100px] -bottom-32 -left-24" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
        {/* Left Content */}
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          animate="visible"
          className="flex flex-col"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} className="mb-7">
            <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 text-blue-600 text-sm font-semibold">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Now with GPT-4 Vision · Real-Time Analysis
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-[-2.5px] text-slate-900 mb-5"
          >
            AI-Powered Healthcare{" "}
            <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
              Guidance in Seconds
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeInUp}
            className="text-lg text-slate-500 leading-relaxed mb-10 max-w-[500px]"
          >
            Describe your symptoms, receive intelligent health insights, understand risk
            levels, and find the right specialist instantly.
          </motion.p>

          {/* Buttons */}
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 mb-10">
           <motion.button
  onClick={() => navigate("/analyze")}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300"
>
  Start Assessment
</motion.button>
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="px-7 py-4 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold text-base hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              Learn More
            </motion.button>
          </motion.div>

          {/* Trust row */}
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-5">
            {["No credit card", "HIPAA Compliant", "Free to start"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <span className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                  ✓
                </span>
                {item}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right — Dashboard Visual */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="relative hidden lg:block"
        >
          {/* Floating badge top-left */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute -top-5 -left-8 z-10 bg-white rounded-2xl px-4 py-3 shadow-xl border border-slate-100 flex items-center gap-2 text-sm font-semibold text-slate-700"
          >
            <span className="text-emerald-500 text-lg">●</span>
            Assessment Complete · 2.4s
          </motion.div>

          {/* Floating badge bottom-right */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 1.5 }}
            className="absolute -bottom-4 -right-8 z-10 bg-white rounded-2xl px-4 py-3 shadow-xl border border-slate-100 flex items-center gap-2 text-sm font-semibold text-slate-700"
          >
            <span className="text-xl">👨‍⚕️</span>
            Dr. Patel · Available Now
          </motion.div>

          {/* Dashboard card */}
          <div className="bg-white rounded-3xl p-7 shadow-2xl shadow-slate-200 border border-slate-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <span className="font-bold text-slate-900">AI Health Assessment</span>
              <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                AI Active
              </div>
            </div>

            {/* Symptom input mock */}
            <div className="bg-slate-50 border-2 border-slate-100 rounded-xl p-4 mb-6 flex items-center gap-3 text-slate-400 text-sm">
              🔍 Persistent headache, fever, fatigue for 3 days...
            </div>

            {/* Risk bars */}
            <div className="mb-6">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                Risk Analysis
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { name: "Influenza", pct: 72, color: "from-amber-400 to-red-400" },
                  { name: "Sinusitis", pct: 48, color: "from-blue-500 to-blue-400" },
                  { name: "Migraine", pct: 30, color: "from-purple-500 to-purple-400" },
                ].map(({ name, pct, color }) => (
                  <div key={name} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-700 w-20 flex-shrink-0">
                      {name}
                    </span>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full bg-gradient-to-r ${color}`}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-400 w-8 text-right">
                      {pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Specialists */}
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              Recommended Specialists
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Dr. Sarah Nair", type: "General Physician", avail: "Available Today" },
                { name: "Dr. Arjun Menon", type: "Neurologist", avail: "Next: 2:00 PM" },
              ].map((s) => (
                <div key={s.name} className="bg-slate-50 rounded-xl p-3">
                  <div className="text-sm font-bold text-slate-800">{s.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{s.type}</div>
                  <div className="text-xs text-emerald-500 font-semibold mt-2">● {s.avail}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Trust Badges ─────────────────────────────────────────────────────────────
function TrustSection() {
  const badges = [
    { icon: "🔒", title: "Secure Auth", sub: "Bank-grade encryption", bg: "bg-blue-50" },
    { icon: "🧠", title: "AI Risk Analysis", sub: "98.4% accuracy", bg: "bg-emerald-50" },
    { icon: "👨‍⚕️", title: "Specialist Match", sub: "500+ specialists", bg: "bg-orange-50" },
    { icon: "📅", title: "Appointments", sub: "Book in 60 seconds", bg: "bg-purple-50" },
  ];

  return (
    <section className="bg-white border-y border-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {badges.map(({ icon, title, sub, bg }) => (
            <motion.div
              key={title}
              variants={fadeInUp}
              whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(37,99,235,0.10)" }}
              className="flex items-center gap-4 p-5 border-2 border-slate-100 rounded-2xl cursor-default transition-all duration-200 hover:border-blue-200"
            >
              <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>
                {icon}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────
function Features() {
  const features = [
    { icon: "🧬", title: "AI Symptom Analysis", desc: "Describe symptoms in plain language. Our AI parses clinical patterns across 10,000+ conditions in real time.", bg: "bg-blue-50" },
    { icon: "📊", title: "Risk Assessment", desc: "Get color-coded risk levels, severity scores, and urgency indicators to understand your health picture clearly.", bg: "bg-orange-50" },
    { icon: "🏥", title: "Specialist Recommendation", desc: "Matched to the right doctor based on your symptoms, location, insurance, and real-time availability.", bg: "bg-emerald-50" },
    { icon: "📅", title: "Appointment Scheduling", desc: "Book confirmed appointments with top specialists in under a minute — no phone calls, no waiting.", bg: "bg-purple-50" },
    { icon: "📈", title: "Health Insights Dashboard", desc: "Track your symptom history, risk trends, and health score over time with visual dashboards.", bg: "bg-teal-50" },
    { icon: "🗂️", title: "Assessment History", desc: "Every assessment saved and searchable. Share with doctors or reference your health timeline anytime.", bg: "bg-rose-50" },
  ];

  return (
    <section
  id="features"
  className="py-28 max-w-7xl mx-auto px-6 lg:px-10"
>
      <Reveal>
        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Features</p>
        <h2 className="text-4xl lg:text-5xl font-extrabold tracking-[-2px] text-slate-900 mb-4">
          Everything you need for smarter healthcare
        </h2>
        <p className="text-lg text-slate-500 leading-relaxed max-w-xl mb-16">
          From symptom input to specialist booking — all in one intelligent platform powered by advanced AI.
        </p>
      </Reveal>

      <motion.div
        variants={stagger(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map(({ icon, title, desc, bg }) => (
          <motion.div
            key={title}
            variants={fadeInUp}
            whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(37,99,235,0.10)" }}
            className="relative group bg-white border-2 border-slate-100 rounded-2xl p-7 transition-all duration-300 hover:border-blue-200 overflow-hidden cursor-default"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-sky-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center text-2xl mb-5 relative z-10`}>
              {icon}
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2 relative z-10">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed relative z-10">{desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { num: "1", icon: "💬", title: "Describe Symptoms", desc: "Type or speak your symptoms naturally. No medical jargon required — just tell us how you feel." },
    { num: "2", icon: "🤖", title: "AI Assessment", desc: "Our model analyzes your input against clinical data and generates a structured risk assessment in seconds." },
    { num: "3", icon: "🏥", title: "Get Specialist Guidance", desc: "Review matched specialists, read their profiles, and book a confirmed appointment instantly." },
  ];

  return (
    <section className="bg-white py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal className="text-center mb-16">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-[-2px] text-slate-900">
            From symptoms to specialist in 3 steps
          </h2>
        </Reveal>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-9 left-[22%] right-[22%] h-0.5 bg-gradient-to-r from-blue-600 to-sky-400 z-0" />

          {steps.map(({ num, icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 0.15}>
              <motion.div
                whileHover={{ y: -4 }}
                className="relative z-10 text-center px-4"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-blue-600 to-blue-500 text-white text-3xl font-extrabold flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200"
                >
                  {num}
                </motion.div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Benefits Section ─────────────────────────────────────────────────────────
function Benefits() {
  const benefits = [
    { icon: "⚡", title: "Fast Assessments", desc: "Full symptom analysis and risk report in under 3 seconds. No delays, no waiting rooms." },
    { icon: "✨", title: "Easy To Use", desc: "Designed for everyone — no medical background needed. Clear language, clear results." },
    { icon: "🤖", title: "AI-Powered Guidance", desc: "Trained on millions of clinical records and continuously updated with the latest research." },
    { icon: "🔐", title: "Secure Data Handling", desc: "HIPAA-compliant storage. Your health data is encrypted end-to-end and never sold." },
    { icon: "🎯", title: "Smart Recommendations", desc: "Personalized specialist matching using your health history, location, and availability." },
    { icon: "🌐", title: "Modern Healthcare Experience", desc: "A platform built for the digital age — mobile-first, intuitive, and available 24/7." },
  ];

  return (
    <section className="py-28 max-w-7xl mx-auto px-6 lg:px-10">
      <Reveal>
        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Why MedAssist AI</p>
        <h2 className="text-4xl lg:text-5xl font-extrabold tracking-[-2px] text-slate-900 mb-4">
          Healthcare that moves at your speed
        </h2>
        <p className="text-lg text-slate-500 leading-relaxed max-w-xl mb-16">
          Modern, intelligent, and designed around how people actually navigate their health.
        </p>
      </Reveal>

      <motion.div
        variants={stagger(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {benefits.map(({ icon, title, desc }) => (
          <motion.div
            key={title}
            variants={fadeInUp}
            whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(37,99,235,0.08)" }}
            className="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-100 rounded-2xl p-7 hover:border-blue-200 transition-all duration-300 cursor-default"
          >
            <div className="text-3xl mb-4">{icon}</div>
            <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

// ─── Stats Section ────────────────────────────────────────────────────────────
function Stats() {
  const stats = [
    { target: 48000, suffix: "+", label: "Assessments Generated" },
    { target: 500, suffix: "+", label: "Specialists Available" },
    { target: 12000, suffix: "+", label: "Appointments Managed" },
    { target: 98, suffix: "%", label: "User Satisfaction" },
  ];

  return (
    <section className="bg-gradient-to-r from-blue-900 via-blue-700 to-sky-500 py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center"
        >
          {stats.map(({ target, suffix, label }) => (
            <motion.div key={label} variants={fadeInUp}>
              <div className="text-5xl lg:text-6xl font-black text-white tracking-tight mb-2">
                <Counter target={target} suffix={suffix} />
              </div>
              <p className="text-blue-200 text-sm font-medium">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}



// ─── CTA Section ─────────────────────────────────────────────────────────────
function CTASection() {
  const navigate = useNavigate();
  return (
    <section className="py-28 px-6 lg:px-10">
      <Reveal className="max-w-3xl mx-auto">
        <div className="relative bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 rounded-3xl p-16 text-center overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute w-80 h-80 bg-white/5 rounded-full -top-32 -right-20 pointer-events-none" />
          <div className="absolute w-64 h-64 bg-white/5 rounded-full -bottom-24 -left-16 pointer-events-none" />

          <h2 className="relative text-4xl lg:text-5xl font-extrabold text-white tracking-[-2px] mb-4">
            Take Control of Your Health Today
          </h2>
          <p className="relative text-blue-200 text-lg leading-relaxed mb-10 max-w-lg mx-auto">
            Get AI-powered healthcare guidance and specialist recommendations instantly. No waiting rooms, no confusion.
          </p>
          <div className="relative flex flex-wrap gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-xl bg-white text-blue-700 font-bold text-base shadow-xl hover:shadow-2xl transition-shadow"
            >
              Start Assessment
            </motion.button>
           <motion.button onClick={() => navigate("/register")}>
  Create Account
</motion.button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    {
      title: "Quick Links",
      links: ["Home", "Features", "Pricing", "About"],
    },
    {
      title: "Features",
      links: ["Symptom Analysis", "Risk Assessment", "Specialists", "Appointments"],
    },
    {
      title: "Contact",
      links: ["hello@medassist.ai", "Support Center", "Privacy Policy", "Terms of Service"],
    },
  ];

  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center text-white font-extrabold text-xs">
                M
              </div>
              <span className="text-white font-bold text-lg tracking-tight">MedAssist AI</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-[260px]">
              AI-powered healthcare guidance that connects patients to the right specialist, faster than ever.
            </p>
          </div>

          {/* Columns */}
          {cols.map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-5">{title}</h4>
              <ul className="flex flex-col gap-3 list-none">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 hover:text-white transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">© 2026 MedAssist AI. All rights reserved.</p>
          <div className="flex gap-3">
            {["HIPAA", "SSL Secured", "SOC 2"].map((badge) => (
              <span
                key={badge}
                className="bg-slate-800 text-slate-500 text-[11px] font-semibold px-3 py-1 rounded-md"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page Root ────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <TrustSection />
      <Features />
      <HowItWorks />
      <Benefits />
      <Stats />
      
      <CTASection />
      <Footer />
    </div>
  );
}