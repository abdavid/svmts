/**
 * Created by davidatborresen on 17.09.13.
 */

///<reference path='.././d3.d.ts' />
///<reference path='../interfaces/ICollection.ts' />
///<reference path='../algorithms/SequentialMinimalOptimization.ts' />


module SVM.Renderer {

    export class D3 implements IRenderer {

        width:number;
        height:number;

        smo:SequentialMinimalOptimization;

        color:any;
        svg:any;
        xAxis:any;
        yAxis:any;
        x:any;
        y:any;
        z:any;

        constructor(options)
        {
            this.smo = options.smo;
            this.width = 720; //options.width;
            this.height = 720; //options.height;
        }

        public render():D3
        {
            var margin = {top: 20, right: 20, bottom: 30, left: 40},
                width = this.width - margin.left - margin.right,
                height = this.height - margin.top - margin.bottom;

            this.x = d3.scale.linear()
                .range([0, width]);

            this.y = d3.scale.linear()
                .range([height, 0]);

            this.color = d3.scale.category10();

            this.xAxis = d3.svg.axis()
                .scale(this.x)
                .orient("bottom");

            this.yAxis = d3.svg.axis()
                .scale(this.y)
                .orient("left");

            this.svg = d3.select("body").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            this.svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(this.xAxis);

            this.svg.append("g")
                .attr("class", "y axis")
                .call(this.yAxis);

            this.x.domain(d3.extent(this.smo.inputs, function(d)
            {
                return d[0];
            })).nice();
            this.y.domain(d3.extent(this.smo.inputs, function(d)
            {
                return d[1];
            })).nice();

            //this.paintDecisionBackground();

            this.paintDataPoints();

            return this;
        }

        private  paintDataPoints():void
        {
            this.svg.selectAll(".dot")
                .data(this.smo.inputs)
                .enter().append("circle")
                .attr("class", "dot")
                .attr("r", (d)=>
                {
                    return 3.5;
                })
                .attr("cx", (d)=>
                {
                    return this.x(d[0]);
                })
                .attr("cy", (d)=>
                {
                    return this.y(d[1]);
                })
                .style("fill", (d, i)=>
                {
                    return this.smo.outputs[i] === -1 ? 'red' : 'green';
                });

            var legend = this.svg.selectAll(".legend")
                .data(this.color.domain())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i)
                {
                    return "translate(0," + i * 20 + ")";
                });

            legend.append("rect")
                .attr("x", this.width - 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", this.color);

            legend.append("text")
                .attr("x", this.width - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d)
                {
                    return d;
                });
        }

        private paintDecisionBackground():void
        {

            var vertices = d3.range(5).map((d) =>
                {
                    return [Math.random() * this.width, Math.random() * this.height];
                }),
                voronoi = d3.geom.voronoi().clipExtent([
                    [0, 0],
                    [this.width, this.height]
                ]),
                path = this.svg.append("g").selectAll("path");

            path = path.data(voronoi(vertices).map(function(d)
            {
                return "M" + d.join("L") + "Z";
            }), String);
            path.exit().remove();
            path.enter().append("path").attr("class",function(d, i)
            {
                return "q" + (i % 9) + "-9";
            }).attr("d", String);
            path.order();
        }
    }
}
