import { instagram } from "@/content/site";
import "./instagram-strip.css";

/**
 * The studio's latest Instagram posts, as a band above the footer.
 *
 * Posts come from behold.so rather than from Instagram directly. Instagram's
 * Basic Display API — the one every "embed your feed" tutorial still describes —
 * was shut down by Meta in December 2024, and the Graph API that replaced it
 * needs a Business account, a Meta app, and an access token rotated every 60
 * days. Behold holds all of that and exposes one public read-only JSON
 * endpoint. Rendering that ourselves also keeps Instagram's boxed iframe and
 * its branding off a site whose footer is a 10px hairline.
 *
 * Server component: the feed is fetched on the server and cached for an hour,
 * so no Instagram request is ever made from the visitor's browser and no
 * client JS ships.
 */

type BeholdSize = { mediaUrl: string; width: number; height: number };

type BeholdPost = {
  id: string;
  permalink: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  mediaUrl: string;
  /** Videos only — mediaUrl on those is the video file itself. */
  thumbnailUrl?: string;
  altText?: string | null;
  prunedCaption?: string;
  /** Behold's own resized copies, off their CDN. Absent on some video posts. */
  sizes?: Partial<Record<"small" | "medium" | "large" | "full", BeholdSize>>;
};

type BeholdFeed = { username?: string; posts?: BeholdPost[] };

/** Matches the widest layout in instagram-strip.css. Narrower ones show fewer. */
const POST_COUNT = 6;

/** An hour. The studio posts daily at most, and this sits in a footer. */
const REVALIDATE_SECONDS = 3600;

/**
 * Behold's dashboard hands back a whole URL, so pasting that into the config
 * instead of the bare id is the obvious mistake to make. Accept either.
 */
function feedUrl(value: string): string {
  const trimmed = value.trim();
  const id = trimmed.startsWith("http")
    ? (trimmed.split("?")[0].replace(/\/+$/, "").split("/").pop() ?? "")
    : trimmed;
  return `https://feeds.behold.so/${id}`;
}

async function latestPosts(): Promise<BeholdPost[]> {
  if (!instagram.beholdFeedId) return [];

  // A footer decoration must never be able to fail a page. Every error path —
  // network, non-200, malformed body — collapses to "render nothing", which the
  // caller treats the same as "not configured yet".
  try {
    const response = await fetch(feedUrl(instagram.beholdFeedId), {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) return [];

    const feed: BeholdFeed = await response.json();
    return Array.isArray(feed?.posts) ? feed.posts.slice(0, POST_COUNT) : [];
  } catch {
    return [];
  }
}

/**
 * `medium` is 700px on its longest edge — ample for a tile that is a sixth of
 * the page at most, and already resized and compressed by Behold's CDN, so
 * these deliberately do not go through next/image: that would be a second
 * optimisation pass over an already-optimised file, billed per source image.
 */
function thumbnailFor(post: BeholdPost): string {
  if (post.mediaType === "VIDEO") {
    return post.thumbnailUrl ?? post.sizes?.medium?.mediaUrl ?? post.mediaUrl;
  }
  return post.sizes?.medium?.mediaUrl ?? post.mediaUrl;
}

/** Instagram's own alt text first, then the caption stripped of its hashtags. */
function altFor(post: BeholdPost): string {
  const text = post.altText?.trim() || post.prunedCaption?.trim();
  if (!text) return "Instagram post";
  return text.length > 140 ? `${text.slice(0, 139).trimEnd()}…` : text;
}

export async function InstagramStrip() {
  const posts = await latestPosts();
  if (posts.length === 0) return null;

  return (
    <section className="mm-ig" aria-label="Latest on Instagram">
      {/* Label only — the handle itself is the footer's, one line below, where it
          is the link to the profile. Both carried it at first and the same
          string twice within 130px read as a bug. */}
      <p className="mm-ig__label">Latest on Instagram</p>

      <ul className="mm-ig__grid">
        {posts.map((post) => (
          <li key={post.id} className="mm-ig__item">
            <a
              className="mm-ig__link"
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="mm-ig__img"
                src={thumbnailFor(post)}
                alt={altFor(post)}
                loading="lazy"
                decoding="async"
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
