import ComplianceSection from '../../components/ComplianceSection';
export default function Notices() {
  return (
    <ComplianceSection
      subCategory="Notice"
      title="Notices"
      subtitle="Statutory notices — open any row to read the conditions"
      columns={['id', 'title', 'category', 'due', 'status', 'proof']}
    />
  );
}
