import Sidebar from '@/components/admin/sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 overflow-auto admin-scrollbar">
        <div className="px-6 py-6">{children}</div>
      </main>
    </div>
  );
}
