"use client";

interface PhoneFrameProps {
  children: React.ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="mx-auto w-[320px]">
      {/* Phone bezel */}
      <div className="rounded-[2.5rem] border-[8px] border-sumi/90 bg-sumi/90 p-1 shadow-xl">
        {/* Notch */}
        <div className="mx-auto mb-1 h-5 w-28 rounded-full bg-sumi/90" />

        {/* Screen */}
        <div className="h-[580px] overflow-y-auto overflow-x-hidden rounded-[2rem] bg-white">
          {children}
        </div>

        {/* Home indicator */}
        <div className="mx-auto mt-2 h-1 w-28 rounded-full bg-white/30" />
      </div>
    </div>
  );
}
