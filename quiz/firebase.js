import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {
	browserLocalPersistence,
	createUserWithEmailAndPassword,
	getAuth,
	GoogleAuthProvider,
	onAuthStateChanged,
	reload,
	sendEmailVerification,
	sendPasswordResetEmail,
	setPersistence,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
	updateProfile,
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {
	doc,
	getFirestore,
	onSnapshot,
	serverTimestamp,
	setDoc,
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

const config = window.REZI_FIREBASE_CONFIG;
const requiredConfig = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingConfig = requiredConfig.filter((key) => !config?.[key] || config[key].startsWith('YOUR_'));

try {
	if (missingConfig.length) {
		throw new Error('Firebase is not configured. Add your Firebase web app values to quiz/firebase-config.js.');
	}

	const app = initializeApp(config);
	const auth = getAuth(app);
	const db = getFirestore(app);
	await setPersistence(auth, browserLocalPersistence);

	window.resolveReziFirebase({
		auth,
		db,
		createUserWithEmailAndPassword,
		doc,
		onAuthStateChanged,
		onSnapshot,
		sendEmailVerification,
		sendPasswordResetEmail,
		serverTimestamp,
		setDoc,
		signInWithEmailAndPassword,
		signInWithPopup,
		signOut,
		GoogleAuthProvider,
		updateProfile,
	});
} catch (error) {
	window.rejectReziFirebase(error);
}
