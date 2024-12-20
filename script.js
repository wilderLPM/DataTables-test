const originalOptions = {
  autoWidth: false,
  order: [],
  paging: false,
  info: false,
  searching: false,
  deferRender: false,
  columns: [
    {
      // column for the arrows
      class: "dt-control",
      searchable: false,
      data: null,
      defaultContent: "",
      width: "128px",
    },
    {
      data: "row_title",
      title: `<button type="button" id="switch" data-bs-toggle="tooltip" title="Basculer entre données brutes et pourcentages">Switch to Percents</button>`,
      render: function (data, type, row) {
        // change the row title if Percents mode is on and add a '?' icon if there is a tooltip
        const tooltip =
          (isPercents && row.pourcentTooltip) || (!isPercents && row.tooltip)
            ? ` <span class="tooltip-icon">?</span>`
            : "";
        return isPercents && row.pourcent
          ? row.pourcent + tooltip
          : data + tooltip;
      },
      width: "460px",
    },
    {
      data: "years.0",
      title: "2022",
    },
    {
      data: "years.1",
      title: "2023",
    },
    {
      data: "years.2",
      title: "2024",
    },
  ],
  data: [
    // All the rows objects
    {
      row_title: "Total Stagiaires",
      years: [368, 344, 154],
      layer: 0,
      isDenominator: 0,
    },
    {
      row_title: "Total Inscrits",
      years: [345, 326, 149],
      pourcent: "Taux de présentation à l'examen",
      isParent: true,
      layer: 0,
      children: [2],
      isDenominator: 1,
      denominator: 0,
      tooltip: "Total Stagiaires - Abandons",
      pourcentTooltip: "Total Inscrits ÷ Total Stagiaires x 100",
      get percents() {
        return toPercents(this.years, this.denominator);
      },
    },
    {
      row_title: "Présents",
      years: [302, 299, 134],
      pourcent: "Taux de présence",
      isChild: true,
      layer: 1,
      denominator: 1,
      pourcentTooltip: "Présents ÷ Total Inscrits x 100",
      get percents() {
        return toPercents(this.years, this.denominator);
      },
    },
    {
      row_title: "Résultats",
      isParent: true,
      layer: 0,
      children: [4, 5, 6, 7, 8, 9, 10],
    },
    {
      row_title: "Absents",
      years: [43, 27, 15],
      pourcent: "Absentéisme",
      isChild: true,
      layer: 1,
      denominator: 1,
      tooltip: "Stagiaires inscrits mais absents à l'examen",
      pourcentTooltip: "Absents ÷ Total Inscrits x 100",
      get percents() {
        return toPercents(this.years, this.denominator);
      },
    },
    {
      row_title: "Échecs",
      years: [28, 29, 11],
      pourcent: "Taux d'échecs",
      isChild: true,
      layer: 1,
      denominator: 1,
      pourcentTooltip: "Échecs ÷ Total Inscrits x 100",
      get percents() {
        return toPercents(this.years, this.denominator);
      },
    },
    {
      row_title: "Réussites",
      years: [274, 270, 123],
      pourcent: "Taux de réussite",
      isParent: true,
      isChild: true,
      layer: 1,
      children: [7, 8, 9, 10],
      isDenominator: 2,
      denominator: 1,
      tooltip: "Stagiaires avec un résultat positif à l'examen",
      pourcentTooltip: "Réussites ÷ Total Inscrits x 100",
      get percents() {
        return toPercents(this.years, this.denominator);
      },
    },
    {
      row_title: "Partielle",
      years: [19, 23, 7],
      isChild: true,
      layer: 2,
      denominator: 2,
      pourcentTooltip: "Réussites Partielles ÷ Réussites x 100",
      get percents() {
        return toPercents(this.years, this.denominator);
      },
    },
    {
      row_title: "Totale",
      years: [255, 247, 116],
      isParent: true,
      isChild: true,
      layer: 2,
      children: [9, 10],
      isDenominator: 3,
      denominator: 2,
      pourcentTooltip: "Réussites Totales ÷ Réussites x 100",
      get percents() {
        return toPercents(this.years, this.denominator);
      },
    },
    {
      row_title: "TP Obtenus",
      years: [207, 206, 101],
      isChild: true,
      layer: 3,
      denominator: 3,
      tooltip: "Titres Professionnels obtenu",
      pourcentTooltip: "TP Obtenus ÷ Réussites Totales x 100",
      get percents() {
        return toPercents(this.years, this.denominator);
      },
    },
    {
      row_title: "Parcours Certifiants Validés",
      years: [48, 41, 15],
      isChild: true,
      layer: 3,
      denominator: 3,
      tooltip: "Objectif de CCP atteint",
      pourcentTooltip: "Parcours Certifiants Validés ÷ Réussites Totales x 100",
      get percents() {
        return toPercents(this.years, this.denominator);
      },
    },
  ],
  createdRow: function (row, data) {
    // after the row is created but before it is displayed
    if (data.isParent) {
      $(row).addClass("parent open");
    } else {
      $("td.dt-control", row).removeClass("dt-control rotate");
    }
    if (data.isChild) {
      $(row).addClass("child");
    }
    $(row).addClass(`layer-${data.layer}`);
  },
  columnDefs: [
    // column settings
    {
      targets: ["_all"],
      orderable: false,
      defaultContent: "",
    },
    {
      targets: [2, 3, 4],
      width: "226px",
      render: function (data, type, row, meta) {
        const i = meta.col - 2; // meta.col = column index
        // if row is a denominator, stores the value of data in the denominators array
        if (isPercents && typeof row.isDenominator === "number") {
          denominators[row.isDenominator][i] = data;
        }
        // if Percents mode is on, displays the converted values
        if (isPercents && row.percents) {
          return row.percents[i];
        }
        return data;
      },
    },
    {
      targets: 1,
      createdCell: function (td, cellData, rowData, row, col) {
        // adds tooltip to cells of column 1
        $(td).attr({
          "data-bs-toggle": "tooltip",
          title: isPercents ? rowData.pourcentTooltip : rowData.tooltip, // Bootstrap doesn't show empty tooltips
        });
      },
    },
  ],
};

