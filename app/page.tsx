import Image from "next/image";

export default function Home() {
  return (
    <main className="paper flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <Image src="/disco.png" alt="" width={120} height={157} />
      <h1 className="text-3xl font-bold">Pssst … 🤫</h1>
      <p className="max-w-sm text-lg text-[#7a5c40]">
        Hier gibt es nichts zu sehen. Wenn du eingeladen bist, hast du einen
        persönlichen Einladungslink bekommen – öffne einfach diesen!
      </p>
    </main>
  );
}
