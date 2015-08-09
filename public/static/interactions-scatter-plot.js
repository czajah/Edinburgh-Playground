function InteractionsScatterPlot(paramInteractionsData,paramTargetSelector,paramWidth,paramHeight){
    this.targetSelector = paramTargetSelector
    this.interactionsData = paramInteractionsData

    this.margin = {top: 40, right: 40, bottom: 40, left: 40}
    this.width = paramWidth - this.margin.left - this.margin.right
    this.height = paramHeight - this.margin.top - this.margin.bottom;

    this.x = d3.scale.linear().range([0, this.width]);

    this.y = d3.scale.linear().range([this.height, 0]);

    var color = d3.scale.category10();

    this.xAxis = d3.svg.axis()
        .scale(this.x)
        .orient("bottom");

    this.yAxis = d3.svg.axis()
        .scale(this.y)
        .orient("left");

    this.filterFunctions = []
    this.pointLabel = function(d){
        return d.mutation_1+" <-> "+ d.mutation_2+" : "+ d.regression_coeff;
    }
}

InteractionsScatterPlot.prototype.addFilter = function(filter){
    this.filterFunctions.push(filter)
}


InteractionsScatterPlot.prototype.draw = function(){

    $(this.targetSelector).html("")

    var styles;
    jQuery.ajax({
        url:    'interactions-scatter-plot.css',
        success: function(result) {
            styles=result;
        },
        async:   false
    });

    var svg = d3.select(this.targetSelector).append("svg")
        .attr("class","interactions-scatter-plot")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    svg.append("defs").append("style").attr("type","text/css").text(styles)

    var self = this
    var combinedFilterFunction = function(d){
        for(var ff in self.filterFunctions){
            if(!self.filterFunctions[ff](d)){
                return false;
            }
        }
        return true;
    }

    var filtered_data = this.interactionsData.data.filter(combinedFilterFunction)

    this.x.domain(d3.extent(this.interactionsData.data, function(d) { return d.mutation_1; })).nice();
    this.y.domain(d3.extent(this.interactionsData.data, function(d) { return d.mutation_2; })).nice();

    function draw(selection){
        var xy0,
            path,
            keep = false,
            line = d3.svg.line()
                .x(function(d){ return d[0]; })
                .y(function(d){ return d[1]; });

        selection
            .on('mousedown', function(){
                d3.select(".group-line").remove()
                keep = true;
                xy0 = d3.mouse(this);
                path = d3.select('svg').append("line")
                    .attr("class","group-line")
                    .attr("x1", xy0[0])
                    .attr("y1", xy0[1])
                    .attr("x2", xy0[0])
                    .attr("y2", xy0[1])
                    .style({'stroke': 'yellow', 'stroke-width': '5px','opacity':1});
            })
            .on('mouseup', function(){
                keep = false;
                console.log(path)
                if(path[0][0].x1.baseVal.value==path[0][0].x2.baseVal.value&&path[0][0].y1.baseVal.value==path[0][0].y2.baseVal.value){
                    d3.select(".group-line").remove()
                }

            })
            .on('mousemove', function(){
                if (keep) {
                    path
                        .attr("x1", xy0[0])
                        .attr("y1", xy0[1])
                        .attr("x2", d3.mouse(this)[0])
                        .attr("y2", d3.mouse(this)[1])
                }
            });
    }

    d3.select('svg')
        .call(draw);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")
        .call(this.xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", this.width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("mutation_1");

    svg.append("g")
        .attr("class", "y axis")
        .call(this.yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("mutation_2")


    var self = this
    svg.selectAll(".dot")
        .data(filtered_data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function(d) { return self.x(d.mutation_1); })
        .attr("cy", function(d) { return self.y(d.mutation_2); })
        .style("fill", function(d) { return d.regression_coeff<0?"white":"red" })

        .append("svg:title")
        .text(this.pointLabel);

}