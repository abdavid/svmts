/**
 * Created by davidatborresen on 9/3/13.
 */

interface IKernel {
    kernel(x:number[], y:number[]):number;
}


interface IDistance {
    distance(x:number[], y:number[]):number;
}

interface IEstimable {
    distance(x:number[], y:number[]):number;
}