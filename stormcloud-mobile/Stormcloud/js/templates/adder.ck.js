AdderTemplate = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div id="adderRoot" class="adder"><section class="page-section">    <div class="title">Add Location<img src="/images/cross.svg"></div>    <input type="text" id="locationQuery" placeholder="City Name"/>    <div class="progress win-ring win-large floatyprogress"></div>    <div id="resultList"></div>    <h3 id="noResults">No Locations Found</h3>  </section></section></div>';
}
return __p;
}
