import app from 'firebase/app';
import 'firebase/analytics';
import 'firebase/firestore';
import 'firebase/auth';

var config = {
    apiKey: "AIzaSyCVnih4H1x59l15DFh6Hi3DGqjatdVdhHE",
    authDomain: "share-site-8ee1b.firebaseapp.com",
    databaseURL: "https://share-site-8ee1b.firebaseio.com",
    projectId: "share-site-8ee1b",
    storageBucket: "share-site-8ee1b.appspot.com",
    messagingSenderId: "641707346599",
    appId: "1:641707346599:web:552d0b3b2f1757280a6982",
    measurementId: "G-DWPPGQRHSK"
};

class Firebase {
    constructor() {
        app.initializeApp(config);

        this.auth = app.auth();
        this.db = app.firestore();
        this.analytics = app.analytics();

        this.googleProvider = new app.auth.GoogleAuthProvider();
    }



    /*** AUTH API ***/

    doSignIn = () => {
        return this.auth.signInWithPopup(this.googleProvider);
    }

    doSignOut = () => {
        return this.auth.signOut();
    }

    getUser = () => {
        return this.auth.currentUser;
    }



    /*** MATCHING API ***/

    getMatching = () => {
        const matchingRef = this.db.collection('matching').doc('0');
        return matchingRef.get().then(matching => {
            if (matching.exists) return matching.data();
            else return null;
        });
    }
}


export default Firebase;