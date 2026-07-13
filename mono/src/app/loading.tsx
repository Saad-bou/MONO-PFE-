export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-[200]">
      <div className="flex flex-col items-center gap-6">
        {/* Logo */}
        <span className="font-nav font-bold text-[24px] tracking-[0.4em] text-mono-black uppercase">
          MONO
        </span>

        {/* Minimal loading indicator */}
        <div className="w-12 h-[1px] bg-mono-border relative overflow-hidden">
          <div className="absolute inset-0 bg-mono-black animate-[shimmer_1.5s_ease-in-out_infinite] origin-left" />
        </div>
      </div>
    </div>
  );
}
