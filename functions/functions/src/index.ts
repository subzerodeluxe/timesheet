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

exports.httpcallable = functions.https.onCall((data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
            'while authenticated.')
    }

    if (!data.name) {
        console.log('data.name is not found')
        throw new functions.https.HttpsError('invalid-argument', 'data.name is undefined.', data)
    }

    return {
        uid: context.auth!.uid,
        name: data.name,
        data: data,
        context: context
    }
})


// Get all the activities for that week
  
  
  