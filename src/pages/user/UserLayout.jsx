import {
  LayoutDashboard,
  ClipboardCheck,
  ScrollText,
  FolderArchive,
  BookOpen
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/dashboard/compliances', label: 'My Compliances', icon: ClipboardCheck },
  { to: '/dashboard/notices', label: 'Notices', icon: ScrollText },
  { to: '/dashboard/records', label: 'Records', icon: FolderArchive },
   { to: '/dashboard/statutory-library', label: 'Statutory Library', icon: BookOpen }
];

export default function UserLayout() {
  return <DashboardLayout nav={nav} />;
}