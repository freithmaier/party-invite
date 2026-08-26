"use server";

import { revalidatePath } from "next/cache";
import { getInvitationBySlug, respondToInvitation } from "@/lib/invitations";

export type RsvpState = {
  ok: boolean;
  error?: string;
};

export async function submitRsvp(
  slug: string,
  _prevState: RsvpState,
  formData: FormData
): Promise<RsvpState> {
  const invitation = await getInvitationBySlug(slug);
  if (!invitation) {
    return { ok: false, error: "Diese Einladung existiert nicht mehr." };
  }

  const personsRaw = formData.get("persons");
  const persons = personsRaw === null ? NaN : Number(personsRaw);
  if (![0, 1, 2, 3].includes(persons)) {
    return { ok: false, error: "Bitte wähle eine der Optionen aus." };
  }

  const notes = String(formData.get("notes") ?? "").slice(0, 500);

  await respondToInvitation(slug, persons, notes);
  revalidatePath(`/${slug}`);
  return { ok: true };
}
