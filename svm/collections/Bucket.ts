/**
 * Created by davidatborresen on 11.09.13.
 */
///<reference path='./HashTable.ts' />

class Bucket {

    public entries:any[];

    constructor(hash, firstKey, firstValue, equalityFunction =  null)
    {
        this[0] = hash;
        this.entries = [];
        this.addEntry(firstKey, firstValue);

        if(equalityFunction !== null)
        {
            this.getEqualityFunction = function()
            {
                return equalityFunction;
            };
        }
        else
        {
            this.getEqualityFunction = function()
            {
                return this.equals_fixedValueNoEquals;
            }
        }
    }

    /**
     * @param fixedValue
     * @param variableValue
     * @returns {null|*}
     */
    public equals_fixedValueHasEquals(fixedValue, variableValue)
    {
        return fixedValue.equals(variableValue);
    }

    /**
     * @param fixedValue
     * @param variableValue
     * @returns {null|*}
     */
    public equals_fixedValueNoEquals(fixedValue, variableValue)
    {
        return (typeof variableValue.equals == HashTable.FUNCTION) ?
            variableValue.equals(fixedValue) : (fixedValue === variableValue);
    }

    /**
     * @param searchValue
     * @returns {function(*, *): (null|*)}
     */
    public getEqualityFunction(searchValue):Function
    {
        return (typeof searchValue.equals == HashTable.FUNCTION) ? this.equals_fixedValueHasEquals : this.equals_fixedValueNoEquals;
    }

    /**
     * @param key
     * @returns {*}
     */
    public getEntryForKey(key)
    {
        return this.createBucketSearcher(HashTableEntries.ENTRY).apply(this, [key]);
    }

    /**
     * @param key
     * @returns {*}
     */
    public getEntryAndIndexForKey(key:any)
    {
        return this.createBucketSearcher(HashTableEntries.ENTRY_INDEX_AND_VALUE)(key);
    }

    /**
     * @param key
     * @returns {*}
     */
    public removeEntryForKey(key:any):any
    {
        var result = this.getEntryAndIndexForKey(key);
        if(result)
        {
            this.entries.splice(result[0], 1);
            return result[1];
        }
        return null;
    }

    /**
     * @param key
     * @param value
     */
    public addEntry(key:any, value:any):void
    {
        this.entries.push([key, value]);
    }

    /**
     * @returns {*}
     */
    public keys(aggregatedArr):Function
    {
        return this.createBucketLister(0)(aggregatedArr);
    }

    /**
     * @returns {*}
     */
    public values(aggregatedArr):Function
    {
        return this.createBucketLister(0)(aggregatedArr);
    }

    /**
     * @param destEntries
     */
    public getEntries(destEntries:Array):void
    {
        var startIndex = destEntries.length;
        for(var i = 0, entries = this.entries, len = entries.length; i < len; ++i)
        {
            // Clone the entry stored in the bucket before adding to array
            destEntries[startIndex + i] = entries[i].slice(0);
        }
    }


    /**
     * @param key
     * @returns {*}
     */
    public containsKey(key:any):boolean
    {
        return this.createBucketSearcher(HashTableEntries.EXISTENCE)(key);
    }

    /**
     * @param value
     * @returns {boolean}
     */
    public containsValue(value:any):boolean
    {
        var entries = this.entries, i = entries.length;
        while(i--)
        {
            if(value === entries[i][1])
            {
                return true;
            }
        }
        return false;
    }

    /**
     * @param entryProperty
     * @returns {function(*)}
     */
    private createBucketLister(entryProperty):Function
    {
        return (aggregatedArr)=>
        {
            var startIndex = aggregatedArr.length;
            for(var i = 0, entries = this.entries, len = entries.length; i < len; ++i)
            {
                aggregatedArr[startIndex + i] = entries[i][entryProperty];
            }

            return aggregatedArr;
        };
    }

    /**
     * @param mode
     * @returns {function(*)}
     */
    private createBucketSearcher(mode:HashTableEntries):Function
    {
        return (key)=>
        {
            var i = this.entries.length, entry,
                equals = this.getEqualityFunction(key);

            while(i--)
            {
                entry = this.entries[i];
                if(equals(key, entry[0]))
                {
                    switch(mode)
                    {
                        case HashTableEntries.EXISTENCE:
                            return true;
                        case HashTableEntries.ENTRY:
                            return entry;
                        case HashTableEntries.ENTRY_INDEX_AND_VALUE:
                            return [ i, entry[1] ];
                    }
                }
            }
            return false;
        };
    }
}