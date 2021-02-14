const { getDiffieHellman } = require("crypto");
const math = require('mathjs');
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
  res.render("index", {
    title: "Thames Weir Stakeout",
    message: stakeout,
  });
  console.log("pinged the front page");
});

router.get("/about", (req, res) => {
  res.render("about", {});
});

app.use("/", router);
app.listen(process.env.port || 3000);

console.log("Alive and kicking at Port 3000");

class Station {
  constructor(id, url, flow) {
    this.id = id;
    this.url = url;
    this.flow = flow;
  }
}

const today = new Date().toJSON().slice(0, 10);
let yesterday = new Date(Date.now() - 864e5); // 864e5 == 86400000 == 24*60*60*1000
yesterday = yesterday.toJSON().slice(0, 10);
var readingqty;

var maids = new Station("2604TH", null, null);
var taplow = new Station("2603TH", null, null);
var weirstatus = {
  Hurley: null,
  Hambleden: null,
  Boulters: null,
  Sunbury: null,
  Chertsey: null,
};

getflow(maids);
getflow(taplow);

function getflow(station) {
  station.url = `http://environment.data.gov.uk/flood-monitoring/id/stations/${station.id}/readings?parameter=flow&_sorted&startdate=${yesterday}&enddate=${today}`;
  fetch(station.url)
    .then((res) => res.json())
    .then(
      (json) => (
        (station.flow = json.items),
        console.log("done with data"),
        console.log(station.flow[0].value),
        (readingqty = json.items.length)
      )
    );
}

function whereshouldipaddle() {
  var wheretogo = [];
  var totalflow = maids.flow[0].value + taplow.flow[0].value;
  wheretogo.push(
    "Maids: " +
      math.round(maids.flow[0].value) +
      "cumecs, Taplow: " +
      math.round(taplow.flow[0].value) +
      "cumecs, Total: " +
      math.round(totalflow) +
      "cumecs"
  );
  if (totalflow < 20) {
    wheretogo.push("Summertime vibes - head to Boulters or Chertsey!");
  }
  if (totalflow < 50 && totalflow > 20) {
    wheretogo.push("1 gate fun - try out Hambleden");
  }
  if (totalflow < 140 && totalflow > 50) {
    wheretogo.push("Time to get haul ass to Hurley");
  }
  if (totalflow > 100) {
    wheretogo.push("Sunbury or Shepperton could be worth a butchers");
  }
  if (totalflow > 140 && totalflow < 170) {
    wheretogo.push("Might be time to check out Marsh");
  }
  if (maids.flow[0].value > 150 && maids.flow[0].value < 185) {
    wheretogo.push("Time to go big on Boulters!");
  }
  return wheretogo;
}
