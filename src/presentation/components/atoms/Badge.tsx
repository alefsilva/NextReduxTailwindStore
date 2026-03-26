interface BadgeProps {
  label: string;
  className?: string;
}

export function Badge({ label, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-full bg-brand-100 px-2.5 py-0.5 text-caption font-medium capitalize text-brand-700 ${className}`}
    >
      {label}
    </span>
  );
}
