import { NextResponse } from "next/server";

const decodeXml = (value: string) => value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const text = (item: string, tag: string) => decodeXml(item.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1]?.trim() ?? "");
const plainText = (value: string) => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

export async function GET() {
  const feedUrl = process.env.SUBSTACK_FEED_URL;
  if (!feedUrl) return NextResponse.json({ configured: false, posts: [] });
  try {
    const parsedUrl = new URL(feedUrl);
    if (parsedUrl.protocol !== "https:") throw new Error("Substack feed URL must use HTTPS");
    const response = await fetch(parsedUrl, { next: { revalidate: 900 }, signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error(`Substack feed returned ${response.status}`);
    const xml = await response.text();
    if (xml.length > 2_000_000 || !/<(?:rss|feed)\b/i.test(xml)) throw new Error("Substack feed response was not a valid RSS document");
    const posts = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].slice(0, 30).map((match) => {
      const item = match[1];
      const categories = [...item.matchAll(/<category(?:\s[^>]*)?>([\s\S]*?)<\/category>/gi)].map((category) => plainText(decodeXml(category[1])).toLowerCase());
      const type = categories.some((category) => category.includes("philosoph")) ? "philosophies" : categories.some((category) => category.includes("note")) ? "notes" : "essays";
      const link = text(item, "link");
      const safeLink = /^https:\/\//i.test(link) ? link : "";
      return { title: plainText(text(item, "title")), link: safeLink, summary: plainText(text(item, "description") || text(item, "content:encoded")).slice(0, 280), publishedAt: text(item, "pubDate"), type };
    }).filter((post) => post.title && post.link);
    return NextResponse.json({ configured: true, posts });
  } catch (error) {
    console.error("Unable to load Substack library feed", error);
    return NextResponse.json({ configured: true, posts: [], unavailable: true });
  }
}
