import ComplianceSection from '../../components/ComplianceSection';
export default function Records() {
  return (
    <ComplianceSection
      subCategory="Record"
      title="Records"
      columns={['id', 'title', 'category', 'assignee', 'freq', 'status', 'proof']}
    />
  );
}
