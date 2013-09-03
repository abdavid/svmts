/**
* Created by davidatborresen on 9/2/13.
*/
///<reference path='../../definitions/underscore.d.ts' />
var FeatureModel = (function () {
    /**
    * @param _class
    * @param data
    */
    function FeatureModel(_class, data) {
        this._class = _class;
        this._data = data;
        this._length = _.size(data);
    }
    /**
    * @returns {Object}
    */
    FeatureModel.prototype.getData = function () {
        return this._data;
    };
    return FeatureModel;
})();
//# sourceMappingURL=FeatureModel.js.map
