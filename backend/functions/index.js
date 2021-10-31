const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.deleteUnverifiedUsers = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
    console.log('This will be run every 24 hours!');
    const users = []
    const listAllUsers = (nextPageToken) => {
        // List batch of users, 1000 at a time.
        return admin.auth().listUsers(1000, nextPageToken).then((listUsersResult) => {
            listUsersResult.users.forEach((userRecord) => {
                users.push(userRecord)
            });
            if (listUsersResult.pageToken) {
                // List next batch of users.
                listAllUsers(listUsersResult.pageToken);
            }
        }).catch((error) => {
            console.log('Error listing users:', error);
        });
    };
    // Start listing users from the beginning, 1000 at a time.
    let now = +new Date();
    const oneDay = 60 * 60 * 24 * 1000;
    await listAllUsers();
    const unVerifiedUsers = users.filter((user) => !user.emailVerified && (now - new Date(user.metadata.creationTime)) > oneDay).map((user) => user.uid)
    ;
    //console.log('unverified', unVerifiedUsers.map(r => r.email));
    //DELETING USERS
    return admin.auth().deleteUsers(unVerifiedUsers).then((deleteUsersResult) => {
        console.log(`Successfully deleted ${deleteUsersResult.successCount} users`);
        console.log(`Failed to delete ${deleteUsersResult.failureCount} users`);
        deleteUsersResult.errors.forEach((err) => {
            console.log(err.error.toJSON());
        });
        return true
    }).catch((error) => {
        console.log('Error deleting users:', error);
        return false
    });
});