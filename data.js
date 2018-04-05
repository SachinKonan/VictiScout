const fs = require('fs');

// Define <thead>, <tbody>, and warning vars to be filled later on.
var thead = document.getElementsByTagName('thead')[0],
    tbody = document.getElementsByTagName('tbody')[0],
    warning = document.getElementById('warning');

var admin = require("firebase-admin");
var serviceAccount = require("C:\\Users\\Sachin Konan\\Documents\\VictiScout\\serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://frcscouting-b9bf6.firebaseio.com"
});

var db = admin.database()

var nodeConsole = require('console');
var myConsole = new nodeConsole.Console(process.stdout, process.stderr);

if (fs.existsSync(localStorage.path) && fs.statSync(localStorage.path).size > 0) {
    //render(JSON.parse(fs.readFileSync(localStorage.path)));
    fireRender(JSON.parse(fs.readFileSync(localStorage.path)));
    //render1();
} else {
    // Display "no data" warning if no data is found
    warning.style.display = 'block';
}

function fireRender(data)
{
  var tr = document.createElement('tr');
  // Go through the first data object
  for (prop in data[0]) {
      // Make a new table cell
      var th = document.createElement('th');
      // ...with the content of the prettified name of the property
      th.innerHTML = pname(prop);
      // Put it into the row
      tr.appendChild(th);
  }
  // Put the row into the table header
  thead.appendChild(tr);

  db.ref("teams/").on("value", function(snapshot)
  {
    //myConsole.log(snapshot);
    list = snapshot.val();
    for(var teams in list)
    {
      for(var matches in list[teams])
      {
        tr = document.createElement('tr');
        for (prop in data[0])
        {
          var td = document.createElement('td');
          // Fill table cell with that data property
          td.innerHTML = list[teams][matches][prop];
          // Put the cell into the row
          tr.appendChild(td);
        }
        tbody.appendChild(tr);
      }
    }
    //myConsole.log(list);
    //myConsole.log(list["5465"]["Match1"]);

  }, function (errorObject) {
    myConsole.log("The read failed: " + errorObject.code);
  });
}

function render(data) {
    // Make column headers.
    // Create <tr> element to put everything in.
    var tr = document.createElement('tr');
    // Go through the first data object
    for (prop in data[0]) {
        // Make a new table cell
        var th = document.createElement('th');
        // ...with the content of the prettified name of the property
        th.innerHTML = pname(prop);
        // Put it into the row
        tr.appendChild(th);
    }
    // Put the row into the table header
    thead.appendChild(tr);

    // For each object in the data array,
    for (pt in data) {
        // Make a new table row
        tr = document.createElement('tr');
        // Go through all properties
        for (prop in data[pt]) {
            // Make a table cell for each
            var td = document.createElement('td');
            // Fill table cell with that data property
            td.innerHTML = data[pt][prop];
            // Put the cell into the row
            tr.appendChild(td);
        }
        // Put this row into the document
        tbody.appendChild(tr);
    }
}

function pname(str) {
    var words = str.split('-');
    for (w in words) words[w] = words[w].charAt(0).toUpperCase() + words[w].slice(1);
    return words.join(' ');
}
