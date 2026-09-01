import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Members } from "@/components/Members";
import { Events } from "@/components/Events";
import { ArticlesGrid } from "@/components/ArticlesGrid";
import { Newsletter } from "@/components/Newsletter";
import { Partners } from "@/components/Partners";
import type { GetStaticProps } from "next";
import { getHomeContent, HomeContent } from "@/lib/cms";

export default function Home({ content }: { content: HomeContent }) {
  return (
    <Layout settings={content.settings}>
      <Hero settings={content.settings} memberCount={content.members.length} />
      <Features />
      <Members members={content.members} />
      <Events events={content.events} />
      <ArticlesGrid articles={content.articles} />
      <Newsletter recipient={content.settings.contactEmail} />
      <Partners partners={content.partners} contactEmail={content.settings.contactEmail} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<{ content: HomeContent }> = async () => ({
  props: { content: await getHomeContent() },
  revalidate: 60,
});
