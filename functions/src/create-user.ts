import * as admin from 'firebase-admin';
import { Employee } from './models';

export function createUserProfile(userRecord) {

    console.log('UserRecord? ', userRecord);

    const docId = userRecord.uid;
    const docRef = admin.firestore().collection('users').doc(docId);

    const userObject: Employee = {
        uid: docId,
        email: userRecord.email,
        email_verified: userRecord.emailVerified,
        creationTime: userRecord.metadata.creationTime
    }
    
    return docRef.set({...userObject}).catch(console.error);
}