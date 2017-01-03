/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app =  {
    // Bluemix credentials
    appGUID: "<PUSH_SERVICE_GUID>",
    clientSecret: "<PUSH_SERVICE_CLIENT_SECRET>",

    // Initialize BMSClient
    initialize: function() {
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to use the 'route' and 'guid'
    // variables, we must explicitly call 'app.route' and 'app.guid'
    onDeviceReady: function() {
        BMSClient.initialize(BMSClient.REGION_US_SOUTH);
        var category =  {};
        BMSPush.initialize(appGUID,clientSecret,category);
    },

    // Register for Push Notifications
    //
    // Sends a request to the Push Notifications service on Bluemix to register
    // The success and failure variables handle the callback response for each case 
    register: function() {
        var header = document.getElementById("text-big");
        var connected = document.getElementById("text-connected");
        var details = document.getElementById("text-details");

        var success = function(successResponse) {
            header.style.display = "block";
            header.innerHTML = "Yay!";
            connected.innerHTML = "You are registered for Push Notifications.";
            details.innerHTML = "<h4>Response:</h4><i>" + successResponse + "</i>";
        };

        var failure = function(failureResponse) {
            header.style.display = "block";
            header.innerHTML = "Bummer";
            connected.innerHTML = "Something Went Wrong";
            details.innerHTML = "<h4>Response:</h4><i>" + failureResponse + "</i>";
        };

        // Optional parameter, but must follow this format
        //
        // For iOS, the setting parameter enables alerts, badges, and sound 
        // Android does NOT make use of the settings parameter
        var options = {
            "userId":"Your user Id"
        };

        BMSPush.registerDevice(options, success, failure);
    },

    // Register notification callback to handle notification when in app
    registerNotificationsCallback: function() {
        var showNotification = function(notif) {
          alert(JSON.stringify(notif));
        };
        BMSPush.registerNotificationsCallback(showNotification);
    }
};

app.initialize();
