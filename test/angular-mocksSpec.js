'use strict';

describe('mocks', function() {
  describe('TzDate', function() {

    function minutes(min) {
      return min*60*1000;
    }

    it('should look like a Date', function() {
      var date = new angular.module.ngMock.TzDate(0,0);
      expect(angular.isDate(date)).toBe(true);
    });

    it('should take millis as constructor argument', function() {
      expect(new angular.module.ngMock.TzDate(0, 0).getTime()).toBe(0);
      expect(new angular.module.ngMock.TzDate(0, 1283555108000).getTime()).toBe(1283555108000);
    });

    it('should take dateString as constructor argument', function() {
      expect(new angular.module.ngMock.TzDate(0, '1970-01-01T00:00:00.000Z').getTime()).toBe(0);
      expect(new angular.module.ngMock.TzDate(0, '2010-09-03T23:05:08.023Z').getTime()).toBe(1283555108023);
    });


    it('should fake getLocalDateString method', function() {
      //0 in -3h
      var t0 = new angular.module.ngMock.TzDate(-3, 0);
      expect(t0.toLocaleDateString()).toMatch('1970');

      //0 in +0h
      var t1 = new angular.module.ngMock.TzDate(0, 0);
      expect(t1.toLocaleDateString()).toMatch('1970');

      //0 in +3h
      var t2 = new angular.module.ngMock.TzDate(3, 0);
      expect(t2.toLocaleDateString()).toMatch('1969');
    });


    it('should fake getHours method', function() {
      //0 in -3h
      var t0 = new angular.module.ngMock.TzDate(-3, 0);
      expect(t0.getHours()).toBe(3);

      //0 in +0h
      var t1 = new angular.module.ngMock.TzDate(0, 0);
      expect(t1.getHours()).toBe(0);

      //0 in +3h
      var t2 = new angular.module.ngMock.TzDate(3, 0);
      expect(t2.getHours()).toMatch(21);
    });


    it('should fake getMinutes method', function() {
      //0:15 in -3h
      var t0 = new angular.module.ngMock.TzDate(-3, minutes(15));
      expect(t0.getMinutes()).toBe(15);

      //0:15 in -3.25h
      var t0a = new angular.module.ngMock.TzDate(-3.25, minutes(15));
      expect(t0a.getMinutes()).toBe(30);

      //0 in +0h
      var t1 = new angular.module.ngMock.TzDate(0, minutes(0));
      expect(t1.getMinutes()).toBe(0);

      //0:15 in +0h
      var t1a = new angular.module.ngMock.TzDate(0, minutes(15));
      expect(t1a.getMinutes()).toBe(15);

      //0:15 in +3h
      var t2 = new angular.module.ngMock.TzDate(3, minutes(15));
      expect(t2.getMinutes()).toMatch(15);

      //0:15 in +3.25h
      var t2a = new angular.module.ngMock.TzDate(3.25, minutes(15));
      expect(t2a.getMinutes()).toMatch(0);
    });


    it('should fake getSeconds method', function() {
      //0 in -3h
      var t0 = new angular.module.ngMock.TzDate(-3, 0);
      expect(t0.getSeconds()).toBe(0);

      //0 in +0h
      var t1 = new angular.module.ngMock.TzDate(0, 0);
      expect(t1.getSeconds()).toBe(0);

      //0 in +3h
      var t2 = new angular.module.ngMock.TzDate(3, 0);
      expect(t2.getSeconds()).toMatch(0);
    });


    it('should create a date representing new year in Bratislava', function() {
      var newYearInBratislava = new angular.module.ngMock.TzDate(-1, '2009-12-31T23:00:00.000Z');
      expect(newYearInBratislava.getTimezoneOffset()).toBe(-60);
      expect(newYearInBratislava.getFullYear()).toBe(2010);
      expect(newYearInBratislava.getMonth()).toBe(0);
      expect(newYearInBratislava.getDate()).toBe(1);
      expect(newYearInBratislava.getHours()).toBe(0);
      expect(newYearInBratislava.getMinutes()).toBe(0);
    });


    it('should delegate all the UTC methods to the original UTC Date object', function() {
      //from when created from string
      var date1 = new angular.module.ngMock.TzDate(-1, '2009-12-31T23:00:00.000Z');
      expect(date1.getUTCFullYear()).toBe(2009);
      expect(date1.getUTCMonth()).toBe(11);
      expect(date1.getUTCDate()).toBe(31);
      expect(date1.getUTCHours()).toBe(23);
      expect(date1.getUTCMinutes()).toBe(0);
      expect(date1.getUTCSeconds()).toBe(0);


      //from when created from millis
      var date2 = new angular.module.ngMock.TzDate(-1, date1.getTime());
      expect(date2.getUTCFullYear()).toBe(2009);
      expect(date2.getUTCMonth()).toBe(11);
      expect(date2.getUTCDate()).toBe(31);
      expect(date2.getUTCHours()).toBe(23);
      expect(date2.getUTCMinutes()).toBe(0);
      expect(date2.getUTCSeconds()).toBe(0);
    });


    it('should throw error when no third param but toString called', function() {
      expect(function() { new angular.module.ngMock.TzDate(0,0).toString(); }).
                           toThrow('Method \'toString\' is not implemented in the TzDate mock');
    });
  });

  describe('$log', function() {
    var $log;
    beforeEach(inject(['$log', function(log) {
      $log = log;
    }]));

    afterEach(inject(function($log){
      $log.reset();
    }));

    it('should provide log method', function() {
      expect(function() { $log.log(''); }).not.toThrow();
    });

    it('should provide info method', function() {
      expect(function() { $log.info(''); }).not.toThrow();
    });

    it('should provide warn method', function() {
      expect(function() { $log.warn(''); }).not.toThrow();
    });

    it('should provide error method', function() {
      expect(function() { $log.error(''); }).not.toThrow();
    });

    it('should store log messages', function() {
      $log.log('fake log');
      expect($log.log.logs).toContain(['fake log']);
    });

    it('should store info messages', function() {
      $log.info('fake log');
      expect($log.info.logs).toContain(['fake log']);
    });

    it('should store warn messages', function() {
      $log.warn('fake log');
      expect($log.warn.logs).toContain(['fake log']);
    });

    it('should store error messages', function() {
      $log.error('fake log');
      expect($log.error.logs).toContain(['fake log']);
    });

    it('should assertEmpty', function(){
      try {
        $log.error(Error('MyError'));
        $log.warn(Error('MyWarn'));
        $log.info(Error('MyInfo'));
        $log.log(Error('MyLog'));
        $log.assertEmpty();
      } catch (error) {
        error = error.message || error;
        expect(error).toMatch(/Error: MyError/m);
        expect(error).toMatch(/Error: MyWarn/m);
        expect(error).toMatch(/Error: MyInfo/m);
        expect(error).toMatch(/Error: MyLog/m);
      } finally {
        $log.reset();
      }
    });

    it('should reset state', function(){
      $log.error(Error('MyError'));
      $log.warn(Error('MyWarn'));
      $log.info(Error('MyInfo'));
      $log.log(Error('MyLog'));
      $log.reset();
      var passed = false;
      try {
        $log.assertEmpty(); // should not throw error!
        passed = true;
      } catch (e) {
        passed = e;
      }
      expect(passed).toBe(true);
    });
  });

  describe('defer', function() {
    var browser, log;
    beforeEach(inject(function($browser) {
      browser = $browser;
      log = '';
    }));

    function logFn(text){ return function() {
        log += text +';';
      };
    }

    it('should flush', function() {
      browser.defer(logFn('A'));
      expect(log).toEqual('');
      browser.defer.flush();
      expect(log).toEqual('A;');
    });

    it('should flush delayed', function() {
      browser.defer(logFn('A'));
      browser.defer(logFn('B'), 10);
      browser.defer(logFn('C'), 20);
      expect(log).toEqual('');

      expect(browser.defer.now).toEqual(0);
      browser.defer.flush(0);
      expect(log).toEqual('A;');

      browser.defer.flush();
      expect(log).toEqual('A;B;C;');
    });

    it('should defer and flush over time', function() {
      browser.defer(logFn('A'), 1);
      browser.defer(logFn('B'), 2);
      browser.defer(logFn('C'), 3);

      browser.defer.flush(0);
      expect(browser.defer.now).toEqual(0);
      expect(log).toEqual('');

      browser.defer.flush(1);
      expect(browser.defer.now).toEqual(1);
      expect(log).toEqual('A;');

      browser.defer.flush(2);
      expect(browser.defer.now).toEqual(3);
      expect(log).toEqual('A;B;C;');
    });
  });


  describe('$exceptionHandler', function() {
    it('should rethrow exceptions', inject(function($exceptionHandler) {
      expect(function() { $exceptionHandler('myException'); }).toThrow('myException');
    }));


    it('should log exceptions', inject(function($exceptionHandlerProvider){
      $exceptionHandlerProvider.mode('log');
      var $exceptionHandler = $exceptionHandlerProvider.$get();
      $exceptionHandler('MyError');
      expect($exceptionHandler.errors).toEqual(['MyError']);
    }));


    it('should thorw on wrong argument', inject(function($exceptionHandlerProvider) {
      expect(function() {
        $exceptionHandlerProvider.mode('XXX');
      }).toThrow("Unknown mode 'XXX', only 'log'/'rethrow' modes are allowed!");
    }));
  });


  describe('angular.module.ngMock.dump', function(){
    var d = angular.module.ngMock.dump;


    it('should serialize primitive types', function(){
      expect(d(undefined)).toEqual('undefined');
      expect(d(1)).toEqual('1');
      expect(d(null)).toEqual('null');
      expect(d('abc')).toEqual('abc');
    });


    it('should serialize element', function(){
      var e = angular.element('<div>abc</div><span>xyz</span>');
      expect(d(e).toLowerCase()).toEqual('<div>abc</div><span>xyz</span>');
      expect(d(e[0]).toLowerCase()).toEqual('<div>abc</div>');
    });

    it('should serialize scope', inject(function($rootScope){
      $rootScope.obj = {abc:'123'};
      expect(d($rootScope)).toMatch(/Scope\(.*\): \{/);
      expect(d($rootScope)).toMatch(/{"abc":"123"}/);
    }));


    it('should be published on window', function(){
      expect(window.dump instanceof Function).toBe(true);
    });
  });

  describe('jasmine inject', function(){
    it('should call invoke', function(){
      var count = 0;
      function fn1(){
        expect(this).toBe(self);
        count++;
      }
      function fn2(){
        expect(this).toBe(self);
        count++;
      }
      var fn = inject(fn1, fn2);
      var self = {
        $injector: {
          invoke: function(self, fn) { fn.call(self); }
        }
      };

      fn.call(self);
      expect(count).toBe(2);
    });
  });
});
