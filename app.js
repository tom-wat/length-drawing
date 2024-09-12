const html = document.getElementsByTagName("html");
const body = document.getElementsByTagName("body");
const backdrop = document.getElementById("backdrop");
const main = document.getElementById("main");
const pc = document.getElementsByClassName("pc");
const fileButton = document.getElementById("file-button");
const fileInput = document.getElementById("file-input");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const compositeCanvas = document.getElementById("compositeCanvas");
const ctxComposite = compositeCanvas.getContext("2d");
const canvasBase = document.getElementById("canvas-base");
const ctxBase = canvasBase.getContext("2d", {
  willReadFrequently: true,
});
const imageContainer = document.querySelector(".image-container");
const container = document.querySelector(".container");
const format = document.getElementById("format");
const linesOnlyElement = document.getElementById("lines-only");
const filter = document.getElementById("filter");
const resetElement = document.getElementById("reset");
const webp = document.getElementById("webp");
const png = document.getElementById("png");
const clear = document.getElementById("clear-btn");
const zoomElement = document.getElementById("zoom");
const fontInput = document.getElementById("font-size-input");
const columnNumber = document.getElementById("column-number");
const downloadBtn = document.getElementById("download-btn");
const menu = document.getElementById("menu");
const openButton = document.getElementById("open-button");
const closeButton = document.getElementById("close-button");
const clickPointAdjustmentX = 0;
const clickPointAdjustmentY = 0;
const lengthElement = document.getElementById("length");
const pointerElement = document.getElementById("pointer");
const angleElement = document.getElementById("angle");
const lineElement = document.getElementById("line");
const lineOpacityElement = document.getElementById("line-opacity");
const lineWidthElement = document.getElementById("line-width");
const lineColorElement = document.getElementById("line-color");
const lineColorBtn = document.getElementById("line-color-btn");
const cardColorElement = document.getElementById("card-color");
const cardColorBtn = document.getElementById("card-color-btn");
const textColorElement = document.getElementById("text-color");
const textColorBtn = document.getElementById("text-color-btn");
const angleConstraintElement = document.getElementById("angle-constraint");
const quaternaryElement = document.getElementById("quaternary");
const textPositionElement = document.getElementById("textPosition");
const textPositionAdjustmentElement = document.getElementById(
  "textPositionAdjustment"
);
const ratioLeft = document.getElementById("ratio-left");
const ratioRight = document.getElementById("ratio-right");
const isMobile = navigator.userAgent.match(/(iPhone|iPod|Android|BlackBerry)/);
const overlay = document.getElementById("overlay");
// const undoStatesLimitNumber = 50;

let isInitialValue = true;
let isInitialValueForTooltip = true;
let image;
let undoStates = [];
let redoStates = [];
let initialState;
let currentStates;
let pointerX = 0;
let pointerY = 0;
let scaleValue = 1;
let startDragOffset = {};
let dragX = 0;
let dragY = 0;
let moveX = 0;
let moveY = 0;
let scaleDiffX = 0;
let scaleDiffY = 0;
let prevCanvasWidth = 0;
let prevCanvasHeight = 0;
let checkedPoints = [];
let lines = [];
let lineColor = lineColorElement.value;
let cardColor = cardColorElement.value;
let textColor = textColorElement.value;
let file;

function setStyles() {
  const settingFormat = localStorage.getItem("length-format");
  const settingTextPositionElement = localStorage.getItem(
    "length-textPosition"
  );
  const settingTextPositionAdjustmentElement = localStorage.getItem(
    "length-textPositionAdjustment"
  );
  const settingFontSize = localStorage.getItem("length-font-size-input");
  const settingPointer = localStorage.getItem("length-pointer");
  const settingLine = localStorage.getItem("length-line");
  const settingLineOpacity = localStorage.getItem("length-line-opacity");
  const settingLineWidth = localStorage.getItem("length-line-width");
  const settingLineColor = localStorage.getItem("length-line-color");
  const settingCardColor = localStorage.getItem("length-card-color");
  const settingTextColor = localStorage.getItem("length-text-color");
  const settingLinesOnly = localStorage.getItem("length-lines-only");
  const settingAngleConstraint = localStorage.getItem(
    "length-angle-constraint"
  );
  const settingLength = localStorage.getItem("length-length");
  const settingQuaternary = localStorage.getItem("length-quaternary");
  const settingAngle = localStorage.getItem("length-angle");

  setValueToSelected(format, settingFormat);
  setValueToSelected(textPositionElement, settingTextPositionElement);
  setValueToSelected(
    textPositionAdjustmentElement,
    settingTextPositionAdjustmentElement
  );
  setValueToSelected(fontInput, settingFontSize);
  changeFontSize(ctx, fontInput.value);
  setValueToChecked(pointerElement, settingPointer);
  setValueToChecked(lineElement, settingLine);
  if (localStorage.getItem("length-line-color") === null) {
    lineColorElement.value = "#ffffff";
  } else {
    lineColorElement.value = settingLineColor;
  }
  if (localStorage.getItem("length-card-color") === null) {
    cardColorElement.value = "#ffffff";
  } else {
    cardColorElement.value = settingCardColor;
  }
  if (localStorage.getItem("length-text-color") === null) {
    textColorElement.value = "#000000";
  } else {
    textColorElement.value = settingTextColor;
  }
  lineColor = lineColorElement.value;
  cardColor = cardColorElement.value;
  textColor = textColorElement.value;
  setValueToSelected(lineOpacityElement, settingLineOpacity);
  setValueToSelected(lineWidthElement, settingLineWidth);
  setValueToChecked(linesOnlyElement, settingLinesOnly);
  setValueToChecked(angleConstraintElement, settingAngleConstraint);
  setValueToChecked(lengthElement, settingLength);
  setValueToChecked(quaternaryElement, settingQuaternary);
  setValueToChecked(angleElement, settingAngle);
}

