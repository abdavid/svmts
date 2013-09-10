var HashSet = (function () {
    function HashSet() {
        this.items = [];
    }
    HashSet.prototype.add = function (whatever) {
        this.items.push(whatever);
    };

    HashSet.prototype.remove = function (whatever) {
        delete this.items[whatever];
    };

    HashSet.prototype.contains = function (whatever) {
        return this.items.indexOf(whatever) > -1;
    };

    HashSet.prototype.count = function () {
        return this.items.length;
    };

    HashSet.prototype.at = function (i) {
        return this.items[i];
    };
    return HashSet;
})();
//# sourceMappingURL=HashSet.js.map
