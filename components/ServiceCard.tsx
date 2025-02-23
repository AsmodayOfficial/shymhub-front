interface ServiceCardProps {
  title: string;
  description: string;
}

// Не используем `export default`, а просто `export`
export const ServiceCard: React.FC<ServiceCardProps> = ({ title, description }) => {
  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};