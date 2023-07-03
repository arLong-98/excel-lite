allCells.forEach((cell) => {
  cell.addEventListener("blur", (e) => {
    //this stores the value of cell in its respective cellPropObject inside sheetDB matrix
    const currentAddress = ADDRESS_BAR.value;
    const { node, cellPropObj } = getActiveCell();
    const cellData = node.innerText;
    if (Number(cellData) === cellPropObj.value) return;

    //if we update the value of a cell, we will have to remove current active formula,
    //remove parent child relation for the current cell and
    // update child cell values for the current cell
    cellPropObj.value = cellData;
    removeChildFromParent(cellPropObj.formula);
    cellPropObj.formula = "";
    updateChildrenCellValues(currentAddress);
  });
});

// two types of formulas, normal and dependency expression

formulaBar.addEventListener("keydown", (e) => {
  const formula = formulaBar.value.trim();

  /**
   * get address for current active cell
   * check if there is an old formula and new formula is different
   *    - if yes, update parent-child relation as per the new formula
   * evaluate the formula for current active cell, set parent child relation for the current active cell derived from the formula
   * update value of the current active cell
   * update childre
   */
  if (e.code === "Enter" && formula) {
    let address = ADDRESS_BAR.value;
    let { cellPropObj } = getRequestedCell(address);
    if (cellPropObj.formula !== formula) {
      //if new formula is different than old formula, then we will have to remove older parent
      //child relation
      removeChildFromParent(cellPropObj.formula);
    }
    const evaluatedValue = evaluateFormula(formula);
    //update this evaluated value in the cell UI and in cell object in sheetDB
    setCellUIAndPropObj(address, evaluatedValue, formula); //update current active cell value on formula update
    addChildToParent(formula); //
    updateChildrenCellValues(address); //this line updates current active cell's childrens' evaluated values
  }
});

function evaluateFormula(formula) {
  //eval is used to evaluate expressions such as 10+20

  /* - to evaluate dependency formula, we take each operand and check if its a cell address
     -  if it is a cell address we take the value on that address and use it to evaluate */
  const [operand1, operator, operand2] = formula.split(" ");
  const value1 = isNumeric(operand1) ? operand1 : getCellValue(operand1);
  const value2 = isNumeric(operand2) ? operand2 : getCellValue(operand2);
  const newFormula = `${value1} ${operator} ${value2}`;
  return eval(newFormula);
}

function isNumeric(str) {
  const number = Number(str);
  return !isNaN(number);
}

function setCellUIAndPropObj(address, evaluatedValue, formula) {
  //this function updates the cell value and cellPropObj with evaluated value
  const { node, cellPropObj } = getRequestedCell(address);
  node.innerText = evaluatedValue;
  cellPropObj.value = evaluatedValue;
  cellPropObj.formula = formula;
}

function getCellValue(cellAddress) {
  const [rowId, colId] = decodeRID_CID(cellAddress);
  const cellPropObj = sheetDB[rowId][colId];
  return cellPropObj.value;
}

function addChildToParent(formula) {
  const childAddress = ADDRESS_BAR.value;
  const encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(1);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let { cellPropObj } = getRequestedCell(encodedFormula[i]);
      cellPropObj.children.push(childAddress);
    }
  }
}

function removeChildFromParent(formula) {
  const childAddress = ADDRESS_BAR.value;
  const encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(1);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let { cellPropObj: parentCellPropObj } = getRequestedCell(
        encodedFormula[i]
      );
      let childIndex = parentCellPropObj.children.indexOf(childAddress);
      parentCellPropObj.children.splice(childIndex, 1);
    }
  }
}

function updateChildrenCellValues(parentAddress) {
  const { node, cellPropObj: parentCellPropObj } =
    getRequestedCell(parentAddress);

  const children = parentCellPropObj.children;

  //this is a recursive function
  for (let i = 0; i < children.length; i++) {
    let childAddress = children[i];
    let { node: childNode, cellPropObj: childPropObj } =
      getRequestedCell(childAddress);

    let childFormula = childPropObj.formula;
    let evaluatedValue = evaluateFormula(childFormula);
    setCellUIAndPropObj(childAddress, evaluatedValue, childFormula);
    updateChildrenCellValues(childAddress);
  }
}