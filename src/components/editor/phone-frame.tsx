"use client";

interface PhoneFrameProps {
  children: React.ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    // 390px wide — iPhone 14 Pro logical width, good reference for modern phones
    <div className="mx-auto w-full max-w-97.5">
      {/* Phone bezel */}
      <div className="rounded-[2.75rem] border-8 border-sumi/85 bg-sumi/85 px-1 pb-1 pt-0 shadow-2xl">
        {/* Dynamic Island style pill */}
        <div className="mx-auto mb-1.5 mt-2 h-4.5 w-25 rounded-full bg-sumi/85" />

        {/* Screen — 390×844 ratio ≈ aspect 9:19.5, we use a fixed height */}
        <div className="h-160 overflow-y-auto overflow-x-hidden rounded-[2rem] bg-white">
          {children}
        </div>

        {/* Home indicator */}
        <div className="mx-auto mb-0.5 mt-2 h-1 w-28 rounded-full bg-white/25" />
      </div>
    </div>
  );
}