function setValueToChecked(element, value) {
  if (value === null) return;
  if (value === "false") {
    element.checked = false;
    return;
  }
  element.checked = true;
}

function setValueToSelected(element, value) {
  if (!value) return;
  for (const option of element.options) {
    if (option.value === value) {
      option.selected = true;
      return;
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const tabbableElements = document.querySelectorAll("[data-tabindex]");

  tabbableElements.forEach(function (element, index) {
    element.setAttribute("tabindex", 0);
  });
  if (!!isMobile === true) {
    menu.classList.toggle("close");
    openButton.classList.toggle("close");
    closeButton.classList.toggle("close");
    main.classList.toggle("close");
    imageContainer.classList.toggle("close");
    Array.from(pc).forEach((element) => (element.style.display = "none"));
  }
  setStyles();

  if (!!isMobile === true) {
    setTimeout(() => {
      backdrop.style.display = "none";
    }, 250);
    return;
  }
  backdrop.style.display = "none";
});

const openFile = (event) => {
  file = event.target.files[0];
  if (!file) {
    console.error("No file selected.");
    return;
  }
  main.style.display = "none";
  const reader = new FileReader();
  reader.onload = function () {
    image = new Image();
    image.src = reader.result;
    image.onload = function () {
      dividedDrawImage(1);
      ctxBase.drawImage(image, 0, 0, canvas.width, canvas.height);
      imageContainer.style.display = "block";
      changeFontSize(ctx, fontInput.value);
      initialState = ctx.getImageData(0, 0, canvas.width, canvas.height);
      lines = [];
      checkedPoints = [];
      undoStates = [];
      redoStates = [];
      dragX = 0;
      dragY = 0;
      moveX = 0;
      moveY = 0;
      scaleDiffX = 0;
      scaleDiffY = 0;
      prevCanvasWidth = 0;
      prevCanvasHeight = 0;
      scaleValue = 1;
      zoomElement.value = String(100);
    };
  };

  reader.readAsDataURL(file);
};

fileInput.addEventListener("change", openFile);

function dividedDrawImage(divisor) {
  canvas.width = image.width / divisor;
  canvas.height = image.height / divisor;
  canvasBase.width = image.width / divisor;
  canvasBase.height = image.height / divisor;
  compositeCanvas.width = image.width / divisor;
  compositeCanvas.height = image.height / divisor;
  imageContainer.style.width = `${image.width / divisor}px`;
  imageContainer.style.height = `${image.height / divisor}px`;
}

//ウインドウの幅にキャンバスを合わせる
function adjustedDrawImage() {
  const canvasWidth = Math.min(
    parseInt(window.getComputedStyle(container).width),
    image.width
  );
  canvas.width = canvasWidth;
  canvas.height = image.height * (canvasWidth / image.width);
  canvasBase.width = canvasWidth;
  canvasBase.height = image.height * (canvasWidth / image.width);
  compositeCanvas.width = canvasWidth;
  compositeCanvas.height = image.height * (canvasWidth / image.width);
  imageContainer.style.width = `${canvasWidth}px`;
  imageContainer.style.height = `${
    image.height * (canvasWidth / image.width)
  }px`;
}

// function to undo
function undo() {
  if (undoStates.length === 0) {
    return;
  }
  redoStates.push(undoStates.pop());
  // console.log(undoStates);
  if (undoStates.length > 0) {
    const undoStatesCopy = structuredClone(undoStates[undoStates.length - 1]);
    lines = undoStatesCopy.lines;
  } else {
    lines = [];
  }
  checkedPoints = [];
  drawImage();
}
function redo() {
  if (redoStates.length > 0) {
    undoStates.push(redoStates.pop());
    // console.log(undoStates);
    // console.log(redoStates);
    const undoStatesCopy = structuredClone(undoStates[undoStates.length - 1]);
    lines = undoStatesCopy.lines;
    checkedPoints = [];
    drawImage();
  }
}
function updateUndoStates() {
  const linesCopy = structuredClone(lines);
  const object = { lines: linesCopy };
  undoStates.push(object);
}

function clearCanvas() {
  if (!initialState) return;
  if (lines[lines.length - 1].length === 0) return;
  lines = [];
  checkedPoints = [];
  updateUndoStates();
  redoStates = [];
  drawImage();
}

///// Draw a line /////
const throttledDrawLine = throttle(drawLine, 200);
canvas.addEventListener("mousedown", throttledDrawLine);

function drawLineOnMouseMove(event) {
  const rect = canvas.getBoundingClientRect();
  const startX = checkedPoints[0].x;
  const startY = checkedPoints[0].y;
  let currentX = event.clientX - rect.left + clickPointAdjustmentX;
  let currentY = event.clientY - rect.top + clickPointAdjustmentY;
  let lineWidth = parseInt(lineWidthElement.value);
  if (!lineWidth) {
    lineWidth = 1;
  }
  ctx.lineWidth = parseInt(lineWidth);
  const opacity = lineOpacityElement.value;
  let currentColor = hexToRgba(lineColor, opacity);
  drawImage();
  drawCross(
    (startX + dragX / scaleValue) * scaleValue,
    (startY + dragY / scaleValue) * scaleValue,
    currentColor,
    lineWidth
  );
  ctx.beginPath();
  ctx.moveTo(
    (startX + dragX / scaleValue) * scaleValue,
    (startY + dragY / scaleValue) * scaleValue
  );
  if (angleConstraintElement.checked === true) {
    const angle = calculateAngle(
      (startX + dragX / scaleValue) * scaleValue,
      (startY + dragY / scaleValue) * scaleValue,
      currentX,
      currentY
    );
    const shiftAngle = adjustedAngle(angle);
    const adjustedPoint = rotatePoint(
      (startX + dragX / scaleValue) * scaleValue,
      (startY + dragY / scaleValue) * scaleValue,
      currentX,
      currentY,
      shiftAngle
    );
    ctx.lineTo(adjustedPoint[0], adjustedPoint[1]);
  } else {
    ctx.lineTo(currentX, currentY);
  }
  ctx.stroke();
}

function drawLine(event) {
  const rect = canvas.getBoundingClientRect();
  let x =
    (event.clientX - rect.left + clickPointAdjustmentX - dragX) / scaleValue;
  let y =
    (event.clientY - rect.top + clickPointAdjustmentY - dragY) / scaleValue;
  const textPositionValue = textPositionElement.selectedOptions[0].value;
  const textPositionAdjustment =
    textPositionAdjustmentElement.selectedOptions[0].value;
  const lineChecked = lineElement.checked;
  const lengthChecked = lengthElement.checked;
  const angleChecked = angleElement.checked;
  const pointerChecked = pointerElement.checked;
  let fontSize = fontInput.value;
  let lineWidth = parseInt(lineWidthElement.value);
  if (!lineWidth) {
    lineWidth = 1;
  }
  ctx.lineWidth = lineWidth;
  const opacity = lineOpacityElement.value;

  if (!x || !y) {
    return;
  }

  let currentColor = hexToRgba(lineColor, opacity);
  drawCross(
    (x + dragX / scaleValue) * scaleValue,
    (y + dragY / scaleValue) * scaleValue,
    currentColor,
    lineWidth
  );
  checkedPoints.push({
    x,
    y,
    fontSize,
    textPositionValue,
    textPositionAdjustment,
    lineColor,
    cardColor,
    textColor,
    lineWidth,
    pointerChecked,
    angleChecked,
    lengthChecked,
    lineChecked,
    opacity,
  });
  if (!!isMobile === false) {
    canvas.addEventListener("mousemove", drawLineOnMouseMove);
  }
  if (checkedPoints.length === 2) {
    if (!!isMobile === false) {
      canvas.removeEventListener("mousemove", drawLineOnMouseMove);
    }

    // console.log("checkedPoints:", checkedPoints);
    const angle = parseFloat(
      calculateAngle(
        checkedPoints[0].x,
        checkedPoints[0].y,
        checkedPoints[1].x,
        checkedPoints[1].y
      )
    );
    // console.log("angle:", angle);
    const shiftAngle = adjustedAngle(angle);
    // console.log("shiftAngle:", shiftAngle);
    const adjustedPoint = rotatePoint(
      checkedPoints[0].x,
      checkedPoints[0].y,
      checkedPoints[1].x,
      checkedPoints[1].y,
      shiftAngle
    );
    if (angleConstraintElement.checked === true) {
      checkedPoints[1].x = adjustedPoint[0];
      checkedPoints[1].y = adjustedPoint[1];
    }
    lines.push(checkedPoints);
    // console.log("lines:", lines);
    updateUndoStates();
    // console.log("undoStates:", undoStates);
    drawImage();
    checkedPoints = [];
    redoStates = [];
  }
}
function adjustedAngle(angle) {
  if (0 < angle && angle <= 22.5) {
    return 0;
  }
  if (22.5 < angle && angle <= 67.5) {
    return -45;
  }
  if (67.5 < angle && angle <= 112.5) {
    return -90;
  }
  if (112.5 < angle && angle <= 157.5) {
    return -135;
  }
  if (157.5 < angle && angle <= 202.5) {
    return -180;
  }
  if (202.5 < angle && angle <= 247.5) {
    return 135;
  }
  if (247.5 < angle && angle <= 292.5) {
    return 90;
  }
  if (292.5 < angle && angle <= 337.5) {
    return 45;
  }
  if (337.5 < angle && angle <= 360) {
    return 0;
  }
  return 0;
}
function drawCross(x, y, color, lineWidth) {
  ctx.strokeStyle = color;
  ctx.lineWidth = parseInt(lineWidth);
  const crossSize = 5 + parseInt(lineWidth); // Size of the cross arms
  ctx.beginPath();
  ctx.moveTo(x - crossSize, y);
  ctx.lineTo(x + crossSize, y);
  ctx.moveTo(x, y - crossSize);
  ctx.lineTo(x, y + crossSize);
  ctx.stroke();
}
function drawLength() {
  lines.forEach((line) => {
    const pointStart = line[0];
    const pointEnd = line[1];
    const positionValue = line[1].textPositionValue;
    const positionAdjustment = line[1].textPositionAdjustment;
    const lineColor = hexToRgba(line[1].lineColor, line[1].opacity);
    const lineWidth = line[1].lineWidth;
    const angle = calculateAngle(
      pointStart.x,
      pointStart.y,
      pointEnd.x,
      pointEnd.y
    );
    const fontSize = parseInt(line[1].fontSize * scaleValue);
    const cardMargin = (fontSize + (fontSize / 4) * 2) / scaleValue;
    let pointStartForAngle = structuredClone(line[0]);
    let pointEndForAngle = structuredClone(line[1]);
    pointStartForAngle.y += cardMargin;
    pointEndForAngle.y += cardMargin;
    let length = Math.sqrt(
      Math.pow(pointEnd.x - pointStart.x, 2) +
        Math.pow(pointEnd.y - pointStart.y, 2)
    ).toFixed(0);
    if (ratioRight.value === "" && ratioLeft.value === "") {
      length = formatNumber((length / 1) * 1);
    } else if (ratioLeft.value === "") {
      length = formatNumber((length / parseInt(ratioRight.value)) * 1);
    } else if (ratioRight.value === "") {
      length = formatNumber((length / 1) * parseInt(ratioLeft.value));
    } else {
      length = formatNumber(
        (length / parseInt(ratioRight.value)) * parseInt(ratioLeft.value)
      );
    }
    if (line[1].lineChecked === true) {
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = parseInt(lineWidth);
      ctx.beginPath();
      ctx.moveTo(pointStart.x * scaleValue, pointStart.y * scaleValue);
      ctx.lineTo(pointEnd.x * scaleValue, pointEnd.y * scaleValue);
      ctx.stroke();
    }
    if (line[1].pointerChecked === true) {
      drawCross(
        pointStart.x * scaleValue,
        pointStart.y * scaleValue,
        lineColor,
        lineWidth
      );
      drawCross(
        pointEnd.x * scaleValue,
        pointEnd.y * scaleValue,
        lineColor,
        lineWidth
      );
    }
    if (line[1].lengthChecked === true && line[1].angleChecked === false) {
      drawLengthValue(
        pointStart,
        pointEnd,
        length,
        positionValue,
        positionAdjustment,
        fontSize
      );
    }
    if (line[1].lengthChecked === true && line[1].angleChecked === true) {
      drawLengthValue(
        pointStart,
        pointEnd,
        length,
        positionValue,
        positionAdjustment,
        fontSize
      );
      drawLengthValue(
        pointStartForAngle,
        pointEndForAngle,
        `${angle}°`,
        positionValue,
        positionAdjustment,
        fontSize,
        true
      );
    }
    if (line[1].lengthChecked === false && line[1].angleChecked === true) {
      drawLengthValue(
        pointStart,
        pointEnd,
        `${angle}°`,
        positionValue,
        positionAdjustment,
        fontSize,
        true
      );
    }
  });
}
function drawLengthValue(
  point1,
  point2,
  value,
  textPosition,
  positionAdjustment,
  fontSize,
  isAngle = false
) {
  let length = value;
  if (quaternaryElement.checked === true && isAngle === false) {
    length = parseInt(value).toString(4);
  }
  changeFontSize(ctx, fontSize);
  const textWidth = ctx.measureText(String(length)).width;
  const textHeight = fontSize;
  const textPadding = fontSize / 4;
  const cornerRadius = fontSize / 4;
  const textX = calculateTextPositionX(textPosition, point1.x, point2.x);
  const textY = calculateTextPositionY(textPosition, point1.y, point2.y);
  const cardColor = hexToRgba(point2.cardColor, point2.opacity);
  const textColor = hexToRgba(point2.textColor, point2.opacity);
  drawCard(
    positionAdjustment,
    length,
    textX,
    textY,
    textWidth,
    textHeight,
    textPadding,
    cornerRadius,
    cardColor,
    textColor
  );
}
function calculateTextPositionX(position, x1, x2) {
  switch (position) {
    case "start":
      return x1 * scaleValue;
    case "middle":
      return ((x1 + x2) / 2) * scaleValue;
    case "end":
      return x2 * scaleValue;
    default:
      return ((x1 + x2) / 2) * scaleValue;
  }
}
function calculateTextPositionY(position, y1, y2) {
  switch (position) {
    case "start":
      return y1 * scaleValue;
    case "middle":
      return ((y1 + y2) / 2) * scaleValue;
    case "end":
      return y2 * scaleValue;
    default:
      return ((y1 + y2) / 2) * scaleValue;
  }
}
function drawCard(
  adjust,
  lengthValue,
  textX,
  textY,
  textWidth,
  textHeight,
  textPadding,
  cornerRadius,
  cardColor,
  textColor
) {
  switch (adjust) {
    case "topRight":
      ctx.fillStyle = cardColor;
      drawRoundedRectangle(
        ctx,
        textX,
        textY - textHeight - textPadding,
        textWidth + textPadding * 2,
        textHeight + textPadding,
        cornerRadius
      );
      ctx.fillStyle = textColor;
      ctx.fillText(`${lengthValue}`, textX + textPadding, textY - textPadding);
      break;
    case "topLeft":
      ctx.fillStyle = cardColor;
      drawRoundedRectangle(
        ctx,
        textX - textWidth - textPadding * 2,
        textY - textHeight - textPadding,
        textWidth + textPadding * 2,
        textHeight + textPadding,
        cornerRadius
      );
      ctx.fillStyle = textColor;
      ctx.fillText(
        `${lengthValue}`,
        textX - textWidth - textPadding * 2 + textPadding,
        textY - textPadding
      );
      break;
    case "bottomLeft":
      ctx.fillStyle = cardColor;
      drawRoundedRectangle(
        ctx,
        textX - textWidth - textPadding * 2,
        textY,
        textWidth + textPadding * 2,
        textHeight + textPadding,
        cornerRadius
      );
      ctx.fillStyle = textColor;
      ctx.fillText(
        `${lengthValue}`,
        textX - textWidth - textPadding * 2 + textPadding,
        textY + textHeight
      );
      break;
    case "bottomRight":
      ctx.fillStyle = cardColor;
      drawRoundedRectangle(
        ctx,
        textX,
        textY,
        textWidth + textPadding * 2,
        textHeight + textPadding,
        cornerRadius
      );
      ctx.fillStyle = textColor;
      ctx.fillText(`${lengthValue}`, textX + textPadding, textY + textHeight);
      break;
    case "middle":
      ctx.fillStyle = cardColor;
      drawRoundedRectangle(
        ctx,
        textX - (textWidth + textPadding * 2) / 2,
        textY - textHeight / 2 - textPadding,
        textWidth + textPadding * 2,
        textHeight + textPadding,
        cornerRadius
      );
      ctx.fillStyle = textColor;
      ctx.fillText(
        `${lengthValue}`,
        textX - textWidth / 2,
        textY + textHeight / 2 - textPadding
      );
      break;
    default:
      ctx.fillStyle = cardColor;
      drawRoundedRectangle(
        ctx,
        textX,
        textY - textHeight - textPadding,
        textWidth + textPadding * 2,
        textHeight + textPadding,
        cornerRadius
      );
      ctx.fillStyle = textColor;
      ctx.fillText(`${lengthValue}`, textX + textPadding, textY - textPadding);
      break;
  }
}

document.addEventListener("keydown", (event) => {
  // if (event.key === "d") {
  //   if (keyMeta) return;

  //   debouncedDownload();
  // }
  // if (event.key === "w") {
  //   if (keyMeta) return;
  //   changeSelectedElement(scale);
  // }
  // if (event.key === "f") {
  //   if (keyMeta) return;
  //   changeSelectedElement(format);
  // }
  if (event.key === "c") {
    if (keyMeta) return;

    clearCanvas();
  }
  // if (event.key === "Escape") {
  //   navToggle();
  // }
  if (event.key === "z") {
    undo();
  }
  if (event.key === "x") {
    redo();
  }
});

// Set up an object to track the current state of each key
// let keyShift = false;
// let keyControl = false;
// let keyArrowUp = false;
// let keyArrowLeft = false;
// let keyArrowDown = false;
// let keyArrowRight = false;
let keyMeta = false;
// let keyZ = false;
// let keyX = false;
// let keyC = false;
// let keyD = false;

// Define your key press handler
// function handleKeyPress() {
//   if (keyMeta && keyZ && !keyShift) {
//     undo();
//     keyZ = false;
//   }
//   if (keyMeta && keyShift && keyZ) {
//     redo();
//     keyZ = false;
//   }
//   if (keyMeta && keyC) {
//     copyToClipboard();
//     keyC = false;
//   }
// }

// Add event listeners to track the state of each key
document.addEventListener("keydown", (event) => {
  if (event.key === "Shift") {
    keyShift = true;
  }
  // if (event.key === "Control") {
  //   keyControl = true;
  // }
  // if (event.key === "ArrowUp") {
  //   keyArrowUp = true;
  // }
  // if (event.key === "ArrowLeft") {
  //   keyArrowLeft = true;
  // }
  // if (event.key === "ArrowDown") {
  //   keyArrowDown = true;
  // }
  // if (event.key === "ArrowRight") {
  //   keyArrowRight = true;
  // }
  // if (event.key === "Meta") {
  //   keyMeta = true;
  // }
  // if (event.key === "z") {
  //   keyZ = true;
  // }
  // if (event.key === "x") {
  //   keyX = true;
  // }
  // if (event.key === "c") {
  //   keyC = true;
  // }
  // if (event.key === "d") {
  //   keyD = true;
  // }
  // handleKeyPress();
});

document.addEventListener("keyup", (event) => {
  // if (event.key === "Shift") {
  //   keyShift = false;
  // }
  // if (event.key === "Control") {
  //   keyControl = false;
  // }
  // if (event.key === "ArrowUp") {
  //   keyArrowUp = false;
  // }
  // if (event.key === "ArrowLeft") {
  //   keyArrowLeft = false;
  // }
  // if (event.key === "ArrowDown") {
  //   keyArrowDown = false;
  // }
  // if (event.key === "ArrowRight") {
  //   keyArrowRight = false;
  // }
  // if (event.key === "Meta") {
  //   keyMeta = false;
  // }
  // if (event.key === "z") {
  //   keyZ = false;
  // }
  // if (event.key === "x") {
  //   keyX = false;
  // }
  // if (event.key === "c") {
  //   keyC = false;
  // }
  // if (event.key === "d") {
  //   keyD = false;
  // }
});

/// Download ///

function download() {
  if (!!initialState === false) {
    return;
  }
  reset();
  drawImageDefault();
  // Canvasのイメージデータを取得する

  let imageData;
  ctxComposite.drawImage(canvasBase, 0, 0);
  ctxComposite.drawImage(canvas, 0, 0);
  switch (format.selectedOptions[0].value) {
    case "png":
      imageData = compositeCanvas.toDataURL("image/png");
      break;
    case "jpeg":
      imageData = compositeCanvas.toDataURL("image/jpeg", 0.85);
      break;
    case "webp":
      imageData = compositeCanvas.toDataURL("image/webP", 0.8);
      break;
    default:
      imageData = compositeCanvas.toDataURL("image/png");
  }
  if (linesOnlyElement.checked === true) {
    switch (format.selectedOptions[0].value) {
      case "png":
        imageData = canvas.toDataURL("image/png");
        break;
      case "jpeg":
        imageData = canvas.toDataURL("image/jpeg", 0.85);
        break;
      case "webp":
        imageData = canvas.toDataURL("image/webP", 0.8);
        break;
      default:
        imageData = canvas.toDataURL("image/png");
    }
  }
  // ダウンロード用のリンクを作成する
  const downloadLink = document.createElement("a");
  downloadLink.href = imageData;
  const fileName = removeExtension(file.name);
  switch (format.selectedOptions[0].value) {
    case "png":
      downloadLink.download = `${fileName}-length.png`;
      break;
    case "jpeg":
      downloadLink.download = `${fileName}-length.jpg`;
      break;
    case "webp":
      downloadLink.download = `${fileName}-length.webp`;
      break;
    default:
      downloadLink.download = `${fileName}-length.png`;
  }
  // リンクをクリックすることでダウンロードを実行する
  downloadLink.click();
  ctxComposite.clearRect(0, 0, compositeCanvas.width, compositeCanvas.height);
}
const debouncedDownload = debounce(download, 2000, true);

function removeExtension(filename) {
  // 最後のドットの位置を見つける
  let lastDotIndex = filename.lastIndexOf(".");

  // ドットが見つからなければ、元のファイル名を返す
  if (lastDotIndex === -1) return filename;

  // ドットの位置から拡張子を除いた部分を返す
  return filename.substring(0, lastDotIndex);
}

downloadBtn.addEventListener("click", debouncedDownload);

function debounce(func, delay, immediate) {
  let timerId;
  return function () {
    const context = this;
    const args = arguments;
    const callNow = immediate && !timerId;
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      timerId = null;
      if (!immediate) {
        func.apply(context, args);
      }
    }, delay);
    if (callNow) {
      func.apply(context, args);
    }
  };
}

