/**
 * Created by davidatborresen on 21.09.13.
 */
///<reference path='../../definitions/underscore.d.ts' />


module SVM.Util {

    export function arrayPopulate(delta:number, value:any):any[]
    {
        var result;
        if(_.isString(value) || _.isNumber(value))
        {
            result = value;
        }
        else if(_.isFunction(value))
        {
             result = value.call(this, arguments);
        }
        else
        {
            throw new Error('Passed value is not supported.');
        }

        return Array.apply(null, new Array(delta)).map(()=>
        {
            return result;
        }, value);
    }
}
