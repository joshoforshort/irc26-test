import Link from 'next/link';

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export default function CTAButton({ href, children, variant = 'primary' }: CTAButtonProps) {
  const baseClasses = 'px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105';
  const variantClasses =
    variant === 'primary'
      ? 'bg-primary-600 text-white hover:bg-primary-700'
      : 'bg-white text-primary-600 hover:bg-primary-50';

  return (
    <Link href={href} className={`${baseClasses} ${variantClasses}`}>
      {children}
    </Link>
  );
}

