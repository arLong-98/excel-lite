const downloadBtn = document.querySelector(".download-btn");
const uploadBtn = document.querySelector(".upload-file");

downloadBtn.addEventListener("click", (e) => {
  const jsonData = JSON.stringify([
    ACTIVE_SHEET,
    ACTIVE_GRAPH_COMPONENT_MATRIX,
  ]);

  const file = new Blob([jsonData], { type: "application/json" });
  const anchorEle = document.createElement("a");
  const fileUrl = URL.createObjectURL(file);
  anchorEle.href = fileUrl;
  anchorEle.download = "SheetData.json";
  anchorEle.click();
  URL.revokeObjectURL(fileUrl);
});

uploadBtn.addEventListener("change", function (e) {
  const fileList = this.files;
  const uploadedFile = fileList[0];
  const fileReader = new FileReader();
  fileReader.readAsText(uploadedFile);
  fileReader.onload = function () {
    const uploadedSheetData = JSON.parse(fileReader.result);
    addSheetButton.click(); // a basic sheet will be created with default data

    // update default data for new sheet with uploaded sheet data
    collectedSheetDB[collectedSheetDB.length - 1] = uploadedSheetData[0];
    collectedGraphComponents[collectedGraphComponents.length - 1] =
      uploadedSheetData[1];

    //set active sheet
    ACTIVE_SHEET = uploadedSheetData[0];
    ACTIVE_GRAPH_COMPONENT_MATRIX = uploadedSheetData[1];
    handleSheetProperties(); // update ui by clicking all cells
  };
});
