var data;
GetData = async () => {
  data = await fetch("/parks").then((r) => r.json());
  return data;
};

async function postData(data = {}) {
  const dataLocatoin = await fetch("/location", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((r) => r.json());
  
  return dataLocatoin.location;
}

/* Formatting function for row details */
function format(location) {
  const start =
    '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">';
  const end = "</table>";
  var direlements = Object.values(location)
    .map(
      (el) =>
      "<tr>" +
      "<td>location name:</td>" +
      "<td>" +
      el.name +
      "</td>" +
      "<td>location capital city:</td>" +
      "<td>" +
      el.capital_city +
      "</td>" +
      "<td>location aree:</td>" +
      "<td>" +
      el.area +
      "</td>" +
      "<td>location population:</td>" +
      "<td>" +
      el.population +
      "</td>" +
      "<tr>"
    )
    .join("");
  //console.log(direlements);
  return start + direlements + end;
}

//ready function
$(document).ready(async function () {
  const json = await GetData();
  //console.log(json);
  // text input to each footer cell
  $('#parks-table tfoot th').each(function () {
    var title = $(this).text();
    $(this).html('<input type="text" placeholder="Search ' + title + '" style="width: 60px;" />');
  });

  var table = $("#parks-table").DataTable({
    data: json,
    columns: [{
        data: "name"
      },
      {
        data: "location_name"
      },
      {
        data: "location_area"
      },
      {
        data: "location_population"
      },
      {
        data: "location_capital_city"
      },
      {
        data: "date"
      },
      {
        data: "area"
      },
      {
        data: "visitors"
      },
      {
        data: "fees"
      },
      {
        data: "climate"
      },
      {
        data: "WiFi_access"
      },
      {
        data: "cellular_access"
      },
      {
        data: "average_temperature"
      },
      {
         data: "picture"
       },
      {
        className: "details-control",
        orderable: false,
        data: null,
        defaultContent: "click here",
      }
    ],
    order: [
      [1, "asc"]
    ],
    dom: 'Bfrtip',
    buttons: [{
        text: 'JSON',
        action: function (e, dt, button, config) {
          var names = dt.buttons.exportData().body.map(r => r[0]);
          dataForExport = data.filter(r => names.includes(r.name));
          console.log(dataForExport)

          $.fn.dataTable.fileSave(
            new Blob([JSON.stringify(dataForExport)]),
            'National Park.json'
          );
        }
      },
      {
        text: 'CSV',
        action: function (e, dt, button, config) {
          var names = dt.buttons.exportData().body.map(r => r[0]);
          dataForExport = data.filter(r => names.includes(r.name));
          var header = dt.buttons.exportData().header.toString() + 'locationname,locationarea,locationpopulation'
          dataForExportCSV = dataForExport.map(r => {
            var row = Object.keys(r).slice(0, -1).map(key => r[key].toString()).join(",");
            var rowsForName = r.locations.map(element => {
              var locationRow = Object.keys(element).map(key => element[key].toString()).join(",");
              return row + ',' + locationRow;
            }).join('\n');
            return rowsForName;
          }).join('\n');
          var finalCSV = header + '\n' + dataForExportCSV
          $.fn.dataTable.fileSave(
            new Blob([finalCSV]),
            'National Park.csv'
          );
        }
      }
    ],

    initComplete: function () {
      // pretrazivanje po atributima
      this.api().columns().every(function () {
        var that = this;
        $('input', this.footer()).on('keyup change clear', function () {
          if (that.search() !== this.value) {
            that
              .search(this.value)
              .draw();
          }
        });
      });
    }
  });

  table.buttons().container()
    .appendTo($('.col-sm-6:eq(0)', table.table().container()));

  // event listener za prikaz i sakrivanje detalja o venueima
  $("#parks-table tbody").on(
    "click",
    "td.details-control",
    async function () {
      var tr = $(this).closest("tr");
      var row = table.row(tr);
      console.log(row.value);
      if (row.child.isShown()) {
        row.child.hide();
        tr.removeClass("shown");
      } else {
        var name = row.data().year;
        var locatioln = await postData({
          name
        });
        row.child(format(location)).show();
        tr.addClass("shown");
      }
    }
  )

});