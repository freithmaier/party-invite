import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInvitationBySlug } from "@/lib/invitations";
import InvitationView from "./invitation-view";

export async function generateMetadata({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await getInvitationBySlug(slug);
  if (!invitation) return { title: "Einladung nicht gefunden" };
  const title = `${invitation.name}, du bist eingeladen! 🎉`;
  const description =
    "Theresa wird 25! 🪩 5. September, ab 19:00 Uhr · Buchenweg 1, 94447 Plattling. Öffne die Einladung und sag zu!";
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function InvitationPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const invitation = await getInvitationBySlug(slug);
  if (!invitation) notFound();

  return (
    <InvitationView
      slug={invitation.slug}
      name={invitation.name}
      persons={invitation.persons}
      notes={invitation.notes}
    />
  );
}
