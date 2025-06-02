import Link from 'next/link';
export default function NavItem({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <li className="flex items-center justify-center">
      <Link
        href={href}
        className="text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors duration-200 px-3 py-1 rounded-md hover:bg-rose-50 dark:hover:bg-neutral-800"
        onClick={onClick}
      >
        {children}
      </Link>
    </li>
  );
}