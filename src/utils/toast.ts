import { toast, type ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ToastType = "success" | "error" | "info" | "warning";

const options: ToastOptions = {
  position: "top-right",
  autoClose: 1500,
  theme: "colored",
  hideProgressBar: true,
};

export const showToast = (type: ToastType, message: string) => {
  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "info":
      toast.info(message, options);
      break;
    case "warning":
      toast.warning(message, options);
      break;
    default:
      toast(message);
  }
};
