webpackJsonp([135],{

/***/ 93:
/***/ (function(module, exports) {

module.exports = function(hljs) {
  return {
    subLanguage: 'xml',
    contains: [
      hljs.COMMENT('<%#', '%>'),
      {
        begin: '<%[%=-]?', end: '[%-]?%>',
        subLanguage: 'ruby',
        excludeBegin: true,
        excludeEnd: true
      }
    ]
  };
};

/***/ })

});
//# sourceMappingURL=135.e1f76d6a.bundle.js.map