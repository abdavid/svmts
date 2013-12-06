/**
 * Created by davidatborresen on 21.09.13.
 */

///<reference path='../../definitions/underscore.d.ts' />

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
        throw 'Passed value is not supported.';
    }

    return Array.apply(null, new Array(delta)).map(()=>
    {
        return result;
    }, value);
}
