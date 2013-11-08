/**
 * Created by davidatborresen on 12.10.13.
 */

///<reference path='./IRenderer.ts' />

interface ICanvasRenderer extends IRenderer
{
    drawBackground(matrix:number[][], color:string):ICanvasRenderer;
    drawAxis():ICanvasRenderer;
    drawMargin():ICanvasRenderer;
    clearCanvas():ICanvasRenderer;
}