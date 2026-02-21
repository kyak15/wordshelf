import Link from "next/link";

function AppLogo() {
  return (
    <div
      className="flex size-20 items-center justify-center rounded-[20px] border-2 border-divider bg-surface sm:size-[7.5rem]"
      aria-hidden
    >
      <span className="text-4xl font-bold text-accent sm:text-[3.75rem]">
        W
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex flex-1 flex-col items-center justify-between px-6 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <AppLogo />
          <div className="mt-8 sm:mt-10">
            <h1 className="text-3xl font-semibold tracking-tight text-primary-text sm:text-4xl">
              Welcome to WordVault
            </h1>
            <p className="mt-3 max-w-sm text-base text-secondary-text sm:text-lg">
              The app to learn words you find while reading
            </p>
          </div>
        </div>

        <div className="flex w-full max-w-sm flex-col gap-4 pb-12 sm:pb-16">
          <Link
            href="#"
            className="flex h-12 items-center justify-center rounded-xl bg-accent font-medium text-primary-text transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
          >
            Get the app
          </Link>
          <Link
            href="#"
            className="flex h-12 items-center justify-center rounded-xl border-2 border-divider bg-surface font-medium text-primary-text transition-colors hover:border-accent/50 hover:bg-surface/80 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
          >
            Sign in
          </Link>
        </div>
      </main>
    </div>
  );
}
