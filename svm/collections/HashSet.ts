/**
 * Created by davidatborresen on 9/4/13.
 */

///<reference path='./HashTable.ts' />

class HashSet {

    public hashTable:HashTable;

    constructor()
    {
        this.hashTable = new HashTable();
    }

    /**
     * @param o
     */
    public add(o:any):void
    {
        this.hashTable.put(o, true);
    }

    /**
     * @param arr
     */
    public addAll(arr:Array):void
    {
        for(var i = 0, len = arr.length; i < len; ++i)
        {
            this.hashTable.put(arr[i], true);
        }
    }

    /**
     * @returns {*}
     */
    public values():any[]
    {
        return this.hashTable.values();
    }

    /**
     * @returns {*}
     */
    public keys():any[]
    {
        return this.hashTable.keys();
    }

    /**
     * @param o
     * @returns {*}
     */
    public remove(o:any):any
    {
        return this.hashTable.remove(o) ? o : null;
    }

    /**
     * @param o
     * @returns {boolean}
     */
    public contains(o):boolean
    {
        return this.hashTable.containsKey(o);
    }

    public clear():void
    {
        this.hashTable.clear();
    }

    /**
     * @returns {number}
     */
    public size():number
    {
        return this.hashTable.size();
    }

    /**
     * @returns {boolean}
     */
    public isEmpty():boolean
    {
        return this.hashTable.isEmpty();
    }

    /**
     * @returns {HashSet}
     */
    public clone():HashSet
    {
        var h = new HashSet();
        h.addAll(this.hashTable.keys());
        return h;
    }

    /**
     * @param hashSet
     * @returns {HashSet}
     */
    public intersection(hashSet:HashSet):HashSet
    {
        var intersection = new HashSet();
        var values = hashSet.values(), i = values.length, val;
        while(i--)
        {
            val = values[i];
            if(this.hashTable.containsKey(val))
            {
                intersection.add(val);
            }
        }
        return intersection;
    }

    /**
     * @param hashSet
     * @returns {HashSet}
     */
    public union(hashSet:HashSet):HashSet
    {
        var union = this.clone();
        var values = hashSet.values(), i = values.length, val;
        while(i--)
        {
            val = values[i];
            if(!this.hashTable.containsKey(val))
            {
                union.add(val);
            }
        }
        return union;
    }

    /**
     * @param hashSet
     * @returns {boolean}
     */
    public isSubsetOf(hashSet:HashSet):boolean
    {
        var values = this.hashTable.keys(), i = values.length;
        while(i--)
        {
            if(!hashSet.contains(values[i]))
            {
                return false;
            }
        }
        return true;
    }

    /**
     * @param hashSet
     * @returns {HashSet}
     */
    public complement(hashSet:HashSet)
    {
        var complement = new HashSet(),
            values = this.values(), i = values.length, val;

        while(i--)
        {
            val = values[i];
            if(!hashSet.contains(val))
            {
                complement.add(val);
            }
        }
        return complement;
    }

    /**
     * @param key
     * @returns {*}
     */
    public get(key:any):any
    {
        return this.hashTable.get(key);
    }

}
