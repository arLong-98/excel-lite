// select a start cell and end cell using ctrl + click.
// click cut, copy or paste button from toolbar for respective functionality

let ctrlKeyPressed = false;

document.addEventListener("keydown", (e) => {
  ctrlKeyPressed = e.ctrlKey;
});

document.addEventListener("keyup", (e) => {
  ctrlKeyPressed = e.ctrlKey;
});

for (let i = 0; i < ROWS; i++) {
  for (let j = 0; j < COLUMNS; j++) {
    const selectedCell = document.querySelector(
      `[data-row="${i}"][data-col="${j}"]`
    );
    handleSelectedCell(selectedCell);
  }
}

let copyBtn = document.querySelector(".copy");
let cutBtn = document.querySelector(".cut");
let pasteBtn = document.querySelector(".paste");

let cellRangeStorage = [];
let selectedCell = []; // store current selected cells node

function handleSelectedCell(cell) {
  cell.addEventListener("click", (e) => {
    //select cell range

    if (!ctrlKeyPressed && cellRangeStorage.length >= 1) {
      // this is used to remove current selection and set related ui and storage states
      for (let i = 0; i < selectedCell.length; i++) {
        selectedCell[i].classList.remove("selected-cell");
      }
      selectedCell = []; // reset storage
      cellRangeStorage = []; // reset storage
      return;
    }

    if (!ctrlKeyPressed) return;

    if (cellRangeStorage.length >= 2) return;

    cell.classList.add("selected-cell");
    const cellRowId = cell.dataset.row,
      cellColId = cell.dataset.col;

    selectedCell.push(cell); // use this to remove current selection ui
    cellRangeStorage.push([Number(cellRowId), Number(cellColId)]); // use this to remove current selection from storage
  });
}

let copiedData = [];

copyBtn.addEventListener("click", (e) => {
  copiedData = []; // reset older copied data before copying new data
  if (cellRangeStorage.length === 2) {
    const startRowID = cellRangeStorage[0][0],
      startColId = cellRangeStorage[0][1],
      endRowId = cellRangeStorage[1][0],
      endColId = cellRangeStorage[1][1];

    for (let i = startRowID; i <= endRowId; i++) {
      let copiedRow = [];
      for (let j = startColId; j <= endColId; j++) {
        let cellProp = ACTIVE_SHEET[i][j];
        // we will only copy value and styling and not copy formula and children relations
        copiedRow.push({ ...cellProp, formula: "", children: "" });
      }
      copiedData.push(copiedRow);
    }
  }
});

pasteBtn.addEventListener("click", (e) => {
  if (copiedData.length > 0) {
    const currentActiveCell = ADDRESS_BAR.value;
    const [rId, cId] = decodeRID_CID(currentActiveCell);
    for (let i = 0; i < copiedData.length; i++) {
      for (let j = 0; j < copiedData[0].length; j++) {
        const cell = document.querySelector(
          `[data-row="${rId + i}"][data-col="${cId + j}"]`
        );
        if (cell) {
          // deep cloning objects from copied data and over writing data in active sheet
          ACTIVE_SHEET[rId + i][cId + j] = JSON.parse(
            JSON.stringify(copiedData[i][j])
          );

          cell.click();
        }
      }
    }
  }
});

cutBtn.addEventListener("click", (e) => {
  if (cellRangeStorage.length === 2) {
    const startRowID = cellRangeStorage[0][0],
      startColId = cellRangeStorage[0][1],
      endRowId = cellRangeStorage[1][0],
      endColId = cellRangeStorage[1][1];

    for (let i = startRowID; i <= endRowId; i++) {
      let copiedRow = [];
      for (let j = startColId; j <= endColId; j++) {
        const cell = document.querySelector(
          `[data-row="${i}"][data-col="${j}"]`
        );
        // cut all the data of the cell from storage except formula and child relations,
        // and update the cell representation storage with default values
        let cellProp = {
          ...ACTIVE_SHEET[i][j],
          bold: false,
          italics: false,
          underline: false,
          alignment: "left",
          backgroundColor: "#ffffff",
          fontFamily: "monospace",
          fontSize: "14",
          fontColor: "#000000",
          value: "",
        };

        ACTIVE_SHEET[i][j] = cellProp;

        //apply change to cell by simple invoking the click
        cell.click();
      }
      copiedData.push(copiedRow);
    }
  }
});
