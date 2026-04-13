import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-6 text-center">
      <p className="font-display text-8xl font-semibold text-muted-foreground/30">404</p>
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-semibold">Page not found</h1>
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
      >
        Back to Home
      </Link>
    </div>
  );
}
