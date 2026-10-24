interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  cream?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  cream = false,
  className = "",
}: SectionHeadingProps) {
  return (
    <div
      className={`${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
    >
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="display-2 mt-5">{title}</h2>
      {description && (
        <p
          className={`lede mt-5 ${align === "center" ? "mx-auto text-center" : ""} ${
            cream ? "text-cream-foreground/70" : ""
          }`}
        >
          {description}
        </p>
      )}
      <div className={`hairline-gold mt-8 ${align === "center" ? "mx-auto" : ""}`} />
    </div>
  );
}
