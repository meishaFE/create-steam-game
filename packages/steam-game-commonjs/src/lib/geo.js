/**
 * 坐标系数学计算方法(大部分已迁移到mathjs-geo)
 * https://github.com/iampomelo/mathjs-geo
 * written by pomelo
 */

import mathgeo from 'mathjs-geo';

/**
 * 线的标签定位
 * @param rangeX1 图层范围最左上角x坐标
 * @param rangeY1 图层范围最左上角y坐标
 * @param rangeX2 图层范围最右下角x坐标
 * @param rangeY2 图层范围最右下角y坐标
 * @param x1 线段端点1x坐标
 * @param y1 线段端点1y坐标
 * @param x2 线段端点2x坐标
 * @param y2 线段端点2y坐标
 * @param width 标签宽
 * @param height 标签高
 * @param dist 标签距离直线的距离，可选
 * @returns {*} 返回标签定位[x,y]
 */
const getLineLabelPosition = function(
  [[rangeX1, rangeY1], [rangeX2, rangeY2]],
  [[x1, y1], [x2, y2]],
  [width, height],
  dist
) {
  const center = [
    mathgeo.round((x1 + x2) / 2, 3),
    mathgeo.round((y1 + y2) / 2, 3)
  ];
  const positions = mathgeo
    .getVertical(center, [[x1, y1], [x2, y2]], dist || 80)
    .sort((a, b) => a[1] - b[1])
    .map(v => [mathgeo.round(v[0] - width / 2, 3), v[1]]);
  for (let pos of positions) {
    if (
      pos[0] >= rangeX1 &&
      pos[0] + width <= rangeX2 &&
      pos[1] >= rangeY1 &&
      pos[1] + height <= rangeY2
    ) {
      return pos;
    }
  }
  return null;
};

export { getLineLabelPosition };
