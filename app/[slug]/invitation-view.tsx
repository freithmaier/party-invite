"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import RsvpForm from "./rsvp-form";

type Props = {
  slug: string;
  name: string;
  persons: number | null;
  notes: string;
};

/* ---------- Ransom-Note-Schrift wie auf dem Inspo-Collage-Bild ---------- */

const RANSOM_COLORS = [
  { bg: "#e0393e", fg: "#fdf6ec" },
  { bg: "#2b6fb3", fg: "#fdf6ec" },
  { bg: "#f3c630", fg: "#3d2f28" },
  { bg: "#4d9a51", fg: "#fdf6ec" },
  { bg: "#e77fae", fg: "#fdf6ec" },
  { bg: "#ee7f2d", fg: "#fdf6ec" },
  { bg: "#7a4f9e", fg: "#fdf6ec" },
];

const RANSOM_FONTS = [
  "Georgia, serif",
  "var(--font-geist-sans), sans-serif",
  "var(--font-geist-mono), monospace",
  "'Times New Roman', serif",
];

const letterPop: Variants = {
  hidden: { opacity: 0, scale: 0, y: 24 },
  visible: ({ i, base }: { i: number; base: number }) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 320,
      damping: 15,
      delay: base + i * 0.05,
    },
  }),
};

function RansomText({
  text,
  delay = 0,
  className,
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  // Each word is its own nowrap flex group so the outer wrap can only ever
  // break between words, never between two letters of the same word.
  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      className={`inline-flex flex-wrap justify-center gap-x-3 ${className ?? ""}`}
    >
      {text.split(" ").map((word, wordIdx) => {
        return (
          <span key={wordIdx} className="inline-flex flex-nowrap gap-x-0.5">
            {word.split("").map((char, j) => {
              // Combine word + letter position for a stable, varied-looking
              // pseudo-random pattern without a cross-word running counter.
              const i = wordIdx * 100 + j;
              const color = RANSOM_COLORS[(i * 3 + 1) % RANSOM_COLORS.length];
              const font = RANSOM_FONTS[(i * 5 + 2) % RANSOM_FONTS.length];
              const rotate = ((i * 7) % 13) - 6;
              const filled = (i * 11) % 3 !== 0;
              return (
                <motion.span
                  key={i}
                  custom={{ i, base: delay }}
                  variants={letterPop}
                  className="inline-block"
                >
                  <span
                    className="inline-block px-1 leading-none"
                    style={{
                      fontFamily: font,
                      transform: `rotate(${rotate}deg)`,
                      backgroundColor: filled ? color.bg : "transparent",
                      color: filled ? color.fg : color.bg,
                      textTransform: (i * 13) % 4 === 0 ? "lowercase" : "uppercase",
                    }}
                  >
                    {char}
                  </span>
                </motion.span>
              );
            })}
          </span>
        );
      })}
    </motion.span>
  );
}

/* ---------- Handgemalte Blume (SVG) wie die Blüten im Inspo-Bild ---------- */