/// UI function eventListener ///

overlay.addEventListener("click", function () {
  navToggle();
});
fileButton.addEventListener("click", function () {
  if (!!isMobile) {
    navToggle();
  }
});
format.addEventListener("change", function (event) {
  localStorage.setItem(
    `length-${format.name}`,
    format.selectedOptions[0].value
  );
  // format.blur();
});
zoomElement.addEventListener("change", function (event) {
  // localStorage.setItem(`length-${zoom.name}`, zoomElement.selectedOptions[0].value);
  zoom();
});
lineOpacityElement.addEventListener("change", function (event) {
  localStorage.setItem(
    `length-${lineOpacityElement.name}`,
    lineOpacityElement.selectedOptions[0].value
  );
});
lineWidthElement.addEventListener("change", function (event) {
  localStorage.setItem(
    `length-${lineWidthElement.name}`,
    lineWidthElement.selectedOptions[0].value
  );
});
fontInput.addEventListener("change", function (event) {
  localStorage.setItem(
    `length-${fontInput.name}`,
    fontInput.selectedOptions[0].value
  );
});
lineColorElement.addEventListener("change", function (event) {
  lineColor = this.value;
  localStorage.setItem(
    `length-${lineColorElement.name}`,
    lineColorElement.value
  );
});
lineColorBtn.addEventListener("click", function (event) {
  lineColorElement.click();
});
lineColorBtn.addEventListener("keydown", function (event) {
  lineColorElement.click();
});
cardColorElement.addEventListener("change", function (event) {
  cardColor = this.value;
  drawImage();
  localStorage.setItem(
    `length-${cardColorElement.name}`,
    cardColorElement.value
  );
});
cardColorBtn.addEventListener("click", function (event) {
  cardColorElement.click();
});
cardColorBtn.addEventListener("keydown", function (event) {
  cardColorElement.click();
});
textColorElement.addEventListener("change", function (event) {
  textColor = this.value;
  drawImage();
  localStorage.setItem(
    `length-${textColorElement.name}`,
    textColorElement.value
  );
});
textColorBtn.addEventListener("click", function (event) {
  textColorElement.click();
});
textColorBtn.addEventListener("keydown", function (event) {
  textColorElement.click();
});

