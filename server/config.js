require('dotenv').config();

function envFor(name, defaultValue = null){
    if (process.env[`SC_${name}`] != undefined) {
        return process.env[`SC_${name}`]
    }
    return defaultValue
}


class AppConfig {	
    constructor() {
        this.name = 'CricketAPI Spider';
        this.port = envFor("PORT", 4000);
        this.enable_memcache = envFor("ENABLE_MEMCACHE", false);
        if (this.enable_memcache == 'true'){
            this.enable_memcache = true;
        } else {
            this.enable_memcache = false;
        }
        this.path = {
            static: '/static'
        };
        
        this.img = {
            static: 'https://s3-ap-southeast-1.amazonaws.com/litzscore/'
        }
            
        this.backend = {
            host: 'https://rest.cricketapi.com',
            spiderHost: 'https://rest.cricketapi.com', //'http://localhost:5000',
            path: '/',
            };
        
        this.auth = {
            app_id: envFor("APP_ID"), // get it from .env
            access_key: envFor("ACCESS_KEY"),
            secret_key: envFor("SECRET_KEY"),
            device_id: envFor("DEVICE_ID")
        }
        // Or Else directly use can put your creditentials here
        // this.auth = {
        //     app_id: "APP_ID",
        //     access_key: "ACCESS_KEY",
        //     secret_key: "SECRET_KEY",
        //     device_id: "DEVICE_ID"
        // }
    }
  }

module.exports = new AppConfig();