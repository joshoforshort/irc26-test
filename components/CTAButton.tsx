import Link from 'next/link';

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export default function CTAButton({ href, children, variant = 'primary' }: CTAButtonProps) {
  const baseClasses = 'px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all shadow-lg hover:shadow-xl active:scale-95 active:shadow-md';
  const variantClasses =
    variant === 'primary'
      ? 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800'
      : 'bg-white text-primary-600 hover:bg-primary-50 active:bg-primary-100';

  return (
    <Link href={href} className={`${baseClasses} ${variantClasses}`}>
      {children}
    </Link>
  );
}