let isPercents = false;
let denominators = [[], [], [], []];
const format = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});
function toPercents(years, denominatorKey) {
  return years.map(
    (year, index) =>
      format.format((year / denominators[denominatorKey][index]) * 100) + "%"
  );
}
const initTable = (options) => {
  const newTable = $("#table").DataTable(options);
  $('[data-bs-toggle="tooltip"]').tooltip({
    placement: "right",
  });
  return newTable;
};

$(async function () {
  let table = initTable(originalOptions);

  $("#table").on("click", "tr.parent", function () {
    // event listener to open/close rows
    const row = table.row(this);

    if (row.node().className.includes("open")) {
      close(row);
      row.node().classList.remove("open");
    } else {
      open(row);
      row.node().classList.add("open");
    }
  });

  $("#table").on("click", "#switch", function () {
    // event listener to switch between normal and percents mode
    $(this).tooltip("hide");
    isPercents = !isPercents;
    $("#table").DataTable().destroy(); // would be better to redraw the table instead of destroying it but it's more complex
    $("#table").empty();
    table = initTable(originalOptions);
    if (isPercents) {
      $("#switch").text("Switch to Raw Data");
    }
  });

  const close = (row) => {
    $(row.node()).find("td.dt-control").addClass("rotate"); // makes the arrow point right
    for (let i = 0; i < table.rows().data().length; i++) {
      // for each row
      const data = table.rows().data()[i]; // get the data object of the row
      if (data.layer > row.data().layer && row.data().children.includes(i)) {
        // if the row is a child of the parent row
        table.row(i).node().classList.add("hidden"); // hide the row
        if (data.layer === row.data().layer + 1) {
          // if the row is a direct child of the parent row
          table.row(i).node().classList.add("closed"); // close the row
        }
      }
    }
  };

  const open = (row) => {
    // same logic than close() but in reverse

    $(row.node()).find("td.dt-control").removeClass("rotate");

    for (let i = 0; i < table.rows().data().length; i++) {
      const data = table.rows().data()[i];
      if (data.layer > row.data().layer && row.data().children.includes(i)) {
        table.row(i).node().classList.remove("hidden");
        if (data.layer === row.data().layer + 1) {
          table.row(i).node().classList.remove("closed");
        }
      }
    }
  };
});
