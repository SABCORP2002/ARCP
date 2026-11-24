// Pure, client-safe helper split out of lib/cms.ts on purpose: lib/cms.ts
// imports lib/db.ts (and transitively the `pg` driver), and any module a
// client component imports from gets bundled for the browser too — Next.js
// only strips code reachable exclusively from getStaticProps/getServerSideProps,
// not plain helpers used inside a component's render. Keeping this helper in
// its own dependency-free module is what keeps `pg` out of the browser bundle.
export function contentImageSrc(image: string, directory: "articles" | "partners") {
  if (image.startsWith("/") || image.startsWith("http://") || image.startsWith("https://")) return image;
  return `/assets/${directory}/${image}`;
}
