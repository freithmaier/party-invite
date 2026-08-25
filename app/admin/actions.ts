"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSession, destroySession, isAuthenticated, verifyCredentials } from "@/lib/auth";
import { createInvitation, deleteInvitation } from "@/lib/invitations";

export async function login(formData: FormData): Promise<void> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!verifyCredentials(username, password)) {
    redirect("/admin?fehler=1");
  }

  await createSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin");
}

export async function createInvitationAction(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin");

  const name = String(formData.get("name") ?? "").trim();
  if (!name) redirect("/admin?fehler=name");

  await createInvitation(name.slice(0, 100));
  revalidatePath("/admin");
}

export async function deleteInvitationAction(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin");

  const slug = String(formData.get("slug") ?? "");
  if (slug) await deleteInvitation(slug);
  revalidatePath("/admin");
}
