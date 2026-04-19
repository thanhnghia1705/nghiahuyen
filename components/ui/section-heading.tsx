import { cn } from "@/lib/utils";

export function SectionHeading({
  kicker,
  title,
  description,
  className
}: {
  kicker: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex flex-col gap-3 md:mb-8", className)}>
      <span className="text-xs font-semibold uppercase tracking-[0.28em] text-blush-700">
        {kicker}
      </span>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
          {title}
        </h2>
        {description ? (
          <p className="max-w-xl text-sm leading-7 text-slate-600 md:text-base">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
