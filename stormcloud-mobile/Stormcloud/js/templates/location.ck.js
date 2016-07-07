LocationTemplate = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="top">  <div class="city">    <div><span>'+
((__t=( place ))==null?'':__t)+
'</span><div class="progress win-ring win-small xhr-request"></div></div>  </div></div><div class="weather">  <img src="/images/climacons/'+
((__t=( code ))==null?'':__t)+
'.svg"></div><div class="stats">  <div class="left">    <div><span>'+
((__t=( temperature ))==null?'':__t)+
'</span></div>  </div>  <div class="right">    <div>      <div class="inner-row">        <span>'+
((__t=( windSpeed ))==null?'':__t)+
'</span> <span>'+
((__t=( windUnit ))==null?'':__t)+
'</span>      </div>      <div class="inner-row">        <span>'+
((__t=( humidity ))==null?'':__t)+
'</span>      </div>    </div>  </div></div><div class="forecast">  <div class="0">    <span class="wday">'+
((__t=( week[0].day ))==null?'':__t)+
'</span>    <span class="wcode"><img src="/images/climacons/'+
((__t=( week[0].code ))==null?'':__t)+
'.svg"></span>    <span class="wtemp"><span>'+
((__t=( week[0].high ))==null?'':__t)+
'</span>&nbsp;&nbsp;<span>'+
((__t=( week[0].low ))==null?'':__t)+
'</span></span>  </div>  <div class="1">    <span class="wday">'+
((__t=( week[1].day ))==null?'':__t)+
'</span>    <span class="wcode"><img src="/images/climacons/'+
((__t=( week[1].code ))==null?'':__t)+
'.svg"></span>    <span class="wtemp"><span>'+
((__t=( week[1].high ))==null?'':__t)+
'</span>&nbsp;&nbsp;<span>'+
((__t=( week[1].low ))==null?'':__t)+
'</span></span>  </div>  <div class="2">    <span class="wday">'+
((__t=( week[2].day ))==null?'':__t)+
'</span>    <span class="wcode"><img src="/images/climacons/'+
((__t=( week[2].code ))==null?'':__t)+
'.svg"></span>    <span class="wtemp"><span>'+
((__t=( week[2].high ))==null?'':__t)+
'</span>&nbsp;&nbsp;<span>'+
((__t=( week[2].low ))==null?'':__t)+
'</span></span>  </div>  <div class="3">    <span class="wday">'+
((__t=( week[3].day ))==null?'':__t)+
'</span>    <span class="wcode"><img src="/images/climacons/'+
((__t=( week[3].code ))==null?'':__t)+
'.svg"></span>    <span class="wtemp"><span>'+
((__t=( week[3].high ))==null?'':__t)+
'</span>&nbsp;&nbsp;<span>'+
((__t=( week[3].low ))==null?'':__t)+
'</span></span>  </div></div>';
}
return __p;
}
