interface PriceTagProps {
  price: number;
}

export function PriceTag({ price }: PriceTagProps) {
  const isFree = price === 0;
  return (
    <div
      className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-lg flex-shrink-0"
      style={{
        color: isFree ? '#34d399' : '#00d9a3',
        background: isFree ? 'rgba(16,185,129,0.08)' : 'rgba(0,217,163,0.08)',
        border: isFree ? '1px solid rgba(52,211,153,0.25)' : '1px solid rgba(0,217,163,0.25)',
      }}
    >
      {isFree ? 'FREE' : `$${price}`}
    </div>
  );
}
