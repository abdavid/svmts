/**
 * Created by davidatborresen on 9/1/13.
 */


interface SGEOptions {
    canvas:HTMLCanvasElement;
    width:number;
    height:number;
    keyUp?: Function;
    keyDown?: Function;
    mouseClick?: Function;
    update?: Function;
    draw?: Function;
    drawOnce:boolean;
}

enum SGEDraw {
    init= 1,
    drawn= 2,
    redraw = 3,

}

/**
 * Simple Game Engine
 * This class does all the boring canvas stuff. To use it, just pass these properties with your callbacks:
 * update()          gets called every frame
 * draw()            gets called every frame
 * mouseClick(x, y)  gets called on mouse click
 * keyUp(keycode)    gets called when key is released
 * keyDown(keycode)  gets called when key is pushed
 *
 * http://www.aspdotnetfaq.com/Faq/What-is-the-list-of-KeyCodes-for-JavaScript-KeyDown-KeyPress-and-KeyUp-events.aspx
 */
class SGE {

    public static FPS:number;

    private keyUp:Function;
    private keyDown:Function;
    private mouseClick:Function;
    private update:Function;
    private draw:Function;
    private lastRedraw:number;
    private drawOnce:SGEDraw;

    public height:number;
    public width:number;
    public canvas:HTMLCanvasElement;
    public ctx:CanvasRenderingContext2D;

    constructor(options:SGEOptions)
    {
        var noop = ()=> {};

        this.canvas = options.canvas;
        this.ctx = options.canvas.getContext('2d');
        this.width = options.width;
        this.height = options.height;

        if(this.ctx)
        {
            this.ctx.canvas.width = this.width;
            this.ctx.canvas.height = this.height;
        }

        this.keyUp = options.keyUp || noop;
        this.keyDown = options.keyDown || noop;
        this.mouseClick = options.mouseClick || noop;
        this.update = options.update || false;
        this.draw = options.draw || false;
        this.drawOnce = options.drawOnce || SGEDraw.redraw;

        var date = new Date();
        this.lastRedraw = date.getTime();
        this.initEvents();
    }

    public render():void
    {
        window.requestAnimationFrame(() => this.tick());
    }

    /**
     * @param x
     * @param y
     * @param w
     * @param h
     * @param radius
     */
    public drawBubble(x:number, y:number, w:number, h:number, radius:number):void
    {
        var r = x + w,
            b = y + h;

        this.ctx.beginPath();
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 2;
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + radius / 2, y - 10);
        this.ctx.lineTo(x + radius * 2, y);
        this.ctx.lineTo(r - radius, y);
        this.ctx.quadraticCurveTo(r, y, r, y + radius);
        this.ctx.lineTo(r, y + h - radius);
        this.ctx.quadraticCurveTo(r, b, r - radius, b);
        this.ctx.lineTo(x + radius, b);
        this.ctx.quadraticCurveTo(x, b, x, b - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.stroke();
    }

    /**
     * @param x
     * @param y
     * @param w
     * @param h
     */
    public drawRect(x:number, y:number, w:number, h:number)
    {
        this.ctx.beginPath();
        this.ctx.rect(x, y, w, h);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }

    /**
     * @param x
     * @param y
     * @param r
     */
    public drawCircle(x:number, y:number, r:number)
    {
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.fill();
    }

    /**
     * @param e
     */
    public eventClick(e:MouseEvent)
    {
        //get position of cursor relative to top left of canvas
        var x,y;

        if (e.pageX || e.pageY)
        {
            x = e.pageX;
            y = e.pageY;
        }
        else
        {
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        x -= this.canvas.offsetLeft;
        y -= this.canvas.offsetTop;

        //call user-defined callback
        this.mouseClick(x, y, e.shiftKey);
    }

    /**
     * @param s
     * @param e
     * @returns {number}
     */
    private randi(s:number, e:number)
    {
        return Math.floor(Math.random() * (e - s) + s);
    }

    /**
     * @param s
     * @param e
     * @returns {number}
     */
    private randf(s:number, e:number)
    {
        return Math.random() * (e - s) + s;
    }

    /**
     * @param mean
     * @param variance
     * @returns {number}
     */
    private randn(mean:number, variance:number)
    {
        var V1, V2, S, X;
        do {
            var U1 = Math.random();
            var U2 = Math.random();
            V1 = 2 * U1 - 1;
            V2 = 2 * U2 - 1;
            S = V1 * V1 + V2 * V2;
        } while (S > 1);
        X = Math.sqrt(-2 * Math.log(S) / S) * V1;
        X = mean + Math.sqrt(variance) * X;
        return X;
    }

    /**
     * @param e
     */
    public eventKeyUp(e:KeyboardEvent)
    {
        var keycode = ('which' in e) ? e.which : e.keyCode;
        this.keyUp(keycode);
    }

    /**
     * @param e
     */
    public eventKeyDown(e:KeyboardEvent)
    {
        var keycode = ('which' in e) ? e.which : e.keyCode;
        this.keyDown(keycode);
    }

    /**
     * canvas element cannot get focus by default. Requires to either set
     * tabindex to 1 so that it's focusable, or we need to attach listeners
     * to the document. Here we do the latter
     */
    public initEvents()
    {
        this.canvas.addEventListener('click', (event) =>this.eventClick, false);
        document.addEventListener('keyup', (event) => this.eventKeyUp, true);
        document.addEventListener('keydown', (event) => this.eventKeyDown, true);
    }

    public tick()
    {
        var delta = (new Date().getTime() - this.lastRedraw)/1000;

        this.lastRedraw = new Date().getTime();

        if(this.drawOnce === SGEDraw.init || this.drawOnce === SGEDraw.redraw)
        {
            window.requestAnimationFrame(() => this.tick());

            if(this.drawOnce === SGEDraw.init)
            {
                this.drawOnce = SGEDraw.drawn;
            }
        }

        SGE.FPS = 1/delta;

        if(this.update)
        {
            this.update.call(this);
        }

        if(this.draw)
        {
            this.draw.call(this);
        }
    }
}

