"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
// Upgraded to v1 using  https://firebase.google.com/docs/functions/beta-v1-diff 
// Import Firebase 
const admin = require("firebase-admin");
admin.initializeApp();
// Import functions
const create_user_1 = require("./create-user");
// CREATE USER PROFILE FUNCTION
exports.createUser = functions.auth.user().onCreate(create_user_1.createUserProfile);
// RESOURCES 
// https://tech.residebrokerage.com/using-firebase-cloud-functions-with-ghostscript-for-pdf-to-image-conversion-f81b248d3b22
// https://github.com/ultrasaurus/ghostscript-cloud-function/blob/master/functions/index.js
// https://github.com/firebase/functions-samples/blob/master/convert-images/functions/index.js 
//# sourceMappingURL=index.js.map