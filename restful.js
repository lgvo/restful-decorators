// restful-decorators - a simple way to define RESTful Metadata in Javascript
// Copyright © 2015 Luis Gustavo Vilela de Oliveira
// 
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
// OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


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

export function path() {
    var params = processArgs(arguments);
    return request('PATH', params.url, params.config);
}

