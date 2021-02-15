const { getDiffieHellman } = require("crypto");
const math = require("mathjs");
const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const fetch = require("node-fetch");

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

router.get("/", (req, res) => {
  var stakeout = whereshouldipaddle();
  var thenumbers = tellmenumbers();
  res.render("index", {
    title: "Thames Weir Stakeout",
    message: stakeout,
    numbers: thenumbers,
  });
  console.log("pinged the front page");
});

app.use("/", router);
app.listen(process.env.port || 3000);

console.log("Alive and kicking at Port 3000");

const today = new Date().toJSON().slice(0, 10);
let yesterday = new Date(Date.now() - 864e5); // 864e5 == 86400000 == 24*60*60*1000
yesterday = yesterday.toJSON().slice(0, 10);

var maids = { id: "2604TH", url: null, dataobj: [], flownow: null };
var taplow = { id: "2603TH", url: null, dataobj: [], flownow: null };
var total = { id: null, url: null, dataobj: [], flownow: null };

getflow(maids);
getflow(taplow);

function getflow(station) {
  station.url = `http://environment.data.gov.uk/flood-monitoring/id/stations/${station.id}/readings?parameter=flow&_sorted&startdate=${yesterday}&enddate=${today}`;
  fetch(station.url)
    .then((res) => res.json())
    .then(
      (json) => (
        (station.dataobj = json.items),
        sumflows(),
        (station.flownow = station.dataobj[0].value)
      )
    );
}

function sumflows() {
  if (taplow.dataobj[0] != null) {
    for (
      var i = 0;
      i < Math.min(maids.dataobj.length, taplow.dataobj.length);
      i++
    ) {
      total.dataobj.push(maids.dataobj[i]);
      total.dataobj[i].value = maids.dataobj[i].value + taplow.dataobj[i].value;
    }
    total.flownow = total.dataobj[0].value;
  }
}

function tellmenumbers(){
 return [
    "Maids gauge: " + math.round(maids.flownow) + " cumecs (a.k.a. flow thru Boulters)",
    "Taplow gauge: " + math.round(taplow.flownow) + " cumecs (a.k.a. flow down Jubilee)",
    "Total: " + math.round(total.flownow) + " cumecs (a.k.a. flow down most weirs inc Hurley)",
  ];
}

function whereshouldipaddle() {
  // Aim of this is to add anything that might be worth checking out to the homepage
  var wheretogo = [];

  if (total.flownow < 20) {
    wheretogo.push(
      "Summer sun vibes - suncream on and head to Boulters or Chertsey!"
    );
  }
  if (total.flownow < 50 && total.flownow > 20) {
    wheretogo.push("1 gate fun - try out Hambleden for a change?");
  }
  if (total.flownow < 140 && total.flownow > 50) {
    wheretogo.push("Go time - time to get haul ass to Hurley");
  }
  if (total.flownow > 100) {
    wheretogo.push("Sunbury or Shepperton could be worth a butchers");
  }
  if (total.flownow > 140 && total.flownow < 170) {
    wheretogo.push("Might be time to become a Marsh-ian");
  }
  if (total.flownow > 150 && maids.flownow < 185) {
    wheretogo.push("Time to go big on Boulters!");
  }

  return wheretogo;
}
