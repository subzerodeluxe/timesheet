import * as functions from 'firebase-functions';
// Upgraded to v1 using  https://firebase.google.com/docs/functions/beta-v1-diff 

// Import Firebase 
import * as admin from 'firebase-admin';
admin.initializeApp();

// Import functions
import { createUserProfile } from './create-user';

// CREATE USER PROFILE FUNCTION
export const createUser = functions.auth.user().onCreate(createUserProfile);


// RESOURCES 

// https://tech.residebrokerage.com/using-firebase-cloud-functions-with-ghostscript-for-pdf-to-image-conversion-f81b248d3b22
// https://github.com/ultrasaurus/ghostscript-cloud-function/blob/master/functions/index.js
// https://github.com/firebase/functions-samples/blob/master/convert-images/functions/index.js 