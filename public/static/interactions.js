function InteractionsData(paramData){
    this.data = paramData

    this.data.forEach(function (d) {
        d.mutation_1 = +d.mutation_1;
        d.mutation_2 = +d.mutation_2;
        d.regression_coeff = +d.regression_coeff;
    });

////uncomment the bellow section to get data reflection over a line y=x
//
//    var self = this
//    paramData.forEach(function (d) {
//        self.data.push({
//            mutation_1 : +d.mutation_2,
//            mutation_2 : +d.mutation_1,
//            regression_coeff : +d.regression_coeff,
//        })
//    });


    this.min_regression_coeff = d3.min(paramData, function(d) { return d.regression_coeff; })
    this.max_regression_coeff = d3.max(paramData, function(d) { return d.regression_coeff; })

    this.numberOfInteractions = []
    this.coeffs = [[]]
    var self = this

    this.data.forEach(function(d){
        var mutation_1 = Math.round(d.mutation_1)-1;
        var mutation_2 = Math.round(d.mutation_2)-1;

        if(!self.coeffs[mutation_1])self.coeffs[mutation_1]=[]
        self.coeffs[mutation_1][mutation_2]= d.regression_coeff

        if(!self.coeffs[mutation_2])self.coeffs[mutation_2]=[]
        self.coeffs[mutation_2][mutation_1]= d.regression_coeff

        if(!self.numberOfInteractions[mutation_1]) self.numberOfInteractions[mutation_1]=0;
        if(!self.numberOfInteractions[mutation_2]) self.numberOfInteractions[mutation_2]=0;

        self.numberOfInteractions[mutation_1] = self.numberOfInteractions[mutation_1]+1
        self.numberOfInteractions[mutation_2] = self.numberOfInteractions[mutation_2]+1
    });

    this.numberOfInteractions_mean = d3.mean(this.numberOfInteractions.filter(function(d){return d!=0}),function(d){return d})
}
