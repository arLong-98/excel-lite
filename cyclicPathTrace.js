//using async await to add a delay so paths are easily visible while tracing

async function isGraphCyclicTracePath(matrix, cycleResposne) {
  const [sourceRID, sourceCID] = cycleResposne;
  const visited = []; // node visit trace
  const dfsVisited = []; //stack visit trace

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

  let response = await detectCycleDFSTracePath(
    matrix,
    visited,
    dfsVisited,
    sourceRID,
    sourceCID
  );

  if (response === true) {
    return true;
  }

  return false;
}

// color cells for tracking
async function detectCycleDFSTracePath(
  matrix,
  visited,
  dfsVisited,
  rowId,
  colId
) {
  visited[rowId][colId] = true;
  dfsVisited[rowId][colId] = true;
  const currentCell = document.querySelector(
    `[data-row="${rowId}"][data-col="${colId}"]`
  );

  //we need a wait so the cell trace is visible to user
  //so we will wrap set timeout in promises

  currentCell.style.backgroundColor = "lightblue";
  await colorPromise(); //this will cause the function to wait for a second

  //looping over all child elements
  for (let i = 0; i < matrix[rowId][colId].length; i++) {
    const [childRowId, childColId] = matrix[rowId][colId][i];
    if (visited[childRowId][childColId] === false) {
      let response = await detectCycleDFSTracePath(
        matrix,
        visited,
        dfsVisited,
        childRowId,
        childColId
      );
      if (response) {
        currentCell.style.backgroundColor = "transparent";
        await colorPromise();
        return true; //will return a promise implicitly -> return Promise.resolve(true)
      }
    } else if (
      visited[childRowId][childColId] &&
      dfsVisited[childRowId][childColId]
    ) {
      let cyclicCell = document.querySelector(
        `[data-row="${childRowId}"][data-col="${childColId}"]`
      );
      cyclicCell.style.backgroundColor = "lightsalmon";
      await colorPromise();
      cyclicCell.style.backgroundColor = "transparent";
      await colorPromise();
      currentCell.style.backgroundColor = "transparent";
      await colorPromise();

      return true;
    }
  }

  dfsVisited[rowId][colId] = false;
  return false;
}

function colorPromise() {
  // this will make the function wait
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}
