/**
 * Created by davidatborresen on 9/3/13.
 */
interface IDistance {

    /**
     * Computes the distance in input space
     * between two points given in feature space.
     * @param x Vector x in feature (kernel) space.
     * @param y Vector y in feature (kernel) space.
     * @return number Distance between x and y in input space.
     */
    distance(x:number[], y:number[]):number;
}