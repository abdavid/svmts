/**
 * Created by davidatborresen on 9/3/13.
 */

/**
 * Common interface for Support Vector Machines
 */
interface ISupportVectorMachine {


    /**
     * Computes the given input to produce the corresponding output.
     * @param inputs An input vector.
     * @param output The output for the given input.
     * @returns number The decision label for the given input.
     */
    compute(inputs:number[]):number;
}