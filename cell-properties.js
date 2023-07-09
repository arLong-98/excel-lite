// selectors for cell properties

const bold = document.querySelector(".bold");
const italics = document.querySelector(".italics");
const underline = document.querySelector(".underline");
const fontSize = document.querySelector(".font-size-prop");
const fontFamily = document.querySelector(".font-family-prop");
const fontColor = document.querySelector(".font-color-input");
const bgColor = document.querySelector(".bg-color-input");
const alignment = document.querySelectorAll(".alignment"); // returns a node list

const [leftAlign, centerAlign, rightAlign] = alignment;

// the listeners below are used to add styles to the current active cell and store them to the 2-d array, so they can be referred later.

alignment.forEach((alignElem) => {
  alignElem.addEventListener("click", (e) => {
    const { node: cellNode, cellPropObj } = getActiveCell();
    let alignValue = e.target.classList[0];
    cellPropObj.alignment = alignValue;
    cellNode.style.textAlign = cellPropObj.alignment;

    switch (alignValue) {
      case "left":
        setPropertyCtaState(leftAlign, true);
        setPropertyCtaState(centerAlign, false);
        setPropertyCtaState(rightAlign, false);
        break;
      case "center":
        setPropertyCtaState(leftAlign, false);
        setPropertyCtaState(centerAlign, true);
        setPropertyCtaState(rightAlign, false);
        break;
      case "right":
        setPropertyCtaState(leftAlign, false);
        setPropertyCtaState(centerAlign, false);
        setPropertyCtaState(rightAlign, true);
        break;
    }
  });
});

bold.addEventListener("click", () => {
  const { node: cellNode, cellPropObj } = getActiveCell();
  cellPropObj.bold = !cellPropObj.bold;
  cellNode.style.fontWeight = cellPropObj.bold ? "bold" : "normal"; //This modifies the cell ui
  setPropertyCtaState(bold, cellPropObj.bold); // This modifies the active state
});

italics.addEventListener("click", () => {
  const { node: cellNode, cellPropObj } = getActiveCell();
  cellPropObj.italics = !cellPropObj.italics;
  cellNode.style.fontStyle = cellPropObj.italics ? "italic" : "normal"; //This modifies the cell ui
  setPropertyCtaState(italics, cellPropObj.italics); // This modifies the active state
});

underline.addEventListener("click", () => {
  const { node: cellNode, cellPropObj } = getActiveCell();
  cellPropObj.underline = !cellPropObj.underline;
  cellNode.style.textDecoration = cellPropObj.underline ? "underline" : "none"; //This modifies the cell ui
  setPropertyCtaState(underline, cellPropObj.underline); // This modifies the active state
});

fontSize.addEventListener("change", () => {
  const { node: cellNode, cellPropObj } = getActiveCell();
  cellPropObj.fontSize = fontSize.value;
  cellNode.style.fontSize = `${cellPropObj.fontSize}px`; //This modifies the cell ui
});

fontFamily.addEventListener("change", () => {
  const { node: cellNode, cellPropObj } = getActiveCell();
  cellPropObj.fontFamily = fontFamily.value;
  cellNode.style.fontFamily = cellPropObj.fontFamily; //This modifies the cell ui
});

fontColor.addEventListener("change", () => {
  const { node: cellNode, cellPropObj } = getActiveCell();
  cellPropObj.fontColor = fontColor.value;
  cellNode.style.color = cellPropObj.fontColor; //This modifies the cell ui
  fontColor.parentElement.style.color = cellPropObj.fontColor;
});

bgColor.addEventListener("change", () => {
  const { node: cellNode, cellPropObj } = getActiveCell();
  cellPropObj.backgroundColor = bgColor.value;
  cellNode.style.backgroundColor = cellPropObj.backgroundColor; //This modifies the cell ui
  bgColor.parentElement.style.color = cellPropObj.backgroundColor;
});

