// Helper za prikaz info polja
export function Info({ label, value , className }: { label: string, value: string | undefined, className?: string }) {
  return (
    <div className={`flex flex-col py-1 ${className ?? ""}`}>
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