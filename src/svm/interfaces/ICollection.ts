/**
 * Created by davidatborresen on 9/3/13.
 */

interface ICollection
{
    values():any[];
    keys():string[];
    equals(collection:ICollection):boolean;
    clone():ICollection;
}

interface IList
{
    add(whatever:any):void;
    count():number;
    remove(key:number):void;
    contains(key:number):boolean;
    clear():void;
}








