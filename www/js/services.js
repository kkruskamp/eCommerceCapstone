angular.module('starter.services',[])
.service('WC', function(){
    return {
        WC: function(){
            var Woocommerce = new WoocommerceAPI({
                url: 'http://samarth.southeastasia.cloudapp.azure.com',
                consumerKey: 'ck_78dac49ee1c47d5bb583a5a20fd432bdc8fe6582',
                consumerSecret: 'cs_8a7be2d8c538506fad4203d7ec125a20532781e8',
		wpAPI: true, //or false if you want to use the legacy API v3
  		version: 'wc/v2' //or wc/v1
            })
            return Woocommerce;
        }
}});
