function SliderRangeFilter(paramTargetSelector,paramMin,paramMax,paramStep){
    var self = this
    this.onSlide = function(min,max){console.log("slide: "+min+" - "+max)}
    this.onChange = function(min,max){console.log("chande: "+min+" - "+max)}

    this.slider = $( paramTargetSelector ).slider({
        range: true,
        min: paramMin,
        max: paramMax,
        values: [ paramMin, paramMax ],
        step:paramStep,
        slide: function( event, ui ) {
            self.onSlide(ui.values[ 0 ], ui.values[ 1 ])
        },
        change: function( event, ui ) {
            self.onChange(ui.values[ 0 ], ui.values[ 1 ])
        }
    });
}
SliderRangeFilter.prototype.minValue = function(){
    return this.slider.slider( "values", 0 )
}

SliderRangeFilter.prototype.maxValue = function(){
    return this.slider.slider( "values", 1 )
}

SliderRangeFilter.prototype.getFilterFunction = function(filter){
    var self = this

    return function(data){
        return filter(self.minValue(),self.maxValue(),data);
    }
}