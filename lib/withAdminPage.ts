import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { requirePageSession } from "@/lib/adminAuth";

/**
 * Wraps a page's getServerSideProps so every `pages/admin/*` page is
 * auth-gated the same way — a new admin page can't accidentally ship
 * reachable without a session, because it can't call getServerSideProps
 * directly without going through this.
 */
export function withAdminPage<P extends Record<string, unknown> = Record<string, never>>(
  loadProps?: (context: GetServerSidePropsContext, email: string) => Promise<GetServerSidePropsResult<P>>,
): GetServerSideProps<P> {
  return async (context) => {
    const session = await requirePageSession(context.req as never);
    if (!session) {
      return {
        redirect: {
          destination: `/admin/login?next=${encodeURIComponent(context.resolvedUrl)}`,
          permanent: false,
        },
      };
    }
    if (!loadProps) return { props: {} as P };
    return loadProps(context, session.email);
  };
}
