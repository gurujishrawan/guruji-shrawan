"use client"
import Link from "next/link"

const SANS   = "'Poppins', system-ui, sans-serif"
const BODY   = "'Lora', Georgia, serif"
const ORANGE = "#c8551a"
const GOLD   = "#b8841a"
const BG     = "#faf7f2"
const CARD   = "#ffffff"
const BORDER = "#e8ddd0"
const TEXT   = "#1a1008"
const MUTED  = "#8a7a6a"

const EFFECTIVE_DATE = "June 1, 2025"
const SITE_NAME      = "Guruji Shrawan"
const SITE_URL       = "https://guruji-shrawan.vercel.app"
const CONTACT_EMAIL  = "gurujishrawan@gmail.com"

/* ── Section wrapper ── */
function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 44 }}>
      <h2 style={{
        fontFamily: SANS, fontSize: 17, fontWeight: 800, color: TEXT,
        marginBottom: 14, paddingBottom: 10, borderBottom: `1.5px solid ${BORDER}`,
        letterSpacing: "-0.01em",
      }}>{title}</h2>
      <div style={{ fontFamily: BODY, fontSize: 15.5, color: "#3a2a14", lineHeight: 1.88 }}>
        {children}
      </div>
    </section>
  )
}

/* ── Paragraph ── */
function P({ children, style = {} }) {
  return <p style={{ marginBottom: "1.2em", ...style }}>{children}</p>
}

/* ── Bullet list ── */
function Ul({ items }) {
  return (
    <ul style={{ marginLeft: 22, marginBottom: "1.2em" }}>
      {items.map((it, i) => (
        <li key={i} style={{ marginBottom: "0.55em", lineHeight: 1.78 }}>{it}</li>
      ))}
    </ul>
  )
}

