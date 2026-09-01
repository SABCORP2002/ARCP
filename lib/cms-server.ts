const cmsUrl = process.env.CMS_URL?.replace(/\/$/, "");
const cmsToken = process.env.CMS_API_TOKEN;

export function getCmsConfiguration() {
  if (!cmsUrl || !cmsToken) {
    throw new Error("CMS_URL and CMS_API_TOKEN must be configured on the server.");
  }
  return { url: cmsUrl, token: cmsToken };
}

export async function createCmsItem(collection: string, item: Record<string, string>) {
  const config = getCmsConfiguration();
  const response = await fetch(`${config.url}/api/${collection}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
    signal: AbortSignal.timeout(7000),
  });
  if (!response.ok) throw new Error(`CMS create ${collection} returned ${response.status}`);
}
