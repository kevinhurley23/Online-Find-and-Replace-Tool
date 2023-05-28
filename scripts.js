$(document).ready(function () {
  const initialRows = $("#rows-container").html();

  function addRow() {
    let row = $(this).closest(".outer-row");
    let newRow = row.clone();
    newRow
      .find(".mode input")
      .attr("name", "mode-" + ($("#rows-container .outer-row").length + 1));
    newRow.find('input[type="text"]').val("");
    newRow.find('.mode input[value="basic"]').prop("checked", true);
    newRow.insertAfter(row);
    updateLabels();
  }

  function deleteRow() {
    let row = $(this).closest(".outer-row");
    let numRows = $("#rows-container .outer-row").length;
    if (numRows > 1) {
      row.remove();
    }
    updateLabels();
  }

  function updateLabels() {
    $("#rows-container .outer-row").each(function (index) {
      $(this)
        .find(".find-label")
        .text("Find #" + (index + 1));
      $(this)
        .find(".replace-label")
        .text("Replace #" + (index + 1));
    });
  }

  function replaceText() {
    let inputText = $("#input-text").val();
    $("#rows-container .outer-row").each(function () {
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

  function reset() {
    $("#rows-container").html(initialRows);
  }

  function saveSearchPattern() {
    let rows = $("#rows-container .outer-row").map(function () {
      let findValue = $(this).find(".find").val();
      let replaceValue = $(this).find(".replace").val();
      let modeValue = $(this).find(".mode input:checked").val();
      return { find: findValue, replace: replaceValue, mode: modeValue };
    });
    console.log(rows);
    let currentDate = new Date().toISOString();
    let patternData = {
      type: "searchPattern",
      date: currentDate,
      rows: rows.toArray(),
    };
    $("#save-modal").show();
    $("#save-button").on("click", function () {
      let patternName = $("#pattern-name").val();
      if (patternName) {
        localStorage.setItem(patternName, JSON.stringify(patternData));
      }
      $("#pattern-name").val("");
      $("#save-modal").hide();
    });
  }

  function loadSearchPattern() {
    $("#pattern-list").empty();
    let searchPatterns = Object.keys(localStorage).filter((key) => {
      let item = JSON.parse(localStorage.getItem(key));
      return item.type === "searchPattern";
    });
    $("#load-modal").show();
    searchPatterns.forEach((pattern) => {
      let item = JSON.parse(localStorage.getItem(pattern));
      let date = new Date(item.date).toLocaleString();
      let button = $(`<button>${pattern} (${date})</button>`);
      button.on("click", function () {
        $("#rows-container").html("");
        item.rows.forEach((row, index) => {
          let newRow = $(initialRows);
          newRow.find(".find").val(row.find);
          newRow.find(".replace").val(row.replace);
          newRow.find(`.mode input`).attr("name", `mode-${index + 1}`);
          newRow.find(`.mode input[value="${row.mode}"]`).prop("checked", true);
          $("#rows-container").append(newRow);
        });
        updateLabels();
        $("#load-modal").hide();
      });
      $("#pattern-list").append(button);
    });
  }

  $("#rows-container").on("click", ".add-row", addRow);
  $("#rows-container").on("click", ".delete-row", deleteRow);
  $("#replace-all").on("click", replaceText);
  $("#reset").on("click", reset);
  $("#save").on("click", saveSearchPattern);
  $("#load").on("click", loadSearchPattern);
  $(".modal").on("click", function (event) {
    if (event.target === this) {
      $(".modal").hide();
    }
  });
});
