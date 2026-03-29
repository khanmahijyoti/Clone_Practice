import path from "node:path";
import { access } from "node:fs/promises";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

const resolveMirrorPath = (slug: string[] | undefined) => {
  if (!slug || slug.length === 0) {
    return "/mirror/index.html";
  }

  const joined = slug.join("/").replace(/\.+/g, "").replace(/\/+/g, "/");
  return `/mirror/${joined}/index.html`;
};

export default async function CatchAllPage({ params }: PageProps) {
  const { slug } = await params;
  const target = resolveMirrorPath(slug);
  const localFile = path.join(process.cwd(), "public", target.replace(/^\//, ""));

  try {
    await access(localFile);
  } catch {
    return (
      <iframe
        className="frame-shell"
        src="/mirror/index.html"
        title="F4 website clone"
        loading="eager"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <iframe className="frame-shell" src={target} title="F4 website clone" loading="eager" referrerPolicy="no-referrer" />
  );
}
