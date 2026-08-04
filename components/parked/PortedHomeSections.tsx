import Link from "next/link";

/**
 * PARKED — not rendered anywhere. This is the full Claude Design home page as
 * imported on 2026-08-02, kept intact as the raw material for /services, /work
 * and /about. The landing page was cut back to gallery + studio intro, so these
 * sections need new homes rather than deletion.
 *
 * Lift sections out of here as those routes get built, then delete what's left.
 * Note it still carries its copy inline, the way the design file wrote it —
 * move copy into content/ when you lift a section out (DESIGN.md §3.4).
 */
export function PortedHomeSections() {
  return (
    <div style={{ background: "var(--bg)", minWidth: "320px" }}>
      <header style={{
          background: "var(--nav-bg)",
          borderBottom: "var(--border-hairline) solid var(--nav-border)",
        }}>
        <nav aria-label="Primary" style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            minHeight: "var(--nav-height)",
            padding: "0 var(--gutter)",
            gap: "var(--space-6)",
          }}>
          <div style={{
              display: "flex",
              gap: "var(--space-8)",
              justifyContent: "flex-start",
              alignItems: "center",
            }}>
            <Link href="/about" className="mm-nav-link" style={{
                color: "var(--nav-ink)",
                textDecoration: "none",
                fontSize: "var(--nav-link-size)",
                fontWeight: "var(--nav-link-weight)",
                letterSpacing: "var(--nav-link-tracking)",
                textTransform: "uppercase",
              }}>About</Link>
            <Link href="/services" className="mm-nav-link" style={{
                color: "var(--nav-ink)",
                textDecoration: "none",
                fontSize: "var(--nav-link-size)",
                fontWeight: "var(--nav-link-weight)",
                letterSpacing: "var(--nav-link-tracking)",
                textTransform: "uppercase",
              }}>Services</Link>
            <Link href="/packages" className="mm-nav-link" style={{
                color: "var(--nav-ink)",
                textDecoration: "none",
                fontSize: "var(--nav-link-size)",
                fontWeight: "var(--nav-link-weight)",
                letterSpacing: "var(--nav-link-tracking)",
                textTransform: "uppercase",
              }}>Packages</Link>
          </div>
          <Link href="/" style={{ display: "flex", alignItems: "center", padding: "var(--space-3) 0" }}>
            <img src="/assets/brand/wordmark-cream.png" alt="MaeMüllen — home" style={{ width: "var(--nav-mark-width)", minWidth: "120px", display: "block" }} />
          </Link>
          <div style={{
              display: "flex",
              gap: "var(--space-8)",
              justifyContent: "flex-end",
              alignItems: "center",
            }}>
            <Link href="/work" className="mm-nav-link" style={{
                color: "var(--nav-ink)",
                textDecoration: "none",
                fontSize: "var(--nav-link-size)",
                fontWeight: "var(--nav-link-weight)",
                letterSpacing: "var(--nav-link-tracking)",
                textTransform: "uppercase",
              }}>Portfolio</Link>
            <Link href="/work" className="mm-nav-link" style={{
                color: "var(--nav-ink)",
                textDecoration: "none",
                fontSize: "var(--nav-link-size)",
                fontWeight: "var(--nav-link-weight)",
                letterSpacing: "var(--nav-link-tracking)",
                textTransform: "uppercase",
              }}>Work</Link>
            <Link href="/enquire" className="mm-nav-link" style={{
                color: "var(--nav-ink)",
                textDecoration: "none",
                fontSize: "var(--nav-link-size)",
                fontWeight: "var(--nav-link-weight)",
                letterSpacing: "var(--nav-link-tracking)",
                textTransform: "uppercase",
              }}>Enquire</Link>
          </div>
        </nav>
      </header>
      <div id="mm-marquee" style={{
          background: "var(--marquee-bg)",
          borderBottom: "var(--border-hairline) solid var(--border)",
          overflow: "hidden",
        }}>
        <div id="mm-marquee-track" style={{
            display: "flex",
            width: "max-content",
            animation: "mm-marquee var(--marquee-duration) linear infinite",
            animationPlayState: "running",
          }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Link href="/services#social-media" className="mm-marquee-link" style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-3) var(--space-5)",
                color: "var(--marquee-ink)",
                textDecoration: "none",
                fontSize: "var(--marquee-size)",
                fontWeight: "var(--marquee-weight)",
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}>Social media management</Link>
            <span aria-hidden="true" style={{ color: "var(--marquee-ink)" }}>✳</span>
            <Link href="/services#content-days" className="mm-marquee-link" style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-3) var(--space-5)",
                color: "var(--marquee-ink)",
                textDecoration: "none",
                fontSize: "var(--marquee-size)",
                fontWeight: "var(--marquee-weight)",
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}>Content days</Link>
            <span aria-hidden="true" style={{ color: "var(--marquee-ink)" }}>✳</span>
            <Link href="/services#tiktok" className="mm-marquee-link" style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-3) var(--space-5)",
                color: "var(--marquee-ink)",
                textDecoration: "none",
                fontSize: "var(--marquee-size)",
                fontWeight: "var(--marquee-weight)",
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}>TikTok management</Link>
            <span aria-hidden="true" style={{ color: "var(--marquee-ink)" }}>✳</span>
            <Link href="/services#ugc" className="mm-marquee-link" style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-3) var(--space-5)",
                color: "var(--marquee-ink)",
                textDecoration: "none",
                fontSize: "var(--marquee-size)",
                fontWeight: "var(--marquee-weight)",
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}>UGC &amp; brand content</Link>
            <span aria-hidden="true" style={{ color: "var(--marquee-ink)" }}>✳</span>
            <Link href="/services#design-illustration" className="mm-marquee-link" style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-3) var(--space-5)",
                color: "var(--marquee-ink)",
                textDecoration: "none",
                fontSize: "var(--marquee-size)",
                fontWeight: "var(--marquee-weight)",
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}>Design &amp; illustration</Link>
            <span aria-hidden="true" style={{ color: "var(--marquee-ink)" }}>✳</span>
            <Link href="/services#pr-events" className="mm-marquee-link" style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-3) var(--space-5)",
                color: "var(--marquee-ink)",
                textDecoration: "none",
                fontSize: "var(--marquee-size)",
                fontWeight: "var(--marquee-weight)",
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}>PR &amp; events</Link>
            <span aria-hidden="true" style={{ color: "var(--marquee-ink)" }}>✳</span>
            <Link href="/services#websites" className="mm-marquee-link" style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-3) var(--space-5)",
                color: "var(--marquee-ink)",
                textDecoration: "none",
                fontSize: "var(--marquee-size)",
                fontWeight: "var(--marquee-weight)",
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}>Website design</Link>
            <span aria-hidden="true" style={{ color: "var(--marquee-ink)" }}>✳</span>
          </div>
          <div aria-hidden="true" style={{ display: "flex", alignItems: "center" }}>
            <span style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-3) var(--space-5)",
                color: "var(--marquee-ink)",
                fontSize: "var(--marquee-size)",
                fontWeight: "var(--marquee-weight)",
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}>Social media management</span>
            <span style={{ color: "var(--marquee-ink)" }}>✳</span>
            <span style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-3) var(--space-5)",
                color: "var(--marquee-ink)",
                fontSize: "var(--marquee-size)",
                fontWeight: "var(--marquee-weight)",
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}>Content days</span>
            <span style={{ color: "var(--marquee-ink)" }}>✳</span>
            <span style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-3) var(--space-5)",
                color: "var(--marquee-ink)",
                fontSize: "var(--marquee-size)",
                fontWeight: "var(--marquee-weight)",
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}>TikTok management</span>
            <span style={{ color: "var(--marquee-ink)" }}>✳</span>
            <span style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-3) var(--space-5)",
                color: "var(--marquee-ink)",
                fontSize: "var(--marquee-size)",
                fontWeight: "var(--marquee-weight)",
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}>UGC &amp; brand content</span>
            <span style={{ color: "var(--marquee-ink)" }}>✳</span>
            <span style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-3) var(--space-5)",
                color: "var(--marquee-ink)",
                fontSize: "var(--marquee-size)",
                fontWeight: "var(--marquee-weight)",
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}>Design &amp; illustration</span>
            <span style={{ color: "var(--marquee-ink)" }}>✳</span>
            <span style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-3) var(--space-5)",
                color: "var(--marquee-ink)",
                fontSize: "var(--marquee-size)",
                fontWeight: "var(--marquee-weight)",
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}>PR &amp; events</span>
            <span style={{ color: "var(--marquee-ink)" }}>✳</span>
            <span style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-3) var(--space-5)",
                color: "var(--marquee-ink)",
                fontSize: "var(--marquee-size)",
                fontWeight: "var(--marquee-weight)",
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}>Website design</span>
            <span style={{ color: "var(--marquee-ink)" }}>✳</span>
          </div>
        </div>
      </div>
      <main>
        <section style={{
            maxWidth: "var(--container-wide)",
            margin: "0 auto",
            padding: "var(--space-section) var(--gutter) var(--space-20)",
          }}>
          <p style={{
              margin: "0 0 var(--space-6)",
              fontSize: "var(--text-eyebrow)",
              fontWeight: "600",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--accent)",
            }}>A female-founded creative studio</p>
          <h1 style={{
              margin: "0",
              fontFamily: "var(--font-display)",
              fontWeight: "var(--head-weight)",
              letterSpacing: "var(--head-tracking)",
              fontSize: "var(--text-display-xl)",
              lineHeight: "1.02",
              textWrap: "balance",
              maxWidth: "12em",
            }}>Where social, content <em style={{ fontStyle: "italic" }}>&amp;</em> design come <em style={{ fontStyle: "italic" }}>together.</em></h1>
          <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-10)",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginTop: "var(--space-12)",
            }}>
            <p style={{
                margin: "0",
                maxWidth: "34em",
                fontSize: "var(--text-body-lg)",
                color: "var(--ink-muted)",
                textWrap: "pretty",
              }}>We create thoughtful, distinctive work that helps brands show up with personality and purpose — social, content, design, illustration, PR and events, under one roof.</p>
            <div style={{ display: "flex", gap: "var(--space-5)", alignItems: "center", flexWrap: "wrap" }}>
              <Link href="/enquire" className="mm-btn-primary" style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "var(--btn-height-lg)",
                  padding: "0 var(--btn-padding-x-lg)",
                  borderRadius: "var(--radius-control)",
                  background: "var(--accent)",
                  color: "var(--accent-ink)",
                  fontSize: "var(--btn-text)",
                  fontWeight: "var(--btn-weight)",
                  letterSpacing: "var(--btn-tracking)",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  transition: "background var(--duration-fast) var(--ease-standard)",
                }}>Enquire</Link>
              <a href="#work" className="mm-link-accent" style={{
                  fontSize: "var(--text-label)",
                  fontWeight: "var(--btn-weight)",
                  letterSpacing: "var(--btn-tracking)",
                  textTransform: "uppercase",
                  color: "var(--ink)",
                  textDecoration: "underline",
                  textUnderlineOffset: "5px",
                }}>Explore our world ↓</a>
            </div>
          </div>
        </section>
        <section aria-label="Studio statement" style={{
            borderTop: "var(--border-hairline) solid var(--border)",
            borderBottom: "var(--border-hairline) solid var(--border)",
          }}>
          <div style={{
              maxWidth: "var(--container-default)",
              margin: "0 auto",
              padding: "var(--space-20) var(--gutter)",
            }}>
            <p style={{
                margin: "0",
                fontSize: "var(--text-statement)",
                fontWeight: "600",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textAlign: "justify",
                lineHeight: "1.55",
                textWrap: "pretty",
              }}>We believe the strongest brands are built through <span style={{ color: "var(--accent)" }}>creativity</span>, <span style={{ color: "var(--accent)" }}>consistency</span> and genuine <span style={{ color: "var(--accent)" }}>connection</span> — work that feels authentic, considered and designed to leave a lasting impression.</p>
          </div>
        </section>
        <section id="services" style={{
            maxWidth: "var(--container-wide)",
            margin: "0 auto",
            padding: "var(--space-section) var(--gutter)",
          }}>
          <div style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: "var(--space-6)",
              flexWrap: "wrap",
              marginBottom: "var(--space-10)",
            }}>
            <h2 style={{
                margin: "0",
                fontFamily: "var(--font-display)",
                fontWeight: "var(--head-weight)",
                letterSpacing: "var(--head-tracking)",
                fontSize: "var(--text-display-md)",
              }}>What we do</h2>
            <p style={{ margin: "0", fontSize: "var(--text-body-sm)", color: "var(--ink-muted)" }}>Seven ways in — mix and match, or the full sha-bang.</p>
          </div>
          <ol style={{ listStyle: "none", margin: "0", padding: "0" }}>
            <li style={{ borderTop: "var(--border-hairline) solid var(--border)" }}>
              <Link href="/services#social-media" className="mm-link-accent" style={{
                  display: "grid",
                  gridTemplateColumns: "3.5em 1fr auto",
                  gap: "var(--space-6)",
                  alignItems: "baseline",
                  padding: "var(--space-6) var(--space-2)",
                  textDecoration: "none",
                  color: "var(--ink)",
                  transition: "color var(--duration-fast) var(--ease-standard)",
                }}>
                <span style={{
                    fontSize: "var(--text-body-sm)",
                    fontWeight: "600",
                    letterSpacing: "0.09em",
                    color: "var(--decor)",
                  }}>001</span>
                <span style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: "var(--head-weight)",
                    letterSpacing: "var(--head-tracking)",
                    fontSize: "var(--text-heading-lg)",
                    lineHeight: "1.15",
                  }}>Social media management</span>
                <span style={{
                    fontSize: "var(--text-body-sm)",
                    color: "var(--ink-muted)",
                    maxWidth: "26em",
                    textAlign: "right",
                  }}>Monthly packages — content, scheduling, planning calls and reports</span>
              </Link>
            </li>
            <li style={{ borderTop: "var(--border-hairline) solid var(--border)" }}>
              <Link href="/services#content-days" className="mm-link-accent" style={{
                  display: "grid",
                  gridTemplateColumns: "3.5em 1fr auto",
                  gap: "var(--space-6)",
                  alignItems: "baseline",
                  padding: "var(--space-6) var(--space-2)",
                  textDecoration: "none",
                  color: "var(--ink)",
                  transition: "color var(--duration-fast) var(--ease-standard)",
                }}>
                <span style={{
                    fontSize: "var(--text-body-sm)",
                    fontWeight: "600",
                    letterSpacing: "0.09em",
                    color: "var(--decor)",
                  }}>002</span>
                <span style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: "var(--head-weight)",
                    letterSpacing: "var(--head-tracking)",
                    fontSize: "var(--text-heading-lg)",
                    lineHeight: "1.15",
                  }}>Content days</span>
                <span style={{
                    fontSize: "var(--text-body-sm)",
                    color: "var(--ink-muted)",
                    maxWidth: "26em",
                    textAlign: "right",
                  }}>A month&#39;s worth of premium, social-first content in one session</span>
              </Link>
            </li>
            <li style={{ borderTop: "var(--border-hairline) solid var(--border)" }}>
              <Link href="/services#tiktok" className="mm-link-accent" style={{
                  display: "grid",
                  gridTemplateColumns: "3.5em 1fr auto",
                  gap: "var(--space-6)",
                  alignItems: "baseline",
                  padding: "var(--space-6) var(--space-2)",
                  textDecoration: "none",
                  color: "var(--ink)",
                  transition: "color var(--duration-fast) var(--ease-standard)",
                }}>
                <span style={{
                    fontSize: "var(--text-body-sm)",
                    fontWeight: "600",
                    letterSpacing: "0.09em",
                    color: "var(--decor)",
                  }}>003</span>
                <span style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: "var(--head-weight)",
                    letterSpacing: "var(--head-tracking)",
                    fontSize: "var(--text-heading-lg)",
                    lineHeight: "1.15",
                  }}>TikTok management</span>
                <span style={{
                    fontSize: "var(--text-body-sm)",
                    color: "var(--ink-muted)",
                    maxWidth: "26em",
                    textAlign: "right",
                  }}>Strategy, trends, captions and posting — alongside any package</span>
              </Link>
            </li>
            <li style={{ borderTop: "var(--border-hairline) solid var(--border)" }}>
              <Link href="/services#ugc" className="mm-link-accent" style={{
                  display: "grid",
                  gridTemplateColumns: "3.5em 1fr auto",
                  gap: "var(--space-6)",
                  alignItems: "baseline",
                  padding: "var(--space-6) var(--space-2)",
                  textDecoration: "none",
                  color: "var(--ink)",
                  transition: "color var(--duration-fast) var(--ease-standard)",
                }}>
                <span style={{
                    fontSize: "var(--text-body-sm)",
                    fontWeight: "600",
                    letterSpacing: "0.09em",
                    color: "var(--decor)",
                  }}>004</span>
                <span style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: "var(--head-weight)",
                    letterSpacing: "var(--head-tracking)",
                    fontSize: "var(--text-heading-lg)",
                    lineHeight: "1.15",
                  }}>UGC &amp; brand content</span>
                <span style={{
                    fontSize: "var(--text-body-sm)",
                    color: "var(--ink-muted)",
                    maxWidth: "26em",
                    textAlign: "right",
                  }}>Authentic content that captures your brand at its best</span>
              </Link>
            </li>
            <li style={{ borderTop: "var(--border-hairline) solid var(--border)" }}>
              <Link href="/services#design-illustration" className="mm-link-accent" style={{
                  display: "grid",
                  gridTemplateColumns: "3.5em 1fr auto",
                  gap: "var(--space-6)",
                  alignItems: "baseline",
                  padding: "var(--space-6) var(--space-2)",
                  textDecoration: "none",
                  color: "var(--ink)",
                  transition: "color var(--duration-fast) var(--ease-standard)",
                }}>
                <span style={{
                    fontSize: "var(--text-body-sm)",
                    fontWeight: "600",
                    letterSpacing: "0.09em",
                    color: "var(--decor)",
                  }}>005</span>
                <span style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: "var(--head-weight)",
                    letterSpacing: "var(--head-tracking)",
                    fontSize: "var(--text-heading-lg)",
                    lineHeight: "1.15",
                  }}>Design &amp; illustration</span>
                <span style={{
                    fontSize: "var(--text-body-sm)",
                    color: "var(--ink-muted)",
                    maxWidth: "26em",
                    textAlign: "right",
                  }}>Bespoke illustration and beautifully designed print &amp; digital</span>
              </Link>
            </li>
            <li style={{ borderTop: "var(--border-hairline) solid var(--border)" }}>
              <Link href="/services#pr-events" className="mm-link-accent" style={{
                  display: "grid",
                  gridTemplateColumns: "3.5em 1fr auto",
                  gap: "var(--space-6)",
                  alignItems: "baseline",
                  padding: "var(--space-6) var(--space-2)",
                  textDecoration: "none",
                  color: "var(--ink)",
                  transition: "color var(--duration-fast) var(--ease-standard)",
                }}>
                <span style={{
                    fontSize: "var(--text-body-sm)",
                    fontWeight: "600",
                    letterSpacing: "0.09em",
                    color: "var(--decor)",
                  }}>006</span>
                <span style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: "var(--head-weight)",
                    letterSpacing: "var(--head-tracking)",
                    fontSize: "var(--text-heading-lg)",
                    lineHeight: "1.15",
                  }}>PR &amp; events</span>
                <span style={{
                    fontSize: "var(--text-body-sm)",
                    color: "var(--ink-muted)",
                    maxWidth: "26em",
                    textAlign: "right",
                  }}>From concept to execution — launches, pop-ups, press</span>
              </Link>
            </li>
            <li style={{
                borderTop: "var(--border-hairline) solid var(--border)",
                borderBottom: "var(--border-hairline) solid var(--border)",
              }}>
              <Link href="/services#websites" className="mm-link-accent" style={{
                  display: "grid",
                  gridTemplateColumns: "3.5em 1fr auto",
                  gap: "var(--space-6)",
                  alignItems: "baseline",
                  padding: "var(--space-6) var(--space-2)",
                  textDecoration: "none",
                  color: "var(--ink)",
                  transition: "color var(--duration-fast) var(--ease-standard)",
                }}>
                <span style={{
                    fontSize: "var(--text-body-sm)",
                    fontWeight: "600",
                    letterSpacing: "0.09em",
                    color: "var(--decor)",
                  }}>007</span>
                <span style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: "var(--head-weight)",
                    letterSpacing: "var(--head-tracking)",
                    fontSize: "var(--text-heading-lg)",
                    lineHeight: "1.15",
                  }}>Website design</span>
                <span style={{
                    fontSize: "var(--text-body-sm)",
                    color: "var(--ink-muted)",
                    maxWidth: "26em",
                    textAlign: "right",
                  }}>Websites, built with your brand in mind</span>
              </Link>
            </li>
          </ol>
        </section>
        <section id="work" style={{
            maxWidth: "var(--container-wide)",
            margin: "0 auto",
            padding: "0 var(--gutter) var(--space-section)",
          }}>
          <div style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: "var(--space-6)",
              flexWrap: "wrap",
              marginBottom: "var(--space-10)",
            }}>
            <h2 style={{
                margin: "0",
                fontFamily: "var(--font-display)",
                fontWeight: "var(--head-weight)",
                letterSpacing: "var(--head-tracking)",
                fontSize: "var(--text-display-md)",
              }}>Selected work</h2>
            <Link href="/work" className="mm-link-accent" style={{
                fontSize: "var(--text-label)",
                fontWeight: "var(--btn-weight)",
                letterSpacing: "var(--btn-tracking)",
                textTransform: "uppercase",
                color: "var(--ink)",
                textDecoration: "underline",
                textUnderlineOffset: "5px",
              }}>All work →</Link>
          </div>
          <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--space-8)",
              alignItems: "start",
            }}>
            <article style={{ gridColumn: "span 1" }}>
              <Link href="/work" className="mm-work-card" style={{ textDecoration: "none", color: "var(--ink)", display: "block" }}>
                <div style={{
                    background: "var(--surface)",
                    border: "var(--border-hairline) solid var(--border)",
                    overflow: "hidden",
                    aspectRatio: "4 / 5",
                  }}>
                  <img src="/assets/work/bendito/menu-in-situ.jpg" alt="Bendito's illustrated menu photographed in situ on a set table beside a glass of red wine" className="mm-work-card-img" style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform var(--duration-slow) var(--ease-entrance)",
                    }} />
                </div>
                <div style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: "var(--space-4)",
                    marginTop: "var(--space-4)",
                  }}>
                  <h3 style={{
                      margin: "0",
                      fontFamily: "var(--font-display)",
                      fontWeight: "var(--head-weight)",
                      letterSpacing: "var(--head-tracking)",
                      fontSize: "var(--text-heading-md)",
                    }}>Bendito</h3>
                  <span style={{
                      fontSize: "var(--text-eyebrow)",
                      fontWeight: "600",
                      letterSpacing: "0.09em",
                      textTransform: "uppercase",
                      color: "var(--ink-muted)",
                    }}>01</span>
                </div>
                <p style={{
                    margin: "var(--space-1) 0 0",
                    fontSize: "var(--text-body-sm)",
                    color: "var(--ink-muted)",
                  }}>Menu design &amp; illustration — hand-drawn artwork, printed and photographed in situ.</p>
              </Link>
            </article>
            <article>
              <div style={{
                  background: "var(--surface)",
                  border: "var(--border-hairline) dashed var(--nav-border)",
                  aspectRatio: "4 / 5",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "var(--space-4)",
                  padding: "var(--space-6)",
                  boxSizing: "border-box",
                  textAlign: "center",
                }}>
                <span style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: "var(--head-weight)",
                    fontStyle: "italic",
                    fontSize: "var(--text-heading-lg)",
                    color: "var(--brand-pink)",
                  }}>Mia Massage</span>
                <span style={{
                    fontSize: "var(--text-eyebrow)",
                    fontWeight: "600",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--accent)",
                    border: "var(--border-hairline) solid var(--accent)",
                    borderRadius: "var(--radius-control)",
                    padding: "var(--space-2) var(--space-4)",
                  }}>Placeholder — photography to come</span>
              </div>
              <div style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: "var(--space-4)",
                  marginTop: "var(--space-4)",
                }}>
                <h3 style={{
                    margin: "0",
                    fontFamily: "var(--font-display)",
                    fontWeight: "var(--head-weight)",
                    letterSpacing: "var(--head-tracking)",
                    fontSize: "var(--text-heading-md)",
                  }}>Mia Massage</h3>
                <span style={{
                    fontSize: "var(--text-eyebrow)",
                    fontWeight: "600",
                    letterSpacing: "0.09em",
                    textTransform: "uppercase",
                    color: "var(--ink-muted)",
                  }}>02</span>
              </div>
              <p style={{
                  margin: "var(--space-1) 0 0",
                  fontSize: "var(--text-body-sm)",
                  color: "var(--ink-muted)",
                }}>Wellness — case study in progress.</p>
            </article>
            <article>
              <div style={{
                  background: "var(--surface)",
                  border: "var(--border-hairline) dashed var(--nav-border)",
                  aspectRatio: "4 / 5",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "var(--space-4)",
                  padding: "var(--space-6)",
                  boxSizing: "border-box",
                  textAlign: "center",
                }}>
                <span style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: "var(--head-weight)",
                    fontStyle: "italic",
                    fontSize: "var(--text-heading-lg)",
                    color: "var(--brand-pink)",
                  }}>Client TBC</span>
                <span style={{
                    fontSize: "var(--text-eyebrow)",
                    fontWeight: "600",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--accent)",
                    border: "var(--border-hairline) solid var(--accent)",
                    borderRadius: "var(--radius-control)",
                    padding: "var(--space-2) var(--space-4)",
                  }}>Placeholder — name &amp; assets TBC</span>
              </div>
              <div style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: "var(--space-4)",
                  marginTop: "var(--space-4)",
                }}>
                <h3 style={{
                    margin: "0",
                    fontFamily: "var(--font-display)",
                    fontWeight: "var(--head-weight)",
                    letterSpacing: "var(--head-tracking)",
                    fontSize: "var(--text-heading-md)",
                  }}>Holiday-let project</h3>
                <span style={{
                    fontSize: "var(--text-eyebrow)",
                    fontWeight: "600",
                    letterSpacing: "0.09em",
                    textTransform: "uppercase",
                    color: "var(--ink-muted)",
                  }}>03</span>
              </div>
              <p style={{
                  margin: "var(--space-1) 0 0",
                  fontSize: "var(--text-body-sm)",
                  color: "var(--ink-muted)",
                }}>Hospitality — details to be confirmed.</p>
            </article>
          </div>
          <figure style={{
              margin: "var(--space-8) 0 0",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--space-8)",
              alignItems: "center",
            }}>
            <img src="/assets/work/bendito/menu-artwork.png" alt="Bendito menu artwork — Poppy's single-weight red line drawings of tomatoes, olives and glasses around royal-blue menu type" style={{
                width: "100%",
                display: "block",
                border: "var(--border-hairline) solid var(--border)",
                background: "var(--surface)",
              }} />
            <figcaption style={{
                fontSize: "var(--text-body)",
                color: "var(--ink-muted)",
                maxWidth: "30em",
                textWrap: "pretty",
              }}>
          <span style={{ display: "block", fontSize: "var(--text-eyebrow)", fontWeight: "600", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "var(--space-4)" }}>From the studio</span>
          Bendito&#39;s menu, drawn by hand in Poppy&#39;s single-weight red line — the kind of detail we sweat so your brand doesn&#39;t look like anyone else&#39;s.
        </figcaption>
          </figure>
        </section>
        <section aria-label="About the studio" style={{ borderTop: "var(--border-hairline) solid var(--border)" }}>
          <div style={{
              maxWidth: "var(--container-default)",
              margin: "0 auto",
              padding: "var(--space-section) var(--gutter)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--space-12)",
              alignItems: "start",
            }}>
            <h2 style={{
                margin: "0",
                fontFamily: "var(--font-display)",
                fontWeight: "var(--head-weight)",
                letterSpacing: "var(--head-tracking)",
                fontSize: "var(--text-display-md)",
                lineHeight: "1.08",
              }}>A studio of two, <em style={{ fontStyle: "italic" }}>by design.</em></h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
              <p style={{ margin: "0", textWrap: "pretty" }}>Maemullen was founded by Laura and Poppy — two creatives brought together by a shared passion for design, content and creativity. Laura brings luxury PR, social and brand storytelling; Poppy, a Fine Art graduate of Central Saint Martins, brings illustration and a distinctive visual eye.</p>
              <p style={{ margin: "0", textWrap: "pretty" }}>Today we partner with lifestyle, hospitality and wellness brands to create work that feels considered, creative and true to their identity.</p>
              <Link href="/about" className="mm-link-accent" style={{
                  alignSelf: "flex-start",
                  fontSize: "var(--text-label)",
                  fontWeight: "var(--btn-weight)",
                  letterSpacing: "var(--btn-tracking)",
                  textTransform: "uppercase",
                  color: "var(--ink)",
                  textDecoration: "underline",
                  textUnderlineOffset: "5px",
                }}>More about us →</Link>
            </div>
          </div>
        </section>
        <section aria-label="Enquire" style={{
            background: "var(--nav-bg)",
            borderTop: "var(--border-hairline) solid var(--nav-border)",
          }}>
          <div style={{
              maxWidth: "var(--container-default)",
              margin: "0 auto",
              padding: "var(--space-section) var(--gutter)",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "var(--space-10)",
            }}>
            <p style={{
                margin: "0",
                fontFamily: "var(--font-display)",
                fontWeight: "var(--head-weight)",
                letterSpacing: "var(--head-tracking)",
                fontSize: "var(--text-display-lg)",
                lineHeight: "1.05",
                color: "var(--nav-ink)",
                textWrap: "balance",
                maxWidth: "14em",
              }}>Have a project in mind? <em style={{ fontStyle: "italic" }}>Explore our world.</em></p>
            <Link href="/enquire" className="mm-btn-cream" style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: "var(--btn-height-lg)",
                padding: "0 var(--btn-padding-x-lg)",
                borderRadius: "var(--radius-control)",
                background: "var(--brand-cream)",
                color: "var(--brand-black)",
                fontSize: "var(--btn-text)",
                fontWeight: "var(--btn-weight)",
                letterSpacing: "var(--btn-tracking)",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "transform var(--duration-fast) var(--ease-standard)",
              }}>Enquire — let&#39;s talk</Link>
          </div>
        </section>
      </main>
      <footer style={{ borderTop: "var(--border-hairline) solid var(--border)", background: "var(--bg)" }}>
        <div style={{
            maxWidth: "var(--container-wide)",
            margin: "0 auto",
            padding: "var(--space-16) var(--gutter) var(--space-10)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "var(--space-12)",
            alignItems: "start",
          }}>
          <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-4)",
              alignItems: "flex-start",
            }}>
            <img src="/assets/brand/monogram.png" alt="" aria-hidden="true" style={{ width: "56px", display: "block" }} />
            <p style={{
                margin: "0",
                fontSize: "var(--text-body-sm)",
                color: "var(--ink-muted)",
                maxWidth: "22em",
                textWrap: "pretty",
              }}>A female-founded creative studio — social, content and design for brands people remember.</p>
          </div>
          <nav aria-label="Footer" style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)",
              alignItems: "flex-start",
            }}>
            <span style={{
                fontSize: "var(--text-eyebrow)",
                fontWeight: "600",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--ink-muted)",
              }}>Menu</span>
            <Link href="/about" className="mm-footer-link" style={{ fontSize: "var(--text-body-sm)", color: "var(--ink)", textDecoration: "none" }}>About</Link>
            <Link href="/services" className="mm-footer-link" style={{ fontSize: "var(--text-body-sm)", color: "var(--ink)", textDecoration: "none" }}>Services</Link>
            <Link href="/packages" className="mm-footer-link" style={{ fontSize: "var(--text-body-sm)", color: "var(--ink)", textDecoration: "none" }}>Packages</Link>
            <Link href="/work" className="mm-footer-link" style={{ fontSize: "var(--text-body-sm)", color: "var(--ink)", textDecoration: "none" }}>Work</Link>
            <Link href="/enquire" className="mm-footer-link" style={{ fontSize: "var(--text-body-sm)", color: "var(--ink)", textDecoration: "none" }}>Enquire</Link>
          </nav>
          <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)",
              alignItems: "flex-start",
            }}>
            <span style={{
                fontSize: "var(--text-eyebrow)",
                fontWeight: "600",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--ink-muted)",
              }}>Say hello</span>
            <span style={{ fontSize: "var(--text-body-sm)", color: "var(--ink-muted)" }}>hello@ — email TBC</span>
            <span style={{ fontSize: "var(--text-body-sm)", color: "var(--ink-muted)" }}>Instagram — handle TBC</span>
          </div>
        </div>
        <div style={{
            maxWidth: "var(--container-wide)",
            margin: "0 auto",
            padding: "0 var(--gutter) var(--space-8)",
            display: "flex",
            justifyContent: "space-between",
            gap: "var(--space-6)",
            flexWrap: "wrap",
          }}>
          <span style={{
              fontSize: "var(--text-eyebrow)",
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              color: "var(--ink-muted)",
            }}>© 2026 MaeMüllen</span>
          <span style={{
              fontSize: "var(--text-eyebrow)",
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              color: "var(--ink-muted)",
            }}>Made with personality &amp; purpose</span>
        </div>
      </footer>
    </div>
  );
}
