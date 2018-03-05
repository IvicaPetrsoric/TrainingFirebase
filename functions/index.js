const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// listen for following exent and then trigger push noticifcation
exports.observerFollowing = functions.database.ref('/following/{uid}/{followingId}')
  .onCreate(event => {

    var uid = event.params.uid;
    var followingId = event.params.followingId;

    console.log('User: ' + uid + ' is following: ' + followingId);

    // trying to figure out fcmToken to send Push sendPushNotification
    return admin.database().ref('/users/' + followingId).once('value', snapshot => {

      var userWeAreFollowing = snapshot.val();

      return admin.database().ref('/users/' + uid).once('value', snapshot => {

        var userDoingTheFollowing = snapshot.val();

        var payload = {
          notification: {
            title: "You now have a new follower",
            body: userDoingTheFollowing.username + ' is now following you'
          },
          data: {
            followerId: uid
          }
        }

        admin.messaging().sendToDevice(userWeAreFollowing.fcmToken, payload)
          .then(response =>{
            // See the MessagingDevicesResponse reference documentation for
            // the contents of response.
            console.log("Successfully sent message:", response);
            return response;
          })
          .catch(function(error) {
            console.log("Error sending message:", error);
          });

      })



    })
  })

exports.sendPushNotification = functions.https.onRequest((req, res) => {
  res.send("Attempting to send push notification");
  console.log("Logger --- trying to send push message...");

  // admin.message().sendToDevice(token, payload);

  var uid = 'xdrKc91950Tz1xw8U8kfQv6N0rO2';

  return admin.database().ref('/users/' + uid).once('value', snapshot => {

    var user = snapshot.val();

    console.log("User username: " + user.username + " fcmToken: " + user.fcmToken);

    var payload = {
      notification: {
        title: "Push notification TITLE HERE",
        body: "Body over here is our message body ...."
      }
    }

    admin.messaging().sendToDevice(user.fcmToken, payload)
      .then(function(response) {
        // See the MessagingDevicesResponse reference documentation for
        // the contents of response.
        console.log("Successfully sent message:", response);
        return response;

      })
      .catch(function(error) {
        console.log("Error sending message:", error);
      });

  })

  // This registration token comes from the client FCM SDKs.
  // var fcmToken = "eWxCf-pAduM:APA91bELDU0hC8Tj222z6uhL47KVFw_B1VJF-ieLkqDEEhu-wL9H34QoQ70-GUyLFP_0ouIQV6ppZybRlzxYgWz5rUEGqUzNm4QK8zumPMOp6W7YPCTo8EJUXek3yrDUPxR3mgYk62O5";
  //
  // // See the "Defining the message payload" section below for details
  // // on how to define a message payload.
  // var payload = {
  //   notification: {
  //     title: "Push notification TITLE HERE",
  //     body: "Body over here is our message body ...."
  //   },
  //   data: {
  //     score: "850",
  //     time: "2:45"
  //   }
  // };
  //
  // // Send a message to the device corresponding to the provided
  // // registration token.




});
