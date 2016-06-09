'use strict';

export default function registerPushwooshAndroid(callback) {
	let pushNotification = cordova.require('pushwoosh-cordova-plugin.PushNotification');

  // set push notifications handler
  document.addEventListener('push-notification', callback, false);

  // initialize Pushwoosh with projectid: 'GOOGLE_PROJECT_ID', appid : 'PUSHWOOSH_APP_ID'. This will trigger all pending push notifications on start.
	pushNotification.onDeviceReady({
		projectid: '924626941924',
		pw_appid: '69FF7-FF417'
	});

	// register for push notifications
	pushNotification.registerDevice(
		token => console.warn('push token: ' + token),
		status => console.warn(JSON.stringify(['failed to register ', status]))
	);
}
