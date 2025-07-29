import { FIREBASE_AUTH_PROVIDER_X509_CERT_URL, FIREBASE_AUTH_URI, FIREBASE_CLIENT_EMAIL, FIREBASE_CLIENT_ID, FIREBASE_CLIENT_X509_CERT_URL, FIREBASE_PRIVATE_KEY, FIREBASE_PRIVATE_KEY_ID, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_TOKEN_URI, FIREBASE_TYPE, FIREBASE_UNIVERSE_DOMAIN } from "./variables.js";
import admin from 'firebase-admin'

const { privateKey } = JSON.parse(FIREBASE_PRIVATE_KEY)

const CREDENTIALS = {
    type: FIREBASE_TYPE,
    project_id: FIREBASE_PROJECT_ID,
    private_key_id: FIREBASE_PRIVATE_KEY_ID,
    private_key: privateKey,
    client_email: FIREBASE_CLIENT_EMAIL,
    client_id: FIREBASE_CLIENT_ID,
    auth_uri: FIREBASE_AUTH_URI,
    token_uri: FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: FIREBASE_UNIVERSE_DOMAIN
}


admin.initializeApp({
    credential: admin.credential.cert(CREDENTIALS),
    storageBucket: FIREBASE_STORAGE_BUCKET
})

const bucket = admin.storage().bucket()

export async function uploadFile(filePath, destination) {
    await bucket.upload(filePath, {
        destination: destination
    })
}

export async function getFileUrl(filePath) {
    const file = bucket.file(filePath);

    const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 10 * 365 * 24 * 60 * 60 * 1000,
    });

    return url;
}
