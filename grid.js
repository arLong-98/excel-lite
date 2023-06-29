const ROWS = 100;
const COLUMNS = 26;
const COLUMN_NAME_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const ADDRESS_BAR = document.querySelector(".cell-address-input");

(function fillAddressCols() {
  const addressColumnContainer = document.querySelector(
    ".address-col-container"
  );

  for (let i = 0; i < ROWS; i++) {
    const nameDiv = createNamingCell(`${i + 1}`, "address-col");
    // appendChild is used to add a node as the last child to an element
    addressColumnContainer.appendChild(nameDiv);
  }
})();

(function fillAddressRows() {
  const addressRowContainer = document.querySelector(".address-row-container");

  for (let i = 0; i < COLUMNS; i++) {
    const nameDiv = createNamingCell(
      COLUMN_NAME_STRING.charAt(i),
      "address-row"
    );
    addressRowContainer.appendChild(nameDiv);
  }
})();

(function fillCells() {
  const cellsContainer = document.querySelector(".cells-container");

  for (let i = 0; i < ROWS; i++) {
    const rowCont = document.createElement("div");
    rowCont.setAttribute("class", "cell-row-container");
    for (let j = 0; j < COLUMNS; j++) {
      const dataCell = createNamingCell(null, "cell");
      // adding below data attributes to identify cells easily
      dataCell.dataset.row = i;
      dataCell.dataset.col = j;
      dataCell.contentEditable = true; // This makes the cell editable
      addAddressListener(dataCell, i, j);
      rowCont.appendChild(dataCell);
    }
    cellsContainer.appendChild(rowCont);
  }
})();

function createNamingCell(text, className) {
  const nameDiv = document.createElement("div");
  if (className) {
    nameDiv.setAttribute("class", className);
  }
  if (text) {
    const textNode = document.createTextNode(text);
    nameDiv.appendChild(textNode);
  }
  return nameDiv;
}

function addAddressListener(cell, i, j) {
  // this listener is attached to each cell, so that the cell address gets filled up
  //when ever we select a cell
  cell.addEventListener("click", function () {
    const rowId = i + 1;
    const colId = COLUMN_NAME_STRING.charAt(j);
    ADDRESS_BAR.value = `${rowId} ${colId}`;
  });
}

(function autoClickFirstCell() {
  //auto-click first cell via DOM
  const firstCell = document.querySelector(".cell");
  firstCell.click();
  firstCell.focus();
})();
