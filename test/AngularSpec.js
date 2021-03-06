'use strict';

describe('angular', function() {
  describe('case', function() {
    it('should change case', function() {
      expect(lowercase('ABC90')).toEqual('abc90');
      expect(manualLowercase('ABC90')).toEqual('abc90');
      expect(uppercase('abc90')).toEqual('ABC90');
      expect(manualUppercase('abc90')).toEqual('ABC90');
    });
  });

  describe("copy", function() {
    it("should return same object", function () {
      var obj = {};
      var arr = [];
      expect(copy({}, obj)).toBe(obj);
      expect(copy([], arr)).toBe(arr);
    });

    it("should copy Date", function() {
      var date = new Date(123);
      expect(copy(date) instanceof Date).toBeTruthy();
      expect(copy(date).getTime()).toEqual(123);
      expect(copy(date) === date).toBeFalsy();
    });

    it("should copy array", function() {
      var src = [1, {name:"value"}];
      var dst = [{key:"v"}];
      expect(copy(src, dst)).toBe(dst);
      expect(dst).toEqual([1, {name:"value"}]);
      expect(dst[1]).toEqual({name:"value"});
      expect(dst[1]).not.toBe(src[1]);
    });

    it('should copy empty array', function() {
      var src = [];
      var dst = [{key: "v"}];
      expect(copy(src, dst)).toEqual([]);
      expect(dst).toEqual([]);
    });

    it("should copy object", function() {
      var src = {a:{name:"value"}};
      var dst = {b:{key:"v"}};
      expect(copy(src, dst)).toBe(dst);
      expect(dst).toEqual({a:{name:"value"}});
      expect(dst.a).toEqual(src.a);
      expect(dst.a).not.toBe(src.a);
    });

    it("should copy primitives", function() {
      expect(copy(null)).toEqual(null);
      expect(copy('')).toBe('');
      expect(copy('lala')).toBe('lala');
      expect(copy(123)).toEqual(123);
      expect(copy([{key:null}])).toEqual([{key:null}]);
    });
  });

  describe('equals', function() {
    it('should return true if same object', function() {
      var o = {};
      expect(equals(o, o)).toEqual(true);
      expect(equals(o, {})).toEqual(true);
      expect(equals(1, '1')).toEqual(false);
      expect(equals(1, '2')).toEqual(false);
    });

    it('should recurse into object', function() {
      expect(equals({}, {})).toEqual(true);
      expect(equals({name:'misko'}, {name:'misko'})).toEqual(true);
      expect(equals({name:'misko', age:1}, {name:'misko'})).toEqual(false);
      expect(equals({name:'misko'}, {name:'misko', age:1})).toEqual(false);
      expect(equals({name:'misko'}, {name:'adam'})).toEqual(false);
      expect(equals(['misko'], ['misko'])).toEqual(true);
      expect(equals(['misko'], ['adam'])).toEqual(false);
      expect(equals(['misko'], ['misko', 'adam'])).toEqual(false);
    });

    it('should ignore $ member variables', function() {
      expect(equals({name:'misko', $id:1}, {name:'misko', $id:2})).toEqual(true);
      expect(equals({name:'misko'}, {name:'misko', $id:2})).toEqual(true);
      expect(equals({name:'misko', $id:1}, {name:'misko'})).toEqual(true);
    });

    it('should ignore functions', function() {
      expect(equals({func: function() {}}, {bar: function() {}})).toEqual(true);
    });

    it('should work well with nulls', function() {
      expect(equals(null, '123')).toBe(false);
      expect(equals('123', null)).toBe(false);

      var obj = {foo:'bar'};
      expect(equals(null, obj)).toBe(false);
      expect(equals(obj, null)).toBe(false);

      expect(equals(null, null)).toBe(true);
    });

    it('should work well with undefined', function() {
      expect(equals(undefined, '123')).toBe(false);
      expect(equals('123', undefined)).toBe(false);

      var obj = {foo:'bar'};
      expect(equals(undefined, obj)).toBe(false);
      expect(equals(obj, undefined)).toBe(false);

      expect(equals(undefined, undefined)).toBe(true);
    });
  });

  describe('size', function() {
    it('should return the number of items in an array', function() {
      expect(size([])).toBe(0);
      expect(size(['a', 'b', 'c'])).toBe(3);
    });

    it('should return the number of properties of an object', function() {
      expect(size({})).toBe(0);
      expect(size({a:1, b:'a', c:noop})).toBe(3);
    });

    it('should return the number of own properties of an object', function() {
      var obj = inherit({protoProp: 'c', protoFn: noop}, {a:1, b:'a', c:noop});

      expect(size(obj)).toBe(5);
      expect(size(obj, true)).toBe(3);
    });

    it('should return the string length', function() {
      expect(size('')).toBe(0);
      expect(size('abc')).toBe(3);
    });

    it('should not rely on length property of an object to determine its size', function() {
      expect(size({length:99})).toBe(1);
    });
  });


  describe('parseKeyValue', function() {
    it('should parse a string into key-value pairs', function() {
      expect(parseKeyValue('')).toEqual({});
      expect(parseKeyValue('simple=pair')).toEqual({simple: 'pair'});
      expect(parseKeyValue('first=1&second=2')).toEqual({first: '1', second: '2'});
      expect(parseKeyValue('escaped%20key=escaped%20value')).
      toEqual({'escaped key': 'escaped value'});
      expect(parseKeyValue('emptyKey=')).toEqual({emptyKey: ''});
      expect(parseKeyValue('flag1&key=value&flag2')).
      toEqual({flag1: true, key: 'value', flag2: true});
    });
  });

  describe('toKeyValue', function() {
    it('should parse key-value pairs into string', function() {
      expect(toKeyValue({})).toEqual('');
      expect(toKeyValue({simple: 'pair'})).toEqual('simple=pair');
      expect(toKeyValue({first: '1', second: '2'})).toEqual('first=1&second=2');
      expect(toKeyValue({'escaped key': 'escaped value'})).
      toEqual('escaped%20key=escaped%20value');
      expect(toKeyValue({emptyKey: ''})).toEqual('emptyKey=');
    });

    it('should parse true values into flags', function() {
      expect(toKeyValue({flag1: true, key: 'value', flag2: true})).toEqual('flag1&key=value&flag2');
    });
  });

  describe('sortedKeys', function() {
    it('should collect keys from object', function() {
      expect(sortedKeys({c:0, b:0, a:0})).toEqual(['a', 'b', 'c']);
    });
  });


  describe('encodeUriSegment', function() {
    it('should correctly encode uri segment and not encode chars defined as pchar set in rfc3986',
        function() {
      //don't encode alphanum
      expect(encodeUriSegment('asdf1234asdf')).
        toEqual('asdf1234asdf');

      //don't encode unreserved'
      expect(encodeUriSegment("-_.!~*'() -_.!~*'()")).
        toEqual("-_.!~*'()%20-_.!~*'()");

      //don't encode the rest of pchar'
      expect(encodeUriSegment(':@&=+$, :@&=+$,')).
        toEqual(':@&=+$,%20:@&=+$,');

      //encode '/', ';' and ' ''
      expect(encodeUriSegment('/; /;')).
        toEqual('%2F%3B%20%2F%3B');
    });
  });


  describe('encodeUriQuery', function() {
    it('should correctly encode uri query and not encode chars defined as pchar set in rfc3986',
        function() {
      //don't encode alphanum
      expect(encodeUriQuery('asdf1234asdf')).
        toEqual('asdf1234asdf');

      //don't encode unreserved
      expect(encodeUriQuery("-_.!~*'() -_.!~*'()")).
        toEqual("-_.!~*'()+-_.!~*'()");

      //don't encode the rest of pchar
      expect(encodeUriQuery(':@$, :@$,')).
        toEqual(':@$,+:@$,');

      //encode '&', ';', '=', '+', and '#'
      expect(encodeUriQuery('&;=+# &;=+#')).
        toEqual('%26%3B%3D%2B%23+%26%3B%3D%2B%23');

      //encode ' ' as '+'
      expect(encodeUriQuery('  ')).
        toEqual('++');

      //encode ' ' as '%20' when a flag is used
      expect(encodeUriQuery('  ', true)).
        toEqual('%20%20');
    });
  });


  describe('angularJsConfig', function() {
    it('should always consider angular.js script tag to be the last script tag', function() {
      var doc = {
        getElementsByTagName: function(tagName) {
          expect(tagName).toEqual('script');
          return [{nodeName: 'SCRIPT', src: 'random.js',
                    attributes: [{name: 'ng:autobind', value: 'wrong'}]},
                  {nodeName: 'SCRIPT', src: 'angular.js',
                    attributes: [{name: 'ng:autobind', value: 'correct'}]}];
        }
      };

      expect(angularJsConfig(doc)).toEqual({autobind: 'correct'});

      doc = {
        getElementsByTagName: function(tagName) {
          expect(tagName).toEqual('script');
          return [{nodeName: 'SCRIPT', src: 'angular.js',
                    attributes: [{name: 'ng:autobind', value: 'wrong'}]},
                  {nodeName: 'SCRIPT', src: 'concatinatedAndObfuscadedScriptWithOurScript.js',
                    attributes: [{name: 'ng:autobind', value: 'correct'}]}];
        }
      };

      expect(angularJsConfig(doc)).toEqual({autobind: 'correct'});
    });


    it('should extract angular config from the ng: attributes', function() {
      var doc = { getElementsByTagName: function(tagName) {
        expect(lowercase(tagName)).toEqual('script');
        return [{
          nodeName: 'SCRIPT',
          src: 'angularjs/angular.js',
          attributes: [{name: 'ng:autobind', value:'elementIdToCompile'},
                       {name: 'ng:css', value: 'css/my_custom_angular.css'}] }];
      }};

      expect(angularJsConfig(doc)).toEqual({
        autobind: 'elementIdToCompile',
        css: 'css/my_custom_angular.css'
      });
    });


    it('should extract angular config and default autobind value to true if present', function() {
      var doc = { getElementsByTagName: function(tagName) {
        expect(lowercase(tagName)).toEqual('script');
        return [{
          nodeName: 'SCRIPT',
          src: 'angularjs/angular.js',
          attributes: [{name: 'ng:autobind', value:undefined}]}];
      }};

      expect(angularJsConfig(doc)).toEqual({autobind: true});
    });


    it('should extract angular autobind config from the script hashpath attributes', function() {
      var doc = { getElementsByTagName: function(tagName) {
        expect(lowercase(tagName)).toEqual('script');
        return [{
          nodeName: 'SCRIPT',
          src: 'angularjs/angular.js#autobind'}];
      }};

      expect(angularJsConfig(doc)).toEqual({autobind: true});
    });


    it('should extract autobind config with element id from the script hashpath', function() {
      var doc = { getElementsByTagName: function(tagName) {
        expect(lowercase(tagName)).toEqual('script');
        return [{
          nodeName: 'SCRIPT',
          src: 'angularjs/angular.js#autobind=foo'}];
      }};

      expect(angularJsConfig(doc)).toEqual({autobind: 'foo'});
    });


    it('should default to versioned ie-compat file if angular file is versioned', function() {
      var doc = { getElementsByTagName: function(tagName) {
        expect(lowercase(tagName)).toEqual('script');
        return [{
          nodeName: 'SCRIPT',
          src: 'js/angular-0.9.0.js'}];
      }};

      expect(angularJsConfig(doc)).toEqual({});
    });
  });


  describe('angularInit', function() {
    var dom;

    beforeEach(function() {
      dom = jqLite('<div foo="{{1+2}}">{{2+3}}' +
                     '<div id="child" bar="{{3+4}}">{{4+5}}</div>' +
                   '</div>')[0];
    });


    afterEach(function() {
      dealoc(dom);
    });


    it('should not compile anything if autobind is missing or false', function() {
      angularInit({}, dom);
      expect(sortedHtml(dom)).toEqual('<div foo="{{1+2}}">{{2+3}}' +
                                        '<div bar="{{3+4}}" id="child">{{4+5}}</div>' +
                                      '</div>');
    });


    it('should compile the document if autobind is true', function() {
      angularInit({autobind: true}, dom);
      expect(sortedHtml(dom)).toEqual('<div foo="3" ng:bind-attr="{"foo":"{{1+2}}"}">' +
                                        '<span ng:bind="2+3">5</span>' +
                                        '<div bar="7" id="child" ng:bind-attr="{"bar":"{{3+4}}"}">'+
                                          '<span ng:bind="4+5">9</span>' +
                                        '</div>' +
                                      '</div>');
    });


    it('should compile only the element specified via autobind', function() {
      dom.getElementById = function() {
        return this.childNodes[1];
      };


      angularInit({autobind: 'child'}, dom);

      expect(sortedHtml(dom)).toEqual('<div foo="{{1+2}}">{{2+3}}' +
                                        '<div bar="7" id="child" ng:bind-attr="{"bar":"{{3+4}}"}">'+
                                          '<span ng:bind="4+5">9</span>' +
                                        '</div>' +
                                      '</div>');
    });
  });


  describe('angular service', function() {
    it('should override services', inject(function($provide){
      $provide.value('fake', 'old');
      $provide.value('fake', 'new');
    }, function(fake) {
      expect(fake).toEqual('new');
    }));

    it('should inject dependencies specified by $inject and ignore function argument name', function() {
      expect(angular.injector(function($provide){
        $provide.factory('svc1', function() { return 'svc1'; });
        $provide.factory('svc2', ['svc1', function(s) { return 'svc2-' + s; }]);
      }).get('svc2')).toEqual('svc2-svc1');
    });

  });


  describe('directive', function() {
    it('should register directives with case-insensitive id', inject(function($compile) {
      angularDirective('ALLCAPS', function(val, el) {el.text('+' + val + '+')});
      angularDirective('lowercase', function(val, el) {el.text('-' + val + '-')});

      var el = jqLite('<div>' +
                        '<span allcaps="xx1"></span>' +
                        '<span ALLcaps="xx2"></span>' +
                        '<span ALLCAPS="xx3"></span>' +
                        '<span lowerCASE="XX4">xx4</span>' +
                      '</div>');
      $compile(el);
      expect(lowercase(sortedHtml(el))).toBe('<div>' +
                                                '<span allcaps="xx1">+xx1+</span>' +
                                                '<span allcaps="xx2">+xx2+</span>' +
                                                '<span allcaps="xx3">+xx3+</span>' +
                                                '<span lowercase="xx4">-xx4-</span>' +
                                              '</div>');
    }));
  });


  describe('isDate', function() {
    it('should return true for Date object', function() {
      expect(isDate(new Date())).toBe(true);
    });

    it('should return false for non Date objects', function() {
      expect(isDate([])).toBe(false);
      expect(isDate('')).toBe(false);
      expect(isDate(23)).toBe(false);
      expect(isDate({})).toBe(false);
    });
  });

  describe('compile', function() {
    it('should link to existing node and create scope', inject(function($rootScope, $compile) {
      var template = angular.element('<div>{{greeting = "hello world"}}</div>');
      $compile(template)($rootScope);
      $rootScope.$digest();
      expect(template.text()).toEqual('hello world');
      expect($rootScope.greeting).toEqual('hello world');
    }));

    it('should link to existing node and given scope', inject(function($rootScope, $compile) {
      var template = angular.element('<div>{{greeting = "hello world"}}</div>');
      $compile(template)($rootScope);
      $rootScope.$digest();
      expect(template.text()).toEqual('hello world');
    }));

    it('should link to new node and given scope', inject(function($rootScope, $compile) {
      var template = jqLite('<div>{{greeting = "hello world"}}</div>');

      var templateFn = $compile(template);
      var templateClone = template.clone();

      var element = templateFn($rootScope, function(clone){
        templateClone = clone;
      });
      $rootScope.$digest();

      expect(template.text()).toEqual('');
      expect(element.text()).toEqual('hello world');
      expect(element).toEqual(templateClone);
      expect($rootScope.greeting).toEqual('hello world');
    }));

    it('should link to cloned node and create scope', inject(function($rootScope, $compile) {
      var template = jqLite('<div>{{greeting = "hello world"}}</div>');
      var element = $compile(template)($rootScope, noop);
      $rootScope.$digest();
      expect(template.text()).toEqual('');
      expect(element.text()).toEqual('hello world');
      expect($rootScope.greeting).toEqual('hello world');
    }));
  });


  describe('nodeName_', function() {
    it('should correctly detect node name with "namespace" when xmlns is defined', function() {
      var div = jqLite('<div xmlns:ngtest="http://angularjs.org/">' +
                         '<ngtest:foo ngtest:attr="bar"></ngtest:foo>' +
                       '</div>')[0];
      expect(nodeName_(div.childNodes[0])).toBe('NGTEST:FOO');
      expect(div.childNodes[0].getAttribute('ngtest:attr')).toBe('bar');
    });

    if (!msie || msie >= 9) {
      it('should correctly detect node name with "namespace" when xmlns is NOT defined', function() {
        var div = jqLite('<div xmlns:ngtest="http://angularjs.org/">' +
                           '<ngtest:foo ngtest:attr="bar"></ng:test>' +
                         '</div>')[0];
        expect(nodeName_(div.childNodes[0])).toBe('NGTEST:FOO');
        expect(div.childNodes[0].getAttribute('ngtest:attr')).toBe('bar');
      });
    }
  });


  describe('nextUid()', function() {
    it('should return new id per call', function() {
      var seen = {};
      var count = 100;

      while(count--) {
        var current = nextUid();
        expect(current.match(/[\d\w]+/)).toBeTruthy();
        expect(seen[current]).toBeFalsy();
        seen[current] = true;
      }
    });
  });


  describe('version', function() {
    it('version should have full/major/minor/dot/codeName properties', function() {
      expect(version).toBeDefined();
      expect(version.full).toBe('"NG_VERSION_FULL"');
      expect(version.major).toBe("NG_VERSION_MAJOR");
      expect(version.minor).toBe("NG_VERSION_MINOR");
      expect(version.dot).toBe("NG_VERSION_DOT");
      expect(version.codeName).toBe('"NG_VERSION_CODENAME"');
    });
  });

  describe('bootstrap', function() {
    it('should bootstrap app', function(){
      var element = jqLite('<div>{{1+2}}</div>');
      var injector;
      angular.bootstrap(element, [function($injector){ injector = $injector; }]);
      expect(injector).toBeDefined();
      expect(element.data('$injector')).toBe(injector);
      dealoc(element);
    });
  });
});
