import ComplianceSection from '../../components/ComplianceSection';
export default function Returns() {
  return (
    <ComplianceSection
      subCategory="Return"
      title="Returns"
      columns={['id', 'title', 'category', 'assignee', 'freq', 'due', 'status', 'proof']}
    />
  );
}
