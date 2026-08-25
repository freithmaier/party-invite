import Image from "next/image";

export default function NotFound() {
  return (
    <main className="paper flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <Image src="/cocktail.png" alt="" width={110} height={133} className="opacity-80" />
      <h1 className="text-3xl font-bold">Einladung nicht gefunden 😢</h1>
      <p className="max-w-sm text-lg text-[#7a5c40]">
        Dieser Einladungslink ist leider ungültig. Prüfe bitte, ob du den Link
        vollständig kopiert hast.
      </p>
    </main>
  );
}
