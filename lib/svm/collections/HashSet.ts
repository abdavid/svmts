/**
 * Created by davidatborresen on 9/4/13.
 */

class HashSet {

    public items:any[] = [];

    public add(whatever:any):void
    {
        this.items.push(whatever);
    }

    public remove(whatever:any)
    {
        delete this.items[whatever];
    }

    public contains(whatever:any):boolean
    {
        return this.items.indexOf(whatever) > -1;
    }

    public count():number
    {
        return this.items.length;
    }

    public at(i:number):any
    {
        return this.items[i];
    }
}