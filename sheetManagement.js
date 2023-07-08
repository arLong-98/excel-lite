/**
 * Handled Cases :
 *  On init
 */

const collectedSheetDB = [];
const collectedGraphComponents = [];

let ACTIVE_SHEET = [];
let ACTIVE_GRAPH_COMPONENT_MATRIX = [];

const addSheetButton = document.querySelector(".add-sheet-btn");
const sheetsFolderContainer = document.querySelector(
  ".sheets-folder-container"
);

addSheetButton.addEventListener("click", (e) => {
  const sheet = document.createElement("div");
  sheet.setAttribute("class", "sheet-folder");

  const allSheetFolder = document.querySelectorAll(".sheet-folder");
  sheet.setAttribute("id", allSheetFolder.length);
  sheet.innerHTML = `<div class="sheet-content">Sheet ${
    allSheetFolder.length + 1
  }</div>`;

  sheetsFolderContainer.appendChild(sheet);

  createSheetDB();
  createGraphComponentMatrix();
  handleActiveSheet(sheet);
  handleSheetRemoval(sheet);
  sheet.click();
});

(function setInitialSheet() {
  //this initializes a new sheet whenever we open the webapp for first time
  addSheetButton.click();
})();

function createSheetDB() {
  //this function creates a representation for a new sheet

  const sheetDB = [];

  for (let i = 0; i < ROWS; i++) {
    const sheetRow = [];
    for (let j = 0; j < COLUMNS; j++) {
      const cellProp = {
        bold: false,
        italics: false,
        underline: false,
        alignment: "left",
        backgroundColor: "#ffffff",
        fontFamily: "monospace",
        fontSize: "14",
        fontColor: "#000000",
        value: "",
        formula: "",
        children: [],
      };
      sheetRow.push(cellProp);
    }
    sheetDB.push(sheetRow);
  }

  collectedSheetDB.push(sheetDB);
}

function createGraphComponentMatrix() {
  let graphComponentMatrix = [];

  for (let i = 0; i < ROWS; i++) {
    let rowArray = [];
    for (let j = 0; j < COLUMNS; j++) {
      rowArray.push([]);
    }
    graphComponentMatrix.push(rowArray);
  }

  collectedGraphComponents.push(graphComponentMatrix);
}

function handleActiveSheet(sheet) {
  sheet.addEventListener("click", (e) => {
    const sheetId = Number(sheet.getAttribute("id"));
    handleSheetDB(sheetId);
    handleSheetProperties();
    handleSheetActiveUI(sheet);
  });
}

function handleSheetDB(sheetIndex) {
  ACTIVE_SHEET = collectedSheetDB[sheetIndex];
  ACTIVE_GRAPH_COMPONENT_MATRIX = collectedGraphComponents[sheetIndex];
}

function handleSheetActiveUI(sheet) {
  const currentActiveSheet = document.querySelector(".active-sheet-folder");
  currentActiveSheet &&
    currentActiveSheet.classList.remove("active-sheet-folder");
  sheet.classList.add("active-sheet-folder");
}

function handleSheetProperties() {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLUMNS; j++) {
      const currentCell = document.querySelector(
        `[data-row="${i}"][data-col="${j}"]`
      );
      currentCell.click();
    }
  }
  autoClickFirstCell();
}

function handleSheetRemoval(sheet) {
  // delete a sheet on right click
  sheet.addEventListener("mousedown", (e) => {
    if (e.button === 2) {
      if (collectedSheetDB.length === 1) {
        alert("A minimum of one sheet is required");
      } else {
        let response = confirm("This sheet will be delete, Confirm ?");
        if (response) {
          //remove current sheet related data from collectedSheetDB and collectedGraphComponents
          const sheetIndex = Number(sheet.getAttribute("id"));
          //remove sheet related data from data layer
          collectedSheetDB.splice(sheetIndex, 1);
          collectedGraphComponents.splice(sheetIndex, 1);
          // removes current sheet, updates the ui for adjusted sheets, updates ids, sets sheet 1 as active
          handleSheetUIRemoval(sheet);

          //set first sheet as active and update active sheet etc...
          handleSheetDB(0);
          handleSheetProperties();
        }
      }
    }
  });
}

function handleSheetUIRemoval(sheet) {
  sheet.remove();
  const allSheetFolder = document.querySelectorAll(".sheet-folder");
  for (let i = 0; i < allSheetFolder.length; i++) {
    allSheetFolder[i].setAttribute("id", i);
    let sheetContent = allSheetFolder[i].querySelector(".sheet-content");
    sheetContent.innerText = `Sheet ${i + 1}`;
  }

  allSheetFolder[0].classList.add("active-sheet-folder");
}
