(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["IntegrationEntryPoint"] = factory();
	else
		root["IntegrationEntryPoint"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SingletonWebSocket = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _globalWebSocketClientJsBundle = __webpack_require__(3);

var _galateaMessageService = __webpack_require__(5);

var _IPHelper = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var webSocketClient = null;
var wsServer = null;
var _port = null;
var _keepAlive = 5000;

var SingletonWebSocket = function () {
    function SingletonWebSocket() {
        _classCallCheck(this, SingletonWebSocket);

        this._dataCall = null;
        this._currentStatus = "logout";
        this._ip = "";
    }

    _createClass(SingletonWebSocket, [{
        key: 'ipAddress',
        get: function get() {
            return this._ip;
        }
    }, {
        key: 'dataCall',
        set: function set(dataCall) {
            this._dataCall = dataCall;
        },
        get: function get() {
            return this._dataCall;
        }
    }, {
        key: 'currentStatus',
        set: function set(currentStatus) {
            this._currentStatus = currentStatus;
        },
        get: function get() {
            return this._currentStatus;
        }
    }], [{
        key: 'setwsServer',
        value: function setwsServer(server) {
            wsServer = server;
        }
    }, {
        key: 'setPort',
        value: function setPort(port) {
            _port = port;
        }
    }, {
        key: 'setKeepAlive',
        value: function setKeepAlive(_setKeepAlive) {
            _keepAlive = _setKeepAlive ? 5000 : 0;
        }
    }, {
        key: 'connect',
        value: function connect() {
            var secureConnection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            SingletonWebSocket.validate();
            webSocketClient.connect(secureConnection);
        }
    }, {
        key: 'validate',
        value: function validate() {
            var _this = this;

            if (webSocketClient === null) {
                ;
                webSocketClient = new _globalWebSocketClientJsBundle.WebSocketFactory().buildClient();
                webSocketClient.WSParameter.serverIP = wsServer;
                webSocketClient.WSParameter.port = _port;
                webSocketClient.WSParameter.keepAliveTimeResponse = _keepAlive;
                webSocketClient.WSParameter.keepAliveTimeRequest = 30000;
                webSocketClient.WSParameter.keepAliveMessage = "{client : \"integration\", action: \"KeepAlive\",  ip: \"" + this._ip + "\"}";

                webSocketClient.WSParameter.onMessage = function (message) {
                    if (message.data === "added") {
                        //This is the message Integration.Service sends when a socket is added to a dico.
                        return;
                    }
                    _galateaMessageService.galateaMessageService.newMessage(message);
                };
                webSocketClient.WSParameter.onOpen = function () {
                    var message = { client: "integration", action: "firstConnection", ip: _this._ip };
                    webSocketClient.send(JSON.stringify(message));
                };
                webSocketClient.WSParameter.onClose = function () {
                    _this._currentStatus = "SocketClosed";
                    onAgentStatus({ currentState: _this._currentStatus });
                };
                webSocketClient.WSParameter.onError = function () {
                    _this._currentStatus = "Error";
                    onAgentStatus({ currentState: _this._currentStatus });
                };
            }
        }
    }, {
        key: 'send',
        value: function send(message) {
            SingletonWebSocket.validate();
            message.ip = this._ip;
            webSocketClient.send(JSON.stringify(message));
        }
    }, {
        key: 'setIPAddress',
        value: function setIPAddress(ipAddress) {
            this._ip = ipAddress;
        }
    }, {
        key: 'close',
        value: function close() {
            webSocketClient.close();
        }
    }]);

    return SingletonWebSocket;
}();

exports.SingletonWebSocket = SingletonWebSocket;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IPHelper = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _singletonWebSocket = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IPHelper = exports.IPHelper = function () {
    function IPHelper() {
        _classCallCheck(this, IPHelper);

        this.ip = 0;
    }

    _createClass(IPHelper, [{
        key: "GetIp",
        value: function GetIp() {
            if ("ActiveXObject" in window) {
                try {
                    this.getIEIPAddress();
                } catch (err) {}
            } else {
                this.getIPAddress();
            }
        }
    }, {
        key: "getIEIPAddress",
        value: function getIEIPAddress() {
            var locator = new window.ActiveXObject("WbemScripting.SWbemLocator");
            var service = locator.ConnectServer(".");
            var properties = service.ExecQuery("SELECT * FROM Win32_NetworkAdapterConfiguration");
            var e = new window.Enumerator(properties);
            for (; !e.atEnd(); e.moveNext()) {
                var p = e.item();
                if (p.IPAddress != null) {
                    _singletonWebSocket.SingletonWebSocket.setIPAddress(p.IPAddress(0));
                    break;
                }
            }
        }
    }, {
        key: "getIPAddress",
        value: function getIPAddress() {
            window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection; //compatibility for firefox and chrome
            if (window.RTCPeerConnection) {
                var pc = new RTCPeerConnection({ iceServers: [] }),
                    noop = function noop() {};
                pc.createDataChannel(""); //create a bogus data channel
                var _this = this;
                pc.createOffer(pc.setLocalDescription.bind(pc), noop); // create offer and set local description
                pc.onicecandidate = function (ice) {
                    //listen for candidate events
                    if (!ice || !ice.candidate || !ice.candidate.candidate) return;
                    var ip = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
                    _this.setIP(ip);
                    pc.onicecandidate = noop;
                };
            } else {
                this.setIP("");
            }
        }
    }, {
        key: "setIP",
        value: function setIP(ipAddress) {
            _singletonWebSocket.SingletonWebSocket.setIPAddress(ipAddress);
        }
    }]);

    return IPHelper;
}();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.IntegrationApiFactory = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _singletonWebSocket = __webpack_require__(0);

var _IntegrationApi = __webpack_require__(13);

var _loginService = __webpack_require__(14);

var _callService = __webpack_require__(15);

var _callBarService = __webpack_require__(16);

var _notAvailableService = __webpack_require__(17);

var _assistedTransferService = __webpack_require__(18);

var _chatService = __webpack_require__(19);

var _callLogService = __webpack_require__(20);

var _dispositionCallService = __webpack_require__(21);

var _agentDataService = __webpack_require__(22);

var _reprogamCallService = __webpack_require__(23);

var _StateRule = __webpack_require__(24);

var _ongoingCallIvrService = __webpack_require__(34);

var _IPHelper = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IntegrationApiFactory = exports.IntegrationApiFactory = function () {
	function IntegrationApiFactory() {
		_classCallCheck(this, IntegrationApiFactory);
	}

	_createClass(IntegrationApiFactory, [{
		key: 'buildClient',
		value: function buildClient() {
			var params = {};
			_singletonWebSocket.SingletonWebSocket.currentStatus = "logout";
			var paramsService = { SingletonWebSocket: _singletonWebSocket.SingletonWebSocket, StateRule: _StateRule.StateRule };
			params.SingletonWebSocket = _singletonWebSocket.SingletonWebSocket;
			params.loginService = new _loginService.loginService(paramsService);
			params.callService = new _callService.callService(paramsService);
			params.notAvailableService = new _notAvailableService.notAvailableService(paramsService);
			params.callBarService = new _callBarService.callBarService(paramsService);
			params.assistedTransferService = new _assistedTransferService.assistedTransferService(paramsService);
			params.chatService = new _chatService.chatService(paramsService);
			params.callLog = new _callLogService.callLogService(paramsService);
			params.dispositionCallService = new _dispositionCallService.dispositionCallService(paramsService);
			params.agentDataService = new _agentDataService.agentDataService(paramsService);
			params.reprogamCallService = new _reprogamCallService.reprogamCallService(paramsService);
			params.ongoingCallIvrService = new _ongoingCallIvrService.ongoingCallIvrService(paramsService);
			new _IPHelper.IPHelper().GetIp();
			return new _IntegrationApi.IntegrationAPI(params);
		}
	}]);

	return IntegrationApiFactory;
}();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof3 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function webpackUniversalModuleDefinition(root, factory) {
  if (( false ? 'undefined' : _typeof3(exports)) === 'object' && ( false ? 'undefined' : _typeof3(module)) === 'object') module.exports = factory();else if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if ((typeof exports === 'undefined' ? 'undefined' : _typeof3(exports)) === 'object') exports["EntryPoint"] = factory();else root["EntryPoint"] = factory();
})(typeof self !== 'undefined' ? self : undefined, function () {
  return (/******/function (modules) {
      // webpackBootstrap
      /******/ // The module cache
      /******/var installedModules = {};
      /******/
      /******/ // The require function
      /******/function __webpack_require__(moduleId) {
        /******/
        /******/ // Check if module is in cache
        /******/if (installedModules[moduleId]) {
          /******/return installedModules[moduleId].exports;
          /******/
        }
        /******/ // Create a new module (and put it into the cache)
        /******/var module = installedModules[moduleId] = {
          /******/i: moduleId,
          /******/l: false,
          /******/exports: {}
          /******/ };
        /******/
        /******/ // Execute the module function
        /******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/
        /******/ // Flag the module as loaded
        /******/module.l = true;
        /******/
        /******/ // Return the exports of the module
        /******/return module.exports;
        /******/
      }
      /******/
      /******/
      /******/ // expose the modules object (__webpack_modules__)
      /******/__webpack_require__.m = modules;
      /******/
      /******/ // expose the module cache
      /******/__webpack_require__.c = installedModules;
      /******/
      /******/ // define getter function for harmony exports
      /******/__webpack_require__.d = function (exports, name, getter) {
        /******/if (!__webpack_require__.o(exports, name)) {
          /******/Object.defineProperty(exports, name, {
            /******/configurable: false,
            /******/enumerable: true,
            /******/get: getter
            /******/ });
          /******/
        }
        /******/
      };
      /******/
      /******/ // getDefaultExport function for compatibility with non-harmony modules
      /******/__webpack_require__.n = function (module) {
        /******/var getter = module && module.__esModule ?
        /******/function getDefault() {
          return module['default'];
        } :
        /******/function getModuleExports() {
          return module;
        };
        /******/__webpack_require__.d(getter, 'a', getter);
        /******/return getter;
        /******/
      };
      /******/
      /******/ // Object.prototype.hasOwnProperty.call
      /******/__webpack_require__.o = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
      };
      /******/
      /******/ // __webpack_public_path__
      /******/__webpack_require__.p = "";
      /******/
      /******/ // Load entry module and return exports
      /******/return __webpack_require__(__webpack_require__.s = 0);
      /******/
    }(
    /************************************************************************/
    /******/[
    /* 0 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.WebSocketFactory = undefined;

      var _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
          }
        }return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
        };
      }();

      var _WebSocketClient = __webpack_require__(1);

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }

      var WebSocketFactory = exports.WebSocketFactory = function () {
        function WebSocketFactory() {
          _classCallCheck(this, WebSocketFactory);
        }

        _createClass(WebSocketFactory, [{
          key: "buildClient",
          value: function buildClient() {
            return new _WebSocketClient.WebSocketClient();
          }
        }]);

        return WebSocketFactory;
      }();

      /***/
    },
    /* 1 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.WebSocketClient = undefined;

      var _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
          }
        }return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
        };
      }();

      var _Logger = __webpack_require__(2);

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }

      var instance = null;
      var connection = null;

      var WebSocketClient = exports.WebSocketClient = function () {
        function WebSocketClient() {
          _classCallCheck(this, WebSocketClient);

          _Logger.Logger.Trace("WebSocketClient constructor");
          if (!instance) {
            this.WSParameter = {
              serverIP: "",
              port: "",
              keepAliveTimeResponse: 0,
              keepAliveTimeRequest: 30000,
              keepAliveMessage: "ping",
              onError: function onError(error) {},
              onDisconnected: function onDisconnected() {},
              onConnected: function onConnected() {},
              onMessage: function onMessage(message) {},
              onOpen: function onOpen() {},
              onClose: function onClose() {}
            };
            this.tm;
          }
          return instance;
        }

        _createClass(WebSocketClient, [{
          key: "manageKeepAlive",
          value: function manageKeepAlive() {
            if (this.WSParameter.keepAliveTimeResponse > 0 && connection.readyState === 1) {
              _Logger.Logger.Debug("Keep Alive configured");
              _Logger.Logger.Debug("Sending every  [" + this.WSParameter.keepAliveTimeRequest + "] milisenconds");
              _Logger.Logger.Debug("Response expected within  [" + this.WSParameter.keepAliveTimeResponse + "] milisenconds");
              this.ping();
            }
          }
        }, {
          key: "ping",
          value: function ping() {
            var _this = this;
            this.send(this.WSParameter.keepAliveMessage);
            this.tm = setTimeout(function () {
              _this.executeOnClose();
              _this.close();
            }, this.WSParameter.keepAliveTimeResponse);
          }
        }, {
          key: "pong",
          value: function pong() {
            _Logger.Logger.Trace("pong");
            var _this = this;
            clearTimeout(this.tm);
            setTimeout(function () {
              _this.ping();
            }, this.WSParameter.keepAliveTimeRequest);
          }
        }, {
          key: "connect",
          value: function connect() {
            var secureConnection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            // if user is running mozilla then use it's built-in WebSocket
            window.WebSocket = window.WebSocket || window.MozWebSocket;

            // if browser doesn't support WebSocket, just show some notification and exit
            if (!window.WebSocket) {
              if (_this.WSParameter.onError) {
                this.WSParameter.onError("Sorry, but your browser doesn\'t support WebSockets.");
              }
              return;
            }
            // open connection
            var connectionType = secureConnection ? "wss" : "ws";
            connection = new WebSocket(connectionType + '://' + this.WSParameter.serverIP + ':' + this.WSParameter.port);
            var _this = this;

            connection.onopen = function () {
              if (_this.WSParameter.onOpen) {
                _Logger.Logger.Trace("onOpen");
                _this.manageKeepAlive();
                _this.WSParameter.onOpen();
              }
            };

            connection.onerror = function (error) {
              if (_this.WSParameter.onError) {
                _this.WSParameter.onError(error);
              }
            };

            connection.onmessage = function (message) {
              if (message.data === "pong") {
                _this.pong();
                return;
              }
              if (_this.WSParameter.onMessage) {
                _this.WSParameter.onMessage(message);
              }
            };
            connection.onclose = function () {
              _this.executeOnClose();
            };
          }
        }, {
          key: "executeOnClose",
          value: function executeOnClose() {
            if (this.WSParameter.onClose) {
              this.WSParameter.onClose();
            }
          }
        }, {
          key: "send",
          value: function send(msg) {
            if (connection && msg) {
              _Logger.Logger.Trace("Sending: ", msg);
              connection.send(msg);
            }
          }
        }, {
          key: "close",
          value: function close() {
            if (connection) {
              connection.close();
              _Logger.Logger.Debug("Closing connection");
            }
          }
        }]);

        return WebSocketClient;
      }();

      /***/
    },
    /* 2 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.Logger = undefined;

      var _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
          }
        }return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
        };
      }();

      var _globalLoggerServicesJsBundle = __webpack_require__(3);

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }

      var Logger = exports.Logger = function () {
        function Logger() {
          _classCallCheck(this, Logger);
        }

        _createClass(Logger, null, [{
          key: 'Trace',
          value: function Trace() {
            for (var _len = arguments.length, msg = Array(_len), _key = 0; _key < _len; _key++) {
              msg[_key] = arguments[_key];
            }

            _globalLoggerServicesJsBundle.LoggerInstance.Trace.apply(_globalLoggerServicesJsBundle.LoggerInstance, ['[Web-Socket-Client] '].concat(msg));
          }
        }, {
          key: 'Debug',
          value: function Debug() {
            for (var _len2 = arguments.length, msg = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              msg[_key2] = arguments[_key2];
            }

            _globalLoggerServicesJsBundle.LoggerInstance.Debug.apply(_globalLoggerServicesJsBundle.LoggerInstance, ['[Web-Socket-Client] '].concat(msg));
          }
        }, {
          key: 'Warning',
          value: function Warning() {
            for (var _len3 = arguments.length, msg = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
              msg[_key3] = arguments[_key3];
            }

            _globalLoggerServicesJsBundle.LoggerInstance.Warning.apply(_globalLoggerServicesJsBundle.LoggerInstance, ['[Web-Socket-Client] '].concat(msg));
          }
        }, {
          key: 'Info',
          value: function Info() {
            for (var _len4 = arguments.length, msg = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
              msg[_key4] = arguments[_key4];
            }

            _globalLoggerServicesJsBundle.LoggerInstance.Info.apply(_globalLoggerServicesJsBundle.LoggerInstance, ['[Common-Utilities] '].concat(msg));
          }
        }, {
          key: 'Error',
          value: function Error() {
            for (var _len5 = arguments.length, msg = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
              msg[_key5] = arguments[_key5];
            }

            _globalLoggerServicesJsBundle.LoggerInstance.Error.apply(_globalLoggerServicesJsBundle.LoggerInstance, ['[Common-Utilities] '].concat(msg));
          }
        }]);

        return Logger;
      }();

      /***/
    },
    /* 3 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";
      /* WEBPACK VAR INJECTION */
      (function (module) {
        var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

        var _typeof2 = typeof Symbol === "function" && _typeof3(Symbol.iterator) === "symbol" ? function (obj) {
          return typeof obj === 'undefined' ? 'undefined' : _typeof3(obj);
        } : function (obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof3(obj);
        };

        (function webpackUniversalModuleDefinition(root, factory) {
          if ((false ? 'undefined' : _typeof2(exports)) === 'object' && (false ? 'undefined' : _typeof2(module)) === 'object') module.exports = factory();else if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = factory, __WEBPACK_AMD_DEFINE_RESULT__ = typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? __WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__) : __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if ((typeof exports === 'undefined' ? 'undefined' : _typeof2(exports)) === 'object') exports["LoggerEntryPoint"] = factory();else root["LoggerEntryPoint"] = factory();
        })(typeof self !== 'undefined' ? self : undefined, function () {
          return (/******/function (modules) {
              // webpackBootstrap
              /******/ // The module cache
              /******/var installedModules = {};
              /******/
              /******/ // The require function
              /******/function __webpack_require__(moduleId) {
                /******/
                /******/ // Check if module is in cache
                /******/if (installedModules[moduleId]) {
                  /******/return installedModules[moduleId].exports;
                  /******/
                }
                /******/ // Create a new module (and put it into the cache)
                /******/var module = installedModules[moduleId] = {
                  /******/i: moduleId,
                  /******/l: false,
                  /******/exports: {}
                  /******/ };
                /******/
                /******/ // Execute the module function
                /******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
                /******/
                /******/ // Flag the module as loaded
                /******/module.l = true;
                /******/
                /******/ // Return the exports of the module
                /******/return module.exports;
                /******/
              }
              /******/
              /******/
              /******/ // expose the modules object (__webpack_modules__)
              /******/__webpack_require__.m = modules;
              /******/
              /******/ // expose the module cache
              /******/__webpack_require__.c = installedModules;
              /******/
              /******/ // define getter function for harmony exports
              /******/__webpack_require__.d = function (exports, name, getter) {
                /******/if (!__webpack_require__.o(exports, name)) {
                  /******/Object.defineProperty(exports, name, {
                    /******/configurable: false,
                    /******/enumerable: true,
                    /******/get: getter
                    /******/ });
                  /******/
                }
                /******/
              };
              /******/
              /******/ // getDefaultExport function for compatibility with non-harmony modules
              /******/__webpack_require__.n = function (module) {
                /******/var getter = module && module.__esModule ?
                /******/function getDefault() {
                  return module['default'];
                } :
                /******/function getModuleExports() {
                  return module;
                };
                /******/__webpack_require__.d(getter, 'a', getter);
                /******/return getter;
                /******/
              };
              /******/
              /******/ // Object.prototype.hasOwnProperty.call
              /******/__webpack_require__.o = function (object, property) {
                return Object.prototype.hasOwnProperty.call(object, property);
              };
              /******/
              /******/ // __webpack_public_path__
              /******/__webpack_require__.p = "";
              /******/
              /******/ // Load entry module and return exports
              /******/return __webpack_require__(__webpack_require__.s = 10);
              /******/
            }(
            /************************************************************************/
            /******/[
            /* 0 */
            /***/function (module, exports, __webpack_require__) {

              "use strict";

              var bind = __webpack_require__(5);
              var isBuffer = __webpack_require__(14);

              /*global toString:true*/

              // utils is a library of generic helper functions non-specific to axios

              var toString = Object.prototype.toString;

              /**
               * Determine if a value is an Array
               *
               * @param {Object} val The value to test
               * @returns {boolean} True if value is an Array, otherwise false
               */
              function isArray(val) {
                return toString.call(val) === '[object Array]';
              }

              /**
               * Determine if a value is an ArrayBuffer
               *
               * @param {Object} val The value to test
               * @returns {boolean} True if value is an ArrayBuffer, otherwise false
               */
              function isArrayBuffer(val) {
                return toString.call(val) === '[object ArrayBuffer]';
              }

              /**
               * Determine if a value is a FormData
               *
               * @param {Object} val The value to test
               * @returns {boolean} True if value is an FormData, otherwise false
               */
              function isFormData(val) {
                return typeof FormData !== 'undefined' && val instanceof FormData;
              }

              /**
               * Determine if a value is a view on an ArrayBuffer
               *
               * @param {Object} val The value to test
               * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
               */
              function isArrayBufferView(val) {
                var result;
                if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
                  result = ArrayBuffer.isView(val);
                } else {
                  result = val && val.buffer && val.buffer instanceof ArrayBuffer;
                }
                return result;
              }

              /**
               * Determine if a value is a String
               *
               * @param {Object} val The value to test
               * @returns {boolean} True if value is a String, otherwise false
               */
              function isString(val) {
                return typeof val === 'string';
              }

              /**
               * Determine if a value is a Number
               *
               * @param {Object} val The value to test
               * @returns {boolean} True if value is a Number, otherwise false
               */
              function isNumber(val) {
                return typeof val === 'number';
              }

              /**
               * Determine if a value is undefined
               *
               * @param {Object} val The value to test
               * @returns {boolean} True if the value is undefined, otherwise false
               */
              function isUndefined(val) {
                return typeof val === 'undefined';
              }

              /**
               * Determine if a value is an Object
               *
               * @param {Object} val The value to test
               * @returns {boolean} True if value is an Object, otherwise false
               */
              function isObject(val) {
                return val !== null && (typeof val === 'undefined' ? 'undefined' : _typeof2(val)) === 'object';
              }

              /**
               * Determine if a value is a Date
               *
               * @param {Object} val The value to test
               * @returns {boolean} True if value is a Date, otherwise false
               */
              function isDate(val) {
                return toString.call(val) === '[object Date]';
              }

              /**
               * Determine if a value is a File
               *
               * @param {Object} val The value to test
               * @returns {boolean} True if value is a File, otherwise false
               */
              function isFile(val) {
                return toString.call(val) === '[object File]';
              }

              /**
               * Determine if a value is a Blob
               *
               * @param {Object} val The value to test
               * @returns {boolean} True if value is a Blob, otherwise false
               */
              function isBlob(val) {
                return toString.call(val) === '[object Blob]';
              }

              /**
               * Determine if a value is a Function
               *
               * @param {Object} val The value to test
               * @returns {boolean} True if value is a Function, otherwise false
               */
              function isFunction(val) {
                return toString.call(val) === '[object Function]';
              }

              /**
               * Determine if a value is a Stream
               *
               * @param {Object} val The value to test
               * @returns {boolean} True if value is a Stream, otherwise false
               */
              function isStream(val) {
                return isObject(val) && isFunction(val.pipe);
              }

              /**
               * Determine if a value is a URLSearchParams object
               *
               * @param {Object} val The value to test
               * @returns {boolean} True if value is a URLSearchParams object, otherwise false
               */
              function isURLSearchParams(val) {
                return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
              }

              /**
               * Trim excess whitespace off the beginning and end of a string
               *
               * @param {String} str The String to trim
               * @returns {String} The String freed of excess whitespace
               */
              function trim(str) {
                return str.replace(/^\s*/, '').replace(/\s*$/, '');
              }

              /**
               * Determine if we're running in a standard browser environment
               *
               * This allows axios to run in a web worker, and react-native.
               * Both environments support XMLHttpRequest, but not fully standard globals.
               *
               * web workers:
               *  typeof window -> undefined
               *  typeof document -> undefined
               *
               * react-native:
               *  navigator.product -> 'ReactNative'
               */
              function isStandardBrowserEnv() {
                if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
                  return false;
                }
                return typeof window !== 'undefined' && typeof document !== 'undefined';
              }

              /**
               * Iterate over an Array or an Object invoking a function for each item.
               *
               * If `obj` is an Array callback will be called passing
               * the value, index, and complete array for each item.
               *
               * If 'obj' is an Object callback will be called passing
               * the value, key, and complete object for each property.
               *
               * @param {Object|Array} obj The object to iterate
               * @param {Function} fn The callback to invoke for each item
               */
              function forEach(obj, fn) {
                // Don't bother if no value provided
                if (obj === null || typeof obj === 'undefined') {
                  return;
                }

                // Force an array if not already something iterable
                if ((typeof obj === 'undefined' ? 'undefined' : _typeof2(obj)) !== 'object') {
                  /*eslint no-param-reassign:0*/
                  obj = [obj];
                }

                if (isArray(obj)) {
                  // Iterate over array values
                  for (var i = 0, l = obj.length; i < l; i++) {
                    fn.call(null, obj[i], i, obj);
                  }
                } else {
                  // Iterate over object keys
                  for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                      fn.call(null, obj[key], key, obj);
                    }
                  }
                }
              }

              /**
               * Accepts varargs expecting each argument to be an object, then
               * immutably merges the properties of each object and returns result.
               *
               * When multiple objects contain the same key the later object in
               * the arguments list will take precedence.
               *
               * Example:
               *
               * ```js
               * var result = merge({foo: 123}, {foo: 456});
               * console.log(result.foo); // outputs 456
               * ```
               *
               * @param {Object} obj1 Object to merge
               * @returns {Object} Result of all merge properties
               */
              function merge() /* obj1, obj2, obj3, ... */{
                var result = {};
                function assignValue(val, key) {
                  if (_typeof2(result[key]) === 'object' && (typeof val === 'undefined' ? 'undefined' : _typeof2(val)) === 'object') {
                    result[key] = merge(result[key], val);
                  } else {
                    result[key] = val;
                  }
                }

                for (var i = 0, l = arguments.length; i < l; i++) {
                  forEach(arguments[i], assignValue);
                }
                return result;
              }

              /**
               * Extends object a by mutably adding to it the properties of object b.
               *
               * @param {Object} a The object to be extended
               * @param {Object} b The object to copy properties from
               * @param {Object} thisArg The object to bind function to
               * @return {Object} The resulting value of object a
               */
              function extend(a, b, thisArg) {
                forEach(b, function assignValue(val, key) {
                  if (thisArg && typeof val === 'function') {
                    a[key] = bind(val, thisArg);
                  } else {
                    a[key] = val;
                  }
                });
                return a;
              }

              module.exports = {
                isArray: isArray,
                isArrayBuffer: isArrayBuffer,
                isBuffer: isBuffer,
                isFormData: isFormData,
                isArrayBufferView: isArrayBufferView,
                isString: isString,
                isNumber: isNumber,
                isObject: isObject,
                isUndefined: isUndefined,
                isDate: isDate,
                isFile: isFile,
                isBlob: isBlob,
                isFunction: isFunction,
                isStream: isStream,
                isURLSearchParams: isURLSearchParams,
                isStandardBrowserEnv: isStandardBrowserEnv,
                forEach: forEach,
                merge: merge,
                extend: extend,
                trim: trim
              };

              /***/
            },
            /* 1 */
            /***/function (module, exports, __webpack_require__) {

              "use strict";

              Object.defineProperty(exports, "__esModule", {
                value: true
              });

              function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                  throw new TypeError("Cannot call a class as a function");
                }
              }

              var Constants = function Constants() {
                _classCallCheck(this, Constants);
              };

              Constants._LOGGER_CONFIGURATION_FILE_LOCALE = './/logger.json';
              Constants._LOGGER_CONFIGURATION_FILE_REMOTE = 'logger.json';
              Constants._LOGGER_CONFIGURATION_FILE_ENCODE = 'utf8';
              Constants._LOGGER_CONFIGURATION_ASSIGNED = false;
              Constants._LOG_LEVELS = [{ logLevel: 0, severity: 'Trace' }, { logLevel: 1, severity: 'Debug' }, { logLevel: 2, severity: 'Info' }, { logLevel: 3, severity: 'Warn' }, { logLevel: 4, severity: 'Error' }];
              Constants._CONFIGURATIONS = {
                _ENABLE_DEFAULT: true,
                _ENABLE_AJAX: false,
                _SERVER: "http://localhost:11217/",
                _DOMAIN: "/api/Logger",
                _SEVERITY: "Trace"
              };
              Constants._REST = {
                _POST_METHOD: "POST",
                _MODE: "cors",
                _CONTENT_TYPE: "content-type",
                _APPLICATION_JSON: "application/json"
              };
              exports.Constants = Constants;

              /***/
            },
            /* 2 */
            /***/function (module, exports, __webpack_require__) {

              "use strict";
              /* WEBPACK VAR INJECTION */

              (function (process) {

                var utils = __webpack_require__(0);
                var normalizeHeaderName = __webpack_require__(17);

                var DEFAULT_CONTENT_TYPE = {
                  'Content-Type': 'application/x-www-form-urlencoded'
                };

                function setContentTypeIfUnset(headers, value) {
                  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
                    headers['Content-Type'] = value;
                  }
                }

                function getDefaultAdapter() {
                  var adapter;
                  if (typeof XMLHttpRequest !== 'undefined') {
                    // For browsers use XHR adapter
                    adapter = __webpack_require__(6);
                  } else if (typeof process !== 'undefined') {
                    // For node use HTTP adapter
                    adapter = __webpack_require__(6);
                  }
                  return adapter;
                }

                var defaults = {
                  adapter: getDefaultAdapter(),

                  transformRequest: [function transformRequest(data, headers) {
                    normalizeHeaderName(headers, 'Content-Type');
                    if (utils.isFormData(data) || utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
                      return data;
                    }
                    if (utils.isArrayBufferView(data)) {
                      return data.buffer;
                    }
                    if (utils.isURLSearchParams(data)) {
                      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
                      return data.toString();
                    }
                    if (utils.isObject(data)) {
                      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
                      return JSON.stringify(data);
                    }
                    return data;
                  }],

                  transformResponse: [function transformResponse(data) {
                    /*eslint no-param-reassign:0*/
                    if (typeof data === 'string') {
                      try {
                        data = JSON.parse(data);
                      } catch (e) {/* Ignore */}
                    }
                    return data;
                  }],

                  /**
                   * A timeout in milliseconds to abort a request. If set to 0 (default) a
                   * timeout is not created.
                   */
                  timeout: 0,

                  xsrfCookieName: 'XSRF-TOKEN',
                  xsrfHeaderName: 'X-XSRF-TOKEN',

                  maxContentLength: -1,

                  validateStatus: function validateStatus(status) {
                    return status >= 200 && status < 300;
                  }
                };

                defaults.headers = {
                  common: {
                    'Accept': 'application/json, text/plain, */*'
                  }
                };

                utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
                  defaults.headers[method] = {};
                });

                utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
                  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
                });

                module.exports = defaults;

                /* WEBPACK VAR INJECTION */
              }).call(exports, __webpack_require__(16));

              /***/
            },
            /* 3 */
            /***/function (module, exports, __webpack_require__) {

              "use strict";

              Object.defineProperty(exports, "__esModule", {
                value: true
              });
              exports.LoggerUtils = undefined;

              var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
                return typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
              } : function (obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
              };

              var _createClass = function () {
                function defineProperties(target, props) {
                  for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
                  }
                }return function (Constructor, protoProps, staticProps) {
                  if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
                };
              }();

              var _Constants = __webpack_require__(1);

              function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                  throw new TypeError("Cannot call a class as a function");
                }
              }

              var LoggerUtils = function () {
                function LoggerUtils() {
                  _classCallCheck(this, LoggerUtils);
                }

                _createClass(LoggerUtils, null, [{
                  key: "GetLogLevelBySeverity",
                  value: function GetLogLevelBySeverity(severity) {
                    var logLevel = 1;
                    _Constants.Constants._LOG_LEVELS.forEach(function (element) {
                      if (severity === element.severity) {
                        logLevel = element.logLevel;
                      }
                    });
                    return logLevel;
                  }
                }, {
                  key: "IsAllowedToLogBySeverity",
                  value: function IsAllowedToLogBySeverity(severity) {
                    return LoggerUtils.GetLogLevelBySeverity(severity) >= LoggerUtils.GetCurrentSeverityLevelConfigured();
                  }
                }, {
                  key: "GetCurrentSeverityLevelConfigured",
                  value: function GetCurrentSeverityLevelConfigured() {
                    return LoggerUtils.GetLogLevelBySeverity(_Constants.Constants._CONFIGURATIONS["_SEVERITY"]);
                  }
                }, {
                  key: "ToStringMessage",
                  value: function ToStringMessage(message) {
                    var messageString = "";
                    message.forEach(function (entry) {
                      messageString += LoggerUtils.ToStringObject(entry);
                    });
                    return messageString;
                  }
                }, {
                  key: "ToStringObject",
                  value: function ToStringObject(entry) {
                    return LoggerUtils.IsObject(entry) ? '\n' + LoggerUtils.JsonToString(entry) : entry + " ";
                  }
                }, {
                  key: "IsObject",
                  value: function IsObject(value) {
                    return value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === 'object' && value.constructor === Object;
                  }
                }, {
                  key: "JsonToString",
                  value: function JsonToString(entry) {
                    var seen = [];
                    var jsonString = JSON.stringify(entry, function (key, val) {
                      if (val != null && (typeof val === "undefined" ? "undefined" : _typeof(val)) == "object") {
                        if (seen.indexOf(val) >= 0) {
                          return;
                        }
                        seen.push(val);
                      }
                      return val;
                    }, 2);

                    return jsonString;
                  }
                }]);

                return LoggerUtils;
              }();

              exports.LoggerUtils = LoggerUtils;

              /***/
            },
            /* 4 */
            /***/function (module, exports, __webpack_require__) {

              module.exports = __webpack_require__(13);

              /***/
            },
            /* 5 */
            /***/function (module, exports, __webpack_require__) {

              "use strict";

              module.exports = function bind(fn, thisArg) {
                return function wrap() {
                  var args = new Array(arguments.length);
                  for (var i = 0; i < args.length; i++) {
                    args[i] = arguments[i];
                  }
                  return fn.apply(thisArg, args);
                };
              };

              /***/
            },
            /* 6 */
            /***/function (module, exports, __webpack_require__) {

              "use strict";

              var utils = __webpack_require__(0);
              var settle = __webpack_require__(18);
              var buildURL = __webpack_require__(20);
              var parseHeaders = __webpack_require__(21);
              var isURLSameOrigin = __webpack_require__(22);
              var createError = __webpack_require__(7);
              var btoa = typeof window !== 'undefined' && window.btoa && window.btoa.bind(window) || __webpack_require__(23);

              module.exports = function xhrAdapter(config) {
                return new Promise(function dispatchXhrRequest(resolve, reject) {
                  var requestData = config.data;
                  var requestHeaders = config.headers;

                  if (utils.isFormData(requestData)) {
                    delete requestHeaders['Content-Type']; // Let the browser set it
                  }

                  var request = new XMLHttpRequest();
                  var loadEvent = 'onreadystatechange';
                  var xDomain = false;

                  // For IE 8/9 CORS support
                  // Only supports POST and GET calls and doesn't returns the response headers.
                  // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
                  if (undefined !== 'test' && typeof window !== 'undefined' && window.XDomainRequest && !('withCredentials' in request) && !isURLSameOrigin(config.url)) {
                    request = new window.XDomainRequest();
                    loadEvent = 'onload';
                    xDomain = true;
                    request.onprogress = function handleProgress() {};
                    request.ontimeout = function handleTimeout() {};
                  }

                  // HTTP basic authentication
                  if (config.auth) {
                    var username = config.auth.username || '';
                    var password = config.auth.password || '';
                    requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
                  }

                  request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

                  // Set the request timeout in MS
                  request.timeout = config.timeout;

                  // Listen for ready state
                  request[loadEvent] = function handleLoad() {
                    if (!request || request.readyState !== 4 && !xDomain) {
                      return;
                    }

                    // The request errored out and we didn't get a response, this will be
                    // handled by onerror instead
                    // With one exception: request that using file: protocol, most browsers
                    // will return status as 0 even though it's a successful request
                    if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
                      return;
                    }

                    // Prepare the response
                    var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
                    var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
                    var response = {
                      data: responseData,
                      // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
                      status: request.status === 1223 ? 204 : request.status,
                      statusText: request.status === 1223 ? 'No Content' : request.statusText,
                      headers: responseHeaders,
                      config: config,
                      request: request
                    };

                    settle(resolve, reject, response);

                    // Clean up request
                    request = null;
                  };

                  // Handle low level network errors
                  request.onerror = function handleError() {
                    // Real errors are hidden from us by the browser
                    // onerror should only fire if it's a network error
                    reject(createError('Network Error', config, null, request));

                    // Clean up request
                    request = null;
                  };

                  // Handle timeout
                  request.ontimeout = function handleTimeout() {
                    reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED', request));

                    // Clean up request
                    request = null;
                  };

                  // Add xsrf header
                  // This is only done if running in a standard browser environment.
                  // Specifically not if we're in a web worker, or react-native.
                  if (utils.isStandardBrowserEnv()) {
                    var cookies = __webpack_require__(24);

                    // Add xsrf header
                    var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ? cookies.read(config.xsrfCookieName) : undefined;

                    if (xsrfValue) {
                      requestHeaders[config.xsrfHeaderName] = xsrfValue;
                    }
                  }

                  // Add headers to the request
                  if ('setRequestHeader' in request) {
                    utils.forEach(requestHeaders, function setRequestHeader(val, key) {
                      if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
                        // Remove Content-Type if data is undefined
                        delete requestHeaders[key];
                      } else {
                        // Otherwise add header to the request
                        request.setRequestHeader(key, val);
                      }
                    });
                  }

                  // Add withCredentials to request if needed
                  if (config.withCredentials) {
                    request.withCredentials = true;
                  }

                  // Add responseType to request if needed
                  if (config.responseType) {
                    try {
                      request.responseType = config.responseType;
                    } catch (e) {
                      // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
                      // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
                      if (config.responseType !== 'json') {
                        throw e;
                      }
                    }
                  }

                  // Handle progress if needed
                  if (typeof config.onDownloadProgress === 'function') {
                    request.addEventListener('progress', config.onDownloadProgress);
                  }

                  // Not all browsers support upload events
                  if (typeof config.onUploadProgress === 'function' && request.upload) {
                    request.upload.addEventListener('progress', config.onUploadProgress);
                  }

                  if (config.cancelToken) {
                    // Handle cancellation
                    config.cancelToken.promise.then(function onCanceled(cancel) {
                      if (!request) {
                        return;
                      }

                      request.abort();
                      reject(cancel);
                      // Clean up request
                      request = null;
                    });
                  }

                  if (requestData === undefined) {
                    requestData = null;
                  }

                  // Send the request
                  request.send(requestData);
                });
              };

              /***/
            },
            /* 7 */
            /***/function (module, exports, __webpack_require__) {

              "use strict";

              var enhanceError = __webpack_require__(19);

              /**
               * Create an Error with the specified message, config, error code, request and response.
               *
               * @param {string} message The error message.
               * @param {Object} config The config.
               * @param {string} [code] The error code (for example, 'ECONNABORTED').
               * @param {Object} [request] The request.
               * @param {Object} [response] The response.
               * @returns {Error} The created error.
               */
              module.exports = function createError(message, config, code, request, response) {
                var error = new Error(message);
                return enhanceError(error, config, code, request, response);
              };

              /***/
            },
            /* 8 */
            /***/function (module, exports, __webpack_require__) {

              "use strict";

              module.exports = function isCancel(value) {
                return !!(value && value.__CANCEL__);
              };

              /***/
            },
            /* 9 */
            /***/function (module, exports, __webpack_require__) {

              "use strict";

              /**
               * A `Cancel` is an object that is thrown when an operation is canceled.
               *
               * @class
               * @param {string=} message The message.
               */

              function Cancel(message) {
                this.message = message;
              }

              Cancel.prototype.toString = function toString() {
                return 'Cancel' + (this.message ? ': ' + this.message : '');
              };

              Cancel.prototype.__CANCEL__ = true;

              module.exports = Cancel;

              /***/
            },
            /* 10 */
            /***/function (module, exports, __webpack_require__) {

              "use strict";

              Object.defineProperty(exports, "__esModule", {
                value: true
              });
              exports.LoggerInstance = undefined;

              var _createClass = function () {
                function defineProperties(target, props) {
                  for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
                  }
                }return function (Constructor, protoProps, staticProps) {
                  if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
                };
              }();

              var _LoggerDispatcher = __webpack_require__(11);

              var _Constants = __webpack_require__(1);

              function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                  throw new TypeError("Cannot call a class as a function");
                }
              }

              var LoggerInstance = function () {
                function LoggerInstance() {
                  _classCallCheck(this, LoggerInstance);
                }

                _createClass(LoggerInstance, null, [{
                  key: 'Trace',
                  value: function Trace() {
                    for (var _len = arguments.length, msg = Array(_len), _key = 0; _key < _len; _key++) {
                      msg[_key] = arguments[_key];
                    }

                    _LoggerDispatcher.LoggerDispatcher.Dispatch('Trace', msg);
                  }
                }, {
                  key: 'Debug',
                  value: function Debug() {
                    for (var _len2 = arguments.length, msg = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                      msg[_key2] = arguments[_key2];
                    }

                    _LoggerDispatcher.LoggerDispatcher.Dispatch('Debug', msg);
                  }
                }, {
                  key: 'Warning',
                  value: function Warning() {
                    for (var _len3 = arguments.length, msg = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                      msg[_key3] = arguments[_key3];
                    }

                    _LoggerDispatcher.LoggerDispatcher.Dispatch('Warn', msg);
                  }
                }, {
                  key: 'Info',
                  value: function Info() {
                    for (var _len4 = arguments.length, msg = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                      msg[_key4] = arguments[_key4];
                    }

                    _LoggerDispatcher.LoggerDispatcher.Dispatch('Info', msg);
                  }
                }, {
                  key: 'Error',
                  value: function Error() {
                    for (var _len5 = arguments.length, msg = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                      msg[_key5] = arguments[_key5];
                    }

                    _LoggerDispatcher.LoggerDispatcher.Dispatch('Error', msg);
                  }
                }, {
                  key: 'Trace',
                  value: function Trace() {
                    for (var _len6 = arguments.length, msg = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                      msg[_key6] = arguments[_key6];
                    }

                    _LoggerDispatcher.LoggerDispatcher.Dispatch('Trace', msg);
                  }
                }]);

                return LoggerInstance;
              }();

              exports.LoggerInstance = LoggerInstance;

              /***/
            },
            /* 11 */
            /***/function (module, exports, __webpack_require__) {

              "use strict";

              Object.defineProperty(exports, "__esModule", {
                value: true
              });
              exports.LoggerDispatcher = undefined;

              var _createClass = function () {
                function defineProperties(target, props) {
                  for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
                  }
                }return function (Constructor, protoProps, staticProps) {
                  if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
                };
              }();

              var _LoggerRestClient = __webpack_require__(12);

              var _Constants = __webpack_require__(1);

              var _LoggerUtils = __webpack_require__(3);

              var _LoggerConfigurator = __webpack_require__(32);

              function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                  throw new TypeError("Cannot call a class as a function");
                }
              }

              var LoggerDispatcher = function () {
                function LoggerDispatcher() {
                  _classCallCheck(this, LoggerDispatcher);
                }

                _createClass(LoggerDispatcher, null, [{
                  key: 'Dispatch',
                  value: function Dispatch(severity, message) {

                    _LoggerConfigurator.LoggerConfigurator.Init(function () {
                      LoggerDispatcher.DefaultOutput(severity, message);
                      LoggerDispatcher.RemoteOutput(severity, message);
                    });
                  }
                }, {
                  key: 'RemoteOutput',
                  value: function RemoteOutput(severity, message) {
                    if (_Constants.Constants._CONFIGURATIONS["_ENABLE_AJAX"]) {
                      if (_LoggerUtils.LoggerUtils.IsAllowedToLogBySeverity(severity)) {
                        _LoggerRestClient.LoggerRestClient.log(severity, message);
                      }
                    }
                  }
                }, {
                  key: 'DefaultOutput',
                  value: function DefaultOutput(severity, message) {
                    if (_Constants.Constants._CONFIGURATIONS["_ENABLE_DEFAULT"]) {
                      if (_LoggerUtils.LoggerUtils.IsAllowedToLogBySeverity(severity)) {
                        console.log("[" + severity + "]" + _LoggerUtils.LoggerUtils.ToStringMessage(message));
                      }
                    }
                  }
                }]);

                return LoggerDispatcher;
              }();

              exports.LoggerDispatcher = LoggerDispatcher;

              /***/
            },
            /* 12 */
            /***/function (module, exports, __webpack_require__) {

              "use strict";

              Object.defineProperty(exports, "__esModule", {
                value: true
              });
              exports.LoggerRestClient = undefined;

              var _createClass = function () {
                function defineProperties(target, props) {
                  for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
                  }
                }return function (Constructor, protoProps, staticProps) {
                  if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
                };
              }();

              var _Constants = __webpack_require__(1);

              var _LoggerUtils = __webpack_require__(3);

              var _axios = __webpack_require__(4);

              var _axios2 = _interopRequireDefault(_axios);

              function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
              }

              function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                  throw new TypeError("Cannot call a class as a function");
                }
              }

              var LoggerRestClient = function () {
                function LoggerRestClient() {
                  _classCallCheck(this, LoggerRestClient);
                }

                _createClass(LoggerRestClient, null, [{
                  key: 'log',
                  value: function log(severity, message) {
                    if (_Constants.Constants._CONFIGURATIONS["_ENABLE_AJAX"]) {
                      _axios2.default.post(_Constants.Constants._CONFIGURATIONS["_SERVER"] + _Constants.Constants._CONFIGURATIONS["_DOMAIN"], { Message: _LoggerUtils.LoggerUtils.ToStringMessage(message), Severity: severity }).then(function (response) {}).catch(function (error) {
                        console.log("It was not possible to send the message");
                      });
                    }
                  }
                }]);

                return LoggerRestClient;
              }();

              exports.LoggerRestClient = LoggerRestClient;

              /***/
            },
            /* 13 */
            /***/function (module, exports, __webpack_require__) {

              "use strict";

              var utils = __webpack_require__(0);
              var bind = __webpack_require__(5);
              var Axios = __webpack_require__(15);
              var defaults = __webpack_require__(2);

              /**
               * Create an instance of Axios
               *
               * @param {Object} defaultConfig The default config for the instance
               * @return {Axios} A new instance of Axios
               */
              function createInstance(defaultConfig) {
                var context = new Axios(defaultConfig);
                var instance = bind(Axios.prototype.request, context);

                // Copy axios.prototype to instance
                utils.extend(instance, Axios.prototype, context);

                // Copy context to instance
                utils.extend(instance, context);

                return instance;
              }

              // Create the default instance to be exported
              var axios = createInstance(defaults);

              // Expose Axios class to allow class inheritance
              axios.Axios = Axios;

              // Factory for creating new instances
              axios.create = function create(instanceConfig) {
                return createInstance(utils.merge(defaults, instanceConfig));
              };

              // Expose Cancel & CancelToken
              axios.Cancel = __webpack_require__(9);
              axios.CancelToken = __webpack_require__(30);
              axios.isCancel = __webpack_require__(8);

              // Expose all/spread
              axios.all = function all(promises) {
                return Promise.all(promises);
              };
              axios.spread = __webpack_require__(31);

              module.exports = axios;

              // Allow use of default import syntax in TypeScript
              module.exports.default = axios;

              /***/
            },
            /* 14 */
            /***/function (module, exports) {

              /*!
               * Determine if an object is a Buffer
               *
               * @author   Feross Aboukhadijeh <https://feross.org>
               * @license  MIT
               */

              // The _isBuffer check is for Safari 5-7 support, because it's missing
              // Object.prototype.constructor. Remove this eventually
              module.exports = function (obj) {
                return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
              };

              function isBuffer(obj) {
                return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj);
              }

              // For Node v0.10 support. Remove this eventually.
              function isSlowBuffer(obj) {
                return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0));
              }

              /***/
            },
            /* 15 */
            /***/function (module, exports, __webpack_require__) {

              "use strict";

              var defaults = __webpack_require__(2);
              var utils = __webpack_require__(0);
              var InterceptorManager = __webpack_require__(25);
              var dispatchRequest = __webpack_require__(26);

              /**
               * Create a new instance of Axios
               *
               * @param {Object} instanceConfig The default config for the instance
               */
              function Axios(instanceConfig) {
                this.defaults = instanceConfig;
                this.interceptors = {
                  request: new InterceptorManager(),
                  response: new InterceptorManager()
                };
              }

              /**
               * Dispatch a request
               *
               * @param {Object} config The config specific for this request (merged with this.defaults)
               */
              Axios.prototype.request = function request(config) {
                /*eslint no-param-reassign:0*/
                // Allow for axios('example/url'[, config]) a la fetch API
                if (typeof config === 'string') {
                  config = utils.merge({
                    url: arguments[0]
                  }, arguments[1]);
                }

                config = utils.merge(defaults, { method: 'get' }, this.defaults, config);
                config.method = config.method.toLowerCase();

                // Hook up interceptors middleware
                var chain = [dispatchRequest, undefined];
                var promise = Promise.resolve(config);

                this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
                  chain.unshift(interceptor.fulfilled, interceptor.rejected);
                });

                this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
                  chain.push(interceptor.fulfilled, interceptor.rejected);
                });

                while (chain.length) {
                  promise = promise.then(chain.shift(), chain.shift());
                }

                return promise;
              };

              // Provide aliases for supported request methods
              utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
                /*eslint func-names:0*/
                Axios.prototype[method] = function (url, config) {
                  return this.request(utils.merge(config || {}, {
                    method: method,
                    url: url
                  }));
                };
              });

              utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
                /*eslint func-names:0*/
                Axios.prototype[method] = function (url, data, config) {
                  return this.request(utils.merge(config || {}, {
                    method: method,
                    url: url,
                    data: data
                  }));
                };
              });

              module.exports = Axios;

              /***/
            },
            /* 16 */
            /***/function (module, exports) {

              // shim for using process in browser
              var process = module.exports = {};

              // cached from whatever global is present so that test runners that stub it
              // don't break things.  But we need to wrap it in a try catch in case it is
              // wrapped in strict mode code which doesn't define any globals.  It's inside a
              // function because try/catches deoptimize in certain engines.

              var cachedSetTimeout;
              var cachedClearTimeout;

              function defaultSetTimout() {
                throw new Error('setTimeout has not been defined');
              }
              function defaultClearTimeout() {
                throw new Error('clearTimeout has not been defined');
              }
              (function () {
                try {
                  if (typeof setTimeout === 'function') {
                    cachedSetTimeout = setTimeout;
                  } else {
                    cachedSetTimeout = defaultSetTimout;
                  }
                } catch (e) {
                  cachedSetTimeout = defaultSetTimout;
                }
                try {
                  if (typeof clearTimeout === 'function') {
                    cachedClearTimeout = clearTimeout;
                  } else {
                    cachedClearTimeout = defaultClearTimeout;
                  }
                } catch (e) {
                  cachedClearTimeout = defaultClearTimeout;
                }
              })();
              function runTimeout(fun) {
                if (cachedSetTimeout === setTimeout) {
                  //normal enviroments in sane situations
                  return setTimeout(fun, 0);
                }
                // if setTimeout wasn't available but was latter defined
                if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
                  cachedSetTimeout = setTimeout;
                  return setTimeout(fun, 0);
                }
                try {
                  // when when somebody has screwed with setTimeout but no I.E. maddness
                  return cachedSetTimeout(fun, 0);
                } catch (e) {
                  try {
                    // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                    return cachedSetTimeout.call(null, fun, 0);
                  } catch (e) {
                    // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                    return cachedSetTimeout.call(this, fun, 0);
                  }
                }
              }
              function runClearTimeout(marker) {
                if (cachedClearTimeout === clearTimeout) {
                  //normal enviroments in sane situations
                  return clearTimeout(marker);
                }
                // if clearTimeout wasn't available but was latter defined
                if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
                  cachedClearTimeout = clearTimeout;
                  return clearTimeout(marker);
                }
                try {
                  // when when somebody has screwed with setTimeout but no I.E. maddness
                  return cachedClearTimeout(marker);
                } catch (e) {
                  try {
                    // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                    return cachedClearTimeout.call(null, marker);
                  } catch (e) {
                    // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                    // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                    return cachedClearTimeout.call(this, marker);
                  }
                }
              }
              var queue = [];
              var draining = false;
              var currentQueue;
              var queueIndex = -1;

              function cleanUpNextTick() {
                if (!draining || !currentQueue) {
                  return;
                }
                draining = false;
                if (currentQueue.length) {
                  queue = currentQueue.concat(queue);
                } else {
                  queueIndex = -1;
                }
                if (queue.length) {
                  drainQueue();
                }
              }

              function drainQueue() {
                if (draining) {
                  return;
                }
                var timeout = runTimeout(cleanUpNextTick);
                draining = true;

                var len = queue.length;
                while (len) {
                  currentQueue = queue;
                  queue = [];
                  while (++queueIndex < len) {
                    if (currentQueue) {
                      currentQueue[queueIndex].run();
                    }
                  }
                  queueIndex = -1;
                  len = queue.length;
                }
                currentQueue = null;
                draining = false;
                runClearTimeout(timeout);
              }

              process.nextTick = function (fun) {
                var args = new Array(arguments.length - 1);
                if (arguments.length > 1) {
                  for (var i = 1; i < arguments.length; i++) {
                    args[i - 1] = arguments[i];
                  }
                }
                queue.push(new Item(fun, args));
                if (queue.length === 1 && !draining) {
                  runTimeout(drainQueue);
                }
              };

              // v8 likes predictible objects
              function Item(fun, array) {
                this.fun = fun;
                this.array = array;
              }
              Item.prototype.run = function () {
                this.fun.apply(null, this.array);
              };
              process.title = 'browser';
              process.browser = true;
              process.env = {};
              process.argv = [];
              process.version = ''; // empty string to avoid regexp issues
              process.versions = {};

              function noop() {}

              process.on = noop;
              process.addListener = noop;
              process.once = noop;
              process.off = noop;
              process.removeListener = noop;
              process.removeAllListeners = noop;
              process.emit = noop;
              process.prependListener = noop;
              process.prependOnceListener = noop;

              process.listeners = function (name) {
                return [];
              };

              process.binding = function (name) {
                throw new Error('process.binding is not supported');
              };

              process.cwd = function () {
                return '/';
              };
              process.chdir = function (dir) {
                throw new Error('process.chdir is not supported');
              };
              process.umask = function () {
                return 0;
              };

              /***/
            },
            /* 17 */
            /***/function (module, exports, __webpack_require__) {

              "use strict";

              var utils = __webpack_require__(0);

              module.exports = function normalizeHeaderName(headers, normalizedName) {
                utils.forEach(headers, function processHeader(value, name) {
                  if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
                    headers[normalizedName] = value;
                    delete headers[name];
                  }
                });
              };

              /***/
            },
            /* 18 */
            /***/function (module, exports, __webpack_require__) {

              "use strict";

              var createError = __webpack_require__(7);

              /**
               * Resolve or reject a Promise based on response status.
               *
               * @param {Function} resolve A function that resolves the promise.
               * @param {Function} reject A function that rejects the promise.
               * @param {object} response The response.
               */
              module.exports = function settle(resolve, reject, response) {
                var validateStatus = response.config.validateStatus;
                // Note: status is not exposed by XDomainRequest
                if (!response.status || !validateStatus || validateStatus(response.status)) {
                  resolve(response);
                } else {
                  reject(createError('Request failed with status code ' + response.status, response.config, null, response.request, response));
                }
              };

              /***/
            },
            /* 19 */
            /***/function (module, exports, __webpack_require__) {

              "use strict";

              /**
               * Update an Error with the specified config, error code, and response.
               *
               * @param {Error} error The error to update.
               * @param {Object} config The config.
               * @param {string} [code] The error code (for example, 'ECONNABORTED').
               * @param {Object} [request] The request.
               * @param {Object} [response] The response.
               * @returns {Error} The error.
               */

              module.exports = function enhanceError(error, config, code, request, response) {
                error.config = config;
                if (code) {
                  error.code = code;
                }
                error.request = request;
                error.response = response;
                return error;
              };

              /***/
            },
            /* 20 */
            /***/function (module, exports, __webpack_require__) {

              "use strict";

              var utils = __webpack_require__(0);

              function encode(val) {
                return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
              }

              /**
               * Build a URL by appending params to the end
               *
               * @param {string} url The base of the url (e.g., http://www.google.com)
               * @param {object} [params] The params to be appended
               * @returns {string} The formatted url
               */
              module.exports = function buildURL(url, params, paramsSerializer) {
                /*eslint no-param-reassign:0*/
                if (!params) {
                  return url;
                }

                var serializedParams;
                if (paramsSerializer) {
                  serializedParams = paramsSerializer(params);
                } else if (utils.isURLSearchParams(params)) {
                  serializedParams = params.toString();
                } else {
                  var parts = [];

                  utils.forEach(params, function serialize(val, key) {
                    if (val === null || typeof val === 'undefined') {
                      return;
                    }

                    if (utils.isArray(val)) {
                      key = key + '[]';
                    } else {
                      val = [val];
                    }

                    utils.forEach(val, function parseValue(v) {
                      if (utils.isDate(v)) {
                        v = v.toISOString();
                      } else if (utils.isObject(v)) {
                        v = JSON.stringify(v);
                      }
                      parts.push(encode(key) + '=' + encode(v));
                    });
                  });

                  serializedParams = parts.join('&');
                }

                if (serializedParams) {
                  url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
                }

                return url;
              };

              /***/
            },
            /* 21 */
            /***/function (module, exports, __webpack_require__) {

              "use strict";

              var utils = __webpack_require__(0);

              // Headers whose duplicates are ignored by node
              // c.f. https://nodejs.org/api/http.html#http_message_headers
              var ignoreDuplicateOf = ['age', 'authorization', 'content-length', 'content-type', 'etag', 'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since', 'last-modified', 'location', 'max-forwards', 'proxy-authorization', 'referer', 'retry-after', 'user-agent'];

              /**
               * Parse headers into an object
               *
               * ```
               * Date: Wed, 27 Aug 2014 08:58:49 GMT
               * Content-Type: application/json
               * Connection: keep-alive
               * Transfer-Encoding: chunked
               * ```
               *
               * @param {String} headers Headers needing to be parsed
               * @returns {Object} Headers parsed into an object
               */
              module.exports = function parseHeaders(headers) {
                var parsed = {};
                var key;
                var val;
                var i;

                if (!headers) {
                  return parsed;
                }

                utils.forEach(headers.split('\n'), function parser(line) {
                  i = line.indexOf(':');
                  key = utils.trim(line.substr(0, i)).toLowerCase();
                  val = utils.trim(line.substr(i + 1));

                  if (key) {
                    if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
                      return;
                    }
                    if (key === 'set-cookie') {
                      parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
                    } else {
                      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
                    }
                  }
                });

                return parsed;
              };

              /***/
            },
            /* 22 */
            /***/function (module, exports, __webpack_require__) {

              "use strict";

              var utils = __webpack_require__(0);

              module.exports = utils.isStandardBrowserEnv() ?

              // Standard browser envs have full support of the APIs needed to test
              // whether the request URL is of the same origin as current location.
              function standardBrowserEnv() {
                var msie = /(msie|trident)/i.test(navigator.userAgent);
                var urlParsingNode = document.createElement('a');
                var originURL;

                /**
                * Parse a URL to discover it's components
                *
                * @param {String} url The URL to be parsed
                * @returns {Object}
                */
                function resolveURL(url) {
                  var href = url;

                  if (msie) {
                    // IE needs attribute set twice to normalize properties
                    urlParsingNode.setAttribute('href', href);
                    href = urlParsingNode.href;
                  }

                  urlParsingNode.setAttribute('href', href);

                  // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
                  return {
                    href: urlParsingNode.href,
                    protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
                    host: urlParsingNode.host,
                    search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
                    hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
                    hostname: urlParsingNode.hostname,
                    port: urlParsingNode.port,
                    pathname: urlParsingNode.pathname.charAt(0) === '/' ? urlParsingNode.pathname : '/' + urlParsingNode.pathname
                  };
                }

                originURL = resolveURL(window.location.href);

                /**
                * Determine if a URL shares the same origin as the current location
                *
                * @param {String} requestURL The URL to test
                * @returns {boolean} True if URL shares the same origin, otherwise false
                */
                return function isURLSameOrigin(requestURL) {
                  var parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
                  return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
                };
              }() :

              // Non standard browser envs (web workers, react-native) lack needed support.
              function nonStandardBrowserEnv() {
                return function isURLSameOrigin() {
                  return true;
                };
              }();

              /***/
            },
            /* 23 */
            /***/function (module, exports, __webpack_require__) {

              "use strict";

              // btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

              var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

              function E() {
                this.message = 'String contains an invalid character';
              }
              E.prototype = new Error();
              E.prototype.code = 5;
              E.prototype.name = 'InvalidCharacterError';

              function btoa(input) {
                var str = String(input);
                var output = '';
                for (
                // initialize result and counter
                var block, charCode, idx = 0, map = chars;
                // if the next str index does not exist:
                //   change the mapping table to "="
                //   check if d has no fractional digits
                str.charAt(idx | 0) || (map = '=', idx % 1);
                // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
                output += map.charAt(63 & block >> 8 - idx % 1 * 8)) {
                  charCode = str.charCodeAt(idx += 3 / 4);
                  if (charCode > 0xFF) {
                    throw new E();
                  }
                  block = block << 8 | charCode;
                }
                return output;
              }

              module.exports = btoa;

              /***/
            },
            /* 24 */
            /***/function (module, exports, __webpack_require__) {

              "use strict";

              var utils = __webpack_require__(0);

              module.exports = utils.isStandardBrowserEnv() ?

              // Standard browser envs support document.cookie
              function standardBrowserEnv() {
                return {
                  write: function write(name, value, expires, path, domain, secure) {
                    var cookie = [];
                    cookie.push(name + '=' + encodeURIComponent(value));

                    if (utils.isNumber(expires)) {
                      cookie.push('expires=' + new Date(expires).toGMTString());
                    }

                    if (utils.isString(path)) {
                      cookie.push('path=' + path);
                    }

                    if (utils.isString(domain)) {
                      cookie.push('domain=' + domain);
                    }

                    if (secure === true) {
                      cookie.push('secure');
                    }

                    document.cookie = cookie.join('; ');
                  },

                  read: function read(name) {
                    var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
                    return match ? decodeURIComponent(match[3]) : null;
                  },

                  remove: function remove(name) {
                    this.write(name, '', Date.now() - 86400000);
                  }
                };
              }() :

              // Non standard browser env (web workers, react-native) lack needed support.
              function nonStandardBrowserEnv() {
                return {
                  write: function write() {},
                  read: function read() {
                    return null;
                  },
                  remove: function remove() {}
                };
              }();

              /***/
            },
            /* 25 */
            /***/function (module, exports, __webpack_require__) {

              "use strict";

              var utils = __webpack_require__(0);

              function InterceptorManager() {
                this.handlers = [];
              }

              /**
               * Add a new interceptor to the stack
               *
               * @param {Function} fulfilled The function to handle `then` for a `Promise`
               * @param {Function} rejected The function to handle `reject` for a `Promise`
               *
               * @return {Number} An ID used to remove interceptor later
               */
              InterceptorManager.prototype.use = function use(fulfilled, rejected) {
                this.handlers.push({
                  fulfilled: fulfilled,
                  rejected: rejected
                });
                return this.handlers.length - 1;
              };

              /**
               * Remove an interceptor from the stack
               *
               * @param {Number} id The ID that was returned by `use`
               */
              InterceptorManager.prototype.eject = function eject(id) {
                if (this.handlers[id]) {
                  this.handlers[id] = null;
                }
              };

              /**
               * Iterate over all the registered interceptors
               *
               * This method is particularly useful for skipping over any
               * interceptors that may have become `null` calling `eject`.
               *
               * @param {Function} fn The function to call for each interceptor
               */
              InterceptorManager.prototype.forEach = function forEach(fn) {
                utils.forEach(this.handlers, function forEachHandler(h) {
                  if (h !== null) {
                    fn(h);
                  }
                });
              };

              module.exports = InterceptorManager;

              /***/
            },
            /* 26 */
            /***/function (module, exports, __webpack_require__) {

              "use strict";

              var utils = __webpack_require__(0);
              var transformData = __webpack_require__(27);
              var isCancel = __webpack_require__(8);
              var defaults = __webpack_require__(2);
              var isAbsoluteURL = __webpack_require__(28);
              var combineURLs = __webpack_require__(29);

              /**
               * Throws a `Cancel` if cancellation has been requested.
               */
              function throwIfCancellationRequested(config) {
                if (config.cancelToken) {
                  config.cancelToken.throwIfRequested();
                }
              }

              /**
               * Dispatch a request to the server using the configured adapter.
               *
               * @param {object} config The config that is to be used for the request
               * @returns {Promise} The Promise to be fulfilled
               */
              module.exports = function dispatchRequest(config) {
                throwIfCancellationRequested(config);

                // Support baseURL config
                if (config.baseURL && !isAbsoluteURL(config.url)) {
                  config.url = combineURLs(config.baseURL, config.url);
                }

                // Ensure headers exist
                config.headers = config.headers || {};

                // Transform request data
                config.data = transformData(config.data, config.headers, config.transformRequest);

                // Flatten headers
                config.headers = utils.merge(config.headers.common || {}, config.headers[config.method] || {}, config.headers || {});

                utils.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], function cleanHeaderConfig(method) {
                  delete config.headers[method];
                });

                var adapter = config.adapter || defaults.adapter;

                return adapter(config).then(function onAdapterResolution(response) {
                  throwIfCancellationRequested(config);

                  // Transform response data
                  response.data = transformData(response.data, response.headers, config.transformResponse);

                  return response;
                }, function onAdapterRejection(reason) {
                  if (!isCancel(reason)) {
                    throwIfCancellationRequested(config);

                    // Transform response data
                    if (reason && reason.response) {
                      reason.response.data = transformData(reason.response.data, reason.response.headers, config.transformResponse);
                    }
                  }

                  return Promise.reject(reason);
                });
              };

              /***/
            },
            /* 27 */
            /***/function (module, exports, __webpack_require__) {

              "use strict";

              var utils = __webpack_require__(0);

              /**
               * Transform the data for a request or a response
               *
               * @param {Object|String} data The data to be transformed
               * @param {Array} headers The headers for the request or response
               * @param {Array|Function} fns A single function or Array of functions
               * @returns {*} The resulting transformed data
               */
              module.exports = function transformData(data, headers, fns) {
                /*eslint no-param-reassign:0*/
                utils.forEach(fns, function transform(fn) {
                  data = fn(data, headers);
                });

                return data;
              };

              /***/
            },
            /* 28 */
            /***/function (module, exports, __webpack_require__) {

              "use strict";

              /**
               * Determines whether the specified URL is absolute
               *
               * @param {string} url The URL to test
               * @returns {boolean} True if the specified URL is absolute, otherwise false
               */

              module.exports = function isAbsoluteURL(url) {
                // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
                // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
                // by any combination of letters, digits, plus, period, or hyphen.
                return (/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
                );
              };

              /***/
            },
            /* 29 */
            /***/function (module, exports, __webpack_require__) {

              "use strict";

              /**
               * Creates a new URL by combining the specified URLs
               *
               * @param {string} baseURL The base URL
               * @param {string} relativeURL The relative URL
               * @returns {string} The combined URL
               */

              module.exports = function combineURLs(baseURL, relativeURL) {
                return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
              };

              /***/
            },
            /* 30 */
            /***/function (module, exports, __webpack_require__) {

              "use strict";

              var Cancel = __webpack_require__(9);

              /**
               * A `CancelToken` is an object that can be used to request cancellation of an operation.
               *
               * @class
               * @param {Function} executor The executor function.
               */
              function CancelToken(executor) {
                if (typeof executor !== 'function') {
                  throw new TypeError('executor must be a function.');
                }

                var resolvePromise;
                this.promise = new Promise(function promiseExecutor(resolve) {
                  resolvePromise = resolve;
                });

                var token = this;
                executor(function cancel(message) {
                  if (token.reason) {
                    // Cancellation has already been requested
                    return;
                  }

                  token.reason = new Cancel(message);
                  resolvePromise(token.reason);
                });
              }

              /**
               * Throws a `Cancel` if cancellation has been requested.
               */
              CancelToken.prototype.throwIfRequested = function throwIfRequested() {
                if (this.reason) {
                  throw this.reason;
                }
              };

              /**
               * Returns an object that contains a new `CancelToken` and a function that, when called,
               * cancels the `CancelToken`.
               */
              CancelToken.source = function source() {
                var cancel;
                var token = new CancelToken(function executor(c) {
                  cancel = c;
                });
                return {
                  token: token,
                  cancel: cancel
                };
              };

              module.exports = CancelToken;

              /***/
            },
            /* 31 */
            /***/function (module, exports, __webpack_require__) {

              "use strict";

              /**
               * Syntactic sugar for invoking a function and expanding an array for arguments.
               *
               * Common use case would be to use `Function.prototype.apply`.
               *
               *  ```js
               *  function f(x, y, z) {}
               *  var args = [1, 2, 3];
               *  f.apply(null, args);
               *  ```
               *
               * With `spread` this example can be re-written.
               *
               *  ```js
               *  spread(function(x, y, z) {})([1, 2, 3]);
               *  ```
               *
               * @param {Function} callback
               * @returns {Function}
               */

              module.exports = function spread(callback) {
                return function wrap(arr) {
                  return callback.apply(null, arr);
                };
              };

              /***/
            },
            /* 32 */
            /***/function (module, exports, __webpack_require__) {

              "use strict";

              Object.defineProperty(exports, "__esModule", {
                value: true
              });
              exports.LoggerConfigurator = undefined;

              var _createClass = function () {
                function defineProperties(target, props) {
                  for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
                  }
                }return function (Constructor, protoProps, staticProps) {
                  if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
                };
              }();

              var _Constants = __webpack_require__(1);

              var _axios = __webpack_require__(4);

              var _axios2 = _interopRequireDefault(_axios);

              function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
              }

              function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                  throw new TypeError("Cannot call a class as a function");
                }
              }

              var LoggerConfigurator = function () {
                function LoggerConfigurator() {
                  _classCallCheck(this, LoggerConfigurator);
                }

                _createClass(LoggerConfigurator, null, [{
                  key: 'Init',
                  value: function Init(callback) {
                    if (LoggerConfigurator.IsConfigurationNotAssigned()) {
                      LoggerConfigurator.GetByExecutionEnvironment(callback);
                    } else {
                      callback();
                    }
                  }
                }, {
                  key: 'Setup',
                  value: function Setup(configuration, callback) {
                    if (null !== configuration) {
                      Object.keys(configuration).forEach(function (key) {
                        return _Constants.Constants._CONFIGURATIONS[key] = configuration[key];
                      });
                    } else {
                      console.log('Logger will use default configuration ... ');
                    }

                    _Constants.Constants._LOGGER_CONFIGURATION_ASSIGNED = true;
                    callback();
                  }
                }, {
                  key: 'GetByExecutionEnvironment',
                  value: function GetByExecutionEnvironment(callback) {

                    if (LoggerConfigurator.IsRunningOnServer()) {
                      LoggerConfigurator.GetLocal(callback);
                    } else {
                      LoggerConfigurator.GetRemote(callback);
                    }
                  }
                }, {
                  key: 'IsRunningOnServer',
                  value: function IsRunningOnServer() {
                    return typeof window === 'undefined';
                  }
                }, {
                  key: 'GetLocal',
                  value: function GetLocal(callback) {
                    LoggerConfigurator.Setup(null, callback);
                  }
                }, {
                  key: 'GetRemote',
                  value: function GetRemote(callback) {

                    var configuration = null;
                    var remoteLocation = window.location + "";
                    var remoteSplit = remoteLocation.split('/');
                    remoteLocation = remoteLocation.replace(remoteSplit[remoteSplit.length - 1], '');
                    remoteLocation = remoteLocation + _Constants.Constants._LOGGER_CONFIGURATION_FILE_REMOTE;

                    _axios2.default.get(remoteLocation, { responseType: 'json' }).then(function (response) {
                      LoggerConfigurator.Setup(response.data, callback);
                    }).catch(function (error) {
                      console.log("It was not possible to get remote file configuration");
                      LoggerConfigurator.Setup(null, callback);
                    });
                  }
                }, {
                  key: 'ExistExternalConfiguration',
                  value: function ExistExternalConfiguration(configuration) {
                    return null !== configuration;
                  }
                }, {
                  key: 'IsConfigurationNotAssigned',
                  value: function IsConfigurationNotAssigned() {
                    return !_Constants.Constants._LOGGER_CONFIGURATION_ASSIGNED;
                  }
                }]);

                return LoggerConfigurator;
              }();

              exports.LoggerConfigurator = LoggerConfigurator;

              /***/
            }]
            /******/)
          );
        });
        //# sourceMappingURL=global-logger-services-js-bundle.js.map
        /* WEBPACK VAR INJECTION */
      }).call(exports, __webpack_require__(4)(module));

      /***/
    },
    /* 4 */
    /***/function (module, exports) {

      module.exports = function (module) {
        if (!module.webpackPolyfill) {
          module.deprecate = function () {};
          module.paths = [];
          // module.parent = undefined by default
          if (!module.children) module.children = [];
          Object.defineProperty(module, "loaded", {
            enumerable: true,
            get: function get() {
              return module.l;
            }
          });
          Object.defineProperty(module, "id", {
            enumerable: true,
            get: function get() {
              return module.i;
            }
          });
          module.webpackPolyfill = 1;
        }
        return module;
      };

      /***/
    }]
    /******/)
  );
});
//# sourceMappingURL=global-web-socket-client-js-bundle.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)(module)))

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.galateaMessageService = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _strategyMessages = __webpack_require__(6);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var galateaMessageService = exports.galateaMessageService = function () {
    function galateaMessageService() {
        _classCallCheck(this, galateaMessageService);
    }

    _createClass(galateaMessageService, null, [{
        key: 'newMessage',
        value: function newMessage(message) {
            var json = JSON.parse(message.data);
            if (_strategyMessages.STRATEGY_MESSAGES[json.action]) {
                _strategyMessages.STRATEGY_MESSAGES[json.action](json);
            }
        }
    }]);

    return galateaMessageService;
}();

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.STRATEGY_MESSAGES = undefined;

