import ComplianceSection from '../../components/ComplianceSection';
export default function Returns() {
  return (
    <ComplianceSection
      subCategory="Return"
      title="Returns"
      subtitle="Periodic returns assigned to you"
      columns={['id', 'title', 'category', 'freq', 'due', 'status', 'proof']}
    />
  );
}
