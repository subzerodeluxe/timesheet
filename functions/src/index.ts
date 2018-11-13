import * as functions from 'firebase-functions';


exports.testOnCall = functions.https.onCall((data, context) => {
    console.log('Dit komt er binnen: ', data);
    const userId = context.auth.uid;

    const enrichedData = {
        textMessage: data.message,
        userId: userId
    }; 
    return enrichedData;
  });
// Get all the activities for that week



