import moment from "moment";
import 'moment/dist/locale/vi';

const getTimeOfDay = () => {
    moment.locale('vi'); // Ensure locale is set
    const currentHour = moment().hour();
    if (currentHour >= 0 && currentHour < 12) {
        return "buổi sáng";
    } else if (currentHour >= 12 && currentHour < 18) {
        return "buổi chiều";
    } else {
        return "buổi tối";
    }
}

const getDiffTime = (time) => {
    moment.locale('vi');
    const diff = moment().diff(moment(time), 'days');
    if (diff === 0) {
        return moment(time).fromNow();
    } else if (diff === 1) {
        return "Hôm qua";
    } else {
        return moment(time).format("DD/MM/YYYY");
    }
}

export {
    moment,
    getTimeOfDay,
    getDiffTime
}