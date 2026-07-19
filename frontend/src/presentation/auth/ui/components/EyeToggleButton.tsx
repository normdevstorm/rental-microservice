import React from "react";

type Props = {
  isVisible: boolean;
  onToggle: () => void;
  className?: string;
  ariaLabelShow?: string;
  ariaLabelHide?: string;
  size?: number; // px
};

const EyeToggleButton: React.FC<Props> = ({
  isVisible,
  onToggle,
  className = "",
  ariaLabelShow = "Show password",
  ariaLabelHide = "Hide password",
  size = 20,
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center justify-center text-gray-500 hover:text-gray-700 focus-visible:outline-none ${className}`}
      aria-label={isVisible ? ariaLabelHide : ariaLabelShow}
    >
      {isVisible ? (
        // Eye with slash (hide)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width={size}
          height={size}
        >
          <path d="M3.707 3.293a1 1 0 00-1.414 1.414l16 16a1 1 0 001.414-1.414l-2.413-2.413A11.734 11.734 0 0022 12S18.5 5 12 5a10.7 10.7 0 00-3.88.72L3.707 3.293zM9.88 8.6A7.2 7.2 0 0112 8c4.5 0 7.5 4 7.5 4a10.1 10.1 0 01-3.186 2.89l-2.046-2.045A4 4 0 0010.5 9.646L9.88 8.6z" />
          <path d="M14.12 15.4L8.6 9.88A4 4 0 0012 16a4 4 0 002.12-.6z" />
        </svg>
      ) : (
        // Eye (show)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width={size}
          height={size}
        >
          <path d="M12 5C5.5 5 2 12 2 12s3.5 7 10 7 10-7 10-7-3.5-7-10-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-2a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
      )}
    </button>
  );
};

export default EyeToggleButton;
