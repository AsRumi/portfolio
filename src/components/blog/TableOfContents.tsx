"use client";

type Heading = {
  level: number;
  text: string;
  id: string;
};

function extractHeadings(content: string | null): Heading[] {
  if (!content) return [];
  const lines = content.split("\n");
  const headings: Heading[] = [];

  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-");
      headings.push({ level, text, id });
    }
  }

  return headings;
}

export default function TableOfContents({ content }: { content: string | null }) {
  const headings = extractHeadings(content);

  if (headings.length === 0) return null;

  return (
    <nav className="flex flex-col gap-1">
      <p className="text-xs font-medium text-foreground mb-2 uppercase tracking-widest">
        On this page
      </p>
      {headings.map((h, i) => (
        <a
          key={i}
          href={`#${h.id}`}
          className={`text-xs text-muted-foreground hover:text-foreground transition-colors leading-relaxed ${
            h.level === 2 ? "pl-0" : h.level === 3 ? "pl-3" : "pl-0 font-medium"
          }`}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );
}
