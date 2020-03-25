import app from 'firebase/app';
import 'firebase/analytics';
import 'firebase/firestore';
import 'firebase/auth';

import { getNextMatchingDate, getCurrentMatchingDate } from '../../util';

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

const FUNCTIONS_URL = 'https://us-central1-share-site-8ee1b.cloudfunctions.net/';

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
}


export default Firebase;