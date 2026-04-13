"use client";

import dynamic from "next/dynamic";

// Dynamically import to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type Props = {
  value: string;
  onChange: (val: string) => void;
  height?: number;
};

export default function MarkdownEditor({ value, onChange, height = 400 }: Props) {
  return (
    <div data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(val) => onChange(val ?? "")}
        height={height}
        preview="live"
      />
    </div>
  );
}
