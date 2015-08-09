function InteractionsMoleculePlot(paramInteractionsData, paramViena, paramSequence,paramTargetSelector,paramWidth,paramHeight){
    this.targetSelector = paramTargetSelector
    this.viena = paramViena
    this.sequence = paramSequence
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

InteractionsMoleculePlot.prototype.addFilter = function(filter){
    this.filterFunctions.push(filter)
}


InteractionsMoleculePlot.prototype.draw = function(){

    $(this.targetSelector).html("")

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

    var nodes = []
    var links = []
    for (var i = 0, len = this.sequence.length; i < len; i++) {
        nodes.push({
            id:i,
            label:this.sequence[i]
        })
    }

    for (var i = 0, len = this.sequence.length-1; i < len; i++) {
        links.push({
            source:nodes[i],
            target:nodes[i+1],
            linkDistance:10,
            linkStrength:10
        })
    }

    var stack = []
    for(var i=0, len = this.viena.length;i!=len;++i){
        if(this.viena[i]=='('){
            stack.push(i)
        }
        if(viena[i]==')'){
            var s = stack.pop()
            links.push({
                source:nodes[s],
                target:nodes[i],
                linkDistance:15,
                linkStrength:5
            })
        }
    }

    var graphWidth = this.width;
    var graphHeight = this.height;
    var svg = d3.select(this.targetSelector).append("svg")
        .attr("width", graphWidth)
        .attr("height", graphHeight)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");


    var styles;
    jQuery.ajax({
        url:    'interactions-molecule-plot.css',
        success: function(result) {
            styles=result;
        },
        async:   false
    });

    svg.append("defs").append("style").attr("type","text/css").text(styles)

    svg.append("defs").append("marker")
        .attr("id", "markerArrow")
        .attr("refX", 13)
        .attr("refY", 6)
        .attr("markerWidth", 13)
        .attr("markerHeight", 13)
        .attr("orient", "auto")
        .attr("fill","#999")
        .append("path")
        .attr("d", "M2,2 L2,11 L10,6 L2,2");



    var force = d3.layout.force()
        .size([graphWidth,graphHeight])
        .nodes(nodes)
        .links(links)
        .linkDistance ( function(l){ return l.linkDistance} )
        .linkStrength (function(l){return l.linkStrength})
        .charge ( - 50 )
        .alpha(0.1)
        .on ( "tick", tick ) ;

    var drag = force.drag()
        .on("dragstart", dragstart);

    var node = svg.selectAll ( ".node" ),
        link = svg.selectAll ( ".link" ) ;

    function tick ( ) {

        link.attr("x1", function (d) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        node.attr ( "transform", function ( d ) {
            var xx = d.x
            var yy = d.y
            return "translate(" + xx + "," + yy + ")" ;
        } ) ;
    }


    link = link.data(force.links());

    var l = link.enter().insert("line", ".node")
        .attr("class", "link")

    link.exit().remove();

    node = node.data ( force.nodes() ) ;
    node.exit().remove()

    var g = node.enter().append("g")
        .attr ( "class", "node" )
        .attr("id",function(d){return "gg"+ d.id})
        .call ( force.drag )


    var self = this

    g.append ( "circle" )
        .attr ( "class", "node" )
        .attr("id",function(d){return "cc"+ d.id})
        .attr ( "r", 5 )
        .style("fill",function(d){
            return "white";

        })
        .on("dblclick", dblclick)
        .on('mouseover', function(d){

            var position = nodes.indexOf(d);

            var coeffs = self.interactionsData.coeffs[position]

            for(var i in coeffs){
                var coeff = coeffs[i]
                if(coeff>0){
                    d3.select("#cc" + i).style("fill", "red")
                }
                else{
                    d3.select("#cc" + i).style("fill", "lime")
                }

                //d3.select("#gg" + i).append("text").text("coeff: "+coeff)
            }
        })
        .on('mouseout', function(d){
            var coeffs = self.interactionsData.coeffs[nodes.indexOf(d)]
            for(var i in coeffs){
                var coeff = coeffs[i]
                if(coeff>0){
                    d3.select("#cc" + i).style("fill", "")
                }
                else{
                    d3.select("#cc" + i).style("fill", "")
                }
                d3.select("#gg"+i+" text").remove()
            }
        })
        .append("svg:title")
        .text(function ( d ) { return d.label+" "+ (d.id+1) } )



    force.size( [graphWidth, graphHeight] ).start()
    function dblclick(d) {
        d.fixed = false
        d3.select(this.parentNode).classed("fixed", false);
    }

    function dragstart(d) {
        d3.select(this).classed("fixed", (d.fixed = true));
    }

}