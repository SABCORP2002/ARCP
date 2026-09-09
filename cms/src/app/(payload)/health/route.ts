import config from "@payload-config";
import { getPayload } from "payload";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error(`timed out after ${ms}ms`)), ms)),
  ]);
}

export async function GET() {
  try {
    const payload = await withTimeout(getPayload({ config }), 25000);
    await withTimeout(payload.count({ collection: "users", overrideAccess: true }), 10000);
    return Response.json(
      { status: "ok", service: "arcp-administration" },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return Response.json(
      { status: "unavailable", service: "arcp-administration", detail: (error as Error).message },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
