export default function CatalogError({ message }: { message: string }) {
  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center bg-[#F7F5F2] px-4 py-16 sm:px-6"
    >
      <div className="rounded-2xl border border-red-100/90 bg-red-50/90 p-7 text-center shadow-[0_4px_24px_rgba(185,28,28,0.08)]">
        <h1 className="font-display text-xl font-semibold text-red-950">Something went wrong</h1>
        <p className="mt-2 text-sm text-red-800/90">{message}</p>
        <p className="mt-4 text-xs text-red-700/70">
          Check that the API is running and{" "}
          <code className="rounded bg-red-100/80 px-1 py-0.5 text-[0.8rem]">
            NEXT_PUBLIC_API_URL
          </code>{" "}
          points to the correct host.
        </p>
      </div>
    </main>
  );
}
