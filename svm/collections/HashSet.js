var HashSet = (function () {
    function HashSet(elements) {
        if (typeof elements === "undefined") { elements = []; }
        this._elements = elements;
    }
    HashSet.prototype.contains = function (value) {
        return [].indexOf.call(this._elements, value) > -1;
    };

    HashSet.prototype.add = function (value) {
        this._elements.push(value);
    };

    HashSet.prototype.get = function (value) {
        var index;
        if ((index = [].indexOf.call(this._elements, value)) !== -1) {
            return this._elements[index];
        }

        return void (1);
    };

    HashSet.prototype.remove = function (value) {
        var index;
        if ((index = [].indexOf.call(this._elements, value)) !== -1) {
            this._elements = this._elements.splice(index, 1);
        }
    };

    HashSet.prototype.values = function () {
        return this._elements;
    };

    HashSet.prototype.toString = function () {
        return '[object HashSet]';
    };
    return HashSet;
})();
//# sourceMappingURL=HashSet.js.map
