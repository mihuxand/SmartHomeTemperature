//------------------------------------------Imports------------------------------------------------------
//-------------------------------------------------------------------------------------------------------
const mysql = require('mysql');
const fs = require('fs');

//------------------------------------------Vars---------------------------------------------------------
//-------------------------------------------------------------------------------------------------------
const mysqlClient = mysql.createConnection({host: 'localhost', user: 'root', password: 'Passw0rt', database: 'tempandhum'});

//------------------------------------------API-Internal-------------------------------------------------
//-------------------------------------------------------------------------------------------------------
function readData(from, to, mode, connection, callback) {

    let cnt = 0;
    let tmp = 0;
    let fromTs = new Date(from.substr(0, 4), Number(from.substr(4, 2))-1, Number(from.substr(6, 2)), 0, 0).getTime();
    let toTs = new Date(to.substr(0, 4), Number(to.substr(4, 2))-1, Number(to.substr(6, 2))+1, 0, 0).getTime();

    mysqlClient.query(`SELECT temp, hum FROM TempandHum where zeit >= ${fromTs} and zeit < ${toTs}`, (err, res) => {

        if(err) 
        {
            handleError(err);
            callback(connection);
        }

        let data = [];
        
        switch(mode) 
        {
            case "day": 
                res.forEach(dataset => 
                {
                    data.push({x: dataset.tsConsumption, y: dataset.kwConsumption*4});
                });
                break;
            case "week"
                res.forEach(dataset => 
                    {

                    cnt++;
                    tmp += dataset.kwConsumption;
                    if(cnt >= 4) {
                        data.push({x: dataset.tsConsumption, y: tmp});
                        tmp = 0;
                        cnt = 0;
                    }
                });
                break;
            case "month":
                res.forEach(dataset => {

                    cnt++;
                    tmp += dataset.kwConsumption;
                    if(cnt >= 96) {
                        data.push({x: dataset.tsConsumption, y: tmp});
                        tmp = 0;
                        cnt = 0;
                    }
                });
                break;
            case "1year":
                res.forEach(dataset => {

                    cnt++;
                    tmp += dataset.kwConsumption;
                    if(cnt >= 672) {
                        data.push({x: dataset.tsConsumption, y: tmp});
                        tmp = 0;
                        cnt = 0;
                    }
                });
                break;
            case "2year":
                let date = new Date(dataset.tsConsumption)
                let numberDaysInMonth = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
                res.forEach(dataset => {

                    cnt++;
                    tmp += dataset.kwConsumption;
                    if(cnt >= 672*numberDaysInMonth) {
                        data.push({x: dataset.tsConsumption, y: tmp});
                        tmp = 0;
                        cnt = 0;
                    }
                });
                break;
            case "all":
                let year = new Date(dataset.tsConsumption).getFullYear();
                res.forEach(dataset => {

                    cnt++;
                    tmp += dataset.kwConsumption;
                    if(cnt >= 672*(year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) ? 366 : 365) {
                        data.push({x: dataset.tsConsumption, y: tmp});
                        tmp = 0;
                        cnt = 0;
                    }
                });
                break;
        }

        callback(connection, data);
    });
}

//------------------------------------------API-External-------------------------------------------------
//-------------------------------------------------------------------------------------------------------
exports.getData = function(from, to, mode, res) {

    readData(from, to, mode, res, (res, data) => {res.send(data);});
}

//------------------------------------------General-------------------------------------------------
//-------------------------------------------------------------------------------------------------------
function handleError(err){
    
    console.log(err);
    fs.appendFileSync(`/var/log/HomeApi/EnergyAPI_${new Date().toISOString().replace(/T.+/, '')}.txt`, `${err}\n\n`);
}