clear.addEventListener("click", function () {
  if (!!isMobile) {
    navToggle();
  }
});
textPositionElement.addEventListener("change", function () {
  localStorage.setItem(
    `length-${textPositionElement.name}`,
    textPositionElement.selectedOptions[0].value
  );
});
textPositionAdjustmentElement.addEventListener("change", function () {
  localStorage.setItem(
    `length-${textPositionAdjustmentElement.name}`,
    textPositionAdjustmentElement.selectedOptions[0].value
  );
});
ratioLeft.addEventListener("change", () => {
  drawImage();
});
ratioRight.addEventListener("change", () => {
  drawImage();
});

resetElement.addEventListener("click", function () {
  reset();
});
resetElement.addEventListener("keydown", function (event) {
  if (event.key === "Enter" || event.key === " ") {
    reset();
  }
});

function navToggle() {
  menu.classList.toggle("close");
  openButton.classList.toggle("close");
  closeButton.classList.toggle("close");
  main.classList.toggle("close");
  imageContainer.classList.toggle("close");
  if (!!isMobile === true) {
    overlay.classList.toggle("close");
    body[0].classList.toggle("close");
  }
}

function changeCheckedLength() {
  lengthElement.checked = !lengthElement.checked;
  localStorage.setItem(`length-length`, lengthElement.checked);
}
function changeCheckedAngle() {
  angleElement.checked = !angleElement.checked;
  localStorage.setItem(`length-angle`, angleElement.checked);
}
function changeCheckedPointer() {
  pointerElement.checked = !pointerElement.checked;
  localStorage.setItem(`length-pointer`, pointerElement.checked);
}
function changeCheckedLine() {
  lineElement.checked = !lineElement.checked;
  localStorage.setItem(`length-line`, lineElement.checked);
}
function changeCheckedLinesOnly() {
  linesOnlyElement.checked = !linesOnlyElement.checked;
  localStorage.setItem(`length-lines-only`, linesOnlyElement.checked);
}
function changeCheckedAngleConstraint() {
  angleConstraintElement.checked = !angleConstraintElement.checked;
  localStorage.setItem(
    `length-angle-constraint`,
    angleConstraintElement.checked
  );
}
function changeCheckedQuaternary() {
  quaternaryElement.checked = !quaternaryElement.checked;
  localStorage.setItem(`length-quaternary`, quaternaryElement.checked);
  drawImage();
}

