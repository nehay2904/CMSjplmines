import ComplianceSection from '../../components/ComplianceSection';
export default function Notices() {
  return (
    <ComplianceSection
      subCategory="Notice"
      title="Notices"
      columns={['id', 'title', 'category', 'assignee', 'due', 'status', 'proof']}
    />
  );
}
