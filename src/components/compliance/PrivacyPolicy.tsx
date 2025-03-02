"use client";

import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import FooterSection from "../sections/footer/default";
import Nav from "../client/navigation/Nav";
import { Section } from "../ui/section";

export default function PrivacyPolicy() {
  return (
    <div>
      <Nav />
      <Section>
        <CardHeader>
          <CardTitle>
            <h1>Privacy Policy</h1>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Introduction */}
          <section>
            <h2>1. Introduction</h2>
            <p>
              Welcome to our platform! These Terms of Service govern your use of
              our website and services. By accessing or using our platform, you
              agree to comply with these terms.
            </p>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2>2. User Responsibilities</h2>
            <p>
              You agree to use our platform only for lawful purposes and in a
              way that does not infringe the rights of others or restrict their
              use of the platform.
            </p>
            <p>
              You are responsible for maintaining the confidentiality of your
              account and password and for restricting access to your account.
            </p>
          </section>

          {/* Content Ownership */}
          <section>
            <h2>3. Content Ownership</h2>
            <p>
              All content uploaded or shared on the platform remains the
              property of the original creator. However, by posting content, you
              grant us a non-exclusive, worldwide license to use, display, and
              distribute your content.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2>4. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account and
              access to the platform at any time, without prior notice, for any
              reason, including violation of these terms.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2>5. Limitation of Liability</h2>
            <p>
              {`Our platform is provided "as is" without any warranties. We are
              not liable for any damages arising from your use of the platform
              or any content provided by third parties.`}
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2>6. Changes to Terms</h2>
            <p>
              We may update these Terms of Service from time to time. Any
              changes will be posted on this page, and your continued use of the
              platform constitutes acceptance of the updated terms.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2>7. Contact Information</h2>
            <p>
              If you have any questions about these terms, please contact us at{" "}
              <a
                href="mailto:support@example.com"
                className="text-primary hover:underline"
              >
                support@example.com
              </a>
              .
            </p>
          </section>
        </CardContent>
      </Section>
      <FooterSection />
    </div>
  );
}
