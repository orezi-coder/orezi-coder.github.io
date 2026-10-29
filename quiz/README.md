# ReziQuiz Firebase setup

ReziQuiz uses Firebase Authentication for accounts and Cloud Firestore to sync
each verified user's quiz, flashcard, and study-streak progress across devices.
The app is a static GitHub Pages site, so Firebase client configuration is
required before sign-in can work.

## Firebase project setup

1. In the [Firebase Console](https://console.firebase.google.com/), create a
   Firebase project (or select one) and register a **Web app**.
2. Confirm `firebase-config.js` contains the configuration snippet for your
   Firebase web app (`apiKey`, `authDomain`, `projectId`, and `appId`). Replace
   any template values with the matching values from Firebase. These web-app
   values are public client configuration, not a service-account key; never
   put a service-account key or other private credentials in this site.
3. In **Authentication → Sign-in method**, enable **Email/Password** and
   **Google**. For Google, select a support email.
4. In **Authentication → Settings → Authorized domains**, add the hostname
   where the site is served, for example `orezi-coder.github.io`, and add
   `localhost` if you will test on a local web server. Add any custom-domain
   hostname too, if you use one.
5. In **Firestore Database**, create a database. In its **Rules** tab, publish
   the contents of `firestore.rules`. These rules restrict progress reads and
   writes to the signed-in, email-verified owner. Confirm the selected Firebase
   project is the same one configured in `firebase-config.js`; an unpublished
   rules file in this repository does not update the live Firestore rules.
6. In **Authentication → Templates**, confirm the **Email address
   verification** template is enabled. Firebase sends verification messages
   using its default delivery service; check the recipient's spam/junk folder
   if a message does not arrive. You can customize the template and sender
   details there. The app requires passwords of at least eight characters.
7. Deploy the `quiz` folder to GitHub Pages and test account creation, email
   verification, Google sign-in, password reset, and progress sync between two
   browser sessions.

Progress is stored at `users/{uid}/progress/current`. Existing progress saved
by older versions in this browser is not automatically uploaded to a new
account, to avoid mixing data between people who may share a device.

## Adding quiz questions and definitions

The question bank is in `questions.json`; the app imports this file directly.
It is organized into three disciplines: Art, Science, and Commercial. The
current bank contains 11 subjects and 1,170 questions. Art includes Visual Arts,
Literature, and Music. Most Arts topics have 60 questions split evenly into 20
easy, 20 medium, and 20 hard questions; African Literature and Foreign Literature
each have 90 questions split evenly into 30 per difficulty. Each Science subject
has 30 questions.
Commercial includes Business Studies, Accounting, Economics, and Government.
The glossary contains contextual excerpts that expand on key terms rather than
repeat answer choices.

Each subject has a `disciplineId` that must match an id in the top-level
`disciplines` array. Add questions to the relevant subject's `questions`
array using this shape:

```json
{
  "topic": "Cell biology",
  "difficulty": "medium",
  "question": "What does a ribosome make?",
  "options": ["Proteins", "Lipids", "DNA", "Glucose"],
  "answer": 0,
  "explanation": "Ribosomes assemble amino acids into proteins."
}
```

`answer` is the zero-based index of the correct option. To make a term
interactive anywhere in a question, topic, answer choice, explanation, or
flashcard, add a case-insensitive entry to the top-level `glossary` object.
Matching terms receive an accessible definition tooltip on hover or keyboard
focus.

The app supports light, polished graphite dark, green dark, and system color themes.
The dark option uses a neutral black-and-gray palette; Green selects the original
green palette. The selected theme is saved in the current browser. Buttons and
flashcard flips use short sounds generated in the browser; interaction remains
available if audio is unsupported. Cards and controls also provide subtle
hover and press feedback. The interactive starfield uses drifting white stars
and a low-contrast grayscale nebula haze; it pauses for reduced-motion users
and when the page is hidden.
Search covers disciplines, subjects, topics, and question content. Resetting account progress clears quiz results, completed
topics, flashcards, and streak data in Firestore; it keeps the Firebase account.