/// switch mode ///

// function changeCheckedPan() {
//   pan.checked = !pan.checked;
//   if (pan.checked === true) {
//     tooltip.style.display = "none";
//     html[0].style.cursor = "grab";
//     removeEventListenerTooltip();
//     canvas.removeEventListener("mousedown", throttledStoreLine);
//     canvas.addEventListener("mousedown", panMode);
//   } else {
//     html[0].style.cursor = "crosshair";
//     canvas.removeEventListener("mousedown", panMode);
//     canvas.addEventListener("mousemove", throttledGetColor);
//     document.addEventListener("mousemove", showTooltip);
//     canvas.addEventListener("mousedown", throttledStoreLine);
//   }
// }

// function panMode(event) {
//   html[0].style.cursor = "grabbing";
//   startDragOffset.x = event.clientX - canvas.offsetLeft - dragX;
//   startDragOffset.y = event.clientY - canvas.offsetTop - dragY;
//   canvas.addEventListener("mousemove", onMouseMove);
//   canvas.addEventListener("mouseup", onMouseUp);
//   canvas.addEventListener("mouseout", onMouseUp);
// }

// function onMouseMove(event) {
//   dragX = event.clientX - canvas.offsetLeft - startDragOffset.x;
//   dragY = event.clientY - canvas.offsetTop - startDragOffset.y;
//   drawImage();
// }

