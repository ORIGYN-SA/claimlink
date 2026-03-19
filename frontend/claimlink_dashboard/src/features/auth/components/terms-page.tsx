import { Link } from "@tanstack/react-router";
import OrigynIcon from "@assets/icon.svg";

export function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <Link to="/login" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={OrigynIcon} alt="ORIGYN" className="h-8 w-8" />
            <span className="text-lg font-semibold tracking-wide text-gray-900">
              ORIGYN
            </span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Terms &amp; Conditions and Privacy Policy
        </h1>
        <p className="mb-8 text-sm text-gray-500">Last Updated: March 2025</p>

        <p className="mb-8 text-gray-700 leading-relaxed">
          Welcome to ORIGYN. By using our platform, including the ORIGYN website,
          Minting Studio, dashboards, and related services (together referred to as
          the &ldquo;Service&rdquo;), you agree to the following Terms &amp;
          Conditions and acknowledge our Privacy Policy. Please read them carefully.
        </p>

        <Section number="1" title="About ORIGYN">
          <p>
            ORIGYN is a decentralized, neutral protocol that allows individuals and
            institutions to create, issue, and verify digital certificates for
            real-world assets fully on-chain. We operate from Switzerland with a
            commitment to transparency, neutrality, and data security.
          </p>
        </Section>

        <Section number="2" title="Eligibility and Access">
          <p>
            The ORIGYN Minting Studio is publicly accessible and may be used by
            anyone to explore features, create templates, or simulate the
            certification process. However, only verified integrators who have been
            approved by the ORIGYN Foundation are authorized to mint official ORIGYN
            Certificates on the blockchain or launch distribution campaigns. Upon
            first login, users requesting integrator status must submit
            identification and project details for review. ORIGYN reserves the right
            to approve, decline, or revoke integrator access at its discretion.
          </p>
        </Section>

        <Section number="3" title="User Responsibilities">
          <p className="mb-3">By using the Service, you agree that:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>You will not use the Service for illegal purposes.</li>
            <li>You will not impersonate another person or entity.</li>
            <li>
              You are responsible for any content you upload, including its accuracy
              and legal validity.
            </li>
            <li>
              You will respect the integrity of ORIGYN&apos;s system,
              infrastructure, and intellectual property.
            </li>
          </ul>
        </Section>

        <Section number="4" title="Intellectual Property">
          <p>
            All software, content, UI elements, logos, documentation, and design
            elements on the ORIGYN platform are the property of ORIGYN Foundation or
            its partners. You may not copy, reproduce, or reuse these assets without
            written permission. Certificates and data structures you create remain
            yours, but by uploading them to the Service, you grant ORIGYN a
            non-exclusive license to use them for platform operations (e.g. storage,
            display, minting).
          </p>
        </Section>

        <Section number="5" title="Certificate Issuance & Blockchain">
          <p>
            Certificates minted via the ORIGYN protocol are written on-chain. This
            process is irreversible and public. Users are responsible for ensuring
            all information they certify is accurate and lawful. ORIGYN does not
            guarantee resale value, legal recognition, or market performance of any
            certified asset.
          </p>
        </Section>

        <Section number="6" title="Campaigns & Distribution">
          <p>
            Integrators may use the platform to launch certificate campaigns using
            claim links or QR codes. Users are responsible for setting access rules,
            distribution limits, and expiration parameters. ORIGYN is not liable for
            misuse of campaigns or unclaimed assets.
          </p>
        </Section>

        <Section number="7" title="Privacy Policy">
          <p className="mb-4">
            We respect your privacy. This section outlines how we collect, use, and
            protect your personal information.
          </p>

          <SubSection title="7.1 Data We Collect">
            <ul className="list-disc space-y-1 pl-6">
              <li>
                User data: Name, email, wallet ID, IP address, device info, country
              </li>
              <li>
                Uploaded content: Media files, documents, metadata associated with
                certificates
              </li>
              <li>Usage data: Platform activity, login timestamps, preferences</li>
            </ul>
          </SubSection>

          <SubSection title="7.2 How We Use Your Data">
            <ul className="list-disc space-y-1 pl-6">
              <li>To validate accounts and enable platform access</li>
              <li>To issue and manage certificates</li>
              <li>To improve and secure our platform</li>
              <li>
                To communicate with you (including updates or promotions if
                consented)
              </li>
            </ul>
          </SubSection>

          <SubSection title="7.3 Data Sharing">
            <p className="mb-2">We may share data with:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                Third-party infrastructure providers (e.g. storage, email services)
              </li>
              <li>Blockchain networks for minting</li>
              <li>Legal authorities when required</li>
            </ul>
            <p className="mt-2 font-medium">
              We do not sell your personal data.
            </p>
          </SubSection>

          <SubSection title="7.4 Data Security">
            <p>
              We use encryption, access control, and secure infrastructure to
              protect your data. You are responsible for keeping your credentials
              safe.
            </p>
          </SubSection>
        </Section>

        <Section number="8" title="Cookies & Tracking">
          <p>
            ORIGYN does not use cookies for tracking, advertising, or analytics
            purposes. Only essential technical cookies may be used to ensure core
            platform functionality, such as session security or login management.
            These cookies do not collect personal data and cannot be disabled.
          </p>
        </Section>

        <Section number="9" title="Your Rights">
          <p className="mb-3">
            Depending on your jurisdiction (e.g. GDPR in the EU), you may have the
            right to:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Access, modify, or delete your personal data</li>
            <li>Object to or restrict data processing</li>
            <li>Withdraw consent at any time</li>
            <li>Request data portability</li>
          </ul>
          <p className="mt-3">
            To exercise these rights, contact us at{" "}
            <a
              href="mailto:partnerships@origyn.ch"
              className="text-blue-600 underline hover:text-blue-800"
            >
              partnerships@origyn.ch
            </a>
            .
          </p>
        </Section>

        <Section number="10" title="Marketing Consent">
          <p>
            By submitting your information, you consent to receiving occasional
            emails from ORIGYN about product updates, protocol changes, or
            promotional offers. You may unsubscribe at any time.
          </p>
        </Section>

        <Section number="11" title="Termination & Suspension">
          <p>
            ORIGYN may suspend or terminate your access for breach of these Terms or
            if your activity threatens the integrity of the Service. You may close
            your account at any time by contacting us.
          </p>
        </Section>

        <Section number="12" title="Limitation of Liability">
          <p>
            The Service is provided &ldquo;as is.&rdquo; ORIGYN makes no warranties
            regarding uninterrupted availability or future functionality. We are not
            liable for any loss, direct or indirect, related to the use of the
            Service.
          </p>
        </Section>

        <Section number="13" title="Changes to This Agreement">
          <p>
            We may update these Terms &amp; Privacy Policy at any time. You will be
            notified of major changes. Continued use of the Service implies
            acceptance of the updated version.
          </p>
        </Section>

        <Section number="14" title="Governing Law & Compliance">
          <p>
            This agreement is governed by the laws of Switzerland. Any disputes
            shall fall under the exclusive jurisdiction of the courts of the Canton
            of Neuch&acirc;tel, where ORIGYN Foundation is registered. ORIGYN
            complies with applicable Swiss regulations and international standards
            such as the GDPR. Users are responsible for ensuring that their use of
            the platform and the assets they certify comply with local laws. ORIGYN
            does not provide legal advice and cannot be held liable for unlawful use
            of the Service.
          </p>
        </Section>

        <Section number="15" title="Contact">
          <p>
            For questions, concerns, or rights requests, please contact us at:{" "}
            <a
              href="mailto:admin@origyn.ch"
              className="text-blue-600 underline hover:text-blue-800"
            >
              admin@origyn.ch
            </a>
          </p>
        </Section>
      </main>
    </div>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-xl font-semibold text-gray-900">
        {number}. {title}
      </h2>
      <div className="text-gray-700 leading-relaxed">{children}</div>
    </section>
  );
}

function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 mt-3">
      <h3 className="mb-2 text-base font-medium text-gray-800">{title}</h3>
      <div className="text-gray-700 leading-relaxed">{children}</div>
    </div>
  );
}
