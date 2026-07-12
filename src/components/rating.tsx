type Props = {
  value: number;
  label: string;
};

export function Rating({ value, label }: Props) {
  return (
    <div className="flex items-center gap-2" aria-label={`${label}: ${value}/5`}>
      <div className="flex gap-0.5 text-[#f5a800]">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} aria-hidden="true">
            {star <= value ? "★" : "☆"}
          </span>
        ))}
      </div>
      <span className="text-sm font-black text-[#78313f]">{value}/5</span>
    </div>
  );
}
