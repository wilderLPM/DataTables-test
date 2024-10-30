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
      title: `<button type="button" id="switch">Switch to Percents</button>`,
      render: function (data, type, row) {
        // change the row title if Percents mode is on
        if (type === "display" && isPercents && row.pourcent) {
          return row.pourcent;
        }
        return data;
      },
      width: "460px",
    },
    {
      data: "years.0",
      title: "2022",
      render: function (data, type, row) {
        // if Percents mode is on, convert the values to percents
        if (isPercents && typeof row.isDenominator === "number") {
          denominators[row.isDenominator][0] = data;
        }
        if (isPercents && row.percents) {
          return row.percents[0];
        }
        return data;
      },
    },
    {
      data: "years.1",
      title: "2023",
      render: function (data, type, row) {
        // if Percents mode is on, convert the values to percents
        if (isPercents && typeof row.isDenominator === "number") {
          denominators[row.isDenominator][1] = data;
        }
        if (isPercents && row.percents) {
          return row.percents[1];
        }
        return data;
      },
    },
    {
      data: "years.2",
      title: "2024",
      render: function (data, type, row) {
        // if Percents mode is on, convert the values to percents
        if (isPercents && typeof row.isDenominator === "number") {
          denominators[row.isDenominator][2] = data;
        }
        if (isPercents && row.percents) {
          return row.percents[2];
        }
        return data;
      },
    },
  ],
  data: [
    // All the rows objects
    {
      row_title: "Total Stagiaires",
      years: [100, 120, 140],
      layer: 0,
      isDenominator: 0,
    },
    {
      row_title: "Total Inscrits",
      years: [30, 30, 40],
      pourcent: "Taux de présentation à l'examen",
      isParent: true,
      layer: 0,
      children: [2],
      isDenominator: 1,
      denominator: 0,
      get percents() {
        return toPercents(this.years, this.denominator);
      },
    },
    {
      row_title: "Présents",
      years: [29, 30, 38],
      pourcent: "Taux de présence",
      isChild: true,
      layer: 1,
      denominator: 1,
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
      years: [30, 30, 40],
      pourcent: "Absentéisme",
      isChild: true,
      layer: 1,
      denominator: 1,
      get percents() {
        return toPercents(this.years, this.denominator);
      },
    },
    {
      row_title: "Échecs",
      years: [30, 30, 40],
      pourcent: "Taux d'échecs",
      isChild: true,
      layer: 1,
      denominator: 1,
      get percents() {
        return toPercents(this.years, this.denominator);
      },
    },
    {
      row_title: "Réussites",
      years: [30, 30, 40],
      pourcent: "Taux de réussite",
      isParent: true,
      isChild: true,
      layer: 1,
      children: [7, 8, 9, 10],
      isDenominator: 2,
      denominator: 1,
      get percents() {
        return toPercents(this.years, this.denominator);
      },
    },
    {
      row_title: "Partielle",
      years: [30, 30, 40],
      isChild: true,
      layer: 2,
      denominator: 2,
      get percents() {
        return toPercents(this.years, this.denominator);
      },
    },
    {
      row_title: "Totale",
      years: [30, 30, 40],
      isParent: true,
      isChild: true,
      layer: 2,
      children: [9, 10],
      isDenominator: 3,
      denominator: 2,
      get percents() {
        return toPercents(this.years, this.denominator);
      },
    },
    {
      row_title: "TP Obtenus",
      years: [30, 30, 40],
      isChild: true,
      layer: 3,
      denominator: 3,
      get percents() {
        return toPercents(this.years, this.denominator);
      },
    },
    {
      row_title: "Parcours Certifiants Validés",
      years: [30, 30, 40],
      isChild: true,
      layer: 3,
      denominator: 3,
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
  return $("#table").DataTable(options);
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

  $("#table").on("click", "#switch", () => {
    // event listener to switch between normal and percents mode
    isPercents = !isPercents;
    $("#table").DataTable().destroy(); // would be better to redraw the table instead of destroying it but it doesn't work
    $("#table").empty();
    table = initTable(originalOptions);
  });

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
});