var _singletonWebSocket = __webpack_require__(0);

var _strategyChat = __webpack_require__(7);

var _strategyAssistedTransfer = __webpack_require__(8);

var _strategyDispositon = __webpack_require__(9);

var _strategyManualCall = __webpack_require__(10);

var _strategyCallFlow = __webpack_require__(11);

var _strategyOngoingCallIvr = __webpack_require__(12);

var STRATEGY_MESSAGES = exports.STRATEGY_MESSAGES = {
    "getUnavailables": function getUnavailables(json) {
        onUnavailableTypes(json.array);
    },
    "agentStatusChange": function agentStatusChange(json) {
        _singletonWebSocket.SingletonWebSocket.currentStatus = json.data.currentState;
        onAgentStatus(json.data);
    },
    "dataCall": function dataCall(json) {
        _singletonWebSocket.SingletonWebSocket.dataCall = json.data;
    },
    "extraDataCall": function extraDataCall(json) {
        _singletonWebSocket.SingletonWebSocket.dataCall = json.data;
    },
    "Chat": function Chat(json) {
        if (_strategyChat.STRATEGY_CHAT[json.subaction]) {
            _strategyChat.STRATEGY_CHAT[json.subaction](json);
        }
    },
    "AssistedTransfer": function AssistedTransfer(json) {
        if (_strategyAssistedTransfer.STRATEGY_ASSISTED_TRANSFER[json.subaction]) {
            _strategyAssistedTransfer.STRATEGY_ASSISTED_TRANSFER[json.subaction](json);
        }
    },
    "TransferOption": function TransferOption(json) {
        onTransferOptions(json);
    },
    "onUnavailableHistory": function (_onUnavailableHistory) {
        function onUnavailableHistory(_x) {
            return _onUnavailableHistory.apply(this, arguments);
        }

        onUnavailableHistory.toString = function () {
            return _onUnavailableHistory.toString();
        };

        return onUnavailableHistory;
    }(function (json) {
        onUnavailableHistory(json.data);
    }),
    "onCampaigns": function (_onCampaigns) {
        function onCampaigns(_x2) {
            return _onCampaigns.apply(this, arguments);
        }

        onCampaigns.toString = function () {
            return _onCampaigns.toString();
        };

        return onCampaigns;
    }(function (json) {
        onCampaigns(json.data);
    }),
    "onCallHistory": function (_onCallHistory) {
        function onCallHistory(_x3) {
            return _onCallHistory.apply(this, arguments);
        }

        onCallHistory.toString = function () {
            return _onCallHistory.toString();
        };

        return onCallHistory;
    }(function (json) {
        onCallHistory(json);
    }),
    "Disposition": function Disposition(json) {
        if (_strategyDispositon.STRATEGY_DISPOSITION[json.subaction]) {
            _strategyDispositon.STRATEGY_DISPOSITION[json.subaction](json);
        }
    },
    "CallBar": function CallBar(json) {
        if (STRATEGY_CALL_BAR[json.subaction]) {
            STRATEGY_CALL_BAR[json.subaction](json);
        }
    },
    "ManualCall": function ManualCall(json) {
        if (_strategyManualCall.STRATEGY_MANUAL_CALL[json.subaction]) {
            _strategyManualCall.STRATEGY_MANUAL_CALL[json.subaction](json);
        }
    },
    "onLogin": function (_onLogin) {
        function onLogin() {
            return _onLogin.apply(this, arguments);
        }

        onLogin.toString = function () {
            return _onLogin.toString();
        };

        return onLogin;
    }(function () {
        onLogin();
    }),
    "onLogOut": function (_onLogOut) {
        function onLogOut() {
            return _onLogOut.apply(this, arguments);
        }

        onLogOut.toString = function () {
            return _onLogOut.toString();
        };

        return onLogOut;
    }(function () {
        _singletonWebSocket.SingletonWebSocket.currentStatus = "logout";
        var logoutState = { currentState: _singletonWebSocket.SingletonWebSocket.currentStatus };
        onAgentStatus(logoutState);
        onLogOut();
    }),
    "CallFlow": function CallFlow(json) {
        if (_strategyCallFlow.STRATEGY_CALL_FLOW[json.subaction]) {
            _strategyCallFlow.STRATEGY_CALL_FLOW[json.subaction](json);
        }
    },
    "GetAgentID": function GetAgentID(json) {
        agentId(json);
    },
    "GetUserName": function GetUserName(json) {
        userName(json);
    },
    "GetExtension": function GetExtension(json) {
        extension(json);
    },
    "onCallEnds": function (_onCallEnds) {
        function onCallEnds(_x4) {
            return _onCallEnds.apply(this, arguments);
        }

        onCallEnds.toString = function () {
            return _onCallEnds.toString();
        };

        return onCallEnds;
    }(function (message) {
        onCallEnds(message.data);
    }),
    "onDialingNumber": function (_onDialingNumber) {
        function onDialingNumber(_x5) {
            return _onDialingNumber.apply(this, arguments);
        }

        onDialingNumber.toString = function () {
            return _onDialingNumber.toString();
        };

        return onDialingNumber;
    }(function (message) {
        onDialingNumber(message.data);
    }),
    "onPasswordUpdated": function (_onPasswordUpdated) {
        function onPasswordUpdated() {
            return _onPasswordUpdated.apply(this, arguments);
        }

        onPasswordUpdated.toString = function () {
            return _onPasswordUpdated.toString();
        };

        return onPasswordUpdated;
    }(function () {
        onPasswordUpdated();
    }),
    "errorOnPasswordChange": function (_errorOnPasswordChange) {
        function errorOnPasswordChange(_x6) {
            return _errorOnPasswordChange.apply(this, arguments);
        }

        errorOnPasswordChange.toString = function () {
            return _errorOnPasswordChange.toString();
        };

        return errorOnPasswordChange;
    }(function (message) {
        errorOnPasswordChange(message.data);
    }),
    "onErrorPasswordUpdate": function (_onErrorPasswordUpdate) {
        function onErrorPasswordUpdate(_x7) {
            return _onErrorPasswordUpdate.apply(this, arguments);
        }

        onErrorPasswordUpdate.toString = function () {
            return _onErrorPasswordUpdate.toString();
        };

        return onErrorPasswordUpdate;
    }(function (message) {
        onErrorPasswordUpdate(message.data);
    }),
    "remoteLoginError": function (_remoteLoginError) {
        function remoteLoginError(_x8) {
            return _remoteLoginError.apply(this, arguments);
        }

        remoteLoginError.toString = function () {
            return _remoteLoginError.toString();
        };

        return remoteLoginError;
    }(function (message) {
        remoteLoginError(message.data);
    }),
    "onCallsOnQueue": function (_onCallsOnQueue) {
        function onCallsOnQueue(_x9) {
            return _onCallsOnQueue.apply(this, arguments);
        }

        onCallsOnQueue.toString = function () {
            return _onCallsOnQueue.toString();
        };

        return onCallsOnQueue;
    }(function (message) {
        onCallsOnQueue(message.data);
    }),
    "errorOnUnavailableStatus": function (_errorOnUnavailableStatus) {
        function errorOnUnavailableStatus(_x10) {
            return _errorOnUnavailableStatus.apply(this, arguments);
        }

        errorOnUnavailableStatus.toString = function () {
            return _errorOnUnavailableStatus.toString();
        };

        return errorOnUnavailableStatus;
    }(function (message) {
        errorOnUnavailableStatus(message.data);
    }),
    "errorOnUnavailableStatusHistory": function (_errorOnUnavailableStatusHistory) {
        function errorOnUnavailableStatusHistory(_x11) {
            return _errorOnUnavailableStatusHistory.apply(this, arguments);
        }

        errorOnUnavailableStatusHistory.toString = function () {
            return _errorOnUnavailableStatusHistory.toString();
        };

        return errorOnUnavailableStatusHistory;
    }(function (message) {
        errorOnUnavailableStatusHistory(message.data);
    }),
    "errorOnCampaignsRelated": function (_errorOnCampaignsRelated) {
        function errorOnCampaignsRelated(_x12) {
            return _errorOnCampaignsRelated.apply(this, arguments);
        }

        errorOnCampaignsRelated.toString = function () {
            return _errorOnCampaignsRelated.toString();
        };

        return errorOnCampaignsRelated;
    }(function (message) {
        errorOnCampaignsRelated(message.data);
    }),
    "errorOnDialProcess": function (_errorOnDialProcess) {
        function errorOnDialProcess(_x13) {
            return _errorOnDialProcess.apply(this, arguments);
        }

        errorOnDialProcess.toString = function () {
            return _errorOnDialProcess.toString();
        };

        return errorOnDialProcess;
    }(function (message) {
        errorOnDialProcess(message.data);
    }),
    "errorOnDispositionList": function (_errorOnDispositionList) {
        function errorOnDispositionList(_x14) {
            return _errorOnDispositionList.apply(this, arguments);
        }

        errorOnDispositionList.toString = function () {
            return _errorOnDispositionList.toString();
        };

        return errorOnDispositionList;
    }(function (message) {
        errorOnDispositionList(message.data);
    }),
    "errorOnDispositionSelected": function (_errorOnDispositionSelected) {
        function errorOnDispositionSelected(_x15) {
            return _errorOnDispositionSelected.apply(this, arguments);
        }

        errorOnDispositionSelected.toString = function () {
            return _errorOnDispositionSelected.toString();
        };

        return errorOnDispositionSelected;
    }(function (message) {
        errorOnDispositionSelected(message.data);
    }),
    "errorOnDispositionsPhonesList": function (_errorOnDispositionsPhonesList) {
        function errorOnDispositionsPhonesList(_x16) {
            return _errorOnDispositionsPhonesList.apply(this, arguments);
        }

        errorOnDispositionsPhonesList.toString = function () {
            return _errorOnDispositionsPhonesList.toString();
        };

        return errorOnDispositionsPhonesList;
    }(function (message) {
        errorOnDispositionsPhonesList(message.data);
    }),
    "errorOnPhoneNumbersList": function (_errorOnPhoneNumbersList) {
        function errorOnPhoneNumbersList(_x17) {
            return _errorOnPhoneNumbersList.apply(this, arguments);
        }

        errorOnPhoneNumbersList.toString = function () {
            return _errorOnPhoneNumbersList.toString();
        };

        return errorOnPhoneNumbersList;
    }(function (message) {
        errorOnPhoneNumbersList(message.data);
    }),
    "errorOnCallHistory": function (_errorOnCallHistory) {
        function errorOnCallHistory(_x18) {
            return _errorOnCallHistory.apply(this, arguments);
        }

        errorOnCallHistory.toString = function () {
            return _errorOnCallHistory.toString();
        };

        return errorOnCallHistory;
    }(function (message) {
        errorOnCallHistory(message.data);
    }),
    "OngoingCallIvr": function OngoingCallIvr(json) {
        if (_strategyOngoingCallIvr.STRATEGY_ONGOING_CALL_IVR[json.subaction]) {
            _strategyOngoingCallIvr.STRATEGY_ONGOING_CALL_IVR[json.subaction](json);
        }
    }
    //"onReprogramCall"(DispositionResult) {
    //     console.log("onReprogramCall");
    //    createTrigger.trigger("onReprogramCall", DispositionResult);
    //}
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var STRATEGY_CHAT = exports.STRATEGY_CHAT = {
    "SupervisorsToChat": function SupervisorsToChat(json) {
        onAdministrators(json.data);
    },
    "NewMessage": function NewMessage(json) {
        onChatMessage(json.data);
    },
    "errorOnChatAdministratorsList": function (_errorOnChatAdministratorsList) {
        function errorOnChatAdministratorsList(_x) {
            return _errorOnChatAdministratorsList.apply(this, arguments);
        }

        errorOnChatAdministratorsList.toString = function () {
            return _errorOnChatAdministratorsList.toString();
        };

        return errorOnChatAdministratorsList;
    }(function (json) {
        errorOnChatAdministratorsList(json.data);
    })
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var STRATEGY_ASSISTED_TRANSFER = exports.STRATEGY_ASSISTED_TRANSFER = {
  "onSecondCallConected": function (_onSecondCallConected) {
    function onSecondCallConected() {
      return _onSecondCallConected.apply(this, arguments);
    }

    onSecondCallConected.toString = function () {
      return _onSecondCallConected.toString();
    };

    return onSecondCallConected;
  }(function () {
    onSecondCallConected();
  }),
  "onSecondCallHangUp": function (_onSecondCallHangUp) {
    function onSecondCallHangUp() {
      return _onSecondCallHangUp.apply(this, arguments);
    }

    onSecondCallHangUp.toString = function () {
      return _onSecondCallHangUp.toString();
    };

    return onSecondCallHangUp;
  }(function () {
    onSecondCallHangUp();
  }),
  "onSecondCall": function (_onSecondCall) {
    function onSecondCall(_x) {
      return _onSecondCall.apply(this, arguments);
    }

    onSecondCall.toString = function () {
      return _onSecondCall.toString();
    };

    return onSecondCall;
  }(function (json) {
    onSecondCall(json.data);
  })
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var STRATEGY_DISPOSITION = exports.STRATEGY_DISPOSITION = {
  "onDispositions": function (_onDispositions) {
    function onDispositions(_x) {
      return _onDispositions.apply(this, arguments);
    }

    onDispositions.toString = function () {
      return _onDispositions.toString();
    };

    return onDispositions;
  }(function (json) {
    onDispositions(json.data);
  }),
  "onDisposeApplied": function (_onDisposeApplied) {
    function onDisposeApplied() {
      return _onDisposeApplied.apply(this, arguments);
    }

    onDisposeApplied.toString = function () {
      return _onDisposeApplied.toString();
    };

    return onDisposeApplied;
  }(function () {
    onDisposeApplied();
  }),
  "onPhoneNumbers": function (_onPhoneNumbers) {
    function onPhoneNumbers(_x2) {
      return _onPhoneNumbers.apply(this, arguments);
    }

    onPhoneNumbers.toString = function () {
      return _onPhoneNumbers.toString();
    };

    return onPhoneNumbers;
  }(function (json) {
    onPhoneNumbers(json.data);
  }),
  "onReprogramCall": function (_onReprogramCall) {
    function onReprogramCall(_x3) {
      return _onReprogramCall.apply(this, arguments);
    }

    onReprogramCall.toString = function () {
      return _onReprogramCall.toString();
    };

    return onReprogramCall;
  }(function (json) {
    onReprogramCall(json.data);
  }),
  "onReprogramSuccess": function (_onReprogramSuccess) {
    function onReprogramSuccess() {
      return _onReprogramSuccess.apply(this, arguments);
    }

    onReprogramSuccess.toString = function () {
      return _onReprogramSuccess.toString();
    };

    return onReprogramSuccess;
  }(function () {
    onReprogramSuccess();
  }),
  "onDispositionsAndNumbers": function (_onDispositionsAndNumbers) {
    function onDispositionsAndNumbers(_x4) {
      return _onDispositionsAndNumbers.apply(this, arguments);
    }

    onDispositionsAndNumbers.toString = function () {
      return _onDispositionsAndNumbers.toString();
    };

    return onDispositionsAndNumbers;
  }(function (json) {
    onDispositionsAndNumbers(json.data);
  }),
  "errorOnDispose": function (_errorOnDispose) {
    function errorOnDispose(_x5) {
      return _errorOnDispose.apply(this, arguments);
    }

    errorOnDispose.toString = function () {
      return _errorOnDispose.toString();
    };

    return errorOnDispose;
  }(function (json) {
    errorOnDispose(json.data);
  })
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var STRATEGY_MANUAL_CALL = exports.STRATEGY_MANUAL_CALL = {
    "wrongNumber": function (_wrongNumber) {
        function wrongNumber(_x) {
            return _wrongNumber.apply(this, arguments);
        }

        wrongNumber.toString = function () {
            return _wrongNumber.toString();
        };

        return wrongNumber;
    }(function (json) {
        wrongNumber(json.data);
    }),
    "onDialResult": function (_onDialResult) {
        function onDialResult(_x2) {
            return _onDialResult.apply(this, arguments);
        }

        onDialResult.toString = function () {
            return _onDialResult.toString();
        };

        return onDialResult;
    }(function (json) {
        onDialResult(json.data);
    }),
    "numberOnDoNotCallList": function (_numberOnDoNotCallList) {
        function numberOnDoNotCallList() {
            return _numberOnDoNotCallList.apply(this, arguments);
        }

        numberOnDoNotCallList.toString = function () {
            return _numberOnDoNotCallList.toString();
        };

        return numberOnDoNotCallList;
    }(function () {
        numberOnDoNotCallList();
    }),
    "timeZoneNumber": function (_timeZoneNumber) {
        function timeZoneNumber(_x3) {
            return _timeZoneNumber.apply(this, arguments);
        }

        timeZoneNumber.toString = function () {
            return _timeZoneNumber.toString();
        };

        return timeZoneNumber;
    }(function (json) {
        timeZoneNumber(json.data.number);
    })
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.STRATEGY_CALL_FLOW = undefined;

var _singletonWebSocket = __webpack_require__(0);

var STRATEGY_CALL_FLOW = exports.STRATEGY_CALL_FLOW = {
    "onCallRecieved": function (_onCallRecieved) {
        function onCallRecieved(_x) {
            return _onCallRecieved.apply(this, arguments);
        }

        onCallRecieved.toString = function () {
            return _onCallRecieved.toString();
        };

        return onCallRecieved;
    }(function (json) {
        _singletonWebSocket.SingletonWebSocket.dataCall = json.data;
        onCallRecieved(json.data);
    })
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var STRATEGY_ONGOING_CALL_IVR = exports.STRATEGY_ONGOING_CALL_IVR = {
    "onIVRList": function (_onIVRList) {
        function onIVRList(_x) {
            return _onIVRList.apply(this, arguments);
        }

        onIVRList.toString = function () {
            return _onIVRList.toString();
        };

        return onIVRList;
    }(function (json) {
        onIVRList(json.data);
    }),
    "onIdleStart": function (_onIdleStart) {
        function onIdleStart(_x2) {
            return _onIdleStart.apply(this, arguments);
        }

        onIdleStart.toString = function () {
            return _onIdleStart.toString();
        };

        return onIdleStart;
    }(function (json) {
        onIdleStart(json.data);
    }),
    "onIdleEnd": function (_onIdleEnd) {
        function onIdleEnd(_x3) {
            return _onIdleEnd.apply(this, arguments);
        }

        onIdleEnd.toString = function () {
            return _onIdleEnd.toString();
        };

        return onIdleEnd;
    }(function (json) {
        onIdleEnd(json.data);
    })
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var instance = null;

var IntegrationAPI = exports.IntegrationAPI = function () {
    function IntegrationAPI(params) {
        _classCallCheck(this, IntegrationAPI);

        if (!instance) {
            //this.Parameters  is an object wich contains all instances of service classes
            this.Parameters = params;
            this.WSParameters = {
                server: "",
                port: "",
                sendKeepAlive: true,
                secureConnection: false
            };
        }
        return instance;
    }

    _createClass(IntegrationAPI, [{
        key: "connectToServer",
        value: function connectToServer() {
            var _this = this;

            this.Parameters.SingletonWebSocket.setwsServer(this.WSParameters.server);
            var port = this.WSParameters.port ? this.WSParameters.port : "1337";
            this.Parameters.SingletonWebSocket.setPort(port);
            this.Parameters.SingletonWebSocket.setKeepAlive(this.WSParameters.sendKeepAlive);
            setTimeout(function () {
                _this.Parameters.SingletonWebSocket.connect(_this.WSParameters.secureConnection);
            }, 25);
        }
    }, {
        key: "disconnectToServer",
        value: function disconnectToServer() {
            this.Parameters.SingletonWebSocket.close();
        }
    }, {
        key: "getIpAddress",
        value: function getIpAddress() {
            return this.Parameters.SingletonWebSocket._ip;
        }
    }, {
        key: "login",
        value: function login(username, password) {
            this.Parameters.loginService.login(username, password);
        }
    }, {
        key: "closeSession",
        value: function closeSession() {
            this.Parameters.loginService.CloseSession();
        }
    }, {
        key: "SetReady",
        value: function SetReady() {
            this.Parameters.loginService.SetReady();
        }
    }, {
        key: "SetAvailable",
        value: function SetAvailable() {
            this.Parameters.loginService.SetReady();
        }
    }, {
        key: "makeManualCall",
        value: function makeManualCall(phoneNum, campID, clientName, callKey) {
            this.Parameters.callService.makeManualCall(phoneNum, campID, clientName, callKey);
        }
    }, {
        key: "HangUpCall",
        value: function HangUpCall() {
            this.Parameters.callService.HangUpCall();
        }
    }, {
        key: "HangUpManualDial",
        value: function HangUpManualDial() {
            this.Parameters.callService.HangUpManualDial();
        }
    }, {
        key: "HangUpAndLeaveMessage",
        value: function HangUpAndLeaveMessage() {
            this.Parameters.callService.HangUpAndLeaveMessage();
        }
    }, {
        key: "getUnavailables",
        value: function getUnavailables() {
            this.Parameters.notAvailableService.getUnavailables();
        }
    }, {
        key: "setOnUnavailableStatus",
        value: function setOnUnavailableStatus(unavailableID) {
            this.Parameters.notAvailableService.setUnavailable(unavailableID);
        }
    }, {
        key: "setUnavailable",
        value: function setUnavailable(unavailableID) {
            this.Parameters.notAvailableService.setUnavailable(unavailableID);
        }
    }, {
        key: "assistedDialNumber",
        value: function assistedDialNumber(phone) {
            this.Parameters.assistedTransferService.assistedDialNumber(phone);
        }
    }, {
        key: "assistedXFerUseSecondCall",
        value: function assistedXFerUseSecondCall() {
            this.Parameters.assistedTransferService.assistedXFerUseSecondCall();
        }
    }, {
        key: "assistedXFerUseMainCall",
        value: function assistedXFerUseMainCall() {
            this.Parameters.assistedTransferService.assistedXFerUseMainCall();
        }
    }, {
        key: "assistedXFerHangUP",
        value: function assistedXFerHangUP() {
            this.Parameters.assistedTransferService.assistedXFerHangUP();
        }
    }, {
        key: "assistedXFerTransferCalls",
        value: function assistedXFerTransferCalls() {
            this.Parameters.assistedTransferService.assistedXFerTransferCalls();
        }
    }, {
        key: "assistedXFerDropFirstCall",
        value: function assistedXFerDropFirstCall() {
            this.Parameters.assistedTransferService.assistedXFerDropFirstCall();
        }
    }, {
        key: "assistedXFerDropSecondCall",
        value: function assistedXFerDropSecondCall() {
            this.Parameters.assistedTransferService.assistedXFerDropSecondCall();
        }
    }, {
        key: "assistedXFerMakeConference",
        value: function assistedXFerMakeConference() {
            this.Parameters.assistedTransferService.assistedXFerMakeConference();
        }
    }, {
        key: "assistedXFerLeaveConference",
        value: function assistedXFerLeaveConference() {
            this.Parameters.assistedTransferService.assistedXFerLeaveConference();
        }
    }, {
        key: "getLastCallData",
        value: function getLastCallData() {
            return this.Parameters.SingletonWebSocket.dataCall;
        }
        //callBar

    }, {
        key: "DTMFDigit",
        value: function DTMFDigit(digit) {
            this.Parameters.callBarService.DTMFDigit(digit);
        }
    }, {
        key: "controlVolume",
        value: function controlVolume(deviceType, xVol) {
            this.Parameters.callBarService.controlVolume(deviceType, xVol);
        }
    }, {
        key: "volumeControl",
        value: function volumeControl(deviceType, xVol) {
            this.Parameters.callBarService.controlVolume(deviceType, xVol);
        }
    }, {
        key: "SetMute",
        value: function SetMute(value) {
            this.Parameters.callBarService.SetMute(value);
        }
    }, {
        key: "HoldCall",
        value: function HoldCall() {
            this.Parameters.callBarService.HoldCall();
        }
    }, {
        key: "addMark",
        value: function addMark() {
            this.Parameters.callBarService.addMark();
        }
    }, {
        key: "updateDataCall",
        value: function updateDataCall(callOutID, data1, data2, data3, data4, data5) {
            this.Parameters.callService.UpdateDataCall(callOutID, data1, data2, data3, data4, data5);
        }
    }, {
        key: "updateCallData",
        value: function updateCallData(callOutID, data1, data2, data3, data4, data5) {
            this.Parameters.callService.UpdateDataCall(callOutID, data1, data2, data3, data4, data5);
        }
    }, {
        key: "getSupervisorsToChat",
        value: function getSupervisorsToChat() {
            this.Parameters.chatService.getSupervisorsToChat();
        }
    }, {
        key: "getTransfersOptions",
        value: function getTransfersOptions() {
            this.Parameters.callService.getTransfersOptions();
        }
    }, {
        key: "sendClientChatMessage",
        value: function sendClientChatMessage(chatID, message) {
            this.Parameters.chatService.sendClientChatMessage(chatID, message);
        }
    }, {
        key: "transferCallToACD",
        value: function transferCallToACD(transferCallToACDid) {
            this.Parameters.callService.transferCallToACD(transferCallToACDid);
        }
    }, {
        key: "transferCallToAgent",
        value: function transferCallToAgent(transferCallToAgentId) {
            this.Parameters.callService.transferCallToAgent(transferCallToAgentId);
        }
    }, {
        key: "transferCallToPhoneNumber",
        value: function transferCallToPhoneNumber(transferCallToPhone) {
            this.Parameters.callService.transferCallToPhoneNumber(transferCallToPhone);
        }
    }, {
        key: "getunavalibaleHistory",
        value: function getunavalibaleHistory() {
            this.Parameters.notAvailableService.getunavalibaleHistory();
        }
    }, {
        key: "GetCampaignsRelated",
        value: function GetCampaignsRelated() {
            this.Parameters.callService.GetCampaignsRelated();
        }
    }, {
        key: "getCallHistory",
        value: function getCallHistory() {
            this.Parameters.callLog.getCallHistory();
        }
    }, {
        key: "getCampaignDispositions",
        value: function getCampaignDispositions(campaignId) {
            this.Parameters.dispositionCallService.getCampaignDispositions(campaignId);
        }
    }, {
        key: "disposeCampaingCall",
        value: function disposeCampaingCall(dispositionId, camId, callID, subId) {
            this.Parameters.dispositionCallService.disposeCampaingCall(dispositionId, camId, callID, subId);
        }
    }, {
        key: "getACDDispositions",
        value: function getACDDispositions(acdId) {
            this.Parameters.dispositionCallService.getACDDispositions(acdId);
        }
    }, {
        key: "disposeACDCall",
        value: function disposeACDCall(dispositionId, callID, subId) {
            this.Parameters.dispositionCallService.disposeACDCall(dispositionId, callID, subId);
        }
    }, {
        key: "dispositionACDCall",
        value: function dispositionACDCall(dispositionId, callID, subId) {
            this.Parameters.dispositionCallService.disposeACDCall(dispositionId, callID, subId);
        }
    }, {
        key: "GetAgentID",
        value: function GetAgentID() {
            this.Parameters.agentDataService.GetAgentID();
        }
    }, {
        key: "GetUserName",
        value: function GetUserName() {
            this.Parameters.agentDataService.GetUserName();
        }
    }, {
        key: "GetExtension",
        value: function GetExtension() {
            this.Parameters.agentDataService.GetExtension();
        }
    }, {
        key: "ChangePassword",
        value: function ChangePassword(aCurrentPassword, aNewPassword) {
            this.Parameters.loginService.ChangePassword(aCurrentPassword, aNewPassword);
        }
    }, {
        key: "getCampaignDispositionsAndNumbers",
        value: function getCampaignDispositionsAndNumbers(idCampaign, callOutID) {
            this.Parameters.reprogamCallService.getCampaignDispositionsAndNumbers(idCampaign, callOutID);
        }
    }, {
        key: "reprogramCampaignCall",
        value: function reprogramCampaignCall(idCampaign, idDisposition, callID, dateCallBack, telephone, existingNumber, subId) {
            this.Parameters.reprogamCallService.reprogramCampaignCall(idCampaign, idDisposition, callID, dateCallBack, telephone, existingNumber, subId);
        }
    }, {
        key: "reprogramAcdCall",
        value: function reprogramAcdCall(idACD, idDisposition, callID, dateCallBack, telephone, callKey, data1, data2, data3, data4, data5, existNum, subId) {
            this.Parameters.reprogamCallService.reprogramAcdCall(idDisposition, callID, subId);
        }
    }, {
        key: "CallBackAcd",
        value: function CallBackAcd(idCampaign, idDisposition, callID, dateCallBack, telephone, callKey, data1, data2, data3, data4, data5, existNum, subDis) {
            this.Parameters.reprogamCallService.CallBackAcd(idCampaign, idDisposition, callID, dateCallBack, telephone, callKey, data1, data2, data3, data4, data5, existNum, subDis);
        }
    }, {
        key: "getPhoneNumbers",
        value: function getPhoneNumbers(callOutID) {
            this.Parameters.reprogamCallService.getPhoneNumbers(callOutID);
        }
    }, {
        key: "recordingStopStart",
        value: function recordingStopStart() {
            this.Parameters.callBarService.recordingStopStart();
        }
    }, {
        key: "idleStart",
        value: function idleStart(IVRId) {
            this.Parameters.ongoingCallIvrService.idleStart(IVRId);
        }
    }, {
        key: "getIVRList",
        value: function getIVRList() {
            this.Parameters.ongoingCallIvrService.getIVRList();
        }
    }]);

    return IntegrationAPI;
}();

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var loginService = exports.loginService = function () {
    function loginService(params) {
        _classCallCheck(this, loginService);

        this.SingletonWebSocket = params.SingletonWebSocket;
        this.StateRule = params.StateRule;
    }

    _createClass(loginService, [{
        key: "login",
        value: function login(username, password) {
            var action = "Login";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration",
                    user: username,
                    password: password,
                    action: action };
                this.SingletonWebSocket.send(message);
            }
        }
    }, {
        key: "CloseSession",
        value: function CloseSession() {
            var action = "Logout";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration",
                    action: action };

                this.SingletonWebSocket.send(message);
                this.SingletonWebSocket.currentState = "logout";
            }
        }
    }, {
        key: "SetReady",
        value: function SetReady() {
            var action = "setReady";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration",
                    action: "setReady" };

                this.SingletonWebSocket.send(message);
            }
        }
    }, {
        key: "ChangePassword",
        value: function ChangePassword(aCurrentPassword, aNewPassword) {
            var action = "ChangePassword";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = {
                    client: "integration",
                    aCurrentPassword: aCurrentPassword,
                    aNewPassword: aNewPassword,
                    action: "Settings",
                    subaction: action
                };
                this.SingletonWebSocket.send(message);
            }
        }
    }]);

    return loginService;
}();

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var callService = exports.callService = function () {
    function callService(params) {
        _classCallCheck(this, callService);

        this.SingletonWebSocket = params.SingletonWebSocket;
        this.StateRule = params.StateRule;
    }

    _createClass(callService, [{
        key: "GetCampaignsRelated",
        value: function GetCampaignsRelated() {
            var action = "GetCampaignsRelated";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration",
                    action: "OpenWindow",
                    window: "ManualCall"
                };

                this.SingletonWebSocket.send(message);
            }
        }
    }, {
        key: "makeManualCall",
        value: function makeManualCall(phoneNum, campID, clientName, callKey) {
            var action = "makeManualCall";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration",
                    action: "ManualCall",
                    camId: campID,
                    callKey: callKey,
                    clientName: clientName,
                    phoneNumber: phoneNum
                };

                this.SingletonWebSocket.send(message);
            }
        }
    }, {
        key: "HangUpCall",
        value: function HangUpCall() {
            var action = "HangUp";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration",
                    action: "CallAction",
                    callAction: "HangUp" };

                this.SingletonWebSocket.send(message);
            }
        }
    }, {
        key: "HangUpAndLeaveMessage",
        value: function HangUpAndLeaveMessage() {
            var action = "HangUpAndLeaveMessage";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration",
                    action: "CallAction",
                    callAction: "HangUpAndLeaveMessage" };
                this.SingletonWebSocket.send(message);
            }
        }
    }, {
        key: "HangUpManualDial",
        value: function HangUpManualDial() {
            var action = "HangUpManualDial";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration", action: action };
                this.SingletonWebSocket.send(message);
            }
        }
    }, {
        key: "UpdateDataCall",
        value: function UpdateDataCall(callOutID, data1, data2, data3, data4, data5) {
            var action = "UpdateDataCall";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { callOutID: callOutID,
                    client: "integration",
                    data: [data1, data2, data3, data4, data5],
                    action: "CallAction",
                    callAction: "UpdateDataCall" };

                this.SingletonWebSocket.send(message);
            }
        }
    }, {
        key: "getTransfersOptions",
        value: function getTransfersOptions() {
            var action = "getTransfersOptions";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration",
                    action: "GetTransferData" };

                this.SingletonWebSocket.send(message);
            }
        }
    }, {
        key: "transferCallToACD",
        value: function transferCallToACD(transferCallToACDID) {
            var action = "transferCallToACD";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var data = { acdID: parseInt(transferCallToACDID),
                    array: "",
                    callKey: this.SingletonWebSocket.dataCall.CalKey,
                    camId: this.SingletonWebSocket.dataCall.Id,
                    dnis: this.SingletonWebSocket.dataCall.DNIS,
                    extId: 0,
                    name: "",
                    reference: "dial",
                    sPhone: this.SingletonWebSocket.dataCall.Phone,
                    typeTransfer: 2
                };
                var message = { client: "integration",
                    data: data,
                    action: action };
                this.SingletonWebSocket.send(message);
            }
        }
    }, {
        key: "transferCallToAgent",
        value: function transferCallToAgent(transferCallToAgentID) {
            var action = "transferCallToAgent";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var data = { acdID: 1,
                    datos: "",
                    callKey: this.SingletonWebSocket.dataCall.CalKey,
                    camId: this.SingletonWebSocket.dataCall.Id,
                    dnis: this.SingletonWebSocket.dataCall.DNIS,
                    extId: parseInt(transferCallToAgentID),
                    name: "",
                    reference: "dial",
                    sPhone: this.SingletonWebSocket.dataCall.Phone,
                    typeTransfer: 1
                };
                var message = { client: "integration", data: data, action: action };
                this.SingletonWebSocket.send(message);
            }
        }
    }, {
        key: "transferCallToPhoneNumber",
        value: function transferCallToPhoneNumber(transferCallToPhone) {
            var action = "transferCallToPhoneNumber";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var data = { acdID: 1,
                    datos: "",
                    callKey: this.SingletonWebSocket.dataCall.CalKey,
                    camId: this.SingletonWebSocket.dataCall.Id,
                    dnis: this.SingletonWebSocket.dataCall.DNIS,
                    extId: 0,
                    name: "",
                    reference: "dial",
                    sPhone: transferCallToPhone,
                    typeTransfer: 0
                };
                var message = { client: "integration", data: data, action: "transferCallToPhoneNumber" };
                this.SingletonWebSocket.send(message);
            }
        }
    }]);

    return callService;
}();

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var callBarService = exports.callBarService = function () {
    function callBarService(params) {
        _classCallCheck(this, callBarService);

        this.SingletonWebSocket = params.SingletonWebSocket;
        this.StateRule = params.StateRule;
    }
    /**
     * Sends a DTMF tone
     * @param {Number} digit digit to send as DTMF tone
     */


    _createClass(callBarService, [{
        key: "DTMFDigit",
        value: function DTMFDigit(digit) {
            var action = "DTMF";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration",
                    action: "CallAction",
                    callAction: "DTMF",
                    digit: digit };

                this.SingletonWebSocket.send(message);
            }
        }

        /**
         * Controls de volume of the internal sipphone
         * @param {Boolean} deviceType Audio device to be used (0 : Speakers | 1 : Microphone)
         * @param {Number} xVol New volume value to be set in the device
         */

    }, {
        key: "controlVolume",
        value: function controlVolume(deviceType, xVol) {
            var message = { client: "integration",
                action: "CallAction",
                callAction: "OpenVolumeWindow" };
            this.SingletonWebSocket.send(message);
            this.sendVolumeValue(deviceType, xVol);
        }
    }, {
        key: "sendVolumeValue",
        value: function sendVolumeValue(deviceType, xVol) {
            var message = { client: "integration",
                action: "SetVolume",
                device: "",
                vol: xVol };

            switch (deviceType) {
                case 0:
                    message.device = "Speaker";
                    this.SingletonWebSocket.send(message);
                    break;
                case 1:
                    message.device = "Microphone";
                    this.SingletonWebSocket.send(message);
                    break;
                default:
                    break;
            }
        }

        /**
        * Activates or deactivates mute functiong during call
        * @param {Boolean} value true or false activate o deactivate mute
        */

    }, {
        key: "SetMute",
        value: function SetMute(value) {
            var action = "Mute";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration",
                    action: "CallAction",
                    enable: value,
                    callAction: "Mute" };

                this.SingletonWebSocket.send(message);
            }
        }

        /**
        * Sets hold music and mutes microphone
        */

    }, {
        key: "HoldCall",
        value: function HoldCall() {
            var action = "Hold";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration",
                    action: "CallAction",
                    callAction: "Hold" };

                this.SingletonWebSocket.send(message);
            }
        }

        /**
        * Adds a mark to the recording
        */

    }, {
        key: "addMark",
        value: function addMark() {
            var message = { client: "integration",
                action: "CallAction",
                callAction: "MarkAdd" };

            this.SingletonWebSocket.send(message);
        }

        /**
         * Stop or start the recording
         */

    }, {
        key: "recordingStopStart",
        value: function recordingStopStart() {
            var message = { client: "integration",
                action: "CallAction",
                callAction: "recordingStopStart" };

            this.SingletonWebSocket.send(message);
        }
    }]);

    return callBarService;
}();

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var notAvailableService = exports.notAvailableService = function () {
    function notAvailableService(params) {
        _classCallCheck(this, notAvailableService);

        this.SingletonWebSocket = params.SingletonWebSocket;
        this.StateRule = params.StateRule;
    }

    _createClass(notAvailableService, [{
        key: "getUnavailables",
        value: function getUnavailables() {
            var action = "getUnavailables";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration",
                    action: action };

                this.SingletonWebSocket.send(message);
            }
        }
    }, {
        key: "setUnavailable",
        value: function setUnavailable(unavailableID) {
            var message = { client: "integration",
                unavailableID: unavailableID,
                action: "setUnavailable" };

            this.SingletonWebSocket.send(message);
        }
    }, {
        key: "getunavalibaleHistory",
        value: function getunavalibaleHistory() {
            var action = "getUnavalibaleHistory";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration",
                    action: action };

                this.SingletonWebSocket.send(message);
            }
        }
    }]);

    return notAvailableService;
}();

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assistedTransferService = exports.assistedTransferService = function () {
    function assistedTransferService(params) {
        _classCallCheck(this, assistedTransferService);

        this.SingletonWebSocket = params.SingletonWebSocket;
        this.StateRule = params.StateRule;
    }

    _createClass(assistedTransferService, [{
        key: "assistedDialNumber",
        value: function assistedDialNumber(phone) {
            var action = "assistedDialNumber";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                if (!/^\d+$/.test(phone) && typeof onError === 'function') {
                    var error = { code: 8, message: "The phone should only contain numbers" };
                    onError(error);
                    return;
                }

                var message = { action: action,
                    client: "integration",
                    phone: phone
                };
                this.SingletonWebSocket.send(message);
            }
        }
    }, {
        key: "assistedXFerUseMainCall",
        value: function assistedXFerUseMainCall() {
            var action = "UseMainCall";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration", action: action };
                this.SingletonWebSocket.send(message);
            }
        }
    }, {
        key: "assistedXFerUseSecondCall",
        value: function assistedXFerUseSecondCall() {
            var action = "UseSecondCall";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration", action: action };
                this.SingletonWebSocket.send(message);
            }
        }
    }, {
        key: "assistedXFerHangUP",
        value: function assistedXFerHangUP() {
            var action = "AssistedTransferCallHangUp";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration",
                    action: "AssistedTransferCallHangUp"
                };
                this.SingletonWebSocket.send(message);
            }
        }
    }, {
        key: "assistedXFerTransferCalls",
        value: function assistedXFerTransferCalls() {
            var action = "TransferAssistedCall";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration",
                    action: "TransferAssistedCall"
                };
                this.SingletonWebSocket.send(message);
            }
        }
    }, {
        key: "assistedXFerDropFirstCall",
        value: function assistedXFerDropFirstCall() {
            var action = "DropFirstCall";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration",
                    action: "DropFirstCall"
                };
                this.SingletonWebSocket.send(message);
            }
        }
    }, {
        key: "assistedXFerDropSecondCall",
        value: function assistedXFerDropSecondCall() {
            var action = "DropSecondCall";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration",
                    action: "DropSecondCall"
                };
                this.SingletonWebSocket.send(message);
            }
        }
    }, {
        key: "assistedXFerMakeConference",
        value: function assistedXFerMakeConference() {
            var action = "MakeConference";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration",
                    action: "MakeConference"
                };
                this.SingletonWebSocket.send(message);
            }
        }
    }, {
        key: "assistedXFerLeaveConference",
        value: function assistedXFerLeaveConference() {
            var action = "LeaveConference";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration",
                    action: "LeaveConference"
                };
                this.SingletonWebSocket.send(message);
            }
        }
    }]);

    return assistedTransferService;
}();

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var chatService = exports.chatService = function () {
    function chatService(params) {
        _classCallCheck(this, chatService);

        this.SingletonWebSocket = params.SingletonWebSocket;
        this.StateRule = params.StateRule;
    }

    _createClass(chatService, [{
        key: "getSupervisorsToChat",
        value: function getSupervisorsToChat() {
            var action = "getSupervisorsToChat";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration",
                    action: "OpenWindow",
                    window: "AgentChat" };

                this.SingletonWebSocket.send(message);
            }
        }
    }, {
        key: "sendClientChatMessage",
        value: function sendClientChatMessage(chatId, message) {
            var action = "sendClientChatMessage";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var _action = { client: "integration",
                    action: "Chat",
                    subaction: "NewMessage",
                    data: { chatId: chatId, message: message } };
                this.SingletonWebSocket.send(_action);
            }
        }
    }]);

    return chatService;
}();

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var callLogService = exports.callLogService = function () {
    function callLogService(params) {
        _classCallCheck(this, callLogService);

        this.SingletonWebSocket = params.SingletonWebSocket;
        this.StateRule = params.StateRule;
    }

    _createClass(callLogService, [{
        key: "getCallHistory",
        value: function getCallHistory() {
            var action = "getCallHistory";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = {
                    client: "integration",
                    action: "OpenWindow",
                    window: "CallRecord"
                };
                this.SingletonWebSocket.send(message);
            }
        }
    }]);

    return callLogService;
}();

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dispositionCallService = exports.dispositionCallService = function () {
    function dispositionCallService(params) {
        _classCallCheck(this, dispositionCallService);

        this.SingletonWebSocket = params.SingletonWebSocket;
        this.StateRule = params.StateRule;
    }

    _createClass(dispositionCallService, [{
        key: "getCampaignDispositions",
        value: function getCampaignDispositions(campaignId) {
            var _this = this;

            var action = "getCampaignDispositions";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration",
                    action: "OpenWindow",
                    window: "Disposition" };
                this.SingletonWebSocket.send(message);

                var message2 = { client: "integration",
                    campaignId: campaignId,
                    action: "getCampaignDispositions" };
                setTimeout(function () {
                    _this.SingletonWebSocket.send(message2);
                }, 500);
            }
        }
    }, {
        key: "disposeCampaingCall",
        value: function disposeCampaingCall(dispositionId, camId, callID, subId) {
            var action = "disposeCampaingCall";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration",
                    DispositionId: dispositionId,
                    CamId: camId,
                    CallID: callID,
                    SubId: subId,
                    action: "Disposition",
                    subaction: "disposeCampaingCall" };
                this.SingletonWebSocket.send(message);
            }
        }
    }, {
        key: "getACDDispositions",
        value: function getACDDispositions(acdId) {
            var _this2 = this;

            var action = "getACDDispositions";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration",
                    action: "OpenWindow",
                    window: "Disposition" };
                this.SingletonWebSocket.send(message);

                var message2 = { client: "integration",
                    acdId: acdId,
                    action: "getACDDispositions" };
                setTimeout(function () {
                    _this2.SingletonWebSocket.send(message2);
                }, 500);
            }
        }
    }, {
        key: "disposeACDCall",
        value: function disposeACDCall(dispositionId, callID, subId) {
            var action = "disposeACDCall";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration",
                    DispositionId: dispositionId,
                    CallID: callID,
                    SubId: subId,
                    action: "Disposition",
                    subaction: "disposeACDCall" };
                this.SingletonWebSocket.send(message);
            }
        }
    }]);

    return dispositionCallService;
}();

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var agentDataService = exports.agentDataService = function () {
    function agentDataService(params) {
        _classCallCheck(this, agentDataService);

        this.SingletonWebSocket = params.SingletonWebSocket;
        this.StateRule = params.StateRule;
    }

    _createClass(agentDataService, [{
        key: "GetAgentID",
        value: function GetAgentID() {
            var action = "GetAgentID";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration", action: action };
                this.SingletonWebSocket.send(message);
            }
        }
    }, {
        key: "GetUserName",
        value: function GetUserName() {
            var action = "GetUserName";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration",
                    action: action };
                this.SingletonWebSocket.send(message);
            }
        }
    }, {
        key: "GetExtension",
        value: function GetExtension() {
            var action = "GetExtension";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration",
                    action: action };
                this.SingletonWebSocket.send(message);
            }
        }
    }]);

    return agentDataService;
}();

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var reprogamCallService = exports.reprogamCallService = function () {
    function reprogamCallService(params) {
        _classCallCheck(this, reprogamCallService);

        this.SingletonWebSocket = params.SingletonWebSocket;
        this.StateRule = params.StateRule;
    }

    _createClass(reprogamCallService, [{
        key: "getCampaignDispositionsAndNumbers",
        value: function getCampaignDispositionsAndNumbers(idCampaign, callOutID) {
            var action = "GetDispositionsAndNumbers";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration",
                    campaignId: idCampaign,
                    callOutID: callOutID,
                    action: "GetDispositionsAndNumbers",
                    callAction: action };
                this.SingletonWebSocket.send(message);
            }
        }
    }, {
        key: "reprogramCampaignCall",
        value: function reprogramCampaignCall(idCampaign, idDisposition, callID, dateCallBack, telephone, existingNumber, subId) {
            var action = "Disposition";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration",
                    CamId: idCampaign,
                    DispositionId: idDisposition,
                    CallID: callID,
                    DateDial: dateCallBack,
                    TelReprograma: telephone,
                    existingNumber: existingNumber,
                    SubId: subId,
                    action: "Disposition",
                    subaction: "reprogramCall"
                };
                this.SingletonWebSocket.send(message);
            }
        }
    }, {
        key: "reprogramAcdCall",
        value: function reprogramAcdCall(idACD, idDisposition, callID, dateCallBack, telephone, callKey, data1, data2, data3, data4, data5, existNum, subId) {
            var message = { client: "integration",
                // idACD : idACD,
                DispositionId: idDisposition,
                CallID: callID,
                // dateCallBack : dateCallBack,
                // telephone : telephone,
                // callKey : callKey,
                // data1 : data1,
                // data2 : data2,
                // data3 : data3,
                // data4 : data4, 
                // data5 : data5,
                // existNum : existNum, 
                SubId: subId,
                action: "reprogramAcdCall"
            };
            this.SingletonWebSocket.send(message);
        }
    }, {
        key: "CallBackAcd",
        value: function CallBackAcd(idCampaign, idDisposition, callID, dateCallBack, telephone, callKey, data1, data2, data3, data4, data5, existNum, subDis) {
            var callAction = "Disposition";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, callAction)) {
                var message = { client: "integration",
                    CamId: idCampaign,
                    DispositionId: idDisposition,
                    CallID: callID,
                    DateDial: dateCallBack,
                    TelReprograma: telephone,
                    existingNumber: existNum,
                    SubId: subDis,
                    action: "Disposition",
                    subaction: "reprogramCall"
                };
                this.SingletonWebSocket.send(message);
            }
        }
    }, {
        key: "getPhoneNumbers",
        value: function getPhoneNumbers(callOutID) {
            var callAction = "getPhoneNumbers";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, callAction)) {
                var message = { client: "integration",
                    callAction: callAction,
                    callOutID: callOutID,
                    action: "CallAction"
                };
                this.SingletonWebSocket.send(message);
            }
        }
        //


    }]);

    return reprogamCallService;
}();

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StateRule = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MainRule = __webpack_require__(25);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StateRule = exports.StateRule = function () {
    function StateRule() {
        _classCallCheck(this, StateRule);
    }

    _createClass(StateRule, null, [{
        key: 'validate',
        value: function validate(currentState, actionName) {
            if (_MainRule.MainRule[currentState] && _MainRule.MainRule[currentState][actionName]) {
                return true;
            }
            if (typeof onError === 'function') {
                var error = { code: 7, message: "Invalid function at the current State" };
                onError(error);
            }
            return false;
        }
    }]);

    return StateRule;
}();

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MainRule = undefined;

