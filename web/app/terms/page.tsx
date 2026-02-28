import Link from "next/link";
import Heading from "../components/atoms/Heading";
import Text from "../components/atoms/Text";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-[var(--accent)] hover:underline"
        >
          ← Back to Home
        </Link>

        <Heading level={1} color="primary" className="mb-2">
          Terms of Service
        </Heading>
        <Text variant="small" color="secondary" className="mb-10">
          Last updated: February 27, 2026
        </Text>

        <section className="space-y-4 mb-10">
          <Text variant="body" color="primary" as="p">
            Welcome to WordVault. By creating an account or using the WordVault
            mobile application (&quot;App&quot;), you agree to the following
            Terms of Service. If you do not agree, please do not use the App.
          </Text>
        </section>

        <section className="space-y-4 mb-10">
          <Heading level={2} color="primary" className="mb-4">
            Description of Service
          </Heading>
          <Text variant="body" color="primary" as="p">
            WordVault is a vocabulary tracking application that allows users to:
            save words from books they are reading, review vocabulary using
            spaced repetition, and track learning progress and statistics. The
            App is provided free of charge.
          </Text>
        </section>

        <section className="space-y-4 mb-10">
          <Heading level={2} color="primary" className="mb-4">
            Accounts
          </Heading>
          <Text variant="body" color="primary" as="p" className="mb-4">
            To use WordVault, you must create an account using Sign in with
            Apple or Sign in with Google. You agree to: provide accurate
            information, keep your account secure, and not share your account
            credentials.
          </Text>
          <Text variant="body" color="primary" as="p">
            You are responsible for all activity under your account.
          </Text>
        </section>

        <section className="space-y-4 mb-10">
          <Heading level={2} color="primary" className="mb-4">
            User Content
          </Heading>
          <Text variant="body" color="primary" as="p">
            You retain ownership of the words, notes, and content you add to
            WordVault. By using the App, you grant WordVault permission to store
            and process your content solely to provide the service. We do not
            sell or share your personal vocabulary data.
          </Text>
        </section>

        <section className="space-y-4 mb-10">
          <Heading level={2} color="primary" className="mb-4">
            Acceptable Use
          </Heading>
          <Text variant="body" color="primary" as="p">
            You agree not to: use the App for unlawful purposes, attempt to
            access other users&apos; data, reverse engineer or interfere with
            the App, or abuse or overload the system.
          </Text>
        </section>

        <section className="space-y-4 mb-10">
          <Heading level={2} color="primary" className="mb-4">
            Account Deletion
          </Heading>
          <Text variant="body" color="primary" as="p" className="mb-4">
            You may delete your account at any time within the App. When you
            delete your account, your personal data, saved words, and progress
            data will be permanently removed from our systems.
          </Text>
        </section>

        <section className="space-y-4 mb-10">
          <Heading level={2} color="primary" className="mb-4">
            Disclaimer
          </Heading>
          <Text variant="body" color="primary" as="p">
            WordVault is provided &quot;as is&quot; without warranties of any
            kind. We do not guarantee: continuous availability, error-free
            operation, or perfect accuracy of definitions or data. Use the App
            at your own discretion.
          </Text>
        </section>

        <section className="space-y-4 mb-10">
          <Heading level={2} color="primary" className="mb-4">
            Limitation of Liability
          </Heading>
          <Text variant="body" color="primary" as="p">
            To the fullest extent permitted by law, WordVault shall not be
            liable for: data loss, indirect damages, or service interruptions.
          </Text>
        </section>

        <section className="space-y-4 mb-10">
          <Heading level={2} color="primary" className="mb-4">
            Changes to Terms
          </Heading>
          <Text variant="body" color="primary" as="p">
            We may update these Terms from time to time. Continued use of the
            App after changes constitutes acceptance of the revised Terms.
          </Text>
        </section>

        <section className="space-y-4">
          <Heading level={2} color="primary" className="mb-4">
            Contact
          </Heading>
          <Text variant="body" color="primary" as="p">
            If you have questions about these Terms, contact:{" "}
            <a
              href="mailto:wordvaultapplication@gmail.com"
              className="text-[var(--accent)] underline hover:no-underline"
            >
              wordvaultapplication@gmail.com
            </a>
          </Text>
        </section>
      </div>
    </main>
  );
}
