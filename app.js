const { getDiffieHellman } = require("crypto");
const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const fetch = require("node-fetch");
//const gd = require('./getdata');

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/about", (req, res) => {
  res.render("about",{
    title:"Hey",
    message:'The flow at the moment is : ' + myitems[0].value
  })
  
});

app.use("/", router);
app.listen(process.env.port || 3000);

console.log("Running at Port 3000");
var myitems;
var listlength;
getFlows();

function getFlows() {
  //maidenhead is 2604TH
  //taplow is 2603TH
  fetch(geturl())
    .then((res) => res.json())
    .then((json) => {
      myitems = json.items;
      listlength = myitems.length;
      console.log(listlength);
    });
}

function geturl(){
  const today = new Date().toJSON().slice(0, 10);
  let yesterday = new Date(Date.now() - 864e5); // 864e5 == 86400000 == 24*60*60*1000
  yesterday = yesterday.toJSON().slice(0, 10);
  const maidsurl = `http://environment.data.gov.uk/flood-monitoring/id/stations/2604TH/readings?parameter=flow&_sorted&startdate=${yesterday}&enddate=${today}`;
return maidsurl;
}
