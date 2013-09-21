/**
 * Created by davidatborresen on 14.09.13.
 */

///<reference path='../../definitions/underscore.d.ts' />


module P {

    var isNode = typeof module !== 'undefined' && module.exports;
    var setImmediate = setImmediate || function (cb) {
        setTimeout(cb, 0);
    };
    var Worker = isNode ? require(__dirname + '/Worker.js') : self.Worker;
    var URL = typeof self !== 'undefined' ? (self.URL ? self.URL : self.webkitURL) : null;
    var _supports = isNode || self.Worker;
    var evalPath = isNode ? __dirname + '/eval.js' : null;
    var maxWorkers = isNode ? require('os').cpus().length : 4;

    export class Thread
    {
        private data;
        private options;
        private operation:Operation;
        private requiredScripts:string[];
        private requiredFunctions:string[];

        public url:string;

        constructor(data, options)
        {
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
        private _getDefaultOptions()
        {
            return {
                synchronous: true
            }
        }

        /**
         * @param cb
         * @returns {string}
         * @private
         */
        private _getWorkerSource(cb:Function)
        {
            var preStr = '';
            var importScripts = '';
            var i = 0;
            if(!isNode && this.requiredScripts.length !== 0)
            {
                importScripts += '\r\nimportScripts("' + this.requiredScripts.join('","') + '")\r\n';
            }

            for(i = 0; i < this.requiredFunctions.length; ++i)
            {
                if(this.requiredFunctions[i].name)
                {
                    preStr += 'var ' + this.requiredFunctions[i].name + ' = ' + this.requiredFunctions[i].fn.toString() + ';';
                }
                else
                {
                    preStr += this.requiredFunctions[i].fn.toString();
                }
            }

            if(isNode)
            {
                return importScripts + preStr + 'process.on("message", function(e) {process.send(JSON.stringify((' + cb.toString() + ')(JSON.parse(e).data)))})';
            }
            else
            {
                return importScripts + preStr + 'self.onmessage = function(e) {self.postMessage(('+ cb.toString() + ')(e.data))}';
            }
        }

        /**
         * @param cb
         * @returns {*}
         * @private
         */
        private _spawnWorker(cb:Function)
        {
            var wrk;
            var src = this._getWorkerSource(cb);

            if(isNode)
            {
                wrk = new Worker(this.options.evalPath);
                wrk.postMessage(src);
            }
            else
            {
                if(Worker === void(1))
                {
                    return void(1);
                }

                try
                {
                    if(isNode && this.requiredScripts.length !== 0)
                    {
                        if(evalPath !== null)
                        {
                            wrk = new Worker(evalPath);
                            wrk.postMessage(src);
                        }
                        else
                        {
                            throw new Error('Can\'t use required scripts without eval.js!');
                        }
                    }
                    else if(!URL)
                    {
                        throw new Error('Can\'t create a blob URL in this browser!');
                    }
                    else
                    {
                        var blob = new Blob([src], { type: 'text/javascript' }),
                            url = URL.createObjectURL(blob);

                        this.url = url;
                        wrk = new Worker(url);
                    }
                }
                catch(e)
                {
                    // blob/url unsupported, cross-origin error
                    if(evalPath !== null)
                    {
                        wrk = new Worker(evalPath);
                        wrk.postMessage(src);
                    }
                    else
                    {
                        throw e;
                    }
                }
            }

            return wrk;
        }

        /**
         * @param i
         * @param cb
         * @param done
         * @private
         */
        private _spawnMapWorker(i, cb, done)
        {

            var wrk = this._spawnWorker(cb);
            if(wrk !== undefined)
            {
                wrk.onmessage = (msg) =>
                {
                    wrk.terminate();
                    this.data[i] = msg.data;
                    done();
                };
                wrk.postMessage(this.data[i]);
            }
            else if(this.options.synchronous)
            {
                setImmediate(() =>
                {
                    this.data[i] = cb(this.data[i]);
                    done();
                });
            }
            else
            {
                throw new Error('Workers do not exist and synchronous operation not allowed!');
            }
        }

        /**
         * @param data
         * @param cb
         * @param done
         * @private
         */
        private _spawnReduceWorker(data, cb, done)
        {
            var wrk = this._spawnWorker(cb);
            if(wrk !== undefined)
            {
                wrk.onmessage = (msg) =>
                {
                    wrk.terminate();
                    this.data[this.data.length] = msg.data;
                    done();
                };

                wrk.postMessage(data);
            }
            else if(this.options.synchronous)
            {
                setImmediate(()=>
                {
                    this.data[this.data.length] = cb(data);
                    done();
                });
            }
            else
            {
                throw new Error('Workers do not exist and synchronous operation not allowed!');
            }
        }

        /**
         * @returns {P.Thread}
         */
        public require(...args):P.Thread
        {
            var func;

            for(var i = 0; i < args.length; i++)
            {
                func = args[i];

                if(typeof func === 'string')
                {
                    this.requiredScripts.push(func);
                }
                else if(typeof func === 'function')
                {
                    this.requiredFunctions.push({ fn: func });
                }
                else if(typeof func === 'object')
                {
                    this.requiredFunctions.push(func);
                }
            }

            return this;
        }

        /**
         * @param cb
         * @returns {P.Thread}
         */
        public map(cb):P.Thread
        {
            if(!this.data.length)
            {
                return this.spawn(cb);
            }

            var startedOps = 0;
            var doneOps = 0;

            var done = ()=>
            {
                if(++doneOps === this.data.length)
                {
                    newOp.resolve(null, this.data);
                }
                else if(startedOps < this.data.length)
                {
                    this._spawnMapWorker(startedOps++, cb, done);
                }
            }

            var newOp = new Operation();
            this.operation.then(() =>
            {
                for(; startedOps - doneOps < maxWorkers && startedOps < this.data.length; ++startedOps)
                {
                    this._spawnMapWorker(startedOps, cb, done);
                }
            });

            this.operation = newOp;

            return this;
        }

        /**
         * @param cb
         * @returns {P.Thread}
         */
        public spawn(cb):P.Thread
        {
            var newOp = new Operation();
            this.operation.then(()=>
            {
                var wrk = this._spawnWorker(cb);
                if(wrk !== undefined)
                {
                    wrk.onmessage = (msg)=>
                    {
                        wrk.terminate();
                        this.data = msg.data;
                        newOp.resolve(null, this.data);
                    };
                    wrk.postMessage(this.data);
                }
                else if(this.options.synchronous)
                {
                    setImmediate(()=>
                    {
                        this.data = cb(this.data);
                        newOp.resolve(null, this.data);
                    });
                }
                else
                {
                    throw new Error('Workers do not exist and synchronous operation not allowed!');
                }
            });

            this.operation = newOp;

            return this;
        }

        /**
         * @param cb
         * @returns {Parallel}
         */
        public reduce(cb):P.Thread
        {
            if(!this.data.length)
            {
                throw new Error('Can\'t reduce non-array data');
            }

            var runningWorkers = 0,
                newOp = new Operation(),
                done = (data)=>
                {
                    --runningWorkers;
                    if(this.data.length === 1 && runningWorkers === 0)
                    {
                        this.data = this.data[0];
                        newOp.resolve(null, this.data);
                    }
                    else if(this.data.length > 1)
                    {
                        ++runningWorkers;
                        this._spawnReduceWorker([this.data[0], this.data[1]], cb, done);
                        this.data.splice(0, 2);
                    }
                }


            this.operation.then(() =>
            {
                if(this.data.length === 1)
                {
                    newOp.resolve(null, this.data[0]);
                }
                else
                {
                    for(var i = 0; i < maxWorkers && i < Math.floor(this.data.length / 2); ++i)
                    {
                        ++runningWorkers;
                        this._spawnReduceWorker([this.data[i * 2], this.data[i * 2 + 1]], cb, done);
                    }

                    this.data.splice(0, i * 2);
                }
            });

            this.operation = newOp;

            return this;
        }

        /**
         * @param cb
         * @param errCb
         * @returns {P.Thread}
         */
        public then(cb, errCb):P.Thread
        {
            var newOp = new Operation();
            this.operation.then(()=>
            {
                var retData = cb(this.data);
                if(retData !== undefined)
                {
                    this.data = retData;
                }

                newOp.resolve(null, this.data);

            }, errCb);

            this.operation = newOp;

            return this;
        }

    }

