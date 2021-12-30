function compareByReservationTime(left, right) {
    const leftDate = left.reservation_date;
    const [leftYear, leftMonth, leftDay] = [leftDate.getFullYear(), leftDate.getMonth(), leftDate.getDate()]
    const leftTimeArray = left.reservation_time.split(':');
    const leftTime = new Date(leftYear, leftMonth, leftDay, ...leftTimeArray)
  
    const rightDate = right.reservation_date;
    const [rightYear, rightMonth, rightDay] = [rightDate.getFullYear(), rightDate.getMonth(), rightDate.getDate()]
    const rightTimeArray = right.reservation_time.split(':');
    const rightTime = new Date(rightYear, rightMonth, rightDay, ...rightTimeArray)
  
    return leftTime.getTime() - rightTime.getTime();
  }

module.exports = compareByReservationTime;