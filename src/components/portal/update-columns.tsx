"use client";

function ColumnList({
  items,
  emptyLabel,
}: {
  items: string[];
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-on-surface-variant/60">{emptyLabel}</p>;
  }
  return (
    <ul className="space-y-4">
      {items.map((item, i) => (
        <li key={`${i}-${item.slice(0, 32)}`} className="text-on-surface text-[15px] leading-snug">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function UpdateColumns({
  done,
  inProgress,
  next,
}: {
  done: string[];
  inProgress: string[];
  next: string[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <section className="p-6 rounded-xl bg-surface-container border border-outline-variant/10">
        <h3 className="text-xs font-label uppercase tracking-widest text-primary font-bold mb-4">
          Completed
        </h3>
        <ColumnList items={done} emptyLabel="Nothing completed yet." />
      </section>

      <section className="p-6 rounded-xl bg-surface-container-high border border-primary/20">
        <h3 className="text-xs font-label uppercase tracking-widest text-primary font-bold mb-4">
          In progress
        </h3>
        <ColumnList items={inProgress} emptyLabel="Nothing in progress right now." />
      </section>

      <section className="p-6 rounded-xl bg-surface-container border border-outline-variant/10">
        <h3 className="text-xs font-label uppercase tracking-widest text-on-surface-variant font-bold mb-4">
          Up next
        </h3>
        <ColumnList items={next} emptyLabel="Nothing scheduled yet." />
      </section>
    </div>
  );
}
