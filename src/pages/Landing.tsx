"use client";

import type { MouseEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AnimatePresence,
  type MotionProps,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  Menu,
  X,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Trophy,
  Flame,
  Apple,
  Play,
  Target,
  BarChart3,
  Star,
  Brain,
  Layers,
  Users,
  CheckCircle2,
  Bot,
  Lightbulb,
  TrendingUp,
  BadgeCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import GrowFiLogo from "@/assets/GrowFi.png";

export const metadata = {
  title: "GrowFi | The Fun Way to Master Money",
  description:
    "GrowFi turns financial literacy into an adventure. Unlock streaks, evolve your frog mascot, and build real-world money skills with daily quests.",
  openGraph: {
    title: "GrowFi | The Fun Way to Master Money",
    description:
      "GrowFi turns financial literacy into an adventure. Unlock streaks, evolve your frog mascot, and build real-world money skills with daily quests.",
    url: "https://growfi.app",
    siteName: "GrowFi",
    images: [{ url: "/og-placeholder.png", width: 1200, height: 630, alt: "GrowFi marketing preview" }],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

type NavItem = {
  label: string;
  href: string;
};

type PillItem = {
  label: string;
};

type ScienceCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type MotivationCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type FAQItem = {
  question: string;
  answer: string;
};

const navItems: NavItem[] = [
  { label: "Features", href: "#features" },
  { label: "Science", href: "#science" },
  { label: "Pricing", href: "#pricing" },
  { label: "Download", href: "#download" },
  { label: "FAQ", href: "#faq" },
];

const languagePills: PillItem[] = [
  { label: "Budgeting" },
  { label: "Credit" },
  { label: "Investing" },
  { label: "Debt" },
  { label: "Taxes" },
  { label: "Insurance" },
];

const scienceHighlights: ScienceCard[] = [
  {
    title: "Learn",
    description: "Daily bites blend stories with real scenarios so new concepts feel familiar from day one.",
    icon: Sparkles,
  },
  {
    title: "Retain",
    description: "Spaced repetition resurfaces lessons right before you forget them, locking in money habits.",
    icon: Brain,
  },
  {
    title: "Act",
    description: "Micro-goals convert theory to action with checklists that connect to real bank-free demo data.",
    icon: CheckCircle2,
  },
];

const motivationHighlights: MotivationCard[] = [
  {
    title: "Evolving Frog",
    description: "Your mascot grows from tadpole to trailblazer with every streak you protect.",
    icon: Trophy,
  },
  {
    title: "Friend Leaderboards",
    description: "Team up with accountability buddies, celebrate wins, and nudge each other on slow days.",
    icon: Users,
  },
  {
    title: "Quest Variety",
    description: "XP, surprise chests, and season passes keep the experience fresh all year long.",
    icon: Flame,
  },
];

const personalizationChips = [
  "Emergency Fund",
  "Debt Snowball",
  "First-Time Investor",
  "Freelancer Taxes",
  "Credit Builder",
  "Travel Hacking",
];

const faqItems: FAQItem[] = [
  {
    question: "Is GrowFi really free?",
    answer:
      "Yes. The core learning path, quests, and frog evolution are free forever. GrowFi+ adds optional advanced analytics and partner perks.",
  },
  {
    question: "How much time do I need each day?",
    answer:
      "Five minutes is enough to keep your streak. Lessons are intentionally bite-sized so you can learn between classes, shifts, or commutes.",
  },
  {
    question: "Do I need a bank account to start?",
    answer:
      "No. We begin with bank-free demo data and adapt as you connect real accounts later on your own terms.",
  },
];

const StoreButton = ({
  label,
  caption,
  href,
  icon: Icon,
}: {
  label: string;
  caption: string;
  href: string;
  icon: LucideIcon;
}) => (
  <Button
    asChild
    variant="secondary"
    className="group h-auto w-full rounded-2xl border border-white/30 bg-white/80 px-6 py-4 text-left shadow-soft transition hover:-translate-y-1 hover:bg-white"
  >
    <a href={href} aria-label={label} target="_blank" rel="noreferrer">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/15 text-brand transition group-hover:bg-brand group-hover:text-white">
          <Icon className="h-6 w-6" />
        </span>
        <span className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-wide text-brand-dark/70">{caption}</span>
          <span className="text-lg font-semibold text-ink">{label}</span>
        </span>
      </div>
    </a>
  </Button>
);

const Landing = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);

  const revealProps = useMemo<Partial<MotionProps>>(
    () =>
      shouldReduceMotion
        ? { initial: false }
        : {
            initial: { opacity: 0, y: 40 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: "-80px" },
            transition: { duration: 0.6, ease: "easeOut" },
          },
    [shouldReduceMotion],
  );

  const staggerProps = useMemo<Partial<MotionProps>>(
    () =>
      shouldReduceMotion
        ? { initial: false }
        : {
            initial: "hidden",
            whileInView: "visible",
            viewport: { once: true, amount: 0.4 },
          },
    [shouldReduceMotion],
  );

  const handleNavClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith("#")) {
        return;
      }

      event.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth", block: "start" });
        setMobileOpen(false);
      }
    },
    [shouldReduceMotion],
  );

  const heroAnimation = shouldReduceMotion
    ? {}
    : {
        animate: {
          y: [0, -12, 0],
        },
        transition: {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        },
      };

  return (
    <div className="relative min-h-screen bg-surface-soft text-ink">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] overflow-hidden">
        <div className="absolute left-1/2 top-[-200px] h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute right-[15%] top-[160px] h-56 w-56 rounded-full bg-brand-accent/15 blur-3xl" />
      </div>

      <header className="sticky top-4 z-40 px-4 sm:px-6">
        <div className="mx-auto flex w-full max-w-5xl justify-center">
          <div className="island flex w-full items-center gap-2.5 rounded-full border border-white/70 bg-white/80 px-4 py-1.5 shadow-[0_16px_32px_-22px_rgba(15,23,42,0.48)] backdrop-blur-xl">
            <a
              href="#hero"
              className="inline-flex shrink-0 items-center"
              aria-label="GrowFi home"
            >
              <img
                src={GrowFiLogo}
                alt="GrowFi logo"
                className="h-28 w-28 max-w-full object-contain"
              />
              <span className="sr-only">GrowFi</span>
            </a>

            <nav className="hidden flex-1 items-center justify-center gap-6 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ink/70 lg:flex" aria-label="Primary">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(event) => handleNavClick(event, item.href)}
                  className="group relative transition-colors hover:text-ink"
                >
                  {item.label}
                  <span className="absolute -bottom-2 left-0 right-0 h-0.5 origin-center scale-x-0 rounded-full bg-brand transition-transform duration-200 ease-out group-hover:scale-x-100" />
                </a>
              ))}
            </nav>

            <div className="hidden shrink-0 items-center gap-1.5 lg:flex">
              <Button
                variant="ghost"
                onClick={() => navigate("/demo")}
                className="rounded-full px-3.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ink transition hover:bg-brand/10"
              >
                Try Demo
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="rounded-full px-3.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ink transition hover:bg-brand/10"
              >
                I already have an account
              </Button>
              <Button
                onClick={() => navigate("/login")}
                className="rounded-full bg-brand px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-brand-dark shadow-soft transition hover:-translate-y-0.5 hover:bg-brand/90"
              >
                Get Started
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="ml-auto inline-flex shrink-0 rounded-full border border-ink/10 bg-white/75 text-ink shadow-[0_8px_20px_-18px_rgba(15,23,42,0.5)] lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-brand-dark/50 backdrop-blur"
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              className="fixed right-0 top-0 z-50 flex h-full w-80 max-w-full flex-col gap-8 bg-surface-light px-6 pb-10 pt-8 shadow-card"
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center">
                  <img src={GrowFiLogo} alt="GrowFi logo" className="h-28 w-28 max-w-full object-contain" />
                  <span className="sr-only">GrowFi</span>
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl text-ink"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex flex-col gap-3 text-base font-medium text-ink" aria-label="Mobile">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(event) => handleNavClick(event, item.href)}
                    className="rounded-xl bg-ink/5 px-4 py-3 transition hover:bg-brand/15"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate("/demo");
                    setMobileOpen(false);
                  }}
                  className="rounded-xl border-ink/10 px-5 py-3 text-base font-semibold text-ink"
                >
                  Try Demo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate("/login");
                    setMobileOpen(false);
                  }}
                  className="rounded-xl border-ink/10 px-5 py-3 text-base font-semibold text-ink"
                >
                  I already have an account
                </Button>
                <Button
                  onClick={() => {
                    navigate("/login");
                    setMobileOpen(false);
                  }}
                  className="rounded-xl bg-brand px-5 py-3 text-base font-semibold text-brand-dark shadow-soft"
                >
                  Get Started
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main id="hero" className="relative">
        <motion.section
          className="mx-auto grid max-w-6xl gap-16 px-4 pb-24 pt-20 sm:px-6 lg:grid-cols-[1.1fr,0.9fr] lg:items-center"
          {...revealProps}
        >
          <div className="space-y-8">
            <motion.span
              className="inline-flex items-center gap-2 rounded-full bg-brand/15 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-brand-dark"
              {...(shouldReduceMotion
                ? {}
                : {
                    initial: { opacity: 0, y: -10 },
                    animate: { opacity: 1, y: 0 },
                    transition: { delay: 0.2 },
                  })}
            >
              <Sparkles className="h-4 w-4" />
              Free. Fun. Effective.
            </motion.span>

            <div className="space-y-6">
              <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl lg:text-6xl">
                The free, fun, and effective way to master money.
              </h1>
              <p className="max-w-xl text-lg text-brand-muted sm:text-xl">
                Bite-sized lessons, daily quests, and a friendly frog mascot that evolves as you build real-world money skills.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                onClick={() => navigate("/login")}
                className="group w-full rounded-2xl bg-brand px-8 py-4 text-base font-semibold text-brand-dark shadow-soft transition hover:-translate-y-0.5 hover:bg-brand/90 sm:w-auto"
              >
                Get Started
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/demo")}
                className="w-full rounded-2xl border border-brand/20 bg-transparent px-8 py-4 text-base font-semibold text-ink transition hover:bg-brand/10 sm:w-auto"
              >
                Try Demo
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="w-full rounded-2xl border border-brand/20 bg-transparent px-8 py-4 text-base font-semibold text-ink transition hover:bg-brand/10 sm:w-auto"
              >
                I already have an account
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-brand-muted">
              <div className="inline-flex items-center gap-2 rounded-full bg-ink/5 px-4 py-2">
                <ShieldCheck className="h-4 w-4 text-brand" />
                FDIC-aligned curriculum
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-ink/5 px-4 py-2">
                <TrendingUp className="h-4 w-4 text-brand" />
                7,000+ points to unlock
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-ink/5 px-4 py-2">
                <BadgeCheck className="h-4 w-4 text-brand" />
                Loved by 120k+ learners
              </div>
            </div>
          </div>

          <motion.div
            className="relative mx-auto flex w-full max-w-md justify-center"
            {...heroAnimation}
          >
            <div className="relative w-full rounded-[2rem] bg-gradient-to-br from-white via-surface-soft to-brand/10 p-6 shadow-card">
              <div className="relative flex flex-col gap-6 rounded-3xl bg-white/90 p-6 backdrop-blur">
                <div className="flex items-center gap-4 rounded-3xl bg-brand/15 p-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand text-brand-dark text-3xl">
                    🐸
                  </div>
                  <div>
                    <p className="text-sm font-medium text-brand-dark/70">Level 3 • Streak 32</p>
                    <p className="text-xl font-semibold text-ink">Frog Financialista</p>
                  </div>
                </div>
                <div className="grid gap-4">
                  <div className="rounded-2xl border border-ink/10 bg-surface-soft p-4">
                    <div className="flex items-center justify-between text-sm font-semibold text-ink">
                      Budget Boss
                      <span className="rounded-full bg-brand/15 px-3 py-1 text-xs text-brand-dark">Next up</span>
                    </div>
                    <p className="mt-2 text-sm text-brand-muted">Track spending with playful prompts and instant feedback.</p>
                  </div>
                  <div className="rounded-2xl border border-ink/10 bg-surface-soft p-4">
                    <div className="flex items-center justify-between text-sm font-semibold text-ink">
                      Investment Warrior
                      <Star className="h-4 w-4 text-brand" />
                    </div>
                    <p className="mt-2 text-sm text-brand-muted">Simulate portfolios before risking a dollar.</p>
                  </div>
                </div>
                <div className="rounded-3xl border border-dashed border-brand/40 bg-white/60 p-5 text-center">
                  <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark/70">Daily Quest</p>
                  <p className="mt-2 text-lg font-semibold text-ink">"Could you skip one takeaway?"</p>
                  <p className="mt-1 text-sm text-brand-muted">Build your emergency fund with tiny swaps that stack up.</p>
                </div>
              </div>
              {!shouldReduceMotion && (
                <motion.span
                  className="absolute -right-6 -top-6 rounded-full bg-brand-accent text-white shadow-soft"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 220, damping: 18 }}
                >
                  <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold">
                    <Star className="h-4 w-4" />
                    420 XP today
                  </span>
                </motion.span>
              )}
            </div>
          </motion.div>
        </motion.section>

        <motion.section
          id="features"
          className="relative mx-auto mb-24 max-w-6xl overflow-hidden rounded-3xl bg-white px-4 py-20 shadow-card sm:px-6"
          {...revealProps}
        >
          <div className="grid gap-12 lg:grid-cols-[0.9fr,1.1fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-dark/70">Free. Fun. Effective.</p>
              <h2 className="font-display text-3xl text-ink sm:text-4xl">Lessons backed by behavioral science, wrapped in pure joy.</h2>
              <p className="text-lg text-brand-muted">
                Mix daily quests, evolving mascots, and real-world simulations to convert knowledge into confident money moves.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition hover:text-brand/80"
              >
                Research shows it works
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="relative">
              <div className="absolute -left-12 -top-12 h-36 w-36 rounded-full bg-brand/15 blur-2xl" />
              <div className="relative mx-auto grid max-w-lg gap-5 rounded-[28px] border border-ink/10 bg-surface-soft p-6 shadow-soft">
                <div className="rounded-2xl bg-white p-5 shadow-card">
                  <div className="flex items-center justify-between text-sm font-semibold text-ink">
                    Budget Boss
                    <BarChart3 className="h-4 w-4 text-brand" />
                  </div>
                  <p className="mt-2 text-sm text-brand-muted">Stick to the plan with daily spending check-ins.</p>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-card">
                  <div className="flex items-center justify-between text-sm font-semibold text-ink">
                    Investment Warrior
                    <Target className="h-4 w-4 text-brand" />
                  </div>
                  <p className="mt-2 text-sm text-brand-muted">Practice buying fractional shares and diversify risk-free.</p>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-card">
                  <div className="flex items-center justify-between text-sm font-semibold text-ink">
                    Debt Destroyer
                    <Layers className="h-4 w-4 text-brand" />
                  </div>
                  <p className="mt-2 text-sm text-brand-muted">Compare avalanche vs. snowball tactics with instant feedback.</p>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-card">
                  <div className="flex items-center justify-between text-sm font-semibold text-ink">
                    Streak Shield
                    <ShieldCheck className="h-4 w-4 text-brand" />
                  </div>
                  <p className="mt-2 text-sm text-brand-muted">Protect your progress with flexible reminders and boosters.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section id="science" className="mx-auto max-w-6xl px-4 py-20 sm:px-6" {...revealProps}>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-dark/70">Backed by science</p>
            <h2 className="mt-4 font-display text-3xl text-ink sm:text-4xl">Built with behavior change experts and econ educators.</h2>
            <p className="mt-4 text-lg text-brand-muted">
              Spaced repetition, habit loops, and variable rewards combine to help you learn faster, remember longer, and act sooner.
            </p>
          </div>
          <motion.div
            className="mt-12 grid gap-6 md:grid-cols-3"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.12 },
              },
            }}
            {...staggerProps}
          >
            {scienceHighlights.map((item) => (
              <motion.div
                key={item.title}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="h-full rounded-3xl border border-ink/10 bg-white p-6 shadow-soft"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/15 text-brand">
                  <item.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-6 text-xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm text-brand-muted">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        <motion.section className="mx-auto max-w-6xl px-4 py-20 sm:px-6" {...revealProps}>
          <div className="grid gap-10 lg:grid-cols-[1fr,1fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-dark/70">Stay motivated</p>
              <h2 className="font-display text-3xl text-ink sm:text-4xl">Momentum that sticks longer than hype cycles.</h2>
              <p className="text-lg text-brand-muted">
                Streak safeties, leaderboard cheers, and evolving frog outfits keep you coming back long after week one.
              </p>
            </div>
            <motion.div
              className="grid gap-4"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.1 },
                },
              }}
              {...staggerProps}
            >
              {motivationHighlights.map((item) => (
                <motion.div
                  key={item.title}
                  variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
                  className="flex items-start gap-4 rounded-3xl border border-ink/10 bg-white p-5 shadow-soft"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/15 text-brand">
                    <item.icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                    <p className="mt-2 text-sm text-brand-muted">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        <motion.section className="mx-auto max-w-6xl px-4 py-20 sm:px-6" {...revealProps}>
          <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
            <motion.div
              className="grid gap-4"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.08 },
                },
              }}
              {...staggerProps}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-dark/70">Personalized learning</p>
              <h2 className="font-display text-3xl text-ink sm:text-4xl">A plan that adapts to your goals, even without a bank account.</h2>
              <p className="text-lg text-brand-muted">
                Connect demo data or real accounts when you are ready. GrowFi fine-tunes lessons, quests, and simulations around what matters most right now.
              </p>
              <div className="flex flex-wrap gap-3">
                {personalizationChips.map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-white px-4 py-2 text-sm font-medium text-ink shadow-soft"
                  >
                    <Bot className="h-4 w-4 text-brand" />
                    {chip}
                  </span>
                ))}
              </div>
            </motion.div>
            <div className="relative">
              <div className="absolute -right-10 -top-6 h-32 w-32 rounded-full bg-brand/20 blur-2xl" />
              <div className="relative mx-auto grid max-w-md gap-4 rounded-[30px] border border-ink/10 bg-white p-6 shadow-soft">
                <div className="rounded-2xl border border-dashed border-brand/40 bg-surface-soft p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-dark/70">Today's Recommendation</h3>
                  <p className="mt-2 text-lg font-semibold text-ink">Build a three-month runway</p>
                  <p className="mt-2 text-sm text-brand-muted">
                    Allocate $25 from non-essential spending into your emergency fund. Need an idea? Skip one food delivery this week.
                  </p>
                </div>
                <div className="rounded-2xl bg-brand-dark text-white p-5">
                  <p className="text-sm uppercase tracking-wide text-white/70">Quest Boost</p>
                  <p className="mt-2 text-lg font-semibold">Invite a friend, earn +120 XP</p>
                  <p className="mt-2 text-sm text-white/80">
                    Unlock the "Future Frog" outfit when three friends hit their third streak milestone.
                  </p>
                </div>
                <div className="rounded-2xl border border-ink/10 bg-surface-soft p-5">
                  <div className="flex items-center justify-between text-sm font-semibold text-ink">
                    Micro-goal progress
                    <Lightbulb className="h-4 w-4 text-brand" />
                  </div>
                  <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-ink/10">
                    <div className="h-full w-3/4 rounded-full bg-brand" />
                  </div>
                  <p className="mt-3 text-xs text-brand-muted">
                    Earn 3,000 XP to graduate from Money Foundations and unlock GrowFi+ perks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          id="download"
          className="relative mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-gradient-to-br from-surface-soft via-white to-brand/10 px-4 py-24 sm:px-6"
          {...revealProps}
        >
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-dark/70">Learn anytime, anywhere</p>
              <h2 className="font-display text-3xl text-ink sm:text-4xl">Keep your streak alive from any device.</h2>
              <p className="text-lg text-brand-muted">
                Start on web, keep going on your phone. Quests adapt to your day so you can bank XP between meetings, lectures, or while the bus is rolling.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <StoreButton label="Download on the App Store" caption="Coming soon" href="#" icon={Apple} />
                <StoreButton label="Get it on Google Play" caption="Coming soon" href="#" icon={Play} />
              </div>
            </div>
            <motion.div
              className="relative grid gap-6"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.12 },
                },
              }}
              {...staggerProps}
            >
              {[1, 2, 3, 4].map((index) => (
                <motion.div
                  key={index}
                  variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
                  className={cn(
                    "relative rounded-3xl border border-ink/10 bg-white/90 p-5 shadow-soft backdrop-blur",
                    index % 2 === 0 ? "translate-x-6" : "-translate-x-6",
                  )}
                  whileHover={shouldReduceMotion ? undefined : { y: -6 }}
                  transition={{ type: "spring", stiffness: 250, damping: 22 }}
                >
                  <div className="flex items-center justify-between text-sm font-semibold text-ink">
                    <span>{index === 1 ? "Daily XP" : index === 2 ? "Quest Board" : index === 3 ? "Vault" : "Community"}</span>
                    <ArrowRight className="h-4 w-4 text-brand" />
                  </div>
                  <p className="mt-3 text-sm text-brand-muted">
                    {index === 1 && "Stay on track with gentle nudges and streak savers."}
                    {index === 2 && "Choose a mission that fits the five minutes you have right now."}
                    {index === 3 && "Track emergency funds, debt payoff, and investing in one friendly view."}
                    {index === 4 && "Celebrate milestones with friends and unlock squad-only rewards."}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          id="pricing"
          className="relative mx-auto mt-20 max-w-6xl overflow-hidden rounded-[36px] bg-brand-dark px-4 py-16 text-white shadow-card sm:px-6"
          {...revealProps}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.45),_transparent_55%)]" />
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr,0.8fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">GrowFi+</p>
              <h2 className="font-display text-3xl sm:text-4xl">
                Power up with <span className="bg-gradient-to-r from-brand to-brand-accent bg-clip-text text-transparent">GrowFi+</span>
              </h2>
              <p className="text-lg text-white/80">
                Premium quests, partner discounts, and deeper analytics designed for graduates of our Money Foundations path.
              </p>
              <ul className="grid gap-3 text-sm text-white/80">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand" /> Premium partner rates and credit builders
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand" /> Multi-account cashflow forecasting
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand" /> Advanced streak boosts and exclusive outfits
                </li>
              </ul>
            </div>
            <div className="relative rounded-[28px] border border-white/20 bg-white/10 p-6 shadow-[0_20px_60px_-30px_rgba(12,12,40,0.7)] backdrop-blur">
              <p className="text-sm uppercase tracking-wide text-white/60">Included with GrowFi</p>
              <p className="mt-3 text-lg font-semibold text-white">
                Unlock premium quests, partner perks, and deep-dive analytics with zero monthly fees.
              </p>
              <p className="mt-3 text-sm text-white/75">
                GrowFi+ is free forever. No credit card. No upsells. Just more ways to keep your streak thriving.
              </p>
              <Button className="mt-6 w-full rounded-2xl bg-brand px-8 py-4 text-base font-semibold text-brand-dark shadow-soft transition hover:bg-brand/90">
                Activate GrowFi+
              </Button>
            </div>
          </div>
        </motion.section>

        <motion.section id="faq" className="mx-auto max-w-6xl px-4 py-24 sm:px-6" {...revealProps}>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-dark/70">FAQ</p>
            <h2 className="mt-4 font-display text-3xl text-ink sm:text-4xl">Answers before you start your streak.</h2>
          </div>
          <div className="mx-auto mt-10 grid max-w-3xl gap-6">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="group rounded-3xl border border-ink/10 bg-white p-6 shadow-soft"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                  <span className="text-lg font-semibold text-ink">{item.question}</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/15 text-brand transition group-open:rotate-45">
                    <PlusIcon />
                  </span>
                </summary>
                <p className="mt-4 text-sm text-brand-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </motion.section>
      </main>

      <section aria-label="GrowFi topics" className="border-t border-ink/10 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-5 text-sm font-medium text-ink/70 sm:px-6">
          {languagePills.map((pill) => (
            <span
              key={pill.label}
              className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-surface-soft px-4 py-2 text-xs font-semibold uppercase tracking-wide"
            >
              <Star className="h-4 w-4 text-brand" />
              {pill.label}
            </span>
          ))}
        </div>
      </section>

      <footer className="bg-brand-dark text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center">
              <img src={GrowFiLogo} alt="GrowFi logo" className="h-28 w-28 max-w-full object-contain" />
              <span className="sr-only">GrowFi</span>
            </div>
            <p className="max-w-md text-sm text-white/75">
              GrowFi turns financial literacy into a habit you actually enjoy. Unlock real-world money confidence one quest at a time.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="space-y-3 text-sm">
              <p className="font-semibold uppercase tracking-wide text-white/60">Product</p>
              <ul className="space-y-2 text-white/75">
                <li><a href="#features" className="transition hover:text-white">Features</a></li>
                <li><a href="#pricing" className="transition hover:text-white">GrowFi+</a></li>
                <li><a href="#download" className="transition hover:text-white">Download</a></li>
              </ul>
            </div>
            <div className="space-y-3 text-sm">
              <p className="font-semibold uppercase tracking-wide text-white/60">Company</p>
              <ul className="space-y-2 text-white/75">
                <li><a href="#" className="transition hover:text-white">About</a></li>
                <li><a href="#" className="transition hover:text-white">Careers</a></li>
                <li><a href="#" className="transition hover:text-white">Partners</a></li>
              </ul>
            </div>
            <div className="space-y-3 text-sm">
              <p className="font-semibold uppercase tracking-wide text-white/60">Legal</p>
              <ul className="space-y-2 text-white/75">
                <li><a href="#" className="transition hover:text-white">Privacy</a></li>
                <li><a href="#" className="transition hover:text-white">Terms</a></li>
                <li><a href="#" className="transition hover:text-white">Accessibility</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-6 text-xs text-white/60 sm:flex-row sm:items-center">
            <p>© {new Date().getFullYear()} GrowFi. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="transition hover:text-white/80">
                Instagram
              </a>
              <a href="#" className="transition hover:text-white/80">
                TikTok
              </a>
              <a href="#" className="transition hover:text-white/80">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
    <path
      d="M12 5v14M5 12h14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default Landing;