var _LoginRule = __webpack_require__(26);

var _ReadyRule = __webpack_require__(27);

var _LogoutRule = __webpack_require__(28);

var _DialogRule = __webpack_require__(29);

var _CalloutRule = __webpack_require__(30);

var _NotReadyRule = __webpack_require__(31);

var _ProblemRule = __webpack_require__(32);

var _WrapupRule = __webpack_require__(33);

var MainRule = exports.MainRule = {
    "Login": _LoginRule.LoginRule,
    "Ready": _ReadyRule.ReadyRule,
    "logout": _LogoutRule.LogoutRule,
    "Dialog": _DialogRule.DialogRule,
    "Callout": _CalloutRule.CalloutRule,
    "NotReady": _NotReadyRule.NotReadyRule,
    "Problem": _ProblemRule.ProblemRule,
    "Wrapup": _WrapupRule.WrapupRule
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var LoginRule = exports.LoginRule = {};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var ReadyRule = exports.ReadyRule = {
    "Logout": "Logout",
    "GetAgentID": "GetAgentId",
    "GetUserName": "getUserName",
    "GetExtension": "GetExtension",
    "ChangePassword": "ChangePassword",
    "sendClientChatMessage": "sendClientChatMessage",
    "getSupervisorsToChat": "getSupervisorsToChat",
    "GetCampaignsRelated": "GetCampaignsRelated",
    "makeManualCall": "makeManualCall",
    "getLastCallData": "getLastCallData",
    "getCallHistory": "getCallHistory",
    "getUnavailables": "getUnavailables",
    "getUnavalibaleHistory": "getUnavalibaleHistory"
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var LogoutRule = exports.LogoutRule = {
    "Login": "Login"
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DialogRule = exports.DialogRule = _defineProperty({
    "getTransfersOptions": "getTransfersOptions",
    "transferCallToACD": "transferCallToACD",
    "transferCallToAgent": "transferCallToAgent",
    "transferCallToPhoneNumber": "transferCallToPhoneNumber",
    "assistedDialNumber": "assistedDialNumber",
    "AssistedTransferCallHangUp": "AssistedTransferCallHangUp",
    "TransferAssistedCall": "TransferAssistedCall",
    "UseMainCall": "UseMainCall",
    "UseSecondCall": "UseSecondCall",
    "HangUp": "HangUp",
    "Mute": "Mute",
    "Hold": "Hold",
    "DTMF": "DTMF",
    "sendClientChatMessage": "sendClientChatMessage",
    "getSupervisorsToChat": "getSupervisorsToChat",
    "UpdateDataCall": "UpdateDataCall",
    "getACDDispositions": "getACDDispositions",
    "getCampaignDispositions": "getCampaignDispositions",
    "disposeACDCall": "disposeACDCall",
    "disposeCampaingCall": "disposeCampaingCall",
    "GetCampaignsRelated": "GetCampaignsRelated",
    "GetDispositionsAndNumbers": "GetDispositionsAndNumbers",
    "reprogramCampaignCall": "reprogramCampaignCall",
    "reprogramAcdCall": "reprogramAcdCall",
    "DropFirstCall": "DropFirstCall",
    "DropSecondCall": "DropSecondCall",
    "MakeConference": "MakeConference",
    "LeaveConference": "LeaveConference",
    "getLastCallData": "getLastCallData",
    "getPhoneNumbers": "getPhoneNumbers",
    "recordingStopStart": "recordingStopStart",
    "HangUpAndLeaveMessage": "HangUpAndLeaveMessage",
    "Disposition": "Disposition",
    "GetIVRList": "GetIVRList",
    "IdleStart": "IdleStart"
}, "recordingStopStart", "recordingStopStart");

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var CalloutRule = exports.CalloutRule = {
    "HangUpManualDial": "HangUpManualDial"
};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var NotReadyRule = exports.NotReadyRule = {
    "setReady": "setReady",
    "GetCampaignsRelated": "GetCampaignsRelated",
    "makeManualCall": "makeManualCall",
    "getLastCallData": "getLastCallData"
};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var ProblemRule = exports.ProblemRule = {
    "Logout": "Logout"
};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var WrapupRule = exports.WrapupRule = {
    "UpdateDataCall": "UpdateDataCall",
    "getACDDispositions": "getACDDispositions",
    "getCampaignDispositions": "getCampaignDispositions",
    "GetDispositionsAndNumbers": "GetDispositionsAndNumbers",
    "disposeACDCall": "disposeACDCall",
    "disposeCampaingCall": "disposeCampaingCall",
    "reprogramCampaignCall": "reprogramCampaignCall",
    "reprogramAcdCall": "reprogramAcdCall",
    "Disposition": "Disposition",
    "getPhoneNumbers": "getPhoneNumbers"
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ongoingCallIvrService = exports.ongoingCallIvrService = function () {
    function ongoingCallIvrService(params) {
        _classCallCheck(this, ongoingCallIvrService);

        this.SingletonWebSocket = params.SingletonWebSocket;
        this.StateRule = params.StateRule;
    }

    _createClass(ongoingCallIvrService, [{
        key: "getIVRList",
        value: function getIVRList() {
            var action = "GetIVRList";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration",
                    action: "CallAction",
                    callAction: action };

                this.SingletonWebSocket.send(message);
            }
        }
    }, {
        key: "idleStart",
        value: function idleStart(IVRId) {
            var action = "IdleStart";
            if (this.StateRule.validate(this.SingletonWebSocket.currentStatus, action)) {
                var message = { client: "integration",
                    action: action,
                    IVRId: IVRId };

                this.SingletonWebSocket.send(message);
            }
        }
    }]);

    return ongoingCallIvrService;
}();

/***/ })
/******/ ]);
});
//# sourceMappingURL=cw-galatea-integration-api-js-bundle.js.map