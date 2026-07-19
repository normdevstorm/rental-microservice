// Status color utility functions for semantic coloring

export const getStatusColor = (status: string) => {
  const normalizedStatus = status.toLowerCase().trim();

  switch (normalizedStatus) {
    case "pending":
      return {
        bg: "bg-gradient-to-r from-yellow-100 to-amber-100",
        border: "border-yellow-300",
        text: "text-yellow-700",
        icon: "text-yellow-600",
      };
    case "confirmed":
      return {
        bg: "bg-gradient-to-r from-blue-100 to-indigo-100",
        border: "border-blue-300",
        text: "text-blue-700",
        icon: "text-blue-600",
      };
    case "completed":
      return {
        bg: "bg-gradient-to-r from-green-100 to-emerald-100",
        border: "border-green-300",
        text: "text-green-700",
        icon: "text-green-600",
      };
    case "cancelled":
      return {
        bg: "bg-gradient-to-r from-red-100 to-rose-100",
        border: "border-red-300",
        text: "text-red-700",
        icon: "text-red-600",
      };
    case "negotiation":
      return {
        bg: "bg-gradient-to-r from-orange-100 to-yellow-100",
        border: "border-orange-300",
        text: "text-orange-700",
        icon: "text-orange-600",
      };
    default:
      return {
        bg: "bg-gradient-to-r from-gray-100 to-slate-100",
        border: "border-gray-300",
        text: "text-gray-700",
        icon: "text-gray-600",
      };
  }
};

export const getPaymentStatusColor = (paymentStatus: string) => {
  const normalizedStatus = paymentStatus.toUpperCase().trim();

  switch (normalizedStatus) {
    case "INITIAL":
      return {
        bg: "bg-gradient-to-r from-gray-100 to-slate-100",
        border: "border-gray-300",
        text: "text-gray-700",
        icon: "text-gray-600",
      };
    case "DEPOSIT_PAID":
      return {
        bg: "bg-gradient-to-r from-yellow-100 to-amber-100",
        border: "border-yellow-300",
        text: "text-yellow-700",
        icon: "text-yellow-600",
      };
    case "RENTAL_PAID":
    case "FULLY_PAID":
      return {
        bg: "bg-gradient-to-r from-green-100 to-emerald-100",
        border: "border-green-300",
        text: "text-green-700",
        icon: "text-green-600",
      };
    default:
      return {
        bg: "bg-gradient-to-r from-gray-100 to-slate-100",
        border: "border-gray-300",
        text: "text-gray-700",
        icon: "text-gray-600",
      };
  }
};

export const getStatusIcon = (status: string) => {
  const normalizedStatus = status.toLowerCase().trim();

  switch (normalizedStatus) {
    case "pending":
      return "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"; // clock
    case "confirmed":
      return "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"; // check-circle
    case "completed":
      return "M5 13l4 4L19 7"; // check
    case "cancelled":
      return "M6 18L18 6M6 6l12 12"; // x
    case "negotiation":
      return "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"; // chat
    default:
      return "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"; // info
  }
};
