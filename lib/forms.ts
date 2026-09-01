export const CONTACT_EMAIL = "info@africanrobotplatform.org";
export const SECRETARIAT_EMAIL = "secretariat@africanrobotplatform.org";

interface DeliverFormOptions {
  endpoint?: string;
  recipient: string;
  subject: string;
  fields: Record<string, string>;
}

export type DeliveryMode = "endpoint" | "email-client";

export async function deliverForm({ endpoint, recipient, subject, fields }: DeliverFormOptions): Promise<DeliveryMode> {
  if (endpoint) {
    const body = new URLSearchParams({ ...fields, subject });
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: body.toString(),
    });

    if (!response.ok) {
      throw new Error(`Form endpoint returned ${response.status}`);
    }

    return "endpoint";
  }

  const message = Object.entries(fields)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
  window.location.assign(
    `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`,
  );
  return "email-client";
}
