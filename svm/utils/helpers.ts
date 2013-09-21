/**
 * Created by davidatborresen on 21.09.13.
 */

module SVM.Util {

    export function zeroes(delta:number)
    {
        return Array.apply(null, new Array(delta)).map(Number.prototype.valueOf, 0)
    }
}
