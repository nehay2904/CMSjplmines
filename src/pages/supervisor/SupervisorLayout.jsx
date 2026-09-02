import {
  LayoutDashboard,
  Users,
  FileText,
  Bell,
  ScrollText,
  FolderArchive,
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const nav = [
  { to: '/supervisor', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/supervisor/team', label: 'My Team', icon: Users },
  { to: '/supervisor/returns', label: 'Returns', icon: FileText },
  { to: '/supervisor/notices', label: 'Notices', icon: ScrollText },
  { to: '/supervisor/records', label: 'Records', icon: FolderArchive },
  { to: '/supervisor/alerts', label: 'Escalations', icon: Bell },
];

export default function SupervisorLayout() {
  return <DashboardLayout nav={nav} />;
}
