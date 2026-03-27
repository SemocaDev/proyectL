"use client";

import { useTranslations } from "next-intl";
import { LinkItemRow } from "./link-item-row";
import type { LinkhubLinkItem } from "@/lib/schemas";

interface LinksSectionProps {
  links: LinkhubLinkItem[];
  onChange: (links: LinkhubLinkItem[]) => void;
}

export function LinksSection({ links, onChange }: LinksSectionProps) {
  const t = useTranslations("editor");

  function addLink() {
    if (links.length >= 20) return;
    onChange([...links, { label: "", url: "" }]);
  }

  function updateLink(index: number, item: LinkhubLinkItem) {
    const updated = [...links];
    updated[index] = item;
    onChange(updated);
  }

  function removeLink(index: number) {
    onChange(links.filter((_, i) => i !== index));
  }

  function moveUp(index: number) {
    if (index === 0) return;
    const updated = [...links];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    onChange(updated);
  }

  function moveDown(index: number) {
    if (index === links.length - 1) return;
    const updated = [...links];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    onChange(updated);
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wider text-ginnezumi">
          {t("links")} ({links.length}/20)
        </h3>
        <button
          type="button"
          onClick={addLink}
          disabled={links.length >= 20}
          className="rounded-md border border-hai px-3 py-1 text-xs text-ginnezumi transition-colors hover:border-beni hover:text-beni disabled:opacity-40"
        >
          + {t("addLink")}
        </button>
      </div>

      {links.length === 0 ? (
        <div className="rounded-lg border border-dashed border-hai py-8 text-center">
          <p className="text-sm text-ginnezumi/50">{t("noLinks")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {links.map((item, i) => (
            <LinkItemRow
              key={i}
              item={item}
              index={i}
              total={links.length}
              onChange={(updated) => updateLink(i, updated)}
              onRemove={() => removeLink(i)}
              onMoveUp={() => moveUp(i)}
              onMoveDown={() => moveDown(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
