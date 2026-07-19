const FormButtons = ({
  onClickNext,
  onClickBack,
}: {
  onClickNext: () => void;
  onClickBack: () => void;
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
      <button
        onClick={onClickBack}
        className="group px-6 py-3 bg-white text-emerald-700 border-2 border-emerald-200 rounded-xl font-semibold hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
      >
        <svg
          className="w-4 h-4 transition-transform group-hover:-translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span>Quay lại</span>
      </button>
      <button
        className="group px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
        onClick={onClickNext}
      >
        <span>Kế tiếp</span>
        <svg
          className="w-4 h-4 transition-transform group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};
export default FormButtons;
