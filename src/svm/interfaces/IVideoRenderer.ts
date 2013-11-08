/**
 * Created by davidatborresen on 12.10.13.
 */

///<reference path='./IRenderer.ts' />

interface IVideoRenderer extends IRenderer
{
    snapShot():Blob;
    trace():void
}