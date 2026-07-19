const StepIndicator = ({ currentStep = 1 }: { currentStep?: number }) => {
  return (
    <div className="flex justify-center items-center mb-6">
      {/* Step 1 */}
      <div className="flex flex-col items-center">
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-sm transition-all duration-200 ${
            currentStep === 1
              ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg"
              : currentStep > 1
              ? "bg-emerald-100 text-emerald-600 border-2 border-emerald-300"
              : "bg-gray-200 text-gray-500"
          }`}
        >
          {currentStep > 1 ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            "1"
          )}
        </div>
        <span
          className={`mt-2 text-xs font-medium transition-colors duration-200 ${
            currentStep === 1
              ? "text-emerald-700"
              : currentStep > 1
              ? "text-emerald-600"
              : "text-gray-400"
          }`}
        >
          Thông tin
        </span>
      </div>

      {/* Connector Line */}
      <div
        className={`w-16 h-0.5 mx-4 transition-colors duration-200 ${
          currentStep > 1 ? "bg-emerald-300" : "bg-gray-200"
        }`}
      />

      {/* Step 2 */}
      <div className="flex flex-col items-center">
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-sm transition-all duration-200 ${
            currentStep === 2
              ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg"
              : currentStep > 2
              ? "bg-emerald-100 text-emerald-600 border-2 border-emerald-300"
              : "bg-gray-200 text-gray-500"
          }`}
        >
          {currentStep > 2 ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            "2"
          )}
        </div>
        <span
          className={`mt-2 text-xs font-medium transition-colors duration-200 ${
            currentStep === 2
              ? "text-emerald-700"
              : currentStep > 2
              ? "text-emerald-600"
              : "text-gray-400"
          }`}
        >
          Đặt đơn
        </span>
      </div>
    </div>
  );
};
export default StepIndicator;
