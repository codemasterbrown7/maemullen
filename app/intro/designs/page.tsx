import type { Metadata } from "next";
import { FACES, Face, type FaceId, faceFonts } from "@/components/intro/faces";
import { siteName } from "@/content/site";
import "./designs.css";

export const metadata: Metadata = {
  title: `Intro lettering — ${siteName}`,
};

/**
 * /intro/designs — every lettering treatment the intro can use, side by side
 * and standing still, for choosing between them. A test page like /intro
 * itself: nothing links here, and it goes when the intro is signed off.
 *
 * Each tile has faint centre lines, because the intro centres every
 * treatment by its ink — a treatment that sits off them would jump when the
 * name morphs into it.
 */
export default function IntroDesignsPage() {
  return (
    <main className={`intro-designs ${faceFonts}`} data-no-proximity>
      <h1 className="intro-designs__title">Intro lettering</h1>
      <ol className="intro-designs__grid">
        {(Object.keys(FACES) as FaceId[]).map((id) => (
          <li key={id} className="intro-designs__item">
            <div className="intro-designs__tile" aria-hidden="true">
              <Face face={id} />
            </div>
            <p className="intro-designs__caption">{FACES[id]}</p>
          </li>
        ))}
      </ol>
    </main>
  );
}
