import ComplianceSection from '../../components/ComplianceSection';
export default function Records() {
  return (
    <ComplianceSection
      subCategory="Record"
      title="Records"
      subtitle="Registers and records to be maintained on site"
      columns={['id', 'title', 'category', 'assignee', 'freq', 'status', 'proof']}
    />
  );
}
