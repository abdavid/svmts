var Bucket = (function () {
    function Bucket(hash, firstKey, firstValue, equalityFunction) {
        if (typeof equalityFunction === "undefined") { equalityFunction = null; }
        this[0] = hash;
        this.entries = [];
        this.addEntry(firstKey, firstValue);

        if (equalityFunction !== null) {
            this.getEqualityFunction = function () {
                return equalityFunction;
            };
        } else {
            this.getEqualityFunction = function () {
                return this.equals_fixedValueNoEquals;
            };
        }
    }
    Bucket.prototype.equals_fixedValueHasEquals = function (fixedValue, variableValue) {
        return fixedValue.equals(variableValue);
    };

    Bucket.prototype.equals_fixedValueNoEquals = function (fixedValue, variableValue) {
        return (typeof variableValue.equals == HashTable.FUNCTION) ? variableValue.equals(fixedValue) : (fixedValue === variableValue);
    };

    Bucket.prototype.getEqualityFunction = function (searchValue) {
        return (typeof searchValue.equals == HashTable.FUNCTION) ? this.equals_fixedValueHasEquals : this.equals_fixedValueNoEquals;
    };

    Bucket.prototype.getEntryForKey = function (key) {
        return this.createBucketSearcher(HashTableEntries.ENTRY).apply(this, [key]);
    };

    Bucket.prototype.getEntryAndIndexForKey = function (key) {
        return this.createBucketSearcher(HashTableEntries.ENTRY_INDEX_AND_VALUE)(key);
    };

    Bucket.prototype.removeEntryForKey = function (key) {
        var result = this.getEntryAndIndexForKey(key);
        if (result) {
            this.entries.splice(result[0], 1);
            return result[1];
        }
        return null;
    };

    Bucket.prototype.addEntry = function (key, value) {
        this.entries.push([key, value]);
    };

    Bucket.prototype.keys = function (aggregatedArr) {
        return this.createBucketLister(0)(aggregatedArr);
    };

    Bucket.prototype.values = function (aggregatedArr) {
        return this.createBucketLister(0)(aggregatedArr);
    };

    Bucket.prototype.getEntries = function (destEntries) {
        var startIndex = destEntries.length;
        for (var i = 0, entries = this.entries, len = entries.length; i < len; ++i) {
            destEntries[startIndex + i] = entries[i].slice(0);
        }
    };

    Bucket.prototype.containsKey = function (key) {
        return this.createBucketSearcher(HashTableEntries.EXISTENCE)(key);
    };

    Bucket.prototype.containsValue = function (value) {
        var entries = this.entries, i = entries.length;
        while (i--) {
            if (value === entries[i][1]) {
                return true;
            }
        }
        return false;
    };

    Bucket.prototype.createBucketLister = function (entryProperty) {
        var _this = this;
        return function (aggregatedArr) {
            var startIndex = aggregatedArr.length;
            for (var i = 0, entries = _this.entries, len = entries.length; i < len; ++i) {
                aggregatedArr[startIndex + i] = entries[i][entryProperty];
            }

            return aggregatedArr;
        };
    };

    Bucket.prototype.createBucketSearcher = function (mode) {
        var _this = this;
        return function (key) {
            var i = _this.entries.length, entry, equals = _this.getEqualityFunction(key);

            while (i--) {
                entry = _this.entries[i];
                if (equals(key, entry[0])) {
                    switch (mode) {
                        case HashTableEntries.EXISTENCE:
                            return true;
                        case HashTableEntries.ENTRY:
                            return entry;
                        case HashTableEntries.ENTRY_INDEX_AND_VALUE:
                            return [i, entry[1]];
                    }
                }
            }
            return false;
        };
    };
    return Bucket;
})();
//# sourceMappingURL=Bucket.js.map
