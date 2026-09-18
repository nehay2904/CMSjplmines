import {
  LayoutDashboard,
  Users,
  FileText,
  Bell,
  ScrollText,
  FolderArchive,
  BookOpen
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const nav = [
  { to: '/supervisor', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/supervisor/team', label: 'My Team', icon: Users },
  { to: '/supervisor/returns', label: 'Team Compliance', icon: FileText },
  { to: '/supervisor/notices', label: 'Notices', icon: ScrollText },
  { to: '/supervisor/records', label: 'Records', icon: FolderArchive },
  { to: '/supervisor/alerts', label: 'Escalations', icon: Bell },
   { to: '/supervisor/statutory-library', label: 'Statutory Library', icon: BookOpen },
];

export default function SupervisorLayout() {
  return <DashboardLayout nav={nav} />;
}
