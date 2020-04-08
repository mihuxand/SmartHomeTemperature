//------------------------------------------Imports------------------------------------------------------
//-------------------------------------------------------------------------------------------------------
const express = require("express");
//const energyAPI_v1 = require("./energyAPI_v1");
//const energyAPI_v2 = require("./energyAPI_v2");
const homeAPI_v1 = require("./homeAPI_v1");

//------------------------------------------Vars-------------------------------------------------
//-------------------------------------------------------------------------------------------------------
var application = express();
var port = 42069; //select your favourite port :----)

//------------------------------------------Express-Config-----------------------------------------------
//-------------------------------------------------------------------------------------------------------


var server = application.listen(port, () => {

    console.log("Server running on port "+port);
});

//------------------------------------------Express-Paths------------------------------------------------
//-------------------------------------------------------------------------------------------------------
application.get('/home/labor', (reg, res, next) => {
    //console.log(req); view for debugging or if u r bored
    homeAPI_v1.getData(req.from, req.query.to, req.query.mode, res)
}

//------------------------------------------Express-Internals--------------------------------------------
//-------------------------------------------------------------------------------------------------------
function closeServer(){
    
    server.close(() => {console.log("Server closed")})
}