function Flower({
  size,
  petals = "#fdfdfb",
  center = "#f3c630",
  className,
}: {
  size: number;
  petals?: string;
  center?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <ellipse
          key={i}
          cx="50"
          cy="22"
          rx="9"
          ry="22"
          fill={petals}
          stroke="rgba(60,40,20,0.15)"
          transform={`rotate(${i * 30} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="13" fill={center} />
      <circle cx="46" cy="47" r="2" fill="rgba(0,0,0,0.25)" />
      <circle cx="54" cy="52" r="2" fill="rgba(0,0,0,0.25)" />
      <circle cx="51" cy="45" r="1.5" fill="rgba(0,0,0,0.25)" />
    </svg>
  );
}

/* ---------- Schwebende Konfetti-Punkte im Hero ---------- */

function Confetti() {
  const pieces = Array.from({ length: 16 }).map((_, i) => ({
    left: `${(i * 37 + 11) % 96}%`,
    top: `${(i * 53 + 17) % 92}%`,
    size: 5 + ((i * 7) % 8),
    color: RANSOM_COLORS[i % RANSOM_COLORS.length].bg,
    round: i % 3 !== 0,
    duration: 3.5 + (i % 5),
    delay: (i % 7) * 0.4,
  }));
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.7, 0.25, 0.7],
            y: [0, -18, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.round ? "9999px" : "2px",
          }}
        />
      ))}
    </div>
  );
}

/* ---------- Papier-Karte mit Einschwenk-Animation ---------- */

function PaperCard({
  children,
  tilt,
  className,
}: {
  children: React.ReactNode;
  tilt: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80, rotate: tilt * 4, scale: 0.85 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ type: "spring", stiffness: 65, damping: 13 }}
      className={`rounded-sm border border-[#e0cdb2] bg-[#fdf6ec] p-8 text-center ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Die eigentliche Einladung ---------- */

export default function InvitationView({ slug, name, persons, notes }: Props) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const ballsY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const flowersY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const flowersRotate = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const faceY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const faceScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const heroFade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <main className="paper flex-1 overflow-x-clip text-ink">
      <div className="relative mx-auto w-full max-w-md px-6">
        {/* ---------- Hero ---------- */}
        <div ref={heroRef} className="relative flex min-h-svh flex-col items-center pt-2">
          <Confetti />

          {/* Discokugeln oben links */}
          <motion.div
            style={{ y: ballsY, opacity: heroFade }}
            className="pointer-events-none absolute -left-8 top-0 z-10 h-72 w-60"
          >
            {[
              { size: 120, left: 0, top: 0, delay: 0.1 },
              { size: 88, left: 108, top: 0, delay: 0.3 },
              { size: 66, left: 46, top: 108, delay: 0.5 },
            ].map((ball, i) => (
              <motion.div
                key={i}
                initial={{ y: -300, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 45,
                  damping: 11,
                  delay: ball.delay,
                }}
                className="absolute"
                style={{ left: ball.left, top: ball.top }}
              >
                <motion.div
                  animate={{ rotate: [-3, 3, -3] }}
                  transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformOrigin: "top center" }}
                >
                  <Image
                    src="/disco.png"
                    alt=""
                    width={ball.size}
                    height={Math.round((ball.size * 523) / 399)}
                    priority={i === 0}
                  />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Blumen oben rechts – drehen sich beim Scrollen leicht weiter */}
          <motion.div
            style={{ y: flowersY, rotate: flowersRotate, opacity: heroFade }}
            className="pointer-events-none absolute -right-6 -top-4 z-10 h-56 w-44"
          >
            {[
              { size: 105, right: 0, top: 0, petals: "#fdfdfb", center: "#f3c630", delay: 0.2 },
              { size: 82, right: 82, top: 52, petals: "#f3c630", center: "#b26a1f", delay: 0.4 },
              { size: 66, right: 8, top: 96, petals: "#e9b7d0", center: "#f3c630", delay: 0.6 },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 70, damping: 12, delay: f.delay }}
                className="absolute"
                style={{ right: f.right, top: f.top }}
              >
                <motion.div
                  animate={{ rotate: [0, 8, 0] }}
                  transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Flower size={f.size} petals={f.petals} center={f.center} />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Happy-Birthday-Girlande */}
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 50, damping: 12, delay: 0.7 }}
            className="relative z-0 mt-20 w-full"
          >
            <Image
              src="/happy-birthday.png"
              alt="Happy Birthday"
              width={1432}
              height={258}
              priority
              className="w-full"
            />
          </motion.div>

          {/* Gesicht mit Partyhut */}
          <motion.div style={{ y: faceY, scale: faceScale }} className="relative z-20 mt-14">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 60, damping: 13, delay: 0.9 }}
              className="relative"
            >
              {/* Leoparden-Partyhut */}
              <motion.div
                initial={{ rotate: -60, y: -30, opacity: 0 }}
                animate={{ rotate: -12, y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 90, damping: 10, delay: 1.4 }}
                className="leopard absolute -top-16 left-1/2 z-10 flex h-24 w-20 translate-x-[-40%] items-end justify-center pb-2"
                style={{ clipPath: "polygon(50% 0, 2% 100%, 98% 100%)" }}
              >
                <span
                  className="text-2xl font-black text-[#e75480]"
                  style={{ fontFamily: "Georgia, serif", textShadow: "1px 1px 0 #fdf6ec" }}
                >
                  25
                </span>
              </motion.div>
              <Image
                src="/face.png"
                alt="Das Geburtstagskind"
                width={230}
                height={210}
                priority
                className="sepia-[.45] contrast-[1.05] drop-shadow-[0_10px_18px_rgba(60,40,20,0.25)]"
              />
            </motion.div>
          </motion.div>

          {/* Titel im Ransom-Note-Stil – Buchstaben poppen nacheinander rein */}
          <h1 className="relative z-20 mt-8 text-center text-4xl font-bold tracking-wide">
            <RansomText text="GEBURTSTAGS" delay={1.0} />
            <br />
            <RansomText text="PARTY" delay={1.6} className="mt-2 text-5xl" />
          </h1>

          {/* Sticker: Theresa wird 25 */}
          <motion.div
            initial={{ scale: 0, rotate: 14 }}
            animate={{ scale: 1, rotate: -3 }}
            transition={{ type: "spring", stiffness: 140, damping: 11, delay: 2.2 }}
            className="relative z-20 mt-6 rounded-sm bg-[#e0393e] px-4 py-1.5 shadow-[3px_4px_0_rgba(61,47,40,0.2)]"
          >
            <span
              className="text-2xl text-[#fdf6ec]"
              style={{ fontFamily: "var(--font-caveat), cursive" }}
            >
              Theresa wird 25!
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.7 }}
            className="relative z-20 mt-5 px-2 text-center text-4xl leading-snug text-[#7a4f2a]"
            style={{ fontFamily: "var(--font-caveat), cursive" }}
          >
            Hallo{" "}
            <span className="font-bold text-[#e0393e]" style={{ textShadow: "1px 1px 0 #fdf6ec" }}>
              {name}
            </span>
            , du bist herzlich eingeladen!
          </motion.p>

          {/* Scroll-Hinweis */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            style={{ opacity: heroFade }}
            className="relative z-20 mt-auto pb-8 text-center"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="text-sm tracking-widest text-[#a3866a]"
            >
              nach unten scrollen
              <div className="mt-1 text-2xl">↓</div>
            </motion.div>
          </motion.div>
        </div>

        {/* ---------- Wann? ---------- */}
        <section className="relative mt-10">
          <PaperCard tilt={-2} className="shadow-[4px_6px_0_rgba(61,47,40,0.12)]">
            <p
              className="text-2xl text-[#a3866a]"
              style={{ fontFamily: "var(--font-caveat), cursive" }}
            >
              Wann?
            </p>
            <h2 className="mt-3 text-3xl font-bold">
              <RansomText text="5. SEPTEMBER" />
            </h2>
            <motion.p
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.5 }}
              className="mt-5 text-xl"
            >
              ab <span className="font-bold text-[#e0393e]">19:00 Uhr</span>
            </motion.p>
          </PaperCard>
        </section>

        {/* ---------- Wo? ---------- */}
        <section className="relative mt-12">
          <motion.div
            initial={{ rotate: -30, x: -70, opacity: 0 }}
            whileInView={{ rotate: -8, x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ type: "spring", stiffness: 55, damping: 12 }}
            className="pointer-events-none absolute -left-8 -top-14 z-10 w-24"
          >
            <motion.div
              animate={{ rotate: [-3, 4, -3] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl leading-none"
            >
              🍻
            </motion.div>
          </motion.div>
          <PaperCard tilt={1.5} className="shadow-[-4px_6px_0_rgba(61,47,40,0.12)]">
            <p
              className="text-2xl text-[#a3866a]"
              style={{ fontFamily: "var(--font-caveat), cursive" }}
            >
              Wo?
            </p>
            <h2 className="mt-3 text-2xl font-bold leading-relaxed">
              Buchenweg 1<br />
              94447 Plattling
            </h2>
            <motion.a
              href="https://www.google.com/maps/search/?api=1&query=Buchenweg+1%2C+94447+Plattling"
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.94 }}
              className="mt-5 inline-block rounded-full bg-[#2b6fb3] px-6 py-2 text-sm font-semibold text-[#fdf6ec]"
            >
              📍 Route anzeigen
            </motion.a>
          </PaperCard>
        </section>

        {/* ---------- Stimmung ---------- */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mt-12"
        >
          <p
            className="text-center text-3xl leading-snug text-[#7a4f2a]"
            style={{ fontFamily: "var(--font-caveat), cursive" }}
          >
            Es gibt Bier, Aperol Spritz, Musik und gute Laune –<br />
            bring einfach dich selbst mit! 🍻
          </p>
        </motion.section>

        {/* ---------- RSVP ---------- */}
        <section className="mt-14 pb-24">
          <h2 className="mb-6 text-center text-3xl font-bold">
            <RansomText text={`${name.toUpperCase()}, BIST DU DABEI?`} />
          </h2>
          <RsvpForm slug={slug} persons={persons} notes={notes} />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-10 text-center text-3xl text-[#7a4f2a]"
            style={{ fontFamily: "var(--font-caveat), cursive" }}
          >
            Wir freuen uns auf dich, {name}!{" "}
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block text-[#e0393e]"
            >
              ♥
            </motion.span>
          </motion.p>
        </section>
      </div>
    </main>
  );
}
