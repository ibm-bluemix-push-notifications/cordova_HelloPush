# HelloPush Cordova application for IBM MobileFirst Services on IBM Bluemix

The HelloPush sample contains a Cordova project that you can use to learn.

### Before you begin

Before you start, make sure you have the following:

- A [Bluemix](http://bluemix.net) account.
- Learn about [Getting Started with Push](https://www.ng.bluemix.net/docs/services/mobilepush/index.html).
- APNs enabled push certificate (.p12 file) and the certificate password for your sandbox environment. For information about how to obtain a p.12 certificate, see the [configuring credentials for Apple push notifications(APNs)](https://www.bluemix.net/docs/services/mobilepush/t_push_provider_ios.html) section in the Push documentation.

### Configure the mobile backend in Bluemix

Before you can run the sample application, you must set up an app on Bluemix.  The following procedure shows you how to create a MobileFirst Services Starter application. A Node.js runtime environment is created so that you can provide server-side functions, such as resource URIs and static files. The Cloudant®NoSQL DB, IBM Push Notifications, and Mobile Client Access services are then added to the app.

Create a mobile backend in the  Bluemix dashboard:

1. In the **Boilerplates** section of the Bluemix catalog, click **MobileFirst Services Starter**.
1. Enter a name and host for your mobile backend and click **Create**.
1. Click **Finish**.

Configure Push Notification service:

1. In the IBM Push Notifications Dashboard, go to the **Configuration** tab to configure your Push Notification Service.  
1. In the Apple Push Certificate section, select the Sandbox environment
1. Upload a valid APNs enabled push certificate (.p12 file), then enter the password associated with the certificate.

### Download the sample

Clone the samples with the following command:

```Bash
git clone https://github.com/ibm-bluemix-push-notifications/cordova_HelloPush.git
```

## Configure Cordova App

### Edit Config.xml file.

Edit config.xml file and set the desired application name in the `<name>` element .

Continue editing config.xml. Update the `<platform name="ios">` element with a deployment target declaration as shown in the code snippet below.

```
<platform name="ios">
    <preference name="deployment-target" value="8.0" />
    <!-- add deployment target declaration -->
</platform>
```

Continue editing config.xml. Update the `<platform name="android">` element with a minimum and target SDK versions as shown in the code snippet below.

```
<platform name="android">
    <preference name="android-minSdkVersion" value="15" />
    <preference name="android-targetSdkVersion" value="23" />
    <!-- add minimum and target Android API level declaration -->
</platform>
```

> The minSdkVersion should be above 15.
> The targetSdkVersion should always reflect the latest Android SDK available from Google.

### Add the native platforms to your app

```
cordova platform add ios
cordova platform add android
```

## Add the plugin

```
cordova plugin add bms-push
```

> Adding the bms-push plugin also adds the bms-core plugin

From your app root folder, verify that the Cordova Core and Push plugin were installed successfully, using the following command.

```
cordova plugin list
```

### Configuring Your iOS Development Environment

1. Follow the `Configuring Your iOS Development Environment` instructions from [Bluemix Mobile Services Core SDK plugin](https://github.com/ibm-bluemix-mobile-services/bms-clientsdk-cordova-plugin-core#4configuring-your-platform)

#### Updating your client application to use the Push SDK

By default, Cordova creates a native iOS project built with iOS, therefore you will need to import an automatically generated Swift header to use the Push SDK. Add the following Objective-C code snippets to your application delegate class.

At the top of your AppDelegate.m:

```
#import "[your-project-name]-Swift.h"
```

If your project name has spaces or hyphens, replace them with underscores in the import statement. Example:

```
// Project name is "Test Project" or "Test-Project"
#import "Test_Project-Swift.h"
```

Add the code below to your application delegate:

#### Objective-C:

```
// Register device token with Bluemix Push Notification Service
- (void)application:(UIApplication *)application
	 didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken{

	   [[CDVBMSPush sharedInstance] didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

// Handle error when failed to register device token with APNs
- (void)application:(UIApplication*)application
	 didFailToRegisterForRemoteNotificationsWithError:(NSError*)error {

	  [[CDVBMSPush sharedInstance] didFailToRegisterForRemoteNotificationsWithError:error];
}

// Handle receiving a remote notification
-(void)application:(UIApplication *)application
	didReceiveRemoteNotification:(NSDictionary *)userInfo
	fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {

	[[CDVBMSPush sharedInstance] didReceiveRemoteNotificationWithNotification:userInfo];
}

// Handle receiving a remote notification on launch
- (BOOL)application:(UIApplication*)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions {

  if (launchOptions != nil) {
         [[CDVBMSPush sharedInstance] didReceiveRemoteNotificationOnLaunchWithLaunchOptions:launchOptions];
     }}
```

#### Swift:

```
// Register device token with Bluemix Push Notification Service
func application(application: UIApplication,
	didRegisterForRemoteNotificationsWithDeviceToken deviceToken: NSData) {

	CDVBMSPush.sharedInstance().didRegisterForRemoteNotificationsWithDeviceToken(deviceToken)
}

// Handle error when failed to register device token with APNs
func application(application: UIApplication,
	didFailToRegisterForRemoteNotificationsWithError error: NSErrorPointer) {

	CDVBMSPush.sharedInstance().didReceiveRemoteNotificationWithNotification(error)
}

// Handle receiving a remote notification
func application(application: UIApplication,
	didReceiveRemoteNotification userInfo: [NSObject : AnyObject], 	fetchCompletionHandler completionHandler: ) {

	CDVBMSPush.sharedInstance().didReceiveRemoteNotificationWithNotification(userInfo)
}

// Handle receiving a remote notification on launch
func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
  let remoteNotif = launchOptions?[UIApplicationLaunchOptionsKey.remoteNotification] as? NSDictionary

  if remoteNotif != nil {
    CDVBMSPush.sharedInstance().didReceiveRemoteNotificationOnLaunchWithLaunchOptions(launchOptions)
  }
}
```

### Configuring Your Android Development Environment

Download your Firebase google-services.json for android, and place them in the root folder of your cordova project: `[your-app-name]/platforms/android`

Go to `[your-app-name]/platforms/android`,

1.) Open file `build.gradle` (Path : platform > android > build.gradle)

2.) find `buildscript` text in `build.gradle` file.

3.) There you will find one classpath line, after that line, please add this line :

	classpath 'com.google.gms:google-services:3.0.0'

4.) Then find "dependencies" .Select that dependencies where you have text `compile` and where that dependecies is getting ended, just after that, add this line :

	apply plugin: 'com.google.gms.google-services'


