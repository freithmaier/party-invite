"use client";

import { useActionState, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { submitRsvp, type RsvpState } from "./actions";

const PERSON_OPTIONS = [
  { value: 1, label: "Ich komme allein", emoji: "🙋" },
  { value: 2, label: "Wir kommen zu zweit", emoji: "👯" },
  { value: 3, label: "Wir kommen zu dritt", emoji: "👨‍👩‍👧" },
];

type Props = {
  slug: string;
  persons: number | null;
  notes: string;
};

export default function RsvpForm({ slug, persons, notes }: Props) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, isPending] = useActionState<RsvpState, FormData>(
    async (prev, formData) => {
      const result = await submitRsvp(slug, prev, formData);
      if (result.ok) setEditing(false);
      return result;
    },
    { ok: false }
  );
  const [selected, setSelected] = useState<number>(persons ?? 1);

  const hasResponded = persons !== null;
  const showConfirmation = (state.ok || hasResponded) && !editing;

  return (
    <motion.div
      initial={{ opacity: 0, y: 70, rotate: -5, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, rotate: -1, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ type: "spring", stiffness: 65, damping: 13 }}
      className="rounded-sm border border-[#e0cdb2] bg-[#fdf6ec] p-8 shadow-[4px_6px_0_rgba(61,47,40,0.12)]"
    >
      <AnimatePresence mode="wait">
        {showConfirmation ? (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center"
          >
            <div className="text-5xl">🎉</div>
            <p className="mt-4 text-xl font-bold">Deine Zusage ist da!</p>
            {hasResponded && (
              <p className="mt-2 text-[#7a5c40]">
                {PERSON_OPTIONS.find((o) => o.value === persons)?.label ??
                  `${persons} Personen`}
                {notes && (
                  <>
                    <br />
                    <span
                      className="text-2xl"
                      style={{ fontFamily: "var(--font-caveat), cursive" }}
                    >
                      „{notes}“
                    </span>
                  </>
                )}
              </p>
            )}
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="mt-6 rounded-full border border-[#c8a165] px-5 py-2 text-sm font-semibold text-[#7a5c40] transition-colors hover:bg-[#f4e9dc]"
            >
              Antwort ändern
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            action={formAction}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-3"
          >
            {PERSON_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 px-4 py-3 transition-colors ${
                  selected === option.value
                    ? "border-[#e0393e] bg-[#fbe9e4]"
                    : "border-[#e0cdb2] hover:border-[#c8a165]"
                }`}
              >
                <input
                  type="radio"
                  name="persons"
                  value={option.value}
                  checked={selected === option.value}
                  onChange={() => setSelected(option.value)}
                  className="sr-only"
                />
                <span className="text-2xl">{option.emoji}</span>
                <span className="font-semibold">{option.label}</span>
              </label>
            ))}

            <label className="mt-3 flex flex-col gap-2">
              <span
                className="text-2xl text-[#a3866a]"
                style={{ fontFamily: "var(--font-caveat), cursive" }}
              >
                Möchtest du uns noch etwas sagen?
              </span>
              <textarea
                name="notes"
                rows={3}
                maxLength={500}
                defaultValue={notes}
                placeholder="z. B. „Ich komme etwas später“ …"
                className="resize-none rounded-lg border-2 border-[#e0cdb2] bg-white/60 px-4 py-3 outline-none transition-colors focus:border-[#c8a165]"
              />
            </label>

            {state.error && (
              <p className="text-sm font-semibold text-[#e0393e]">{state.error}</p>
            )}

            <motion.button
              type="submit"
              disabled={isPending}
              whileTap={{ scale: 0.96 }}
              className="mt-2 rounded-full bg-[#e0393e] px-6 py-3 text-lg font-bold text-[#fdf6ec] shadow-md transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              {isPending ? "Wird gesendet …" : "Zusage senden 🎉"}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
