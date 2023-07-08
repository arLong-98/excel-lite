//create a 2d array for 100 rows and each row with 26 columns, each column with an array for child [rowId, colID]
// let graphComponentMatrix = new Array(ROWS)
//   .fill("")
//   .map(() => new Array(COLUMNS).fill(new Array()));

let graphComponentMatrix = [];

for (let i = 0; i < ROWS; i++) {
  let rowArray = [];
  for (let j = 0; j < COLUMNS; j++) {
    rowArray.push([]);
  }
  graphComponentMatrix.push(rowArray);
}

// return true if cycle, else false if not cyclic
function isGraphCyclic(matrix) {
  const visited = [];
  const dfsVisited = [];

  for (let i = 0; i < ROWS; i++) {
    let visitedRow = [];
    let dfsVisitedRow = [];
    for (let j = 0; j < COLUMNS; j++) {
      visitedRow[j] = false;
      dfsVisitedRow[j] = false;
    }

    visited.push(visitedRow);
    dfsVisited.push(dfsVisitedRow);
  }

  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLUMNS; j++) {
      const response = detectCycleDFS(matrix, visited, dfsVisited, i, j);
      if (response) {
        //return the cell where cyclic formula was detected
        //this will help is path tracing
        return [i, j];
      }
    }
  }

  return null;
}

//start -> vis = true, dfsVis = true;
//if already visited, we go back
//end -> dfsVis = false
//cycle detection algo

/**
 * matrix =
 * [
 * [ [[rid,cid],[rid,cid],[rid,cid]],[[rid,cid],[rid,cid],[rid,cid]],[],[],[] ],
 * [ [],[],[[rid,cid]],[[rid,cid],[rid,cid]],[] ],
 * [ [],[],[[rid,cid],[rid,cid]],[[rid,cid]],[] ],
 * [ [],[[rid,cid]],[],[[rid,cid]],[] ],
 * [ [],[],[],[[rid,cid]],[[rid,cid],[rid,cid]] ],
 * ]
 *
 * matrix[i][j] gives an array of children for a parent cell
 * each children is an array of size 2 containing children rowId and colId
 */

function detectCycleDFS(matrix, visited, dfsVisited, rowId, colId) {
  visited[rowId][colId] = true;
  dfsVisited[rowId][colId] = true;

  //looping over all child elements
  for (let i = 0; i < matrix[rowId][colId].length; i++) {
    const [childRowId, childColId] = matrix[rowId][colId][i];
    if (visited[childRowId][childColId] === false) {
      let response = detectCycleDFS(
        matrix,
        visited,
        dfsVisited,
        childRowId,
        childColId
      ); //keep tracing children
      if (response) {
        // if cycle found, we do not need to go further
        return true;
      }
    } else if (
      visited[childRowId][childColId] &&
      dfsVisited[childRowId][childColId]
    ) {
      // ultimate conditiion that tells that a cycle was detected,
      // since we get to an already visited child while traversing
      return true;
    }
  }

  dfsVisited[rowId][colId] = false;
}
