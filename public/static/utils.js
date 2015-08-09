function toPNGButton(buttonSelector,svgSelector){
    $(buttonSelector).button().click(function(){
        var svg = $(svgSelector).get()[0]
        var svgData = new XMLSerializer().serializeToString( svg );
        var canvas = $('<canvas style="background-color: #ffffff" id="canvas" width="1000px" height="600px"></canvas>').get()[0]
        canvg(canvas, svgData)
        var dataURL = canvas.toDataURL( "image/png" )
        var base64 = dataURL.replace(/^data:image\/(png|jpg);base64,/, "") ;
        window.open(dataURL);
    })

}

