/**
 * Created by davidatborresen on 9/2/13.
 */

class SVMModel {

    /**
     * @var number[]
     */
    private labels:number[];

    /**
     * @var Array[]
     */
    private data:Object[];

    constructor(labels:number[], data:Object[])
    {
        this.labels = labels;
        this.data = data;
    }
}