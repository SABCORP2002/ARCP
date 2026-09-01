import config from "@payload-config";
import { getPayload } from "payload";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = await getPayload({ config });
    await payload.count({ collection: "users", overrideAccess: true });
    return Response.json(
      { status: "ok", service: "arcp-administration" },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { status: "unavailable", service: "arcp-administration" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
