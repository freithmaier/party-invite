import type { Metadata } from "next";
import { isAuthenticated } from "@/lib/auth";
import { listInvitations } from "@/lib/invitations";
import {
  createInvitationAction,
  deleteInvitationAction,
  login,
  logout,
} from "./actions";
import CopyButton from "./copy-button";
import WhatsappShareButton from "./whatsapp-share-button";

export const metadata: Metadata = {
  title: "Admin – Einladungen",
};

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  const { fehler } = await searchParams;

  if (!(await isAuthenticated())) {
    return <LoginForm showError={fehler === "1"} />;
  }

  const invitations = await listInvitations();
  const accepted = invitations.filter(
    (i) => i.persons !== null && i.persons >= 1 && i.persons <= 3
  );
  const declined = invitations.filter((i) => i.persons === 0);
  const totalGuests = accepted.reduce((sum, i) => sum + (i.persons ?? 0), 0);

  return (
    <main className="paper flex-1 px-4 py-8">
      <div className="mx-auto w-full max-w-md">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">🪩 Einladungen</h1>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-full border border-[#c8a165] px-4 py-1.5 text-sm font-semibold text-[#7a5c40] hover:bg-[#f4e9dc]"
            >
              Abmelden
            </button>
          </form>
        </div>

        {/* Übersicht */}
        <div className="mt-5 grid grid-cols-2 gap-2 text-center">
          {[
            { label: "Einladungen", value: invitations.length },
            { label: "Zusagen", value: accepted.length },
            { label: "Gäste", value: totalGuests },
            { label: "Absagen", value: declined.length },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-[#e0cdb2] bg-[#fdf6ec] px-2 py-3 shadow-sm"
            >
              <div className="text-2xl font-bold text-[#e0393e]">{stat.value}</div>
              <div className="mt-0.5 text-xs text-[#7a5c40]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Neue Einladung */}
        <div className="mt-6 rounded-lg border border-[#e0cdb2] bg-[#fdf6ec] p-5 shadow-sm">
          <h2 className="text-lg font-bold">Neue Einladung erstellen</h2>
          {fehler === "name" && (
            <p className="mt-2 text-sm font-semibold text-[#e0393e]">
              Bitte gib einen Spitznamen ein.
            </p>
          )}
          <form action={createInvitationAction} className="mt-3 flex flex-col gap-3">
            <input
              type="text"
              name="name"
              required
              maxLength={100}
              placeholder="Spitzname, z. B. „Basti“"
              className="w-full rounded-lg border-2 border-[#e0cdb2] bg-white/70 px-4 py-3 outline-none focus:border-[#c8a165]"
            />
            <button
              type="submit"
              className="w-full rounded-full bg-[#e0393e] px-6 py-3 font-bold text-[#fdf6ec] active:scale-[0.98]"
            >
              Erstellen
            </button>
          </form>
        </div>

        {/* Liste */}
        <div className="mt-6 flex flex-col gap-3">
          {invitations.length === 0 && (
            <p className="text-center text-[#7a5c40]">
              Noch keine Einladungen – erstelle die erste! 🎉
            </p>
          )}
          {invitations.map((inv) => (
            <div
              key={inv.slug}
              className="rounded-lg border border-[#e0cdb2] bg-[#fdf6ec] p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-lg font-bold">{inv.name}</div>
                  <div className="truncate text-xs text-[#a3866a]">/{inv.slug}</div>
                </div>
                {inv.persons === null ? (
                  <span className="shrink-0 rounded-full bg-[#f4e9dc] px-3 py-1 text-xs font-semibold text-[#a3866a]">
                    Ausstehend
                  </span>
                ) : inv.persons === 0 ? (
                  <span className="shrink-0 rounded-full bg-[#f0e6d8] px-3 py-1 text-xs font-semibold text-[#7a5c40]">
                    ✕ Abgesagt
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full bg-[#e4f2e5] px-3 py-1 text-xs font-semibold text-[#2f6b33]">
                    ✓ {inv.persons} {inv.persons === 1 ? "Person" : "Personen"}
                  </span>
                )}
              </div>
              {inv.notes && (
                <p className="mt-3 rounded-md bg-white/60 px-3 py-2 text-sm text-[#5c4634]">
                  💬 {inv.notes}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <CopyButton slug={inv.slug} />
                <WhatsappShareButton slug={inv.slug} />
                <a
                  href={`/${inv.slug}`}
                  target="_blank"
                  className="rounded-full border border-[#c8a165] px-4 py-2 text-sm font-semibold text-[#7a5c40] active:bg-[#f4e9dc]"
                >
                  Ansehen
                </a>
                <form action={deleteInvitationAction} className="ml-auto">
                  <input type="hidden" name="slug" value={inv.slug} />
                  <button
                    type="submit"
                    title="Einladung löschen"
                    className="rounded-full px-3 py-2 text-sm text-[#a3866a] active:bg-[#fbe9e4] active:text-[#e0393e]"
                  >
                    ✕
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function LoginForm({ showError }: { showError: boolean }) {
  return (
    <main className="paper flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-[#e0cdb2] bg-[#fdf6ec] p-8 shadow-[4px_6px_0_rgba(61,47,40,0.12)]">
        <h1 className="text-center text-2xl font-bold">🔐 Admin-Login</h1>
        {showError && (
          <p className="mt-3 text-center text-sm font-semibold text-[#e0393e]">
            Benutzername oder Passwort ist falsch.
          </p>
        )}
        <form action={login} className="mt-6 flex flex-col gap-4">
          <input
            type="text"
            name="username"
            required
            autoComplete="username"
            placeholder="Benutzername"
            className="rounded-lg border-2 border-[#e0cdb2] bg-white/70 px-4 py-2 outline-none focus:border-[#c8a165]"
          />
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            placeholder="Passwort"
            className="rounded-lg border-2 border-[#e0cdb2] bg-white/70 px-4 py-2 outline-none focus:border-[#c8a165]"
          />
          <button
            type="submit"
            className="mt-2 rounded-full bg-[#e0393e] px-6 py-2.5 font-bold text-[#fdf6ec] hover:scale-[1.02]"
          >
            Anmelden
          </button>
        </form>
      </div>
    </main>
  );
}
