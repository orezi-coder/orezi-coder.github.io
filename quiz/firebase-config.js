window.REZI_FIREBASE_CONFIG = {
	apiKey: 'AIzaSyDv3ITnjUsLqLLTboFNelAdW_XFXlXcr3I',
	authDomain: 'reziquiz-ed751.firebaseapp.com',
	projectId: 'reziquiz-ed751',
	appId: '1:163537718321:web:fd1d7f6e86acf4be9b1910',
	storageBucket: "reziquiz-ed751.firebasestorage.app",
    messagingSenderId: "163537718321",
	measurementId: "G-LRMT3MENH1"
};

window.reziFirebaseReady = new Promise((resolve, reject) => {
	window.resolveReziFirebase = resolve;
	window.rejectReziFirebase = reject;
});
