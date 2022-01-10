const axios = require('axios');
const fs = require('fs');
const path = require('path');

class LoadData {
    constructor(url, method="GET") {
        this.url = url;
        this.method = method;
    }
    up(){
        console.log("Migration process started...")
        console.log(path.join(path.dirname(__dirname), 'data', 'atm_data.json'));
        this.getData()
    }
    async getData(){
        console.log(`Getting data from [${this.method}] ${this.url} ...`)
        await axios({
            method: this.method,
            url: this.url,
          })
            .then((response) => {
                console.log("Data received")
                this.writeToDB(response.data);
            })
            .catch((err)=>{
                console.log("Request failed")
                console.log(err);
            });
    }

    writeToDB(data){
        console.log("Cleaning data...")
        if(data.substr(0,5) == ")]}',"){
            data = data.slice(5);
        }
        const filepath  = path.join(path.dirname(__dirname), 'data', 'jsons', 'atmdata.json');
        console.log(`Dumping into JSON file (${filepath})...`)
        try {
            fs.writeFile(filepath, data,(err) => {
            if (err) throw err;
            console.log('Dumping success!');
            console.log("Migration completed.")
          });
        } catch (err) {
            console.log(`Failed to write the file (${filepath})...`);
            console.log(err)
        }
    }
}

const load = new LoadData("https://www.ing.nl/api/locator/atms/")
load.up()
