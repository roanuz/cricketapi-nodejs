let http = require('http');
let https = require('https');
let request = require('request');

let Config = require('../config');
let Token = require('./auth')
const querystring = require('querystring');

var CacherLogic;

// configuring backend host 
let host = Config.backend.host
let lastQuery = {}

let memCacheEnable = Config.enable_memcache

if (memCacheEnable){
    CacherLogic = require('./cacherLogics');
}

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
    recentMatchesResponse(){
        let apiPath = '/rest/v2/recent_matches/';
        let params = {};
        return new Promise((resolve, reject) => {
            resolve(this.getData(apiPath, params));
        }).catch(function(err) {
            console.error('Oops we have an error', err);
            reject(err);
        });
    }

    getMatchResponse(matchId){
        let apiPath = '/rest/v2/match/'+matchId+'/';
        let params = {}
        let cacheKey = 'match|'+matchId+'|full_card';
        return new Promise((resolve, reject) => {
            if (memCacheEnable) {
                CacherLogic.getCachedData(cacheKey).then((cachedResponse)=>{
                    if(cachedResponse&& cachedResponse != null) {
                        resolve(cachedResponse)
                    } else {
                        resolve(this.getData(apiPath, params));
                    }
                });
            } else {
                resolve(this.getData(apiPath, params));
            }
        }).catch(function(err) {
            console.error('Oops we have an error', err);
            reject(err);
        });
    }

    getData(source_path, queryParams={}){
        console.log('getdata called')
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
                        if(body.status_code == 200 && memCacheEnable){
                            if (body.data.card && body.data.card.cache_key){
                                CacherLogic.setCache(body.data.card.cache_key, body.data, body.expires);
                            }
                        }
                        resolve(body.data);
                    }                    
                }
            })
        })
    }
}

module.exports = new CricketAPIServices;