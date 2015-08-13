// one line to give the program's name and a brief description
// Copyright 2015 Luis Gustavo Vilela de Oliveira
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
// http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// use Symbol if supported
var sym = Symbol || function(str) {
    return '__$$' + str;
};

var symCommon = sym('common'),
    symEndPoints = sym('EndPoints');

function request(httpMethod, url, config) {
    return function(target, key) {
        var endpoints;
        if (!target[symEndPoints]) {
            endpoints = {};
            target[symEndPoints] = endpoints;
        } else {
            endpoints = target[symEndPoints];
        }
        endpoints[key] = {httpMethod: httpMethod, url: url, config: config};
    };
}

function processArgs(args) {
    var url = '',
        config = {};

    for(var i = 0; i < args.length; i++) {
        var arg = args[i];
        if (typeof arg === 'string') {
            url += arg;
        } else if (typeof arg === 'function') {
            arg(config);
        }
    }


    return {url: url, config: config};
    
}

export function processEndPoints(class_, callback) {

    var endPoints = endPointsOf(class_);
    var defaultConfig = configOf(class_);

    Object.getOwnPropertyNames(endPoints).forEach((methodName) => {

        var endPoint = endPoints[methodName];

        var params = [];

        params.push(endPoint.httpMethod);
        params.push(class_.prototype[methodName]);
        params.push(endPoint.url);
        params.push(endPoint.config);

        if (defaultConfig) {
            params.push(defaultConfig.url);
            params.push(defaultConfig.config);
        }

        callback.apply(null, params);

    });
}

export function endPointsOf(class_) {
    return class_.prototype[symEndPoints];
}


export function configOf(class_) {
    return class_.prototype[symCommon];
}


export function endPoint() {
   var params = processArgs(arguments);
   return function(class_) {
       class_.prototype[symCommon] = params;
   };
}

export function get() {
    var params = processArgs(arguments);
    return request('GET', params.url, params.config);
}


export function post() {
    var params = processArgs(arguments);
    return request('POST', params.url, params.config);
}


export function put() {
    var params = processArgs(arguments);
    return request('PUT', params.url, params.config);
}

export function del() {
    var params = processArgs(arguments);
    return request('DELETE', params.url, params.config);
}
