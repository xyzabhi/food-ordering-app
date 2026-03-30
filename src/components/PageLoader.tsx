import Spinner from "@/src/components/Spinner";

export default function PageLoader({ label }: { label: string }) {
  return (
    <main
      id="main-content"
      className="flex min-h-dvh flex-col items-center justify-center bg-[#F7F5F2] px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-4">
        <Spinner className="size-10" aria-hidden />
        <p className="text-sm font-medium text-[#6B6560]">{label}</p>
      </div>
    </main>
  );
}
