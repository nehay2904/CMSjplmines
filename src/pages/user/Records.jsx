import ComplianceSection from '../../components/ComplianceSection';
export default function Records() {
  return (
    <ComplianceSection
      subCategory="Record"
      title="Records"
      subtitle="Registers and records you maintain on site"
      columns={['id', 'title', 'category', 'freq', 'status', 'proof']}
    />
  );
}
