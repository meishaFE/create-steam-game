/**
 * 对d3常见操作的封装，确保先全局引入d3
 */

const addLine = function(selector, lineData, attrs) {
  const Line = d3
    .line()
    .x(d => d[0])
    .y(d => d[1]);
  let line = selector.append('path').attr('d', Line(lineData));
  for (let [key, value] of Object.entries(attrs)) {
    line = line.attr(key, value);
  }
};

const addPoint = function(selector, position, attrs) {
  let point = selector
    .append('circle')
    .attr('cx', position[0])
    .attr('cy', position[1]);
  for (let [key, value] of Object.entries(attrs)) {
    point = point.attr(key, value);
  }
};

const addText = function(selector, innerText, position, attrs) {
  let text = selector
    .append('text')
    .text(innerText)
    .attr('x', position[0])
    .attr('y', position[1]);
  for (let [key, value] of Object.entries(attrs)) {
    text = text.attr(key, value);
  }
};

export { addLine, addPoint, addText };