function setPropertyCtaState(node, cellPropValue) {
  node.style.backgroundColor = cellPropValue ? "#d1d8e0" : "transparent";
}

// use ACTIVE_SHEET to reflect the styles attached to a particular cell on the property container with bold, italics etc ctas.

let allCells = document.querySelectorAll(".cell");

for (let i = 0; i < allCells.length; i++) {
  addListenerToAttachCellProperties(allCells[i]);
}

function addListenerToAttachCellProperties(cell) {
  // this functions adds active styles styles to the property ctas as per the selected cell
  // we select a cell, this function adds an onClick listener that updates bold, italics, etc cta state in the property tool bar above
  cell.addEventListener("click", (e) => {
    const rowId = cell.dataset.row,
      colId = cell.dataset.col;

    const cellPropObj = ACTIVE_SHEET[rowId][colId];
    //bind tool bar ui state with current clicked cell
    setPropertyCtaState(bold, cellPropObj.bold);
    setPropertyCtaState(italics, cellPropObj.italics);
    setPropertyCtaState(underline, cellPropObj.underline);
    fontSize.value = cellPropObj.fontSize;
    fontColor.value = cellPropObj.fontColor;
    fontColor.parentElement.style.color = cellPropObj.fontColor;
    fontFamily.value = cellPropObj.fontFamily;
    bgColor.value = cellPropObj.backgroundColor;
    bgColor.parentElement.style.color = cellPropObj.backgroundColor;
    formulaBar.value = cellPropObj.formula;

    // bind cell styles with cellpropobj
    cell.innerText = cellPropObj.value;
    cell.style.backgroundColor = cellPropObj.backgroundColor;
    cell.style.textAlign = cellPropObj.alignment;
    cell.style.fontWeight = cellPropObj.bold ? "bold" : "normal";
    cell.style.fontStyle = cellPropObj.italics ? "italic" : "normal";
    cell.style.textDecoration = cellPropObj.underline ? "underline" : "none";
    cell.style.fontSize = `${cellPropObj.fontSize}px`;
    cell.style.color = cellPropObj.fontColor;

    const alignValue = cellPropObj.alignment;
    switch (alignValue) {
      case "left":
        setPropertyCtaState(leftAlign, true);
        setPropertyCtaState(centerAlign, false);
        setPropertyCtaState(rightAlign, false);
        break;
      case "center":
        setPropertyCtaState(leftAlign, false);
        setPropertyCtaState(centerAlign, true);
        setPropertyCtaState(rightAlign, false);
        break;
      case "right":
        setPropertyCtaState(leftAlign, false);
        setPropertyCtaState(centerAlign, false);
        setPropertyCtaState(rightAlign, true);
        break;
    }
  });
}

function getActiveCell() {
  const cellAddressElement = document.querySelector(".cell-address-input");
  const cellValue = cellAddressElement.value;

  const [rowId, colId] = decodeRID_CID(cellValue);
  const activeCell = document.querySelector(
    `[data-row="${rowId}"][data-col="${colId}"]`
  );

  const cellPropObj = ACTIVE_SHEET[rowId][colId];
  return { node: activeCell, cellPropObj };
}

function getRequestedCell(cellValue) {
  const [rowId, colId] = decodeRID_CID(cellValue);
  const activeCell = document.querySelector(
    `[data-row="${rowId}"][data-col="${colId}"]`
  );
  const cellPropObj = ACTIVE_SHEET[rowId][colId];
  return { node: activeCell, cellPropObj };
}

function decodeRID_CID(cellValue) {
  // cell address come in the form of 1A - 100Z, we need to get 0 based row, col from this
  const colValue = cellValue.charAt(cellValue.length - 1);
  const rowValue = cellValue.substring(0, cellValue.length - 1);
  const rowId = parseInt(rowValue - 1, 10);
  const colId = COLUMN_NAME_STRING.indexOf(colValue);

  return [rowId, colId];
}
