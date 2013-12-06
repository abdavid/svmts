/**
* Created by davidatborresen on 14.09.13.
*/
///<reference path='../../definitions/underscore.d.ts' />
var P;
(function (P) {
    var isNode = typeof module !== 'undefined' && module.exports;
    var setImmediate = setImmediate || function (cb) {
        setTimeout(cb, 0);
    };
    var Worker = isNode ? require(__dirname + '/Worker.js') : self.Worker;
    var URL = typeof self !== 'undefined' ? (self.URL ? self.URL : self.webkitURL) : null;
    var _supports = isNode || self.Worker;
    var evalPath = isNode ? __dirname + '/eval.js' : null;
    var maxWorkers = isNode ? require('os').cpus().length : 4;

    var Thread = (function () {
        function Thread(data, options) {
            if (typeof data === "undefined") { data = {}; }
            if (typeof options === "undefined") { options = {}; }
            this.data = data;
            this.options = _.extend(this._getDefaultOptions(), options);
            this.operation = new Operation();
            this.operation.resolve(null, this.data);
            this.requiredScripts = [];
            this.requiredFunctions = [];
        }
        /**
        * @returns {{synchronous: boolean}}
        * @private
        */
        Thread.prototype._getDefaultOptions = function () {
            return {
                synchronous: true
            };
        };

        /**
        * @param cb
        * @returns {string}
        * @private
        */
        Thread.prototype._getWorkerSource = function (cb) {
            var preStr = '';
            var importScripts = '';
            var i = 0;
            if (!isNode && this.requiredScripts.length !== 0) {
                importScripts += '\r\nimportScripts("' + this.requiredScripts.join('","') + '")\r\n';
            }

            for (i = 0; i < this.requiredFunctions.length; ++i) {
                if (this.requiredFunctions[i].name) {
                    preStr += 'var ' + this.requiredFunctions[i].name + ' = ' + this.requiredFunctions[i].fn.toString() + ';';
                } else {
                    preStr += this.requiredFunctions[i].fn.toString();
                }
            }

            if (isNode) {
                return importScripts + preStr + 'process.on("message", function(e) {process.send(JSON.stringify((' + cb.toString() + ')(JSON.parse(e).data)))})';
            } else {
                return importScripts + preStr + 'self.onmessage = function(e) {self.postMessage((' + cb.toString() + ')(e.data))}';
            }
        };

        /**
        * @param cb
        * @returns {*}
        * @private
        */
        Thread.prototype._spawnWorker = function (cb) {
            var wrk;
            var src = this._getWorkerSource(cb);

            if (isNode) {
                wrk = new Worker(this.options.evalPath);
                wrk.postMessage(src);
            } else {
                if (Worker === void (1)) {
                    return void (1);
                }

                try  {
                    if (isNode && this.requiredScripts.length !== 0) {
                        if (evalPath !== null) {
                            wrk = new Worker(evalPath);
                            wrk.postMessage(src);
                        } else {
                            throw new Error('Can\'t use required scripts without eval.js!');
                        }
                    } else if (!URL) {
                        throw new Error('Can\'t create a blob URL in this browser!');
                    } else {
                        var blob = new Blob([src], { type: 'text/javascript' }), url = URL.createObjectURL(blob);

                        this.url = url;
                        wrk = new Worker(url);
                    }
                } catch (e) {
                    if (evalPath !== null) {
                        wrk = new Worker(evalPath);
                        wrk.postMessage(src);
                    } else {
                        throw e;
                    }
                }
            }

            return wrk;
        };

        /**
        * @param i
        * @param cb
        * @param done
        * @private
        */
        Thread.prototype._spawnMapWorker = function (i, cb, done) {
            var _this = this;
            var wrk = this._spawnWorker(cb);
            if (wrk !== undefined) {
                wrk.onmessage = function (msg) {
                    wrk.terminate();
                    _this.data[i] = msg.data;
                    done();
                };
                wrk.postMessage(this.data[i]);
            } else if (this.options.synchronous) {
                setImmediate(function () {
                    _this.data[i] = cb(_this.data[i]);
                    done();
                });
            } else {
                throw new Error('Workers do not exist and synchronous operation not allowed!');
            }
        };

        /**
        * @param data
        * @param cb
        * @param done
        * @private
        */
        Thread.prototype._spawnReduceWorker = function (data, cb, done) {
            var _this = this;
            var wrk = this._spawnWorker(cb);
            if (wrk !== undefined) {
                wrk.onmessage = function (msg) {
                    wrk.terminate();
                    _this.data[_this.data.length] = msg.data;
                    done();
                };

                wrk.postMessage(data);
            } else if (this.options.synchronous) {
                setImmediate(function () {
                    _this.data[_this.data.length] = cb(data);
                    done();
                });
            } else {
                throw new Error('Workers do not exist and synchronous operation not allowed!');
            }
        };

        /**
        * @returns {P.Thread}
        */
        Thread.prototype.require = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            var func;

            for (var i = 0; i < args.length; i++) {
                func = args[i];

                if (typeof func === 'string') {
                    this.requiredScripts.push(func);
                } else if (typeof func === 'function') {
                    this.requiredFunctions.push({ fn: func });
                } else if (typeof func === 'object') {
                    this.requiredFunctions.push(func);
                }
            }

            return this;
        };

        /**
        * @param fromInclusive
        * @param toExclusive
        * @param fn
        * @returns {P.Thread}
        */
        Thread.prototype.for = function (fromInclusive, toExclusive, fn) {
            var _this = this;
            return this.spawn(function () {
                while (fromInclusive < toExclusive) {
                    fn.call(_this, fromInclusive);
                    fromInclusive++;
                }
            });
        };

        /**
        * @param cb
        * @returns {P.Thread}
        */
        Thread.prototype.map = function (cb) {
            var _this = this;
            if (!this.data.length) {
                return this.spawn(cb);
            }

            var startedOps = 0;
            var doneOps = 0;

            var done = function () {
                if (++doneOps === _this.data.length) {
                    newOp.resolve(null, _this.data);
                } else if (startedOps < _this.data.length) {
                    _this._spawnMapWorker(startedOps++, cb, done);
                }
            };

            var newOp = new Operation();
            this.operation.then(function () {
                for (; startedOps - doneOps < maxWorkers && startedOps < _this.data.length; ++startedOps) {
                    _this._spawnMapWorker(startedOps, cb, done);
                }
            });

            this.operation = newOp;

            return this;
        };

        /**
        * @param cb
        * @returns {P.Thread}
        */
        Thread.prototype.spawn = function (cb) {
            var _this = this;
            var newOp = new Operation();
            this.operation.then(function () {
                var wrk = _this._spawnWorker(cb);
                if (wrk !== undefined) {
                    wrk.onmessage = function (msg) {
                        wrk.terminate();
                        _this.data = msg.data;
                        newOp.resolve(null, _this.data);
                    };
                    wrk.postMessage(_this.data);
                } else if (_this.options.synchronous) {
                    setImmediate(function () {
                        _this.data = cb(_this.data);
                        newOp.resolve(null, _this.data);
                    });
                } else {
                    throw new Error('Workers do not exist and synchronous operation not allowed!');
                }
            });

            this.operation = newOp;

            return this;
        };

        /**
        * @param cb
        * @returns {Parallel}
        */
        Thread.prototype.reduce = function (cb) {
            var _this = this;
            if (!this.data.length) {
                throw new Error('Can\'t reduce non-array data');
            }

            var runningWorkers = 0, newOp = new Operation(), done = function (data) {
                --runningWorkers;
                if (_this.data.length === 1 && runningWorkers === 0) {
                    _this.data = _this.data[0];
                    newOp.resolve(null, _this.data);
                } else if (_this.data.length > 1) {
                    ++runningWorkers;
                    _this._spawnReduceWorker([_this.data[0], _this.data[1]], cb, done);
                    _this.data.splice(0, 2);
                }
            };

            this.operation.then(function () {
                if (_this.data.length === 1) {
                    newOp.resolve(null, _this.data[0]);
                } else {
                    for (var i = 0; i < maxWorkers && i < Math.floor(_this.data.length / 2); ++i) {
                        ++runningWorkers;
                        _this._spawnReduceWorker([_this.data[i * 2], _this.data[i * 2 + 1]], cb, done);
                    }

                    _this.data.splice(0, i * 2);
                }
            });

            this.operation = newOp;

            return this;
        };

        /**
        * @param cb
        * @param errCb
        * @returns {P.Thread}
        */
        Thread.prototype.then = function (cb, errCb) {
            var _this = this;
            var newOp = new Operation();
            this.operation.then(function () {
                var retData = cb(_this.data);
                if (retData !== undefined) {
                    _this.data = retData;
                }

                newOp.resolve(null, _this.data);
            }, errCb);

            this.operation = newOp;

            return this;
        };
        return Thread;
    })();
    P.Thread = Thread;

    var Operation = (function () {
        function Operation() {
            this._callbacks = [];
            this._errCallbacks = [];
            this._resolved = 0;
            this._result = null;
        }
        /**
        * @param err
        * @param res
        */
        Operation.prototype.resolve = function (err, res) {
            if (!err) {
                this._resolved = 1;
                this._result = res;

                for (var i = 0; i < this._callbacks.length; ++i) {
                    this._callbacks[i](res);
                }
            } else {
                this._resolved = 2;
                this._result = err;

                for (var iE = 0; iE < this._errCallbacks.length; ++iE) {
                    this._errCallbacks[iE](res);
                }
            }

            this._callbacks = [];
            this._errCallbacks = [];
        };

        /**
        * @param cb
        * @param errCb
        * @returns {Operation}
        */
        Operation.prototype.then = function (cb, errCb) {
            if (typeof cb === "undefined") { cb = null; }
            if (typeof errCb === "undefined") { errCb = null; }
            if (this._resolved === 1) {
                if (cb) {
                    cb(this._result);
                }
            } else if (this._resolved === 2) {
                if (errCb) {
                    errCb(this._result);
                }
            } else {
                if (cb) {
                    this._callbacks[this._callbacks.length] = cb;
                }

                if (errCb) {
                    this._errCallbacks[this._errCallbacks.length] = errCb;
                }
            }

            return this;
        };
        return Operation;
    })();
})(P || (P = {}));
//# sourceMappingURL=Parallel.js.map
