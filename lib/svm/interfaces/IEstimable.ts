/**
 * Created by davidatborresen on 9/3/13.
 */
interface IEstimable {

    /**
     * Estimates kernel parameters from the data.
     * @param inputs The input data.
     */
    estimate(inputs:Array[]):void;
}