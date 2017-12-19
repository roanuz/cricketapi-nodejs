let http = require('http');
let https = require('https');
let request = require('request');

let Config = require('../config');
let Token = require('./auth')
const querystring = require('querystring');

var CacherLogic = require('./cacherLogics');

// configuring backend host 
let host = Config.backend.host
let lastQuery = {}

class CricketAPIServices {
    constructor() {
        this.formateUrl = '',
        this.headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    getAccessToken() {
        return new Promise(resolve => {
            var options = {
                url: host+'/rest/v2/auth/',
                method: 'POST',
                json:true,
                gzip: true,
                form: Config.auth
            }

            request(options, function(error, response, body){
                if(error) console.log(error);
                else {
                    if(body.status_code == 200){
                        resolve({
                            token :  body.auth.access_token
                        })
                        console.log('body.auth.access_token',body.auth.access_token);
                    }
                    else{
                        resolve(false);
                    }
                };
            });
        });
    }

    setAccessToken(){
        return new Promise(resolve => {
            this.getAccessToken().then((data) => {
                if(data){
                    let gotToken = data;
                    Token.key = gotToken.token;
                    resolve(true);
                }
            })
        });
    }

    getData(source_path, queryParams={}){
        
        let newHost = host
        if (source_path.startsWith('/rest/add-on/spider-')) {
            newHost = Config.backend.spiderHost
        }

        return new Promise((resolve, reject) => { 
            if(queryParams.hasOwnProperty("access_token")) {
               queryParams.access_token = Token.key
            } else {
                queryParams['access_token'] = Token.key
            }
            
            this.formateUrl = newHost+source_path;
            
            var options = {
                url: this.formateUrl,
                qs:queryParams,
                method: 'GET',
                headers: this.headers,
                json:true,
                gzip: true
            }
            // console.log(options)
            
            request(options, (error, response, body) => {
                if(error) {
                    console.log(error)
                    reject(error);
                } else {
                    if(body.status_code == 403 && body.status_msg == 'Invalid Access Token'){   
                        lastQuery = queryParams                      
                        this.setAccessToken().then(() => {                            
                            resolve(this.getData(source_path, lastQuery));
                        }).catch((res) => {
                            console.log("catch",res);
                        })
                    } else if(body.status_code == 403 && body.status_msg == 'InvalidAccessToken'){       
                        lastQuery = queryParams        
                        this.setAccessToken().then(() => {
                            resolve(this.getData(source_path, lastQuery));
                        }).catch((res) => {
                            console.log("catch",res);
                        })
                    } else {
                        if(body.status_code == 200){
                            CacherLogic.setCache(body.data.card.cache_key, body.data, body.expires);
                        }
                        resolve(body);
                    }                    
                }
            })
        })
    }
}

module.exports = new CricketAPIServices;