    class Operation {

        private _callbacks = [];
        private _errCallbacks = [];

        private _resolved = 0;
        private _result = null;

        /**
         * @param err
         * @param res
         */
        public resolve(err, res):void
        {
            if(!err)
            {
                this._resolved = 1;
                this._result = res;

                for(var i = 0; i < this._callbacks.length; ++i)
                {
                    this._callbacks[i](res);
                }
            }
            else
            {
                this._resolved = 2;
                this._result = err;

                for(var iE = 0; iE < this._errCallbacks.length; ++iE)
                {
                    this._errCallbacks[iE](res);
                }
            }

            this._callbacks = [];
            this._errCallbacks = [];
        }

        /**
         * @param cb
         * @param errCb
         * @returns {Operation}
         */
        public then(cb:Function = null, errCb:Function = null):Operation
        {
            if(this._resolved === 1) // result
            {
                if(cb)
                {
                    cb(this._result);
                }
            }
            else if(this._resolved === 2) // error
            {
                if(errCb)
                {
                    errCb(this._result);
                }
            }
            else // we are busy, so store the callbacks
            {
                if(cb)
                {
                    this._callbacks[this._callbacks.length] = cb;
                }

                if(errCb)
                {
                    this._errCallbacks[this._errCallbacks.length] = errCb;
                }
            }

            return this;
        }
    }
}