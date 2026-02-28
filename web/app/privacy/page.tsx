import Link from "next/link";
import Heading from "../components/atoms/Heading";
import Text from "../components/atoms/Text";

export default function PrivacyPage() {
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
          Privacy Policy
        </Heading>
        <Text variant="small" color="secondary" className="mb-10">
          Last updated: February 27, 2026
        </Text>

        <section className="space-y-6 mb-10">
          <Text variant="body" color="primary" as="p">
            WordVault respects your privacy. This Privacy Policy explains what
            information we collect, how we use it, and your rights.
          </Text>
        </section>

        <section className="space-y-4 mb-10">
          <Heading level={2} color="primary" className="mb-4">
            Information We Collect
          </Heading>
          <Heading level={4} color="primary" className="mt-4 mb-2">
            Account Information
          </Heading>
          <Text variant="body" color="primary" as="p" className="mb-4">
            When you create an account, we collect: email address,
            authentication provider (Apple or Google), and unique user
            identifier.
          </Text>
          <Heading level={4} color="primary" className="mt-4 mb-2">
            User Content
          </Heading>
          <Text variant="body" color="primary" as="p" className="mb-4">
            We collect and store: saved words, definitions, book associations,
            review progress, and learning statistics.
          </Text>
          <Heading level={4} color="primary" className="mt-4 mb-2">
            Usage Data
          </Heading>
          <Text variant="body" color="primary" as="p">
            We may collect basic usage data to improve the App, such as: app
            interactions, feature usage, and crash reports.
          </Text>
        </section>

        <section className="space-y-4 mb-10">
          <Heading level={2} color="primary" className="mb-4">
            How We Use Your Information
          </Heading>
          <Text variant="body" color="primary" as="p" className="mb-4">
            We use your information to: provide and operate WordVault, store
            your vocabulary data, track learning progress, improve the App, and
            maintain security.
          </Text>
          <Text variant="body" color="primary" as="p" className="font-semibold">
            We do not sell your personal information.
          </Text>
        </section>

        <section className="space-y-4 mb-10">
          <Heading level={2} color="primary" className="mb-4">
            Authentication Providers
          </Heading>
          <Text variant="body" color="primary" as="p" className="mb-4">
            If you use Sign in with Apple or Sign in with Google, authentication
            is handled securely by those providers. We do not receive your
            password.
          </Text>
        </section>

        <section className="space-y-4 mb-10">
          <Heading level={2} color="primary" className="mb-4">
            Data Storage
          </Heading>
          <Text variant="body" color="primary" as="p">
            Your data is stored securely using industry-standard practices. We
            implement reasonable safeguards to protect your information.
          </Text>
        </section>

        <section className="space-y-4 mb-10">
          <Heading level={2} color="primary" className="mb-4">
            Data Retention
          </Heading>
          <Text variant="body" color="primary" as="p">
            We retain your data as long as your account is active. When you
            delete your account, your personal data and saved content are
            permanently removed.
          </Text>
        </section>

        <section className="space-y-4 mb-10">
          <Heading level={2} color="primary" className="mb-4">
            Third-Party Services
          </Heading>
          <Text variant="body" color="primary" as="p">
            WordVault may use trusted third-party services for: authentication
            (Apple, Google), hosting and infrastructure. These providers process
            data solely to support the App.
          </Text>
        </section>

        <section className="space-y-4 mb-10">
          <Heading level={2} color="primary" className="mb-4">
            Your Rights
          </Heading>
          <Text variant="body" color="primary" as="p" className="mb-4">
            You may: access your data, update your data, delete your account at
            any time. Account deletion permanently removes stored data.
          </Text>
        </section>

        <section className="space-y-4 mb-10">
          <Heading level={2} color="primary" className="mb-4">
            Children&apos;s Privacy
          </Heading>
          <Text variant="body" color="primary" as="p">
            WordVault is not directed at children under 13. We do not knowingly
            collect information from children.
          </Text>
        </section>

        <section className="space-y-4 mb-10">
          <Heading level={2} color="primary" className="mb-4">
            Changes to This Policy
          </Heading>
          <Text variant="body" color="primary" as="p">
            We may update this Privacy Policy from time to time. Continued use
            of the App indicates acceptance of updates.
          </Text>
        </section>

        <section className="space-y-4">
          <Heading level={2} color="primary" className="mb-4">
            Contact
          </Heading>
          <Text variant="body" color="primary" as="p">
            If you have privacy questions, contact:{" "}
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
