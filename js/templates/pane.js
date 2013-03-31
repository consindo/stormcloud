(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['pane.template'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                <span class=\"temp\">";
  stack1 = depth0.week;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1[0];
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.average;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</span>\n            ";
  return buffer;}

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                <span class=\"temp\">";
  stack1 = depth0.week;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1[0];
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.high;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "&nbsp;&nbsp;<span>";
  stack1 = depth0.week;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1[3];
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.low;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</span></span>\n            ";
  return buffer;}

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                <span class=\"temp\">";
  stack1 = depth0.week;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1[1];
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.average;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</span>\n            ";
  return buffer;}

function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                <span class=\"temp\">";
  stack1 = depth0.week;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1[1];
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.high;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "&nbsp;&nbsp;<span>";
  stack1 = depth0.week;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1[3];
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.low;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</span></span>\n            ";
  return buffer;}

function program9(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                <span class=\"temp\">";
  stack1 = depth0.week;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1[2];
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.average;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</span>\n            ";
  return buffer;}

function program11(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                <span class=\"temp\">";
  stack1 = depth0.week;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1[2];
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.high;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "&nbsp;&nbsp;<span>";
  stack1 = depth0.week;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1[3];
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.low;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</span></span>\n            ";
  return buffer;}

function program13(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                <span class=\"temp\">";
  stack1 = depth0.week;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1[3];
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.average;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</span>\n            ";
  return buffer;}

function program15(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                <span class=\"temp\">";
  stack1 = depth0.week;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1[3];
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.high;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "&nbsp;&nbsp;<span>";
  stack1 = depth0.week;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1[3];
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.low;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</span></span>\n            ";
  return buffer;}

  buffer += "<div class=\"middle\" data-background=\"";
  foundHelper = helpers.background;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.background; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\">\n    <div class=\"top\">\n        <div class=\"padding\"></div>\n        <div class=\"city\">\n            <div><span><a href=\"";
  foundHelper = helpers.link;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.link; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\" target=\"_blank\">";
  foundHelper = helpers.place;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.place; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</a></span></div>\n        </div>\n    </div>\n    <div class=\"weather\">\n        <img src=\"img/climacons/";
  foundHelper = helpers.code;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.code; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + ".svg\">\n    </div>\n    <div class=\"stats\">\n        <div class=\"left\">\n            <div><span>";
  foundHelper = helpers.temperature;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.temperature; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</span></div>\n        </div>\n        <div class=\"right\">\n            <div>\n                <div>\n                    <span>";
  foundHelper = helpers.windSpeed;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.windSpeed; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</span> <span>";
  foundHelper = helpers.windUnit;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.windUnit; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</span><br>\n                    <span>";
  foundHelper = helpers.humidity;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.humidity; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + " %</span>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class=\"forecast\">\n        <div class=\"0\">\n            <span class=\"day\">";
  stack1 = depth0.week;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1[0];
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.day;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</span>\n            <span class=\"code\"><img src=\"img/climacons/";
  stack1 = depth0.week;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1[0];
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.code;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + ".svg\"></span>\n            ";
  stack1 = depth0.average;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </div>\n        <div class=\"1\">\n            <span class=\"day\">";
  stack1 = depth0.week;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1[1];
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.day;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</span>\n            <span class=\"code\"><img src=\"img/climacons/";
  stack1 = depth0.week;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1[1];
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.code;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + ".svg\"></span>\n            ";
  stack1 = depth0.average;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </div>\n        <div class=\"2\">\n            <span class=\"day\">";
  stack1 = depth0.week;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1[2];
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.day;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</span>\n            <span class=\"code\"><img src=\"img/climacons/";
  stack1 = depth0.week;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1[2];
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.code;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + ".svg\"></span>\n            ";
  stack1 = depth0.average;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.program(11, program11, data),fn:self.program(9, program9, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </div>\n        <div class=\"3\">\n            <span class=\"day\">";
  stack1 = depth0.week;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1[3];
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.day;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</span>\n            <span class=\"code\"><img src=\"img/climacons/";
  stack1 = depth0.week;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1[3];
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.code;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + ".svg\"></span>\n            ";
  stack1 = depth0.average;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.program(15, program15, data),fn:self.program(13, program13, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </div>\n    </div>\n</div>\n";
  return buffer;});
})();