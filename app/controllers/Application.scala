package controllers

import play.api._
import play.api.mvc._

object Application extends Controller {

  def hello = Action {
    Ok(views.html.hello("Your new application is ready."))
  }

  def index = Action {
    Ok(views.html.index())
//    ".interactions-scatter-plot .axis path,\n.interactions-scatter-plot .axis line {\n    fill: none;\n    stroke: #000;\n    shape-rendering: crispEdges;\n}\n\n.interactions-scatter-plot .dot {\n    stroke: #000;\n}\n\nsvg.interactions-scatter-plot {\n    border: 1px solid #cdcdcd;\n    border-color: rgba(0,0,0,.15);\n    -webkit-box-sizing: border-box;\n    box-sizing: border-box;\n    background-color: #ffffff;\n    background: #ffffff;\n}\n\n#min, #max {\n    width: 50px;\n    text-align: center;\n}"
  }

}
