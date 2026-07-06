'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/admin', label: '仪表盘', icon: '📊' },
  { href: '/admin/pages', label: '落地页管理', icon: '📄' },
  { href: '/admin/pages/new', label: '新建页面', icon: '➕' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-screen sticky top-0">
      <div className="px-6 py-5 border-b border-gray-800">
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          🚀 落地页管理系统
        </h1>
        <p className="text-xs text-gray-500 mt-1">Landing Page Manager</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-gray-800">
        <p className="text-xs text-gray-600">v1.0 — SQLite + Next.js</p>
      </div>
    </aside>
  );
}
