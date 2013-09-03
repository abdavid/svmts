/**
 * Created by davidatborresen on 9/2/13.
 */
///<reference path='../../definitions/underscore.d.ts' />
class FeatureModel {

    /**
     * @var number
     */
    private _class:number;

    /**
     * @var Object
     */
    private _data:Object;

    /**
     * @var number
     */
    private _length:number;

    /**
     * @param _class
     * @param data
     */
    constructor(_class:number, data:Object)
    {
        this._class = _class;
        this._data = data;
        this._length = _.size(data);
    }

    /**
     * @returns {Object}
     */
    public getData():Object
    {
        return this._data;
    }
}