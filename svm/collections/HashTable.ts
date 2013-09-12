/**
 * Created by davidatborresen on 11.09.13.
 */

///<reference path='./Bucket.ts' />
enum HashTableEntries {
    EXISTENCE = 0,
    ENTRY = 1,
    ENTRY_INDEX_AND_VALUE = 2,
}

interface HashTableOptions {
    replaceDuplicateKey: boolean
    hashCode: Function;
    equals: any;
}

class HashTable {

    public static FUNCTION = 'function';
    public static STRING = 'string';
    public static UNDEFINED = 'undefined';

    private buckets:Bucket[] = [];
    private bucketsByHash:Object = {};
    private properties:HashTableOptions;

    public keys:Function;
    public values:Function;
    public entries:Function;

    private checkKey:Function;
    private checkValue:Function;

    constructor(options:Object = null)
    {
        if(this.isLegacy())
        {
            throw new Error('Missing nessesary components');
        }

        var properties = {
            replaceDuplicateKey: true,
            hashCode: () => this.hashObject,
            equals: null
        };

        if(properties)
        {
            properties = <HashTableOptions>this.merge(properties, options);
        }

        this.properties = properties;
        this.keys = this.createBucketAggregator('keys');
        this.values = this.createBucketAggregator('values');
        this.entries = this.createBucketAggregator('getEntries');
        this.checkKey = this.createKeyValCheck('key');
        this.checkValue = this.createKeyValCheck('value');
    }

    /**
     * @returns {boolean}
     */
    private isLegacy():boolean
    {
        return typeof encodeURIComponent === HashTable.UNDEFINED || typeof Array.prototype.splice === HashTable.UNDEFINED || typeof Array.prototype.hasOwnProperty === HashTable.UNDEFINED;
    }

    /**
     * @param obj
     * @returns {*}
     */
    public toStr(obj:any):string
    {
        return (typeof obj == HashTable.STRING) ? obj : obj.toString();
    }

    /**
     * @param obj
     * @returns {*}
     */
    private hashObject(obj:any):string
    {
        var hashCode;
        if(typeof obj == HashTable.STRING)
        {
            return obj;
        }
        else if(typeof obj.hashCode == HashTable.FUNCTION)
        {
            // Check the hashCode method really has returned a string
            hashCode = obj.hashCode();
            return (typeof hashCode == HashTable.STRING) ? hashCode : this.hashObject(hashCode);
        }
        else
        {
            return this.toStr(obj);
        }
    }

    /**
     * @param o1
     * @param o2
     */
    private merge(o1:Object, o2:Object):Object
    {
        for(var i in o2)
        {
            if(o2.hasOwnProperty(i))
            {
                o1[i] = o2[i];
            }
        }

        return o1;
    }

    /**
     * @param kvStr
     * @returns {function(*)}
     */
    private createKeyValCheck(kvStr:string):Function
    {
        return (kv)=>
        {
            if(kv === null)
            {
                throw new Error("null is not a valid " + kvStr);
            }
            else if(kv === HashTable.UNDEFINED)
            {
                throw new Error(kvStr + " must not be undefined");
            }
        };
    }


    private searchBuckets(buckets, hash)
    {
        var i = buckets.length, bucket;
        while(i--)
        {
            bucket = buckets[i];
            if(hash === bucket[0])
            {
                return i;
            }
        }
        return null;
    }

    /**
     * @param key
     * @param value
     * @returns {*}
     */
    public put(key:any, value:any)
    {
        this.checkKey(key);
        this.checkValue(value);

        var hash = this.properties.hashCode(key),
            bucket = this.getBucketForHash(this.bucketsByHash, hash),
            bucketEntry,
            oldValue = null;

        // Check if a bucket exists for the bucket key
        if(bucket)
        {
            // Check this bucket to see if it already contains this key
            bucketEntry = bucket.getEntryForKey(key);
            if(bucketEntry)
            {
                // This bucket entry is the current mapping of key to value, so replace the old value.
                // Also, we optionally replace the key so that the latest key is stored.
                if(this.properties.replaceDuplicateKey)
                {
                    bucketEntry[0] = key;
                }
                oldValue = bucketEntry[1];
                bucketEntry[1] = value;
            }
            else
            {
                // The bucket does not contain an entry for this key, so add one
                bucket.addEntry(key, value);
            }
        }
        else
        {
            // No bucket exists for the key, so create one and put our key/value mapping in
            bucket = new Bucket(hash, key, value);
            this.buckets.push(bucket);
            this.bucketsByHash[hash] = bucket;
        }
        return oldValue;
    }

