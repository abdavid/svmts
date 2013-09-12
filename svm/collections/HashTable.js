var HashTableEntries;
(function (HashTableEntries) {
    HashTableEntries[HashTableEntries["EXISTENCE"] = 0] = "EXISTENCE";
    HashTableEntries[HashTableEntries["ENTRY"] = 1] = "ENTRY";
    HashTableEntries[HashTableEntries["ENTRY_INDEX_AND_VALUE"] = 2] = "ENTRY_INDEX_AND_VALUE";
})(HashTableEntries || (HashTableEntries = {}));

var HashTable = (function () {
    function HashTable(options) {
        if (typeof options === "undefined") { options = null; }
        var _this = this;
        this.buckets = [];
        this.bucketsByHash = {};
        if (this.isLegacy()) {
            throw new Error('Missing nessesary components');
        }

        var properties = {
            replaceDuplicateKey: true,
            hashCode: function () {
                return _this.hashObject;
            },
            equals: null
        };

        if (properties) {
            properties = this.merge(properties, options);
        }

        this.properties = properties;
        this.keys = this.createBucketAggregator('keys');
        this.values = this.createBucketAggregator('values');
        this.entries = this.createBucketAggregator('getEntries');
        this.checkKey = this.createKeyValCheck('key');
        this.checkValue = this.createKeyValCheck('value');
    }
    HashTable.prototype.isLegacy = function () {
        return typeof encodeURIComponent === HashTable.UNDEFINED || typeof Array.prototype.splice === HashTable.UNDEFINED || typeof Array.prototype.hasOwnProperty === HashTable.UNDEFINED;
    };

    HashTable.prototype.toStr = function (obj) {
        return (typeof obj == HashTable.STRING) ? obj : obj.toString();
    };

    HashTable.prototype.hashObject = function (obj) {
        var hashCode;
        if (typeof obj == HashTable.STRING) {
            return obj;
        } else if (typeof obj.hashCode == HashTable.FUNCTION) {
            hashCode = obj.hashCode();
            return (typeof hashCode == HashTable.STRING) ? hashCode : this.hashObject(hashCode);
        } else {
            return this.toStr(obj);
        }
    };

    HashTable.prototype.merge = function (o1, o2) {
        for (var i in o2) {
            if (o2.hasOwnProperty(i)) {
                o1[i] = o2[i];
            }
        }

        return o1;
    };

    HashTable.prototype.createKeyValCheck = function (kvStr) {
        return function (kv) {
            if (kv === null) {
                throw new Error("null is not a valid " + kvStr);
            } else if (kv === HashTable.UNDEFINED) {
                throw new Error(kvStr + " must not be undefined");
            }
        };
    };

    HashTable.prototype.searchBuckets = function (buckets, hash) {
        var i = buckets.length, bucket;
        while (i--) {
            bucket = buckets[i];
            if (hash === bucket[0]) {
                return i;
            }
        }
        return null;
    };

    HashTable.prototype.put = function (key, value) {
        this.checkKey(key);
        this.checkValue(value);

        var hash = this.properties.hashCode(key), bucket = this.getBucketForHash(this.bucketsByHash, hash), bucketEntry, oldValue = null;

        if (bucket) {
            bucketEntry = bucket.getEntryForKey(key);
            if (bucketEntry) {
                if (this.properties.replaceDuplicateKey) {
                    bucketEntry[0] = key;
                }
                oldValue = bucketEntry[1];
                bucketEntry[1] = value;
            } else {
                bucket.addEntry(key, value);
            }
        } else {
            bucket = new Bucket(hash, key, value);
            this.buckets.push(bucket);
            this.bucketsByHash[hash] = bucket;
        }
        return oldValue;
    };

    HashTable.prototype.get = function (key) {
        this.checkKey(key);

        var hash = this.properties.hashCode(key);

        var bucket = this.getBucketForHash(this.bucketsByHash, hash);
        if (bucket) {
            var bucketEntry = bucket.getEntryForKey(key);
            if (bucketEntry) {
                return bucketEntry[0];
            }
        }
        return null;
    };

    HashTable.prototype.containsKey = function (key) {
        this.checkKey(key);
        var bucketKey = this.properties.hashCode(key);

        var bucket = this.getBucketForHash(this.bucketsByHash, bucketKey);

        return bucket ? bucket.containsKey(key) : false;
    };

    HashTable.prototype.containsValue = function (value) {
        this.checkValue(value);
        var i = this.buckets.length;
        while (i--) {
            if (this.buckets[i].containsValue(value)) {
                return true;
            }
        }
        return false;
    };

    HashTable.prototype.clear = function () {
        this.buckets.length = 0;
        this.bucketsByHash = {};
    };

    HashTable.prototype.isEmpty = function () {
        return !this.buckets.length;
    };

    HashTable.prototype.createBucketAggregator = function (bucketFuncName) {
        var _this = this;
        return function () {
            var aggregated = [], i = _this.buckets.length;
            while (i--) {
                _this.buckets[i][bucketFuncName](aggregated);
            }
            return aggregated;
        };
    };

    HashTable.prototype.getBucketForHash = function (bucketsByHash, hash) {
        var bucket = bucketsByHash[hash];

        return (bucket && (bucket instanceof Bucket)) ? bucket : null;
    };

    HashTable.prototype.each = function (callback) {
        var entries = this.entries(), i = entries.length, entry;
        while (i--) {
            entry = entries[i];
            callback(entry[0], entry[1]);
        }
    };

    HashTable.prototype.equals = function (hashtable) {
        var keys, key, val, count = this.size();
        if (count == hashtable.size()) {
            keys = this.keys();
            while (count--) {
                key = keys[count];
                val = hashtable.get(key);
                if (val === null || val !== this.get(key)) {
                    return false;
                }
            }
            return true;
        }
        return false;
    };

    HashTable.prototype.putAll = function (hashtable, conflictCallback) {
        if (typeof conflictCallback === "undefined") { conflictCallback = null; }
        var entries = hashtable.entries(), entry, key, value, thisValue, i = entries.length, hasConflictCallback = (typeof conflictCallback == HashTable.FUNCTION);

        while (i--) {
            entry = entries[i];
            key = entry[0];
            value = entry[1];

            if (hasConflictCallback && (thisValue = this.get(key))) {
                value = conflictCallback(key, thisValue, value);
            }

            this.put(key, value);
        }
    };

    HashTable.prototype.clone = function () {
        var clone = new HashTable(this.properties);
        clone.putAll(this);
        return clone;
    };

    HashTable.prototype.remove = function (key) {
        this.checkKey(key);

        var hash = this.properties.hashCode(key), bucketIndex, oldValue = null;

        var bucket = this.getBucketForHash(this.bucketsByHash, hash);

        if (bucket) {
            oldValue = bucket.removeEntryForKey(key);
            if (oldValue !== null) {
                if (bucket.entries.length == 0) {
                    bucketIndex = this.searchBuckets(this.buckets, hash);
                    this.buckets.splice(bucketIndex, 1);
                    delete this.bucketsByHash[hash];
                }
            }
        }
        return oldValue;
    };

    HashTable.prototype.size = function () {
        var total = 0, i = this.buckets.length;
        while (i--) {
            total += this.buckets[i].entries.length;
        }
        return total;
    };

    HashTable.prototype.toQueryString = function () {
        var entries = this.entries(), i = entries.length, entry;
        var parts = [];
        while (i--) {
            entry = entries[i];
            parts[i] = encodeURIComponent(this.toStr(entry[0])) + "=" + encodeURIComponent(this.toStr(entry[1]));
        }
        return parts.join("&");
    };
    HashTable.FUNCTION = 'function';
    HashTable.STRING = 'string';
    HashTable.UNDEFINED = 'undefined';
    return HashTable;
})();
//# sourceMappingURL=HashTable.js.map
