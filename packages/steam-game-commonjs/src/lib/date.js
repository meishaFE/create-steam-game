/**
 * 时间处理
 *
 * writtern by pomelo
 */

/**
 * 格式化时间
 * @param {Date} date
 * @param {string} ft 格式化参数,如'YYYY年MM月'
 * @returns {string} 格式化后字符串
 *
 * 格式化参数说明: (如有需要可继续拓展)
 *  YYYY: 4位年份
 *  MM: 2位月份，如01
 *  MEn: 英文月份缩写，可能值：'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
 *  mm: 月份，如1
 *  DD: 2位日期，如01
 *  dd: 日期，如1
 *  HH: 24小时制小时，如23
 *  hh: 12小时制小时，如11
 *  min: 分
 *  sec: 秒
 *  weekday: 星期几，可能值：'日', '一', '二', '三', '四', '五', '六'
 */
const dateFormat = function(date, ft) {
  if (!(date instanceof Date) || typeof ft !== 'string') return '';
  const t = function(n) {
    return n < 10 ? '0' + n : '' + n;
  };
  const monthsEn = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const f = {
    YYYY: date.getFullYear(),
    MM: t(date.getMonth() + 1),
    MEn: monthsEn[date.getMonth()],
    mm: date.getMonth() + 1,
    DD: t(date.getDate()),
    dd: date.getDate(),
    HH: t(date.getHours()),
    hh: date.getHours() < 13 ? t(date.getHours()) : t(date.getHours() - 12),
    min: t(date.getMinutes()),
    sec: t(date.getSeconds()),
    weekday: weekDays[date.getUTCDay()]
  };
  for (let i in f) {
    ft = ft.replace(i, f[i]);
  }
  return ft;
};

/**
 * 两个时间间隔
 * @param date1 前个时间
 * @param date2 后个时间
 * @param unit 单位:sec/min/hour/day
 * @returns {number} 间隔数
 */
const dateDiff = function(date1, date2, unit) {
  if (!(date1 instanceof Date) || !(date2 instanceof Date)) return 0;
  const time1 = date1.getTime();
  const time2 = date2.getTime();
  const r = {
    sec: parseInt((time2 - time1) / 1000),
    min: parseInt((time2 - time1) / 1000 / 60),
    hour: parseInt((time2 - time1) / 1000 / 60 / 60),
    day: parseInt((time2 - time1) / 1000 / 60 / 60 / 24)
  };
  return r[unit] || 0;
};

/**
 * 日期增加/减少
 * @param date
 * @param n 数量
 * @param unit 单位
 * @returns {object} Date对象或null
 */
const addDate = function(date, n, unit) {
  if (
    !(date instanceof Date) ||
    typeof n !== 'number' ||
    typeof unit !== 'string'
  ) {
    return null;
  }
  const u = {
    sec: 1000,
    min: 1000 * 60,
    hour: 1000 * 60 * 60,
    day: 1000 * 60 * 60 * 24
  };
  return new Date(date.getTime() + u[unit] * n);
};

/**
 * 转成Unix时间戳(以秒为单位)
 * @param date
 * @returns {number} 秒
 */
const toUnixTime = function(date) {
  if (!(date instanceof Date)) return 0;
  return parseInt(date.getTime() / 1000);
};

/**
 * 持续时间
 * @param date1
 * @param date2
 * @returns {object} [时,分,秒]或null
 */
const timeDuration = function(date1, date2) {
  if (!(date1 instanceof Date) || !(date2 instanceof Date)) return null;
  const t = (date2.getTime() - date1.getTime()) / 1000;

  const decimalT = +parseFloat(t % 1).toPrecision(12);

  const roundT = Math.floor(t);

  const h = parseInt(roundT / 3600);

  const m = parseInt((roundT - 3600 * h) / 60);

  const s = roundT % 60;

  const ms = Math.round(decimalT * 100);
  return [h, m, s, ms];
};

/**
 * 转换成分秒毫秒形式
 * @param duration
 * @returns {object} [时,分,毫秒]或null
 */
const toMMssmm = duration => {
  const formatNumber = n => {
    n = n.toString();
    return n[2] ? n[0] + n[1] : n[1] ? n : '0' + n;
  };
  return `${formatNumber(Math.floor(duration / 1000 / 60))}:${formatNumber(
    Math.floor((duration / 1000) % 60)
  )}.${formatNumber((duration % 1000) / 10)}`;
};

export { dateFormat, dateDiff, addDate, toUnixTime, timeDuration, toMMssmm };
