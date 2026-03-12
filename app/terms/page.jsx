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
const SITE_URL       = "https://gurujishrawan.com"
const CONTACT_EMAIL  = "hello@gurujishrawan.com"

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

function P({ children, style = {} }) {
  return <p style={{ marginBottom: "1.2em", ...style }}>{children}</p>
}

function Ul({ items }) {
  return (
    <ul style={{ marginLeft: 22, marginBottom: "1.2em" }}>
      {items.map((it, i) => (
        <li key={i} style={{ marginBottom: "0.55em", lineHeight: 1.78 }}>{it}</li>
      ))}
    </ul>
  )
}

export default function TermsOfService() {
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
            Terms of Service
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
        <div style={{ maxWidth: 760, margin: "24px auto 0", padding: "0 24px" }}>
          <div style={{ background: CARD, borderRadius: 18, padding: "48px 52px", border: `1.5px solid ${BORDER}`, boxShadow: "0 2px 20px rgba(180,80,20,0.06)" }}>

            {/* Intro */}
            <div style={{ background: "linear-gradient(135deg,#fff8f2,#fff4e6)", borderRadius: 12, padding: "18px 22px", marginBottom: 36, border: `1.5px solid #f0d8c0` }}>
              <p style={{ fontFamily: BODY, fontSize: 15, fontStyle: "italic", color: "#4a3a20", lineHeight: 1.75 }}>
                Please read these Terms of Service carefully before using {SITE_NAME}. By accessing or using our website, you agree to be bound by these terms. If you do not agree, please do not use our website.
              </p>
            </div>

            <Section title="1. Acceptance of Terms">
              <P>By accessing or using {SITE_NAME} ("<strong>the Website</strong>") at <a href={SITE_URL}>{SITE_URL}</a>, you confirm that you are at least 13 years of age and agree to these Terms of Service ("<strong>Terms</strong>") and our <Link href="/privacy">Privacy Policy</Link>.</P>
              <P>These Terms apply to all visitors, readers, registered users, and anyone who interacts with our content or services.</P>
            </Section>

            <Section title="2. About the Service">
              <P>{SITE_NAME} is a spiritual content platform that shares articles, quotes, and insights drawn from the teachings and sessions of Guruji Shrawan. Our content is created by volunteers and offered freely as a service to seekers of wisdom.</P>
              <P>We reserve the right to modify, suspend, or discontinue any part of the Website at any time without prior notice.</P>
            </Section>

            <Section title="3. User Accounts">
              <P>You may create a free account to access features such as liking articles, saving content, and posting comments. When creating an account, you agree to:</P>
              <Ul items={[
                "Provide accurate and truthful information",
                "Keep your login credentials secure and not share them with others",
                "Be responsible for all activity that occurs under your account",
                "Notify us immediately at " + CONTACT_EMAIL + " if you suspect unauthorised access",
              ]}/>
              <P>We reserve the right to suspend or terminate accounts that violate these Terms.</P>
            </Section>

            <Section title="4. User-Generated Content">
              <P>When you post comments or other content on our Website, you agree that:</P>
              <Ul items={[
                "Your content is your own and does not infringe the rights of any third party",
                "You grant us a non-exclusive, royalty-free licence to display and moderate your content on the Website",
                "You will not post content that is harmful, hateful, abusive, defamatory, obscene, or otherwise objectionable",
                "You will not post spam, advertisements, or links to external websites without permission",
                "You will not impersonate any person or entity",
              ]}/>
              <P>We reserve the right to remove any content that violates these Terms or that we deem inappropriate, without notice or liability.</P>
            </Section>

            <Section title="5. Intellectual Property">
              <P>All content on {SITE_NAME} — including articles, images, logos, and design — is the property of {SITE_NAME} or its content creators and is protected by applicable copyright laws.</P>
              <P>You may:</P>
              <Ul items={[
                "Read and share links to our articles",
                "Quote brief excerpts (up to 50 words) with clear attribution and a link back to the original",
              ]}/>
              <P>You may <strong>not</strong>:</P>
              <Ul items={[
                "Reproduce, republish, or redistribute our full articles or significant portions without written permission",
                "Use our content for commercial purposes without prior written consent",
                "Remove or alter any copyright or attribution notices",
              ]}/>
              <P>To request permission for any use not covered above, email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</P>
            </Section>

            <Section title="6. Prohibited Conduct">
              <P>When using our Website, you agree not to:</P>
              <Ul items={[
                "Attempt to gain unauthorised access to any part of the Website or its systems",
                "Use automated tools (bots, scrapers, crawlers) to access our content without permission",
                "Interfere with or disrupt the integrity or performance of the Website",
                "Engage in any activity that is illegal under applicable law",
                "Harass, threaten, or harm other users",
                "Upload or transmit viruses or any other malicious code",
              ]}/>
            </Section>

            <Section title="7. Newsletter">
              <P>By subscribing to our newsletter, you consent to receive periodic emails from us containing spiritual content, articles, and updates. You can unsubscribe at any time using the link included in every email. We will not use your email for any other purpose.</P>
            </Section>

            <Section title="8. Third-Party Links">
              <P>Our Website may contain links to third-party websites. These links are provided for convenience only. We have no control over the content or practices of third-party sites and accept no responsibility for them. We encourage you to review their terms and privacy policies.</P>
            </Section>

            <Section title="9. Disclaimers">
              <P>The content on {SITE_NAME} is provided for spiritual and informational purposes only. It is not intended as medical, legal, psychological, or professional advice of any kind.</P>
              <P>The Website is provided on an "<strong>as is</strong>" and "<strong>as available</strong>" basis. We make no warranties, express or implied, regarding the accuracy, completeness, reliability, or suitability of the content.</P>
            </Section>

            <Section title="10. Limitation of Liability">
              <P>To the fullest extent permitted by applicable law, {SITE_NAME} and its volunteers, contributors, and operators shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of or inability to use the Website, even if we have been advised of the possibility of such damages.</P>
            </Section>

            <Section title="11. Governing Law">
              <P>These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of India.</P>
            </Section>

            <Section title="12. Changes to These Terms">
              <P>We reserve the right to update these Terms at any time. Changes will be effective immediately upon posting to this page with an updated effective date. Continued use of the Website after changes constitutes your acceptance of the revised Terms.</P>
            </Section>

            <Section title="13. Contact Us">
              <P>If you have any questions about these Terms, please contact us:</P>
              <div style={{ background: BG, borderRadius: 10, padding: "16px 20px", fontFamily: SANS, fontSize: 13, color: TEXT, lineHeight: 2 }}>
                <strong>{SITE_NAME}</strong><br/>
                Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a><br/>
                Website: <a href={SITE_URL}>{SITE_URL}</a>
              </div>
            </Section>

            {/* Footer links */}
            <div style={{ borderTop: `1.5px solid ${BORDER}`, paddingTop: 24, marginTop: 8, display: "flex", gap: 20, flexWrap: "wrap" }}>
              <Link href="/privacy" style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: ORANGE, textDecoration: "none" }}>Privacy Policy →</Link>
              <Link href="/" style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: MUTED, textDecoration: "none" }}>Back to {SITE_NAME}</Link>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}