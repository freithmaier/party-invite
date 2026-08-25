"use client";

export default function WhatsappShareButton({ slug }: { slug: string }) {
  function share() {
    const link = `${window.location.origin}/${slug}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(link)}`, "_blank");
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
