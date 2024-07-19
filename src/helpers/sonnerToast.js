import {toast} from "sonner";

function pushToast(message, type = "success") {
  toast[type](message);
}

export default pushToast;