"use client";

interface PhoneFrameProps {
  children: React.ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="mx-auto w-full max-w-[320px]">
      {/* Phone bezel */}
      <div className="rounded-[2rem] border-[6px] border-sumi/90 bg-sumi/90 p-1 shadow-xl sm:rounded-[2.5rem] sm:border-8">
        {/* Notch */}
        <div className="mx-auto mb-1 h-4 w-20 rounded-full bg-sumi/90 sm:h-5 sm:w-28" />

        {/* Screen */}
        <div className="h-130 overflow-y-auto overflow-x-hidden rounded-[1.5rem] bg-white sm:h-145 sm:rounded-[2rem]">
          {children}
        </div>

        {/* Home indicator */}
        <div className="mx-auto mt-1.5 h-1 w-20 rounded-full bg-white/30 sm:mt-2 sm:w-28" />
      </div>
    </div>
  );
}