export default function PrivacyPolicy() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,700;1,400&family=Poppins:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        a{color:${ORANGE};}
        a:hover{opacity:.75;}
      `}</style>

      <div style={{ background: BG, minHeight: "100vh", padding: "0 0 80px" }}>

        {/* Hero banner */}
        <div style={{
          background: `linear-gradient(135deg, #1a0a04 0%, #3a1206 60%, #5a2210 100%)`,
          padding: "56px 24px 48px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position:"absolute", top:-60, right:-60, width:200, height:200, borderRadius:"50%", background:"rgba(200,85,26,0.08)" }}/>
          <div style={{ position:"absolute", bottom:-40, left:-40, width:140, height:140, borderRadius:"50%", background:"rgba(184,132,26,0.07)" }}/>
          <p style={{ fontFamily:SANS, fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.2em", color:GOLD, marginBottom:10 }}>Legal</p>
          <h1 style={{ fontFamily:SANS, fontSize:"clamp(26px,4vw,42px)", fontWeight:800, color:"#fff", marginBottom:12, letterSpacing:"-0.02em" }}>
            Privacy Policy
          </h1>
          <p style={{ fontFamily:SANS, fontSize:13, color:"rgba(255,255,255,0.5)" }}>
            Effective: {EFFECTIVE_DATE} · {SITE_URL}
          </p>
        </div>

        {/* Nav breadcrumb */}
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "18px 24px 0" }}>
          <Link href="/" style={{ fontFamily:SANS, fontSize:12, fontWeight:600, color:MUTED, textDecoration:"none", display:"inline-flex", alignItems:"center", gap:5 }}>
            ← Back to {SITE_NAME}
          </Link>
        </div>

        {/* Content card */}
        <div style={{
          maxWidth: 760, margin: "24px auto 0", padding: "0 24px",
        }}>
          <div style={{ background: CARD, borderRadius: 18, padding: "48px 52px", border: `1.5px solid ${BORDER}`, boxShadow: "0 2px 20px rgba(180,80,20,0.06)" }}>

            {/* Intro */}
            <div style={{ background: "linear-gradient(135deg,#fff8f2,#fff4e6)", borderRadius: 12, padding: "18px 22px", marginBottom: 36, border: `1.5px solid #f0d8c0` }}>
              <p style={{ fontFamily: BODY, fontSize: 15, fontStyle: "italic", color: "#4a3a20", lineHeight: 1.75 }}>
                At {SITE_NAME}, we deeply value your trust. This Privacy Policy explains clearly and honestly what information we collect, why we collect it, and how we protect it. We are committed to handling your personal data with care and transparency.
              </p>
            </div>

            <Section title="1. Who We Are">
              <P>{SITE_NAME} ("<strong>we</strong>", "<strong>us</strong>", or "<strong>our</strong>") is a spiritual content platform dedicated to sharing wisdom through articles, quotes, and insights. We operate the website at <a href={SITE_URL}>{SITE_URL}</a>.</P>
              <P>For any privacy-related questions, contact us at: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></P>
            </Section>

            <Section title="2. Information We Collect">
              <P>We collect the following types of information when you use our website:</P>
              <P><strong>a) Information you provide directly:</strong></P>
              <Ul items={[
                "Email address (when you create an account or subscribe to our newsletter)",
                "Name (optional — when you sign up or update your profile)",
                "Comments and replies you post on articles",
                "Any messages you send us directly",
              ]}/>
              <P><strong>b) Information collected automatically:</strong></P>
              <Ul items={[
                "Anonymous session identifiers for view counting (stored in your browser's sessionStorage — not linked to your identity)",
                "Basic usage data such as which articles you visit",
                "Browser type and device type (via standard web logs)",
                "IP address (collected by our hosting and authentication providers)",
              ]}/>
              <P><strong>c) Information from third-party sign-in (Google OAuth):</strong></P>
              <P>If you choose to sign in with Google, we receive your name, email address, and profile picture URL from Google. We do not receive your Google password. We store only what is necessary to identify you on our platform.</P>
            </Section>

            <Section title="3. How We Use Your Information">
              <P>We use the information we collect to:</P>
              <Ul items={[
                "Create and manage your account",
                "Enable features such as liking articles, saving articles, and commenting",
                "Send you our newsletter (only if you subscribe — you can unsubscribe at any time)",
                "Count article views to show readers how popular an article is",
                "Improve the content and experience of our website",
                "Respond to your questions or support requests",
                "Comply with legal obligations",
              ]}/>
              <P>We do <strong>not</strong> use your information for advertising, profiling, or sell it to any third party.</P>
            </Section>

            <Section title="4. Data Storage and Security">
              <P>Your data is stored securely using <strong>Supabase</strong>, a trusted cloud database platform with industry-standard encryption in transit (TLS) and at rest. Authentication is handled using Supabase Auth, which follows modern security best practices.</P>
              <P>We take reasonable technical and organisational steps to protect your information from unauthorised access, loss, or disclosure. However, no internet transmission is 100% secure and we cannot guarantee absolute security.</P>
            </Section>

            <Section title="5. Cookies and Local Storage">
              <P>Our website uses minimal browser storage:</P>
              <Ul items={[
                "sessionStorage — to store an anonymous visitor ID for view counting. This is cleared automatically when you close your browser tab.",
                "Cookies set by Supabase for authentication (session management). These are essential for keeping you logged in.",
              ]}/>
              <P>We do not use advertising cookies, tracking pixels, or third-party analytics cookies.</P>
            </Section>

            <Section title="6. Third-Party Services">
              <P>We use a small number of trusted third-party services to operate our website:</P>
              <Ul items={[
                "Supabase (database and authentication) — supabase.com",
                "Google OAuth (sign-in option) — accounts.google.com",
                "Google Fonts (typography) — fonts.googleapis.com",
                "Vercel (website hosting) — vercel.com",
              ]}/>
              <P>Each of these services has its own privacy policy and we encourage you to review them. We only share information with these services to the minimum extent necessary to operate the website.</P>
            </Section>

            <Section title="7. Your Rights">
              <P>Depending on your location, you may have the following rights regarding your personal data:</P>
              <Ul items={[
                "Right to access — request a copy of the data we hold about you",
                "Right to correction — ask us to correct any inaccurate information",
                "Right to deletion — ask us to delete your account and personal data",
                "Right to withdraw consent — unsubscribe from the newsletter at any time",
                "Right to data portability — request your data in a structured format",
              ]}/>
              <P>To exercise any of these rights, email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We will respond within 30 days.</P>
            </Section>

            <Section title="8. Children's Privacy">
              <P>{SITE_NAME} is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately and we will delete it.</P>
            </Section>

            <Section title="9. Newsletter">
              <P>If you subscribe to our newsletter, we collect your email address solely to send you our weekly spiritual content email. You can unsubscribe at any time by clicking the unsubscribe link in any email, or by emailing us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We do not share your email with any third party for marketing purposes.</P>
            </Section>

            <Section title="10. Changes to This Policy">
              <P>We may update this Privacy Policy from time to time. When we do, we will update the effective date at the top of this page. Significant changes will be communicated via email to registered users. Continued use of the website after changes constitutes acceptance of the updated policy.</P>
            </Section>

            <Section title="11. Contact Us">
              <P>If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:</P>
              <div style={{ background: BG, borderRadius: 10, padding: "16px 20px", fontFamily: SANS, fontSize: 13, color: TEXT, lineHeight: 2 }}>
                <strong>{SITE_NAME}</strong><br/>
                Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a><br/>
                Website: <a href={SITE_URL}>{SITE_URL}</a>
              </div>
            </Section>

            {/* Footer links */}
            <div style={{ borderTop: `1.5px solid ${BORDER}`, paddingTop: 24, marginTop: 8, display: "flex", gap: 20, flexWrap: "wrap" }}>
              <Link href="/terms" style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: ORANGE, textDecoration: "none" }}>Terms of Service →</Link>
              <Link href="/" style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: MUTED, textDecoration: "none" }}>Back to {SITE_NAME}</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}