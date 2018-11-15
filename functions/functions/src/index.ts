import * as functions from 'firebase-functions';
import { sampleTable } from './sample-pdf-table';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs-extra';
import * as admin from 'firebase-admin';
import { serviceAccount } from './google-service-account';
import { join } from 'path';
import { tmpdir } from 'os';

const serviceObject = {};
Object.assign(serviceObject, serviceAccount);

admin.initializeApp({
    credential: admin.credential.cert(serviceObject),
    databaseURL: functions.config().firebase
});

const gcs = admin.storage();
const bucketName = 'generated-pdfs';

exports.createPDF = functions.https.onCall(async (incomingObject, authData) => {
    const userId = authData.auth.uid; 
    const sample = sampleTable;

    const writeFilePromise = (file, data, option) => {
        return new Promise((resolve, reject) => {
            fs.writeFile(file, data, option, error => {
                if (error) reject(error);
                resolve("File created! Time for the next step!");
            });
        });
    };

    // Creat temp directory
    const workingDir = join(tmpdir(), 'generatedpdfs');
    const tmpFilePath = join(workingDir, 'output.pdf');

    // Ensure temp directory exists
    await fs.ensureDir(workingDir);
    console.log('Going to perform PDF creation ..');
    
    const fontDescriptors = {
        Roboto: {
            normal: './fonts/Roboto-Regular.ttf',
            bold: './fonts/Roboto-Medium.ttf',
            italics: './fonts/Roboto-Italic.ttf',
            bolditalics: './fonts/Roboto-MediumItalic.ttf',
        }
    };

    /// PDF MAGIC
    const PdfPrinter = require('./node_modules/pdfmake/src/printer');
    const printer = new PdfPrinter(fontDescriptors);
    const pdfDoc = printer.createPdfKitDocument(sample);
    pdfDoc.pipe(pdfDoc.createWriteStream()).on('finish', function () {
        console.log('Pdf successfully created!');
    }).on('error', function(err){
        console.log('Error during the wirtestream operation in the new file: ', err);
        });
    pdfDoc.end();

    await writeFilePromise(tmpFilePath, pdfDoc, 'binary');
    
    const id: string = uuid();

    const options = {
        destination: tmpFilePath,
        uploadType: "media",
        metadata: {
            contentType: 'application/pdf',
            metadata: {
                firebaseStorageDownloadTokens: id
            }
        }
    };

    console.log('Trying to upload PDF to bucket');
    const result = await gcs.bucket(bucketName).upload(tmpFilePath, options);

    if (result === null) {
        console.log('It went wrong bad');
    }
    console.log('PDF uploaded successfully');

    const aFile = result[0];
    const getMetadata = await aFile.getMetadata();

    const path = "https://firebasestorage.googleapis.com/v0/b/" + bucketName + "/o/" + encodeURIComponent(aFile.name) + "?alt=media&token=" + id;
    const metadata = getMetadata[0];
    console.log('Metadata=', metadata.mediaLink);
    
    console.log('Trying to upload to database');
    const ref = admin.firestore().collection('messages');
    const object = { file: path };
    console.log('PDF uploaded to database');
    return await ref.doc('new').set(object);   

    
})


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