// function onMouseUp() {
//   html[0].style.cursor = "grab";
//   canvas.removeEventListener("mousemove", onMouseMove);
//   canvas.removeEventListener("mouseup", onMouseUp);
//   canvas.removeEventListener("mouseout", onMouseUp);
// }

/// utility functions ///

function drawRoundedRectangle(
  ctx,
  x,
  y,
  width,
  height,
  cornerRadius,
  isStroke
) {
  ctx.beginPath();
  ctx.moveTo(x + cornerRadius, y);
  ctx.lineTo(x + width - cornerRadius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + cornerRadius);
  ctx.lineTo(x + width, y + height - cornerRadius);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - cornerRadius,
    y + height
  );
  ctx.lineTo(x + cornerRadius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - cornerRadius);
  ctx.lineTo(x, y + cornerRadius);
  ctx.quadraticCurveTo(x, y, x + cornerRadius, y);
  ctx.closePath();
  if (isStroke) {
    ctx.stroke();
  } else {
    ctx.fill();
  }
}
function throttle(fn, wait) {
  let lastTime = 0;

  return function (event, ...args) {
    const now = Date.now();

    if (now - lastTime >= wait) {
      lastTime = now;
      return fn.apply(this, [event, ...args]);
    }
  };
}

function changeFontSize(context, fontSize) {
  const fontSizeValue = parseInt(fontSize);
  context.font = `500 ${fontSizeValue}px 'Inter','Helvetica Neue', Arial, sans-serif `;
}

