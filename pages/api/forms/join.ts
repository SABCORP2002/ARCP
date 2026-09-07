import type { NextApiRequest, NextApiResponse } from "next";
import { createCmsItem } from "@/lib/cms-server";
import { formValue, guardPublicForm, validEmail } from "@/lib/form-api";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (!guardPublicForm(request, response)) return;
  const item = {
    full_name: formValue(request, "full_name", 160),
    email: formValue(request, "email", 254).toLowerCase(),
    phone: formValue(request, "phone", 80),
    applicant_role: formValue(request, "applicant_role", 120),
    organization: formValue(request, "organization", 200),
    organization_type: formValue(request, "organization_type", 120),
    org_website: formValue(request, "org_website", 300),
    community_size: formValue(request, "community_size", 80),
    focus_area: formValue(request, "focus_area", 300),
    contributions: formValue(request, "contributions", 300),
    country: formValue(request, "country", 160),
    membership_type: formValue(request, "membership_type", 100),
    interest: formValue(request, "interest", 300),
    message: formValue(request, "message", 5000),
  };
  if (!item.full_name || !validEmail(item.email) || !item.organization || !item.country || !item.membership_type || !item.interest || !item.message) {
    response.status(400).json({ error: "Invalid fields" });
    return;
  }
  try {
    await createCmsItem("membership_requests", item);
    response.status(201).json({ ok: true });
  } catch {
    response.status(503).json({ error: "Form service unavailable" });
  }
}
