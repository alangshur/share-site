import app from 'firebase/app';
import 'firebase/analytics';
import 'firebase/firestore';
import 'firebase/auth';
import { v1 as uuid } from 'uuid';

import { 
    getNextMatchingDate, 
    getCurrentMatchingDate 
} from '../../util';

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyCVnih4H1x59l15DFh6Hi3DGqjatdVdhHE",
    authDomain: "share-site-8ee1b.firebaseapp.com",
    databaseURL: "https://share-site-8ee1b.firebaseio.com",
    projectId: "share-site-8ee1b",
    storageBucket: "share-site-8ee1b.appspot.com",
    messagingSenderId: "641707346599",
    appId: "1:641707346599:web:552d0b3b2f1757280a6982",
    measurementId: "G-DWPPGQRHSK"
};

const FUNCTIONS_URL = 'https://us-central1-share-site-8ee1b.cloudfunctions.net/';

class Firebase {
    constructor() {
        app.initializeApp(FIREBASE_CONFIG);

        this.auth = app.auth();
        this.db = app.firestore();
        this.analytics = app.analytics();

        this.googleProvider = new app.auth.GoogleAuthProvider();
    }



    /*** FIREBASE UTIL ***/

    getFirebaseTimestamp = () => {
        return app.firestore.Timestamp.now();
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



    /*** USER API ***/

    getUserData = () => {
        const id = this.getUser().uid;
        const userRef = this.db.collection('users').doc(id);
        return userRef.get().then(user => {
            if (user.exists) return user.data();
            else return null;
        });
    }



    /*** MATCHING API ***/

    getNextMatching = () => {
        const date = getNextMatchingDate();
        const matchingRef = this.db.collection('matchings').doc(date);
        return matchingRef.get().then(matching => {
            if (matching.exists) return matching.data();
            else return null;
        });
    }

    getCurrentMatching = () => {
        const date = getCurrentMatchingDate();
        const matchingRef = this.db.collection('matchings').doc(date);
        return matchingRef.get().then(matching => {
            if (matching.exists) return matching.data();
            else return null;
        });
    }



    /*** SURVEY API ***/

    submitSurveyAnswers = (survey, age, country, region) => {
        return this.getUser().getIdToken().then(token => {
            return fetch(FUNCTIONS_URL + 'updateSurvey', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'Survey': survey,
                    'Age': age,
                    'Country': country,
                    'Region': region
                }
            }).then(res => res.json());
        });
    }



    /*** MATCH API ***/

    getMatchData = matchId => {
        const current = getCurrentMatchingDate();
        const matchRef = this.db.collection('matchings').doc(current)
            .collection('matches').doc(matchId);
        return matchRef.get().then(match => {
            if (match.exists) return match.data();
            else return null;
        });
    }

    getMessageBlock = (current, matchId) => {
        const messagesRef = this.db.collection('matchings').doc(current)
            .collection('matches').doc(matchId).collection('messages');
        return messagesRef.orderBy('timestamp', 'desc').limit(3).get().then(data => {
            var messages = [];
            data.forEach(doc => {
                if (doc.exists) messages.push(doc.data());
                else return null;
            });

            return messages;
        });
    }

    getMessages = (current, matchId, onSuccess, onFailure) => {
        const messagesRef = this.db.collection('matchings').doc(current)
            .collection('matches').doc(matchId).collection('messages');
        messagesRef.orderBy('timestamp', 'desc').limit(50).onSnapshot(snapshot => {
            const changes = snapshot.docChanges().reverse();
            const bulk = Boolean(changes.length > 5);

            changes.forEach((change, index) => {
                if (change.doc.exists) {
                    const message = change.doc.data();
                    const bulkStart = bulk && (index === 0);
                    const bulkEnd = bulk && (index === changes.length - 1);

                    if (message.timestamp) onSuccess(
                        change.type,
                        change.doc.id, 
                        message,
                        bulkStart,
                        bulkEnd
                    );
                }
                else onFailure();
            });
        });
    }

    writeMessage = (current, matchId, content) => {
        const messageId = uuid();
        const messageRef = this.db.collection('matchings').doc(current)
            .collection('matches').doc(matchId).collection('messages').doc(messageId);
        return messageRef.set({
            id: messageId,
            name: this.getUser().displayName,
            content: content,
            timestamp: app.firestore.FieldValue.serverTimestamp(),
        }).then(() => messageId);
    }
}


export default Firebase;