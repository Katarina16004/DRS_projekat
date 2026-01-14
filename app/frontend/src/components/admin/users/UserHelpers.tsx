// Helper za prikaz info polja
export function Info({ label, value }: { label: string, value: string | undefined }) {
  return (
    <div className="flex flex-col mb-2">
      <span className="font-medium text-xs text-gray-600 mb-1">{label}</span>
      <span className="font-semibold text-base text-gray-800">{value || <span className="text-gray-400">-</span>}</span>
    </div>
  );
}

// Helper za veliko prvo slovo
export function capitalize(str?: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}