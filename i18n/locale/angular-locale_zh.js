window.angular = window.angular || {};
angular.module = angular.module || {};
angular.module.ngLocale = ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {"DATETIME_FORMATS":{"MONTH":["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],"SHORTMONTH":["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],"DAY":["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],"SHORTDAY":["周日","周一","周二","周三","周四","周五","周六"],"AMPMS":["上午","下午"],"medium":"yyyy-M-d ah:mm:ss","short":"yy-M-d ah:mm","fullDate":"y年M月d日EEEE","longDate":"y年M月d日","mediumDate":"yyyy-M-d","shortDate":"yy-M-d","mediumTime":"ah:mm:ss","shortTime":"ah:mm"},"NUMBER_FORMATS":{"DECIMAL_SEP":".","GROUP_SEP":",","PATTERNS":[{"minInt":1,"minFrac":0,"macFrac":0,"posPre":"","posSuf":"","negPre":"-","negSuf":"","gSize":3,"lgSize":3,"maxFrac":3},{"minInt":1,"minFrac":2,"macFrac":0,"posPre":"\u00A4","posSuf":"","negPre":"\u00A4-","negSuf":"","gSize":3,"lgSize":3,"maxFrac":2}],"CURRENCY_SYM":"¥"},"pluralCat":function (n) {  return PLURAL_CATEGORY.OTHER;},"id":"zh"});
}];
