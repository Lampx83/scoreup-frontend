import moment from "moment-timezone";
import 'moment/locale/vi.js';
moment.tz.setDefault('Asia/Ho_Chi_Minh');
moment.locale('vi');

const getTimeOfDay = () => {
    const currentHour = moment().hour();
    if (currentHour >= 0 && currentHour < 12) {
        return "buổi sáng";
    } else if (currentHour >= 12 && currentHour < 18) {
        return "buổi chiều";
    } else {
        return "buổi tối";
    }
}

export {
  moment,
  getTimeOfDay
}