var HashSet = (function () {
    function HashSet() {
        this.hashTable = new HashTable();
    }
    HashSet.prototype.add = function (o) {
        this.hashTable.put(o, true);
    };

    HashSet.prototype.addAll = function (arr) {
        for (var i = 0, len = arr.length; i < len; ++i) {
            this.hashTable.put(arr[i], true);
        }
    };

    HashSet.prototype.values = function () {
        return this.hashTable.values();
    };

    HashSet.prototype.keys = function () {
        return this.hashTable.keys();
    };

    HashSet.prototype.remove = function (o) {
        return this.hashTable.remove(o) ? o : null;
    };

    HashSet.prototype.contains = function (o) {
        return this.hashTable.containsKey(o);
    };

    HashSet.prototype.clear = function () {
        this.hashTable.clear();
    };

    HashSet.prototype.size = function () {
        return this.hashTable.size();
    };

    HashSet.prototype.isEmpty = function () {
        return this.hashTable.isEmpty();
    };

    HashSet.prototype.clone = function () {
        var h = new HashSet();
        h.addAll(this.hashTable.keys());
        return h;
    };

    HashSet.prototype.intersection = function (hashSet) {
        var intersection = new HashSet();
        var values = hashSet.values(), i = values.length, val;
        while (i--) {
            val = values[i];
            if (this.hashTable.containsKey(val)) {
                intersection.add(val);
            }
        }
        return intersection;
    };

    HashSet.prototype.union = function (hashSet) {
        var union = this.clone();
        var values = hashSet.values(), i = values.length, val;
        while (i--) {
            val = values[i];
            if (!this.hashTable.containsKey(val)) {
                union.add(val);
            }
        }
        return union;
    };

    HashSet.prototype.isSubsetOf = function (hashSet) {
        var values = this.hashTable.keys(), i = values.length;
        while (i--) {
            if (!hashSet.contains(values[i])) {
                return false;
            }
        }
        return true;
    };

    HashSet.prototype.complement = function (hashSet) {
        var complement = new HashSet(), values = this.values(), i = values.length, val;

        while (i--) {
            val = values[i];
            if (!hashSet.contains(val)) {
                complement.add(val);
            }
        }
        return complement;
    };

    HashSet.prototype.get = function (key) {
        return this.hashTable.get(key);
    };
    return HashSet;
})();
//# sourceMappingURL=HashSet.js.map
