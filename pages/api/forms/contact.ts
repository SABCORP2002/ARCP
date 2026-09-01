import type { NextApiRequest, NextApiResponse } from "next";
import { createCmsItem } from "@/lib/cms-server";
import { formValue, guardPublicForm, validEmail } from "@/lib/form-api";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (!guardPublicForm(request, response)) return;
  const item = {
    full_name: formValue(request, "full_name", 160),
    email: formValue(request, "email", 254).toLowerCase(),
    phone: formValue(request, "phone", 80),
    subject: formValue(request, "subject", 200),
    message: formValue(request, "message", 5000),
  };
  if (!item.full_name || !validEmail(item.email) || !item.subject || !item.message) {
    response.status(400).json({ error: "Invalid fields" });
    return;
  }
  try {
    await createCmsItem("contact_requests", item);
    response.status(201).json({ ok: true });
  } catch {
    response.status(503).json({ error: "Form service unavailable" });
  }
}
