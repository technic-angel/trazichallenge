const fs = require("fs");
const { parse } = require("csv-parse");
const { Client } = require('pg') 
const { setTimeout } = require("timers/promises");
const client = new Client({ 
    user: 'admin', 
    password:'password', 
    host: 'localhost', 
    port: 5432, 
    database: 'api'
}) 



const tableInput = async () =>{
    try{
        await client.connect()
        await client.query("CREATE TABLE cities( id SERIAL PRIMARY KEY, city VARCHAR(100), state VARCHAR(100), population BIGINT)")
        await fs.createReadStream("./city_populations.csv")
            .pipe(parse({ delimiter: ",", from_line: 2 }))
            .on("data", function (row) {
                console.log(row)
                client.query({
                    text: `INSERT INTO cities (city, state, population) VALUES($1, $2, $3)`,
                    values: [row[0].toLowerCase(), row[1].toLowerCase(), row[2]]
                })
            })
        .on("end", () => {
            console.log("finished");
            
        })
        .on("error", function (error) {
        console.log(error.message);
        });
        await setTimeout(7000)
        client.end()
    }catch(err){
        console.log(err)
        throw new Error(err)
    }

}

tableInput()

