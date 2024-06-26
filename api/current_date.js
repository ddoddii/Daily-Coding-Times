import { getCurrentDate } from '../src/date.js';

export default (req, res) => {
    const currentDate = getCurrentDate();
    res.status(200).json({ currentDate });
};
