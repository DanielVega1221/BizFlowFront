export const HelpText = ({ children, icon = 'ℹ️' }) => {
  return (
    <div className="flex items-start gap-2 p-3 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600">
      <span className="flex-shrink-0">{icon}</span>
      <p>{children}</p>
    </div>
  );
};
