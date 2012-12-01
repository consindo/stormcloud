(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['settings.template'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <li data-code=\"";
  stack1 = depth0.zip;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\"><span class=\"name\">";
  stack1 = depth0.place;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</span><span class=\"delete\">&#10005;</span></li>\n        ";
  return buffer;}

function program3(depth0,data) {
  
  
  return "\n        <input type=\"checkbox\" id=\"launcherswitch\" checked><label for=\"launcherswitch\">Show Launcher Count</label>\n    ";}

function program5(depth0,data) {
  
  
  return "\n        <input type=\"checkbox\" id=\"launcherswitch\"><label for=\"launcherswitch\">Show Launcher Count</label>\n    ";}

  buffer += "<div class=\"locationSettings\">\n    <h2>Locations<span class=\"add\" title=\"Add City\">+</span></h2>\n    <ul>\n        <li class=\"placeInput\"><input placeholder=\"Location\" type=\"text\"><span class=\"status\"></span></li>\n        ";
  stack1 = depth0.location;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </ul>\n</div>\n<div class=\"wrapperTwenty\">\n    <div class=\"toggleswitch measurement\">\n        ";
  foundHelper = helpers.measurement;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.measurement; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n    <div class=\"toggleswitch speed\">\n        ";
  foundHelper = helpers.speed;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.speed; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n    <div class=\"color\">\n        <span data-color=\"gradient\"></span>\n        <span data-color=\"A200FF\"></span>\n        <span data-color=\"FF0097\"></span>\n        <span data-color=\"00ABA9\"></span>\n        <span data-color=\"8CBF26\"></span>\n        <span data-color=\"A05000\"></span>\n        <span data-color=\"333333\"></span>\n        <span data-color=\"F09609\"></span>\n        <span data-color=\"1BA1E2\"></span>\n        <span data-color=\"E51400\"></span>\n        <span data-color=\"339933\"></span>\n    </div>\n    <div class=\"launcher\" data-boop=\"";
  foundHelper = helpers.launcher;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.launcher; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\">\n    ";
  stack1 = depth0.launcher;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n    <a class=\"btn\" href=\"http://caffeinatedco.de/donate.html\">DONATE</a>&nbsp;<a class=\"btn credits\" href=\"#\">CREDITS</a><br>\n</div>\n";
  return buffer;});
})();