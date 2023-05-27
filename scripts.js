$(document).ready(function () {
  function addRow() {
    let row = $(this).closest(".row");
    let newRow = row.clone();
    newRow.find('input[type="text"]').val("");
    newRow.insertAfter(row);
  }

  function deleteRow() {
    let row = $(this).closest(".row");
    let numRows = $("#rows-container .row").length;
    if (numRows > 1) {
      row.remove();
    }
  }

  function updateLabels() {
    $("#rows-container .row").each(function (index) {
      $(this)
        .find(".find-label")
        .text("Find #" + (index + 1));
      $(this)
        .find(".replace-label")
        .text("Replace #" + (index + 1));
      $(this)
        .find(".mode input")
        .attr("name", "mode-" + (index + 1));
    });
  }

  function replaceText() {
    let inputText = $("#input-text").val();
    $("#rows-container .row").each(function () {
      let findText = $(this).find(".find").val();
      let replaceText = $(this).find(".replace").val();
      let mode = $(this).find(".mode input:checked").val();
      let regex;
      if (mode === "basic") {
        regex = new RegExp(escapeRegExp(findText), "g");
      } else if (mode === "whole-word") {
        regex = new RegExp("\\b" + escapeRegExp(findText) + "\\b", "g");
      } else if (mode === "regex") {
        regex = new RegExp(findText, "g");
      }
      inputText = inputText.replace(regex, replaceText);
    });
    $("#output-text").val(inputText);
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  $("#rows-container").on("click", ".add-row", addRow);
  $("#rows-container").on("click", ".add-row", updateLabels);
  $("#rows-container").on("click", ".delete-row", deleteRow);
  $("#rows-container").on("click", ".delete-row", updateLabels);
  $("#replace-all").on("click", replaceText);
});
