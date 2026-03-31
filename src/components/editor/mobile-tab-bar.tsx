"use client";

import { useTranslations } from "next-intl";
import type { EditorTab } from "./editor-tab-panel";

type MobileView = "editor" | "preview";

interface MobileTabBarProps {
  view: MobileView;
  activeTab: EditorTab;
  wizard?: boolean;
  tabValidity?: Record<EditorTab, boolean>;
  tabAttempted?: Set<EditorTab>;
  onViewChange: (v: MobileView) => void;
  onTabChange: (tab: EditorTab) => void;
}

function IconProfile({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function IconLinks({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    </svg>
  );
}

function IconDesign({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
    </svg>
  );
}

function IconEye({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

const TAB_ICONS: Record<EditorTab, React.ReactNode> = {
  profile: <IconProfile className="h-5 w-5" />,
  links:   <IconLinks   className="h-5 w-5" />,
  design:  <IconDesign  className="h-5 w-5" />,
};

export function MobileTabBar({
  view, activeTab, wizard, tabValidity, tabAttempted, onViewChange, onTabChange,
}: MobileTabBarProps) {
  const t = useTranslations("editor");

  const editorTabs: { id: EditorTab; label: string }[] = [
    { id: "profile", label: t("tabProfile") },
    { id: "links",   label: t("tabLinks")   },
    { id: "design",  label: t("tabDesign")  },
  ];

  function isTabActive(id: EditorTab) {
    return view === "editor" && activeTab === id;
  }

  function tabBadge(id: EditorTab) {
    if (!wizard || !tabValidity || !tabAttempted) return null;
    const valid    = tabValidity[id];
    const tried    = tabAttempted.has(id);
    const isDesign = id === "design";
    if (valid || isDesign) {
      // show check only if the user has visited / attempted this tab
      if (tried || isTabActive(id)) {
        return (
          <span className="absolute -top-0.5 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-uguisu text-[8px] text-white">
            ✓
          </span>
        );
      }
    } else if (tried) {
      return (
        <span className="absolute -top-0.5 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-shu text-[8px] text-white">
          !
        </span>
      );
    }
    return null;
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-hai/40 bg-white lg:hidden"
      style={{ paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}
    >
      {editorTabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => {
            onTabChange(tab.id);
            if (view === "preview") onViewChange("editor");
          }}
          className={`relative flex flex-1 flex-col items-center gap-0.5 px-1 pt-2 pb-1 text-[10px] font-medium transition-colors ${
            isTabActive(tab.id)
              ? "text-beni"
              : view === "preview"
                ? "text-ginnezumi/30"
                : "text-ginnezumi/60 hover:text-sumi"
          }`}
        >
          <span className="relative">
            {TAB_ICONS[tab.id]}
            {tabBadge(tab.id)}
          </span>
          {tab.label}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onViewChange(view === "preview" ? "editor" : "preview")}
        className={`flex flex-1 flex-col items-center gap-0.5 px-1 pt-2 pb-1 text-[10px] font-medium transition-colors ${
          view === "preview" ? "text-beni" : "text-ginnezumi/60 hover:text-sumi"
        }`}
      >
        <IconEye className="h-5 w-5" />
        {t("mobilePreview")}
      </button>
    </div>
  );
}
