const fetch = require("node-fetch");

function getFlows() {
 
  //maidenhead is 2604TH
  //taplow is 2603TH

  fetch(geturl())
    .then((res) => res.json())
    .then((json) => {
      var myitems = json.items;
      console.log('so ' + myitems[0].value);
      return myitems;
    });
}

function geturl(){
  const today = new Date().toJSON().slice(0, 10);
  let yesterday = new Date(Date.now() - 864e5); // 864e5 == 86400000 == 24*60*60*1000
  yesterday = yesterday.toJSON().slice(0, 10);
  const maidsurl = `http://environment.data.gov.uk/flood-monitoring/id/stations/2604TH/readings?parameter=flow&_sorted&startdate=${yesterday}&enddate=${today}`;
return maidsurl;
}
module.exports = { getFlows };
