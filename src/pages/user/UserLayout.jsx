import {
  LayoutDashboard,
  ClipboardCheck,
  FileText,
  ScrollText,
  FolderArchive,
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/dashboard/compliances', label: 'My Compliances', icon: ClipboardCheck },
  { to: '/dashboard/returns', label: 'Returns', icon: FileText },
  { to: '/dashboard/notices', label: 'Notices', icon: ScrollText },
  { to: '/dashboard/records', label: 'Records', icon: FolderArchive },
];

export default function UserLayout() {
  return <DashboardLayout nav={nav} />;
}
