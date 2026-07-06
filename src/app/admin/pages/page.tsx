import Link from 'next/link';
import Button from '@/components/ui/button';
import PagesTable from '@/components/admin/pages-table';

export default function PagesListPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">落地页管理</h2>
          <p className="text-gray-400 mt-1">管理您的所有落地页</p>
        </div>
        <Link href="/admin/pages/new">
          <Button variant="primary" size="lg">➕ 新建页面</Button>
        </Link>
      </div>
      <PagesTable />
    </div>
  );
}
