export default function CatalogError({ message }: { message: string }) {
  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-4 py-16"
    >
      <div className="rounded-2xl border border-red-100 bg-red-50/80 p-6 text-center">
        <h1 className="text-lg font-semibold text-red-900">Something went wrong</h1>
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
