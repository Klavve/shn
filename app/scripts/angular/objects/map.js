'use strict';
app.controller('MapCtrl', function($scope) {
	angular.extend($scope, {
		center: {
			latitude: 55.587808, // initial map center latitude
			longitude: 13.009065, // initial map center longitude
		},
		markers: [
			{
				latitude: 55.587808, // initial map center latitude
				longitude: 13.009065
			},
			{
				latitude: 56.587808, // initial map center latitude
				longitude: 13.009065
			}
		], // an array of markers,
		zoom: 8, // the zoom level
	});
	console.log('google: ', google.maps)
});