5.) Prepare and build your cordova Android project

	cordova prepare android
	cordova build android

6.) Run your Cordova android project either opening in android studion or using cordova CLI

    cordova run android


***Note: Project will not build until you follow instructions from this step.***

### Using BMSPush

1. Navigate to the directory where the project was cloned.
1. Open **index.js** located at [your-directory]/www/js/index.js
1. Replace the \<PUSH_SERVICE_GUID\> and \<PUSH_SERVICE_CLIENT_SECRET\> with your Bluemix Push service appGUID and clientSecret.

Javascript:

```
// Bluemix Push credentials
appGUID: "<PUSH_SERVICE_GUID>",
clientSecret: "<PUSH_SERVICE_CLIENT_SECRET>",
```

***Note: Don't forget commas at the end of each line!***


#### Register for Push Notifications

```

// initialize BMSCore SDK
BMSClient.initialize("Your Push service region");

// initialize BMSPush SDK
var appGUID = "Your Push service appGUID";
var clientSecret = "Your Push service clientSecret";
var category =  {};
BMSPush.initialize(appGUID,clientSecret,category);

var success = function(response) { console.log("Success: " + response); };
var failure = function(response) { console.log("Error: " + response); };

// Register device for push notification without UserId
var options = {};
BMSPush.registerDevice(options, success, failure);

// Register device for push notification with UserId
var options = {"userId": "Your User Id value"};
BMSPush.registerDevice(options,success, failure);
```

#### Un-Register from Push Notifications

To unregister for push notifications, simply call the following:

```
BMSPush.unregisterDevice(success, failure);
```

#### Retrieving Tags

In the following examples, the function parameter is a success callback that receives an array of tags. The second parameter is a callback function called on error.

To retrieve an array of tags to which the user is currently subscribed, use the following Javascript function:

```
BMSPush.retrieveSubscriptions(function(tags) {
	alert(tags);
}, failure);
```

To retrieve an array of tags that are available to subscribe, use the following Javascript function:

```
BMSPush.retrieveAvailableTags(function(tags) {
	alert(tags);
}, failure);
```

#### Subscribe and Unsubscribe to/from Tags

```
var tag = "YourTag";
BMSPush.subscribe(tag, success, failure);
BMSPush.unsubscribe(tag, success, failure);
```

### Receiving a Notification

```
var handleNotificationCallback = function(notification) {
	// notification is a JSON object
	alert(notification.message);
}

BMSPush.registerNotificationsCallback(handleNotificationCallback);
```

### Build/Run the Cordova App

Now you can run your application in your mobile emulator or on your device.

1. Build the Cordova app. From your terminal enter the following command:

	```
	cordova build ios
	cordova build android
	```

2. Prepare the sample app. From your terminal enter the following command:

  	```
  	cordova prepare ios
  	cordova prepare android
  	```

3. Run the sample app. From your terminal enter the following command:

	```
	cordova run ios
	cordova run android
	```

**Important**: For further reference please visit - [Cordova Push Plugin](https://github.com/ibm-bluemix-mobile-services/bms-clientsdk-cordova-plugin-push/blob/master/README.md)

***Note: If testing iOS you need to use a real device connected to your network and build/run from Xcode to register for and receive notifications.***

You will see a single view application with a "REGISTER" button. When you click this button the application will attempt to register the device and application to the Push Notification Service. The application will then display if the registration was successful or unsuccessful. In the unsuccessful state an error will be displayed in the Xcode/Android log, as well as in the application.

Once your device is registered for Push Notifications, it is ready to receive remote notifications. In the Bluemix Push Dashboard, navigate to Notifications. Under **Choose The Audience** select **All Devices**. This will send a notification to all devices that have registered for push notifications. Once the notification is received by your app an alert should appear with notification contents.



### License

This package contains sample code provided in source code form. The samples are licensed under the under the Apache License, Version 2.0 (the "License"). You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 and may also view the license in the license.txt file within this package. Also see the notices.txt file within this package for additional notices.
