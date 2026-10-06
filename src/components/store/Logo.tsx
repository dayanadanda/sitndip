import Link from "next/link";

export function Logo({
  className = "",
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link href="/" onClick={onClick} className={`inline-flex flex-col items-center ${className}`}>
      <span className="logo-mark text-[34px] leading-none tracking-tight md:text-[40px]">
        SitnDip
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-[0.35em] text-muted">
        Sit. Dip. Savor.
      </span>
    </Link>
  );
}
