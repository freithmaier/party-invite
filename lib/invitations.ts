import "server-only";
import { randomBytes } from "crypto";
import { getDb } from "./mongodb";

export type Invitation = {
  slug: string;
  name: string;
  /** null = noch keine Antwort, 1 = kommt allein, 2/3 = kommt mit Begleitung */
  persons: number | null;
  notes: string;
  createdAt: Date;
  respondedAt: Date | null;
};

async function collection() {
  const db = await getDb();
  return db.collection<Invitation>("invitations");
}

export async function getInvitationBySlug(
  slug: string
): Promise<Invitation | null> {
  const col = await collection();
  const doc = await col.findOne({ slug }, { projection: { _id: 0 } });
  return doc;
}

export async function listInvitations(): Promise<Invitation[]> {
  const col = await collection();
  return col
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function createInvitation(name: string): Promise<Invitation> {
  const col = await collection();
  const invitation: Invitation = {
    slug: randomBytes(6).toString("base64url"),
    name: name.trim(),
    persons: null,
    notes: "",
    createdAt: new Date(),
    respondedAt: null,
  };
  await col.insertOne(invitation);
  return invitation;
}

export async function respondToInvitation(
  slug: string,
  persons: number,
  notes: string
): Promise<boolean> {
  const col = await collection();
  const result = await col.updateOne(
    { slug },
    { $set: { persons, notes: notes.trim(), respondedAt: new Date() } }
  );
  return result.matchedCount > 0;
}

export async function deleteInvitation(slug: string): Promise<void> {
  const col = await collection();
  await col.deleteOne({ slug });
}
