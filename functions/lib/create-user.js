"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
function createUserProfile(userRecord) {
    console.log('UserRecord? ', userRecord);
    const docId = userRecord.uid;
    const docRef = admin.firestore().collection('users').doc(docId);
    const userObject = {
        uid: docId,
        email: userRecord.email,
        email_verified: userRecord.emailVerified,
        creationTime: userRecord.metadata.creationTime
    };
    return docRef.set({ userObject }).catch(console.error);
}
exports.createUserProfile = createUserProfile;
//# sourceMappingURL=create-user.js.map