    /**
     * @param key
     * @returns {*}
     */
    public get(key:string):any
    {
        this.checkKey(key);

        var hash = this.properties.hashCode(key);

        // Check if a bucket exists for the bucket key
        var bucket = this.getBucketForHash(this.bucketsByHash, hash);
        if(bucket)
        {
            // Check this bucket to see if it contains this key
            var bucketEntry = bucket.getEntryForKey(key);
            if(bucketEntry)
            {
                // This bucket entry is the current mapping of key to value, so return the value.
                return bucketEntry[0];
            }
        }
        return null;
    }

    /**
     * @param key
     * @returns {*}
     */
    public containsKey(key:string):boolean
    {
        this.checkKey(key);
        var bucketKey = this.properties.hashCode(key);

        // Check if a bucket exists for the bucket key
        var bucket = this.getBucketForHash(this.bucketsByHash, bucketKey);

        return bucket ? bucket.containsKey(key) : false;
    }

    /**
     * @param value
     * @returns {boolean}
     */
    public containsValue(value:any):boolean
    {
        this.checkValue(value);
        var i = this.buckets.length;
        while(i--)
        {
            if(this.buckets[i].containsValue(value))
            {
                return true;
            }
        }
        return false;
    }

    /**
     *
     */
    public clear():void
    {
        this.buckets.length = 0;
        this.bucketsByHash = {};
    }

    /**
     * @returns {boolean}
     */
    public isEmpty():boolean
    {
        return !this.buckets.length;
    }

    /**
     * @param bucketFuncName
     * @returns {function()}
     */
    private createBucketAggregator(bucketFuncName):Function
    {
        return ()=>
        {
            var aggregated = [], i = this.buckets.length;
            while(i--)
            {
                this.buckets[i][bucketFuncName](aggregated);
            }
            return aggregated;
        };
    }

    /**
     * @param bucketsByHash
     * @param hash
     * @returns {*}
     */
    private getBucketForHash(bucketsByHash, hash):Bucket
    {
        var bucket = bucketsByHash[hash];

        // Check that this is a genuine bucket and not something inherited from the bucketsByHash's prototype
        return ( bucket && (bucket instanceof Bucket) ) ? bucket : null;
    }

    /**
     * @param callback
     */
    public each(callback:Function):void
    {
        var entries = this.entries(), i = entries.length, entry;
        while(i--)
        {
            entry = entries[i];
            callback(entry[0], entry[1]);
        }
    }

    /**
     * @param hashtable
     * @returns {boolean}
     */
    public equals(hashtable:HashTable):boolean
    {
        var keys, key, val, count = this.size();
        if(count == hashtable.size())
        {
            keys = this.keys();
            while(count--)
            {
                key = keys[count];
                val = hashtable.get(key);
                if(val === null || val !== this.get(key))
                {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    /**
     * @param hashtable
     * @param conflictCallback
     */
    public putAll(hashtable:HashTable, conflictCallback:Function = null)
    {
        var entries = hashtable.entries(),
            entry, key, value, thisValue, i = entries.length,
            hasConflictCallback = (typeof conflictCallback == HashTable.FUNCTION);

        while(i--)
        {
            entry = entries[i];
            key = entry[0];
            value = entry[1];

            // Check for a conflict. The default behaviour is to overwrite the value for an existing key
            if(hasConflictCallback && (thisValue = this.get(key)))
            {
                value = conflictCallback(key, thisValue, value);
            }

            this.put(key, value);
        }
    }

    /**
     * @returns {HashTable}
     */
    public clone():HashTable
    {
        var clone = new HashTable(this.properties);
        clone.putAll(this);
        return clone;
    }

    /**
     * @param key
     * @returns {*}
     */
    public remove(key:string):any
    {
        this.checkKey(key);

        var hash = this.properties.hashCode(key), bucketIndex, oldValue = null;

        // Check if a bucket exists for the bucket key
        var bucket = this.getBucketForHash(this.bucketsByHash, hash);

        if(bucket)
        {
            // Remove entry from this bucket for this key
            oldValue = bucket.removeEntryForKey(key);
            if(oldValue !== null)
            {
                // Entry was removed, so check if bucket is empty
                if(bucket.entries.length == 0)
                {
                    // Bucket is empty, so remove it from the bucket collections
                    bucketIndex = this.searchBuckets(this.buckets, hash);
                    this.buckets.splice(bucketIndex, 1);
                    delete this.bucketsByHash[hash];
                }
            }
        }
        return oldValue;
    }

    /**
     * @returns {number}
     */
    public size():number
    {
        var total = 0, i = this.buckets.length;
        while(i--)
        {
            total += this.buckets[i].entries.length;
        }
        return total;
    }

    /**
     * @returns {string}
     */
    public toQueryString():string
    {
        var entries = this.entries(), i = entries.length, entry;
        var parts = [];
        while(i--)
        {
            entry = entries[i];
            parts[i] = encodeURIComponent(this.toStr(entry[0])) + "=" + encodeURIComponent(this.toStr(entry[1]));
        }
        return parts.join("&");
    }
}

