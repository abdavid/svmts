var SVM;
(function (SVM) {
    (function (Renderer) {
        var D3 = (function () {
            function D3(options) {
                this.smo = options.smo;
                this.width = 720;
                this.height = 720;
            }
            D3.prototype.render = function () {
                var margin = { top: 20, right: 20, bottom: 30, left: 40 }, width = this.width - margin.left - margin.right, height = this.height - margin.top - margin.bottom;

                this.x = d3.scale.linear().range([0, width]);

                this.y = d3.scale.linear().range([height, 0]);

                this.color = d3.scale.category10();

                this.xAxis = d3.svg.axis().scale(this.x).orient("bottom");

                this.yAxis = d3.svg.axis().scale(this.y).orient("left");

                this.svg = d3.select("body").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                this.svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(this.xAxis);

                this.svg.append("g").attr("class", "y axis").call(this.yAxis);

                this.x.domain(d3.extent(this.smo.inputs, function (d) {
                    return d[0];
                })).nice();
                this.y.domain(d3.extent(this.smo.inputs, function (d) {
                    return d[1];
                })).nice();

                this.paintDataPoints();

                return this;
            };

            D3.prototype.paintDataPoints = function () {
                var _this = this;
                this.svg.selectAll(".dot").data(this.smo.inputs).enter().append("circle").attr("class", "dot").attr("r", function (d) {
                    return 3.5;
                }).attr("cx", function (d) {
                    return _this.x(d[0]);
                }).attr("cy", function (d) {
                    return _this.y(d[1]);
                }).style("fill", function (d, i) {
                    return _this.smo.outputs[i] === -1 ? 'red' : 'green';
                });

                var legend = this.svg.selectAll(".legend").data(this.color.domain()).enter().append("g").attr("class", "legend").attr("transform", function (d, i) {
                    return "translate(0," + i * 20 + ")";
                });

                legend.append("rect").attr("x", this.width - 18).attr("width", 18).attr("height", 18).style("fill", this.color);

                legend.append("text").attr("x", this.width - 24).attr("y", 9).attr("dy", ".35em").style("text-anchor", "end").text(function (d) {
                    return d;
                });
            };

            D3.prototype.paintDecisionBackground = function () {
                var _this = this;
                var vertices = d3.range(5).map(function (d) {
                    return [Math.random() * _this.width, Math.random() * _this.height];
                }), voronoi = d3.geom.voronoi().clipExtent([
                    [0, 0],
                    [this.width, this.height]
                ]), path = this.svg.append("g").selectAll("path");

                path = path.data(voronoi(vertices).map(function (d) {
                    return "M" + d.join("L") + "Z";
                }), String);
                path.exit().remove();
                path.enter().append("path").attr("class", function (d, i) {
                    return "q" + (i % 9) + "-9";
                }).attr("d", String);
                path.order();
            };
            return D3;
        })();
        Renderer.D3 = D3;
    })(SVM.Renderer || (SVM.Renderer = {}));
    var Renderer = SVM.Renderer;
})(SVM || (SVM = {}));
//# sourceMappingURL=D3.js.map
