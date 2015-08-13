import chai from 'chai';

import {get, post, put, del, endPoint, endPointsOf, configOf} from './restful';

const expect = chai.expect;

describe('EndPoints', function() {

    it('should define a endpoint with get method', function() {
        class Test {
            @get('/test')
            methodGet(req, res) {

            }
        }

        var endpoints = endPointsOf(Test);

        expect(endpoints).exist;
        expect(endpoints.methodGet).exist;
        expect(endpoints.methodGet.httpMethod).to.equal('GET');
        
    });
    
    it('should define a endpoint with post method', function() {
        class Test {
            @post('/test')
            methodPost(req, res) {

            }
        }

        var endpoints = endPointsOf(Test);
        expect(endpoints).exist;
        expect(endpoints.methodPost);
        expect(endpoints.methodPost.httpMethod).to.equal('POST');
        
    });
    
    it('should define a endpoint with put method', function() {
        class Test {
            @put('/test')
            methodPut(req, res) {

            }
        }

        var endpoints = endPointsOf(Test);
        expect(endpoints).exist;
        expect(endpoints.methodPut);
        expect(endpoints.methodPut.httpMethod).to.equal('PUT');

    });

    it('should define a endpoint with delete method', function() {
        class Test {
            @del('/test')
            methodPut(req, res) {

            }
        }

        var endpoints = endPointsOf(Test);
        expect(endpoints).exist;
        expect(endpoints.methodPut);
        expect(endpoints.methodPut.httpMethod).to.equal('DELETE');

    });

    it('should define the url', function() {
        class Test {
            @get('/test')
            method() {

            }
        }  

        expect(endPointsOf(Test).method.url).to.equal('/test');
    });

    it('should define url of multiple strings', function() {
        class Test {
            @get('/test', '/:id')
            method() {
            }
        }

        expect(endPointsOf(Test).method.url).to.equal('/test/:id');
    });

    it('should defult the url to empty string', function() {

        class Test {
            @get()
            method() {
                
            }
        }
        expect(endPointsOf(Test).method.url).to.equal('');
    });

    it('should support define configs throw functions', function() {

        var defineName = function(config) {
            config.name = 'REST';
        };

        class Test {
            @get(defineName)
            method() {

            }
        }

        expect(endPointsOf(Test).method.config.name).to.equal('REST');
        
    });
});

describe('Common Properties', function() {
    it('should define the url', function() {
        @endPoint('/test')
        class Test {
            method() {

            }
        }  

        expect(configOf(Test).url).to.equal('/test');
    });
    
    it('should default the url to empty', function() {
        @endPoint()
        class Test {
            method() {

            }
        }  

        expect(configOf(Test).url).to.equal('');
    });

    it('should define url of multiple strings', function() {
        @endPoint('/test', '/:id')
        class Test {
            method() {
            }
        }

        expect(configOf(Test).url).to.equal('/test/:id');
    });
    it('should support define configs throw functions', function() {

        var defineName = function(config) {
            config.name = 'REST';
        };

        @endPoint(defineName)
        class Test {
            method() {

            }
        }

        expect(configOf(Test).config.name).to.equal('REST');
        
    });
});
