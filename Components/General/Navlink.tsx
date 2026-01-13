"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  name: string;
  link: string;
}

interface NavlinkProps {
  item: NavItem;
  variant?: 'navbar' | 'footer';
}

const Navlink = ({ item, variant = 'navbar' }: NavlinkProps) => {
  const pathname = usePathname();
  
  if (variant === 'footer') {
    return (
      <Link
        href={item.link}
        className="hover:text-white transition duration-150 text-gray-400"
      >
        {item.name}
      </Link>
    );
  }

  // Navbar variant (with active state)
  const isActive = pathname === item.link || pathname.startsWith(`${item.link}/`);

  return (
    <Link
      href={item.link}
      className={`
        relative px-1 py-2 transition-all duration-200
        ${isActive 
          ? 'text-[#D55900] font-semibold' 
          : 'text-gray-700 hover:text-[#D55900]'
        }
        after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 
        after:bg-[#D55900] after:transition-all after:duration-300
        hover:after:w-full
        ${isActive ? 'after:w-full' : ''}
      `}
    >
      {item.name}
    </Link>
  );
};

export default Navlink;