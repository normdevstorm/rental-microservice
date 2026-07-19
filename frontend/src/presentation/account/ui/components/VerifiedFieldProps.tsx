interface VerifiedFieldProps {
  label: string;
  value: string;
  isEditing: boolean;
  enable?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  verified?: boolean;
  verifiedLabel?: string;
  unverifiedLabel?: string;
}

const VerifiedField: React.FC<VerifiedFieldProps> = ({
  label,
  value,
  isEditing,
  enable = true,
  onChange,
  type = "text",
  verified = false,
  verifiedLabel = "Đã xác thực",
  unverifiedLabel = "Chưa xác thực",
}) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="font-medium">{label}:</span>
      {isEditing ? (
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="border rounded px-2 py-1"
        />
      ) : (
        <>
          <span className="text-gray-800">{value || "—"}</span>
{enable && (
  <span
    className={`text-xs px-2 py-0.5 rounded border ${
      verified
        ? "bg-green-100 text-green-700 border-green-400"
        : "bg-red-100 text-red-600 border-red-400"
    }`}
  >
    {verified ? verifiedLabel : unverifiedLabel}
  </span>
)}

        </>
      )}
    </div>
  );
};

export default VerifiedField;
