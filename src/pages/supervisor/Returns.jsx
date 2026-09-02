import ComplianceSection from '../../components/ComplianceSection';
export default function Returns() {
  return (
    <ComplianceSection
      subCategory="Return"
      title="Returns"
      subtitle="Periodic returns your team is responsible for filing"
      columns={['id', 'title', 'category', 'assignee', 'freq', 'due', 'status', 'proof']}
    />
  );
}
