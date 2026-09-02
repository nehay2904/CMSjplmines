import {
  LayoutDashboard,
  ClipboardList,
  UserPlus,
  Users,
  Building2,
  Bell,
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const nav = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/compliances', label: 'Compliances', icon: ClipboardList },
  { to: '/admin/assign', label: 'Assign & Track', icon: UserPlus },
  { to: '/admin/users', label: 'Users & Team', icon: Users },
  { to: '/admin/mines', label: 'Mines', icon: Building2 },
  { to: '/admin/alerts', label: 'Alert Log', icon: Bell },
];

export default function AdminLayout() {
  return <DashboardLayout nav={nav} />;
}
