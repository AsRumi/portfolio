"use client";

import { PERSONAS } from "@/lib/personas";

type Props = {
  /** Currently-selected persona IDs. */
  value: string[];
  onChange: (roles: string[]) => void;
};

// Multi-select control for assigning a content item to one or more personas.
// Stores the stable persona IDs from src/lib/personas.ts. Leaving every box
// unchecked means the item surfaces under every persona on the home page.
export default function RolesCheckboxGroup({ value, onChange }: Props) {
  function toggle(id: string, checked: boolean) {
    onChange(checked ? [...value, id] : value.filter((r) => r !== id));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {PERSONAS.map((p) => (
          <label
            key={p.id}
            className="flex items-center gap-2 text-sm cursor-pointer"
          >
            <input
              type="checkbox"
              checked={value.includes(p.id)}
              onChange={(e) => toggle(p.id, e.target.checked)}
              className="accent-primary w-4 h-4"
            />
            {p.label}
          </label>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Controls which persona this appears under on the home page. Leave all
        unchecked to show under every role.
      </p>
    </div>
  );
}
