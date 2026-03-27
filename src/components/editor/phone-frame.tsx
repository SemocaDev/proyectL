"use client";

interface PhoneFrameProps {
  children: React.ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    // Ocupa el ancho disponible del panel, máximo 480px
    <div className="w-full max-w-120">
      {/* Bezel */}
      <div className="rounded-[2.5rem] border-8 border-sumi/80 bg-sumi/80 px-1.5 pb-2 pt-1 shadow-2xl">
        {/* Dynamic Island */}
        <div className="mx-auto mb-2 mt-1.5 h-5 w-24 rounded-full bg-sumi/80" />

        {/* Pantalla — proporción ~9:16, alto fijo con scroll propio */}
        <div
          className="overflow-y-auto overflow-x-hidden rounded-[1.75rem] bg-white"
          style={{ height: "min(540px, 60vh)" }}
        >
          {children}
        </div>

        {/* Home indicator */}
        <div className="mx-auto mb-0.5 mt-2 h-1 w-24 rounded-full bg-white/20" />
      </div>
    </div>
  );
}