fontInput.addEventListener("change", function () {
  changeFontSize(ctx, fontInput.value);
});

// function updateOutput(inputField, outputField) {
//   const inputValue = inputField.value; // 入力値を取得
//   outputField.textContent = inputValue; // 出力要素に処理後の値を表示
// }

function changeSelectedElement(element) {
  const selectedIndex = element.selectedIndex;
  if (selectedIndex + 1 === element.options.length) {
    element.options[0].selected = true;
    localStorage.setItem(
      `length-${element.name}`,
      element.selectedOptions[0].value
    );
  } else {
    element.options[selectedIndex + 1].selected = true;
    localStorage.setItem(
      `length-${element.name}`,
      element.selectedOptions[0].value
    );
  }
}

function drawImage() {
  if (!!image === false) return;
  ctxBase.clearRect(0, 0, canvas.width, canvas.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctxBase.save();
  ctxBase.translate(dragX, dragY);
  ctxBase.scale(scaleValue, scaleValue);

  ctx.save();
  ctx.translate(dragX, dragY);
  ctx.scale(scaleValue, scaleValue);

  moveX = window.scrollX;
  moveY = window.scrollY;
  prevCanvasWidth = canvas.width;
  prevCanvasHeight = canvas.height;
  dividedDrawImage(1 / scaleValue);
  scaleDiffX = (canvas.width - prevCanvasWidth) / 2;
  scaleDiffY = (canvas.height - prevCanvasHeight) / 2;
  window.scrollTo(moveX + scaleDiffX, moveY + scaleDiffY);
  ctxBase.drawImage(image, 0, 0, canvas.width, canvas.height);
  drawLength();
  ctxBase.restore();
  ctx.restore();
}

function drawImageDefault() {
  ctxBase.clearRect(0, 0, canvas.width, canvas.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctxBase.save();
  ctxBase.scale(1, 1);

  ctx.save();
  ctx.scale(1, 1);

  ctxBase.drawImage(image, 0, 0, canvas.width, canvas.height);
  drawLength();
  ctxBase.restore();
  ctx.restore();
}

function zoom() {
  const zoomValue = zoomElement.value / 100;
  scaleValue = zoomValue;
  drawImage();
}

function reset() {
  if (!!initialState === false) {
    return;
  }
  dragX = 0;
  dragY = 0;
  moveX = 0;
  moveY = 0;
  scaleDiffX = 0;
  scaleDiffY = 0;
  prevCanvasWidth = 0;
  prevCanvasHeight = 0;
  scaleValue = 1;
  zoomElement.value = String(100);
  dividedDrawImage(1 / scaleValue);
  drawImageDefault();
  window.scrollTo(0, 0);
}

function adjustedAngle(angle) {
  if (0 < angle && angle <= 22.5) {
    return 0;
  }
  if (22.5 < angle && angle <= 67.5) {
    return -45;
  }
  if (67.5 < angle && angle <= 112.5) {
    return -90;
  }
  if (112.5 < angle && angle <= 157.5) {
    return -135;
  }
  if (157.5 < angle && angle <= 202.5) {
    return -180;
  }
  if (202.5 < angle && angle <= 247.5) {
    return 135;
  }
  if (247.5 < angle && angle <= 292.5) {
    return 90;
  }
  if (292.5 < angle && angle <= 337.5) {
    return 45;
  }
  if (337.5 < angle && angle <= 360) {
    return 0;
  }
  return 0;
}
function drawCross(x, y, color, lineWidth) {
  ctx.strokeStyle = color;
  ctx.lineWidth = parseInt(lineWidth);
  const crossSize = 3 + parseInt(lineWidth); // Size of the cross arms
  ctx.beginPath();
  ctx.moveTo(x - crossSize, y);
  ctx.lineTo(x + crossSize, y);
  ctx.moveTo(x, y - crossSize);
  ctx.lineTo(x, y + crossSize);
  ctx.stroke();
}
function formatNumber(number) {
  if (Number.isNaN(number)) {
    return "Invalid Number";
  }

  if (Number.isInteger(number)) {
    return number.toString();
  }

  const rounded = Math.round(number * 100) / 100; // Round to 2 decimal places
  const decimalPart = rounded - Math.floor(rounded);

  if (decimalPart === 0) {
    return Math.floor(rounded).toString();
  } else {
    return rounded.toFixed(2);
  }
}
function calculateAngle(x0, y0, x, y) {
  // Adjust the click coordinates to be relative to the custom origin (x0, y0)
  let adjustedX = x - x0;
  let adjustedY = y - y0;

  // Calculate the angle in degrees
  let angleDegrees = (Math.atan2(adjustedY, adjustedX) * 180) / Math.PI;

  // Normalize the angle to be within 0 to 360 degrees
  if (angleDegrees > 0) {
    angleDegrees -= 360;
  }
  return formatNumber(Math.abs(angleDegrees));
}
function rotatePoint(x0, y0, x, y, degree) {
  // Convert degrees to radians
  const rad = degree * (Math.PI / 180);

  // Calculate the length from the origin to the point
  const length = Math.sqrt(Math.pow(x - x0, 2) + Math.pow(y - y0, 2));

  // Calculate new coordinates
  const x1 = x0 + length * Math.cos(rad);
  const y1 = y0 + length * Math.sin(rad);

  return [x1, y1];
}

function hexToRgba(hex, alpha) {
  // HEX値を正規化（3桁の場合は6桁に拡張）
  let normalizedHex = hex.replace(/^#/, "");
  if (normalizedHex.length === 3) {
    normalizedHex = normalizedHex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  // 16進数を10進数のRGB値に変換
  const r = parseInt(normalizedHex.substring(0, 2), 16);
  const g = parseInt(normalizedHex.substring(2, 4), 16);
  const b = parseInt(normalizedHex.substring(4, 6), 16);

  // α値を0から1の範囲に変換
  const a = alpha / 100;

  // RGBA値を返す
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
