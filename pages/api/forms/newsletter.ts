import type { NextApiRequest, NextApiResponse } from "next";
import { createCmsItem } from "@/lib/cms-server";
import { formValue, guardPublicForm, validEmail } from "@/lib/form-api";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (!guardPublicForm(request, response, false)) return;
  const email = formValue(request, "email", 254).toLowerCase();
  if (!validEmail(email)) {
    response.status(400).json({ error: "Invalid email" });
    return;
  }
  try {
    await createCmsItem("newsletter_subscriptions", {
      email,
    });
    response.status(201).json({ ok: true });
  } catch {
    response.status(503).json({ error: "Form service unavailable" });
  }
}
