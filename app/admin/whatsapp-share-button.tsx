"use client";

export default function WhatsappShareButton({
  slug,
  name,
}: {
  slug: string;
  name: string;
}) {
  function share() {
    const link = `${window.location.origin}/${slug}`;
    const text = `Hallo ${name}, du bist herzlich eingeladen zu Theresas Geburtstagsparty am 12. September ab 19:00 Uhr! 🎉\n${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <button
      type="button"
      onClick={share}
      className="rounded-full bg-[#25D366] px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-[#1fb855]"
    >
      📲 WhatsApp
    </button>
  );
}
