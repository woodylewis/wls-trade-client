angular.module('services', [])

.factory('socketService', function (socketFactory) {
	var theIoSocket = io.connect('http://dev1:3500');

	var theSocket = socketFactory({
		ioSocket: theIoSocket
	});

	return theSocket;
});
