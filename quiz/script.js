import questionBank from './questions.json' with { type: 'json' };

const { disciplines, subjects: learningSubjects, glossary } = questionBank;

const emptyProgress = () => ({
	answered: 0,
	correct: 0,
	bySubject: {},
	completedTopics: [],
	knownCards: [],
	streak: 0,
	lastStudyDate: null,
});

const migrateProgress = (savedStats, subjects) => {
	const stats = {
		...emptyProgress(),
		...savedStats,
		bySubject: { ...(savedStats.bySubject || {}) },
		completedTopics: Array.isArray(savedStats.completedTopics) ? savedStats.completedTopics : [],
		knownCards: Array.isArray(savedStats.knownCards) ? savedStats.knownCards : [],
	};
	const subjectById = new Map(subjects.map((subject) => [subject.id, subject]));
	const topicDestinations = {
		'Business & entrepreneurship': 'business-studies',
		'Marketing & trade': 'business-studies',
		'Accounting & financial literacy': 'accounting',
		Economics: 'economics',
	};
	let changed = false;

	if (stats.bySubject.art && !stats.bySubject['visual-arts']) {
		stats.bySubject['visual-arts'] = stats.bySubject.art;
		delete stats.bySubject.art;
		changed = true;
	}

	stats.completedTopics = [...new Set(stats.completedTopics.map((entry) => {
		const separator = entry.indexOf(':');
		const subjectId = entry.slice(0, separator);
		const topic = entry.slice(separator + 1);
		if (subjectId === 'art') {
			changed = true;
			return `visual-arts:${topic}`;
		}
		if (subjectId === 'commercial-studies' && topicDestinations[topic]) {
			changed = true;
			return `${topicDestinations[topic]}:${topic}`;
		}
		return entry;
	}))];

	const oldCommercialTopics = ['Business & entrepreneurship', 'Accounting & financial literacy', 'Economics', 'Marketing & trade'];
	const commercialCardIds = oldCommercialTopics.map((topic) => {
		const subjectId = topicDestinations[topic];
		const subject = subjectById.get(subjectId);
		const questionIndexes = subject?.questions
			.map((question, index) => question.topic === topic ? index : -1)
			.filter((index) => index >= 0) || [];
		return { topic, subjectId, questionIndexes };
	});
	stats.knownCards = [...new Set(stats.knownCards.map((cardId) => {
		const artCard = cardId.match(/^art-(\d+)$/);
		if (artCard) {
			changed = true;
			return `visual-arts-${artCard[1]}`;
		}
		const commercialCard = cardId.match(/^commercial-studies-(\d+)$/);
		if (!commercialCard) return cardId;

		const oldIndex = Number(commercialCard[1]);
		let offset = 0;
		for (const { topic, subjectId, questionIndexes } of commercialCardIds) {
			const topicCount = questionIndexes.length;
			if (oldIndex < offset + topicCount) {
				changed = true;
				return `${subjectId}-${questionIndexes[oldIndex - offset]}`;
			}
			offset += topicCount;
		}
		return cardId;
	}))];

	return { stats, changed };
};

document.addEventListener('alpine:init', () => {
	Alpine.data('reziQuiz', () => ({
		disciplines,
		subjects: learningSubjects,
		view: 'home',
		activeDisciplineId: null,
		activeSubjectId: null,
		mobileMenu: false,
		accountMenuOpen: false,
		searchQuery: '',
		searchOpen: false,
		searchActiveIndex: 0,
		flashSubject: 'all',
		flashIndex: 0,
		flashFlipped: false,
		audioContext: null,
		buttonSoundListenerInstalled: false,
		selectedQuizSubject: 'all',
		quizActive: false,
		quizFinished: false,
		quizQuestions: [],
		quizSubjectId: null,
		quizDisciplineId: null,
		quizTopic: null,
		questionIndex: 0,
		selectedAnswer: null,
		quizScore: 0,
		stats: emptyProgress(),
		firebase: null,
		authUser: null,
		authLoading: true,
		authBusy: false,
		authMode: 'signIn',
		showAuthCard: false,
		authEmail: '',
		authPassword: '',
		authDisplayName: '',
		authError: '',
		authNotice: '',
		firebaseConfigError: '',
		firestoreError: '',
		firestoreReady: false,
		syncState: 'synced',
		authUnsubscribe: null,
		progressUnsubscribe: null,
		progressSaveTimer: null,
		progressWriteQueue: null,
		progressUserId: null,
		authGeneration: 0,
		theme: 'system',
		themeError: '',
		weekDays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],

		async init() {
			try {
				this.theme = window.localStorage.getItem('rezi-theme') || 'system';
			} catch (error) {
				this.theme = 'system';
				this.themeError = `Theme preference could not be loaded: ${error.message}`;
			}
			this.applyTheme();
			window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
				if (this.theme === 'system') this.applyTheme();
			});
			this.$nextTick(() => this.renderIcons());
			this.$watch('view', () => this.$nextTick(() => this.renderIcons()));
			this.$watch('questionIndex', () => this.$nextTick(() => this.renderIcons()));
			this.$watch('selectedAnswer', () => this.$nextTick(() => this.renderIcons()));
			this.$watch('flashFlipped', () => this.$nextTick(() => this.renderIcons()));
			this.$watch('flashSubject', () => {
				this.flashIndex = 0;
				this.flashFlipped = false;
			});
			this.$watch('searchQuery', () => {
				this.searchActiveIndex = 0;
			});
			if (!this.buttonSoundListenerInstalled) {
				document.addEventListener('click', (event) => {
					const target = event.target instanceof Element
						? event.target.closest('button, a[href], [role="button"], .topic-row')
						: null;
					if (!target || target.matches(':disabled, [aria-disabled="true"], .flashcard, .flashcard-controls .button-outline')) return;
					this.playButtonSound();
				});
				this.buttonSoundListenerInstalled = true;
			}
			window.addEventListener('keydown', (event) => {
				if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
					event.preventDefault();
					document.querySelector('.search-box input')?.focus();
				}
				if (event.key === 'Escape') {
					this.mobileMenu = false;
					this.accountMenuOpen = false;
					this.searchOpen = false;
				}
			});
			try {
				let timeout;
				try {
					this.firebase = await Promise.race([
						window.reziFirebaseReady,
						new Promise((resolve, reject) => {
							timeout = window.setTimeout(() => reject(new Error('Firebase could not be reached. Check your connection and reload the page.')), 15000);
						}),
					]);
				} finally {
					window.clearTimeout(timeout);
				}
				this.authUnsubscribe = this.firebase.onAuthStateChanged(this.firebase.auth, (user) => {
					this.handleAuthState(user);
				});
			} catch (error) {
				this.firebaseConfigError = error.message || 'Firebase could not be initialized.';
				this.authLoading = false;
			}
		},

		saveProgress() {
			if (!this.isAuthenticated || !this.firebase) return;
			window.clearTimeout(this.progressSaveTimer);
			this.syncState = 'syncing';
			const userId = this.authUser.uid;
			const generation = this.authGeneration;
			const stats = JSON.parse(JSON.stringify(this.stats));
			this.progressSaveTimer = window.setTimeout(() => {
				this.progressSaveTimer = null;
				this.persistProgress(userId, generation, stats);
			}, 250);
		},

		renderIcons() {
			if (window.lucide?.createIcons) window.lucide.createIcons();
		},

		annotateText(text) {
			if (typeof text !== 'string') return '';
			const terms = Object.keys(glossary).sort((left, right) => right.length - left.length);
			if (!terms.length) return this.escapeHtml(text);

			const pattern = new RegExp(`(^|[^\\p{L}\\p{N}_])(${terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?=$|[^\\p{L}\\p{N}_])`, 'giu');
			let output = '';
			let lastIndex = 0;
			let match;
			while ((match = pattern.exec(text)) !== null) {
				const prefix = match[1];
				const term = match[2];
				const definition = glossary[term.toLowerCase()];
				const termStart = match.index + prefix.length;
				output += this.escapeHtml(text.slice(lastIndex, termStart));
				output += definition
					? `<span class="term-tooltip" tabindex="0" role="note" aria-label="${this.escapeHtml(`${term}. ${definition}`)}" data-tooltip="${this.escapeHtml(definition)}">${this.escapeHtml(term)}</span>`
					: this.escapeHtml(term);
				lastIndex = termStart + term.length;
			}
			return output + this.escapeHtml(text.slice(lastIndex));
		},

		escapeHtml(value) {
			return value.replace(/[&<>"']/g, (character) => ({
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#39;',
			})[character]);
		},

		get isAuthenticated() {
			return Boolean(this.authUser?.emailVerified && this.firestoreReady);
		},

		get userInitial() {
			return (this.authUser?.displayName || this.authUser?.email || 'S').trim().charAt(0).toUpperCase();
		},

		get userLabel() {
			return this.authUser?.displayName || this.authUser?.email?.split('@')[0] || 'Student';
		},

		async handleAuthState(user) {
			const generation = ++this.authGeneration;
			this.accountMenuOpen = false;
			window.clearTimeout(this.progressSaveTimer);
			this.progressSaveTimer = null;
			this.progressUnsubscribe?.();
			this.progressUnsubscribe = null;
			this.progressUserId = null;
			this.firestoreReady = false;
			this.firestoreError = '';
			this.authError = '';
			this.authNotice = '';
			this.stats = emptyProgress();

			if (!user) {
				this.authUser = null;
				this.stats = emptyProgress();
				this.showAuthCard = false;
				this.authLoading = false;
				this.syncState = 'synced';
				return;
			}

			this.authUser = {
				uid: user.uid,
				email: user.email,
				displayName: user.displayName,
				emailVerified: user.emailVerified,
			};
			this.showAuthCard = true;

			if (!user.emailVerified) {
				this.authLoading = false;
				return;
			}

			this.authLoading = true;
			this.progressUserId = user.uid;
			const progressRef = this.firebase.doc(this.firebase.db, 'users', user.uid, 'progress', 'current');
			this.progressUnsubscribe = this.firebase.onSnapshot(progressRef, (snapshot) => {
				if (generation !== this.authGeneration) return;
				let migratedProgress = false;
				if (snapshot.exists()) {
					const savedStats = snapshot.data().stats;
					if (savedStats && typeof savedStats === 'object') {
						const migrated = migrateProgress(savedStats, this.subjects);
						this.stats = migrated.stats;
						migratedProgress = migrated.changed;
					}
				} else {
					this.firebase.setDoc(progressRef, {
						stats: emptyProgress(),
						updatedAt: this.firebase.serverTimestamp(),
					}).catch((error) => {
						if (generation !== this.authGeneration) return;
						this.firestoreError = `Progress could not be initialized: ${error.message}`;
						this.syncState = 'error';
					});
				}
				this.firestoreReady = true;
				this.authLoading = false;
				this.syncState = 'synced';
				if (migratedProgress) this.saveProgress();
				this.$nextTick(() => this.renderIcons());
			}, (error) => {
				if (generation !== this.authGeneration) return;
				this.firestoreError = `Progress could not be loaded: ${error.message}`;
				this.authLoading = false;
				this.syncState = 'error';
			});
		},

		async persistProgress(userId, generation, stats) {
			const write = (this.progressWriteQueue || Promise.resolve()).then(async () => {
				try {
					const progressRef = this.firebase.doc(this.firebase.db, 'users', userId, 'progress', 'current');
					await this.firebase.setDoc(progressRef, {
						stats,
						updatedAt: this.firebase.serverTimestamp(),
					});
					if (generation === this.authGeneration && this.authUser?.uid === userId) {
						this.syncState = 'synced';
						this.firestoreError = '';
					}
					return true;
				} catch (error) {
					if (generation === this.authGeneration && this.authUser?.uid === userId) {
						this.syncState = 'error';
						this.firestoreError = `Progress could not be saved: ${error.message}`;
					}
					return false;
				}
			});
			this.progressWriteQueue = write;
			return write;
		},

		setAuthMode(mode) {
			this.authMode = mode;
			this.authError = '';
			this.authNotice = '';
			this.authPassword = '';
		},

		authErrorMessage(error) {
			const messages = {
				'auth/account-exists-with-different-credential': 'This email already uses another sign-in method. Sign in with that method instead.',
				'auth/email-already-in-use': 'An account with this email already exists. Sign in instead.',
				'auth/invalid-credential': 'The email or password is incorrect.',
				'auth/invalid-email': 'Enter a valid email address.',
				'auth/operation-not-allowed': 'This sign-in method is not enabled in Firebase Authentication yet.',
				'auth/popup-closed-by-user': 'The Google sign-in window was closed before completing sign-in.',
				'auth/popup-blocked': 'Your browser blocked the Google sign-in window. Allow pop-ups and try again.',
				'auth/unauthorized-domain': 'This website domain is not authorized in Firebase Authentication. Add it under Authentication settings.',
				'auth/too-many-requests': 'Too many attempts. Wait a little while and try again.',
				'auth/user-disabled': 'This account has been disabled. Contact the site administrator.',
				'auth/weak-password': 'Choose a stronger password with at least eight characters.',
				'auth/network-request-failed': 'A network error interrupted sign-in. Check your connection and try again.',
			};
			return messages[error.code] || error.message || 'Authentication failed. Please try again.';
		},

		async signIn() {
			this.authBusy = true;
			this.authError = '';
			this.authNotice = '';
			try {
				await this.firebase.signInWithEmailAndPassword(this.firebase.auth, this.authEmail.trim(), this.authPassword);
				this.authPassword = '';
			} catch (error) {
				this.authError = this.authErrorMessage(error);
			} finally {
				this.authBusy = false;
			}
		},

		async signUp() {
			this.authBusy = true;
			this.authError = '';
			this.authNotice = '';
			try {
				const credential = await this.firebase.createUserWithEmailAndPassword(this.firebase.auth, this.authEmail.trim(), this.authPassword);
				const displayName = this.authDisplayName.trim().slice(0, 80);
				if (displayName) await this.firebase.updateProfile(credential.user, { displayName });
				await this.firebase.sendEmailVerification(credential.user);
				this.authUser = {
					uid: credential.user.uid,
					email: credential.user.email,
					displayName: credential.user.displayName,
					emailVerified: credential.user.emailVerified,
				};
				this.authNotice = `We sent a verification link to ${credential.user.email}. Verify your email, then return here.`;
				this.authPassword = '';
			} catch (error) {
				this.authError = this.authErrorMessage(error);
			} finally {
				this.authBusy = false;
			}
		},

		async signInWithGoogle() {
			this.authBusy = true;
			this.authError = '';
			this.authNotice = '';
			try {
				const provider = new this.firebase.GoogleAuthProvider();
				provider.setCustomParameters({ prompt: 'select_account' });
				await this.firebase.signInWithPopup(this.firebase.auth, provider);
			} catch (error) {
				this.authError = this.authErrorMessage(error);
			} finally {
				this.authBusy = false;
			}
		},

		async sendPasswordReset() {
			this.authBusy = true;
			this.authError = '';
			this.authNotice = '';
			try {
				await this.firebase.sendPasswordResetEmail(this.firebase.auth, this.authEmail.trim());
				this.authNotice = 'If an account exists for that email, a password reset link has been sent.';
			} catch (error) {
				this.authError = this.authErrorMessage(error);
			} finally {
				this.authBusy = false;
			}
		},

		async resendVerification() {
			this.authBusy = true;
			this.authError = '';
			this.authNotice = '';
			try {
				await this.firebase.sendEmailVerification(this.firebase.auth.currentUser);
				this.authNotice = 'A new verification link has been sent.';
			} catch (error) {
				this.authError = this.authErrorMessage(error);
			} finally {
				this.authBusy = false;
			}
		},

		async checkEmailVerification() {
			this.authBusy = true;
			this.authError = '';
			this.authNotice = '';
			try {
				const user = this.firebase.auth.currentUser;
				await this.firebase.reload(user);
				await this.handleAuthState(user);
				if (!user.emailVerified) this.authNotice = 'Your email is not verified yet. Check your inbox for the verification link.';
			} catch (error) {
				this.authError = this.authErrorMessage(error);
			} finally {
				this.authBusy = false;
			}
		},

		async signOut() {
			if (this.progressSaveTimer !== null && this.authUser?.uid) {
				window.clearTimeout(this.progressSaveTimer);
				this.progressSaveTimer = null;
				const saved = await this.persistProgress(
					this.authUser.uid,
					this.authGeneration,
					JSON.parse(JSON.stringify(this.stats)),
				);
				if (!saved) {
					this.authError = 'Your latest progress could not be synced. Check your connection and try again before signing out.';
					return;
				}
			}
			try {
				await this.firebase.signOut(this.firebase.auth);
				this.view = 'home';
			} catch (error) {
				this.authError = this.authErrorMessage(error);
			}
		},

		retryProgressSync() {
			this.authLoading = true;
			this.handleAuthState(this.firebase.auth.currentUser);
		},

		get pageTitle() {
			if (this.view === 'subject') return this.activeSubject?.name || 'Subject';
			if (this.view === 'discipline') return this.activeDiscipline?.name || 'Discipline';
			return ({ home: 'Overview', subjects: 'Disciplines', quiz: 'Quick quiz', flashcards: 'Flashcards', progress: 'My progress' })[this.view] || 'Overview';
		},

		get breadcrumbItems() {
			const workspace = { label: 'Workspace', view: 'home' };
			const library = { label: 'Disciplines', view: 'subjects' };
			if (this.view === 'subject') return [
				workspace,
				library,
				{ label: this.activeDiscipline?.name || 'Discipline', view: 'discipline', current: false },
				{ label: this.activeSubject?.name || 'Subject', current: true },
			];
			if (this.view === 'discipline') return [
				workspace,
				library,
				{ label: this.activeDiscipline?.name || 'Discipline', current: true },
			];
			if (this.view === 'quiz' && this.quizSubjectId) {
				const subject = this.subjects.find((item) => item.id === this.quizSubjectId);
				const discipline = this.disciplines.find((item) => item.id === subject?.disciplineId);
				return [
					workspace,
					library,
					{ label: discipline?.name || 'Discipline', view: 'discipline', disciplineId: discipline?.id },
					{ label: subject?.name || 'Subject', view: 'subject', subjectId: subject?.id },
					{ label: this.quizTopic || 'Quick quiz', current: true },
				];
			}
			if (this.view === 'quiz' && this.quizDisciplineId) {
				const discipline = this.disciplines.find((item) => item.id === this.quizDisciplineId);
				return [
					workspace,
					library,
					{ label: discipline?.name || 'Discipline', view: 'discipline', disciplineId: discipline?.id },
					{ label: 'Quick quiz', current: true },
				];
			}
			const label = ({ home: 'Overview', subjects: 'Disciplines', quiz: 'Quick quiz', flashcards: 'Flashcards', progress: 'My progress' })[this.view] || 'Overview';
			return [workspace, { label, current: true }];
		},

		get todayLabel() {
			return new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());
		},

		get streak() {
			return this.stats.streak;
		},

		get dueCards() {
			return Math.max(0, this.allFlashcards.length - this.stats.knownCards.length);
		},

		get accuracy() {
			return this.stats.answered ? Math.round((this.stats.correct / this.stats.answered) * 100) : 0;
		},

		get activeSubject() {
			return this.subjects.find((subject) => subject.id === this.activeSubjectId) || null;
		},

		get activeDiscipline() {
			return this.disciplines.find((discipline) => discipline.id === this.activeDisciplineId) || null;
		},

		subjectsForDiscipline(disciplineId) {
			return this.subjects.filter((subject) => subject.disciplineId === disciplineId);
		},

		get filteredDisciplines() {
			const query = this.searchQuery.trim().toLowerCase();
			if (!query) return this.disciplines;
			return this.disciplines.filter((discipline) => {
				const subjects = this.subjectsForDiscipline(discipline.id);
				return `${discipline.name} ${discipline.description} ${subjects.map((subject) => `${subject.name} ${subject.description} ${subject.topics.join(' ')}`).join(' ')}`.toLowerCase().includes(query);
			});
		},

		get filteredSubjects() {
			const query = this.searchQuery.trim().toLowerCase();
			const subjects = this.activeDiscipline ? this.subjectsForDiscipline(this.activeDiscipline.id) : this.subjects;
			if (!query) return subjects;
			return subjects.filter((subject) => `${subject.name} ${subject.category} ${subject.description} ${subject.topics.join(' ')}`.toLowerCase().includes(query));
		},

		get searchResults() {
			const query = this.normalizeSearchText(this.searchQuery);
			if (query.length < 2) return [];
			const terms = query.split(/\s+/).filter(Boolean);
			const results = [];
			const score = (text, title = '') => {
				const normalized = this.normalizeSearchText(text);
				if (!terms.every((term) => normalized.includes(term))) return 0;
				const normalizedTitle = this.normalizeSearchText(title);
				return terms.reduce((total, term) => total + (normalizedTitle.startsWith(term) ? 8 : normalizedTitle.includes(` ${term}`) ? 5 : normalizedTitle.includes(term) ? 3 : 1), 0);
			};

			for (const discipline of this.disciplines) {
				const relevance = score(`${discipline.name} ${discipline.description}`, discipline.name);
				if (relevance) results.push({ id: discipline.id, type: 'discipline', title: discipline.name, description: discipline.description, label: 'Discipline', icon: 'layers-3', relevance });
			}
			for (const subject of this.subjects) {
				const discipline = this.disciplines.find((item) => item.id === subject.disciplineId);
				const relevance = score(`${subject.name} ${subject.category} ${subject.description} ${subject.topics.join(' ')} ${discipline?.name || ''}`, subject.name);
				if (relevance) results.push({ id: subject.id, type: 'subject', subjectId: subject.id, title: subject.name, description: `${discipline?.name || 'Learning'} · ${subject.description}`, label: 'Subject', icon: 'book-open', relevance });
				for (const topic of subject.topics) {
					const topicRelevance = score(`${topic} ${subject.name} ${discipline?.name || ''}`, topic);
					if (topicRelevance) results.push({ id: `${subject.id}:${topic}`, type: 'topic', subjectId: subject.id, topic, title: topic, description: `${subject.name} · ${this.topicQuestionCount(subject.id, topic)} practice questions`, label: 'Topic', icon: 'bookmark', relevance: topicRelevance + 2 });
				}
				for (const [index, question] of subject.questions.entries()) {
					const questionRelevance = score(`${question.question} ${question.explanation} ${question.options[question.answer]}`, question.question);
					if (questionRelevance) results.push({ id: `${subject.id}:${index}`, type: 'question', subjectId: subject.id, question, title: question.question, description: `${subject.name} · ${question.topic} · ${question.difficulty}`, label: 'Question', icon: 'circle-help', relevance: questionRelevance });
				}
			}
			return results.sort((left, right) => right.relevance - left.relevance || left.title.localeCompare(right.title)).slice(0, 8);
		},

		get allFlashcards() {
			return this.subjects.flatMap((subject) => subject.questions.map((question, index) => ({
				id: `${subject.id}-${index}`,
				subjectId: subject.id,
				subjectName: subject.name,
				topic: question.topic,
				question: question.question,
				explanation: question.explanation || question.options[question.answer],
			})));
		},

		get filteredCards() {
			const cards = this.flashSubject === 'all' ? this.allFlashcards : this.allFlashcards.filter((card) => card.subjectId === this.flashSubject);
			return cards.filter((card) => !this.stats.knownCards.includes(card.id));
		},

		get currentFlashcard() {
			return this.filteredCards[this.flashIndex] || null;
		},

		get currentQuestion() {
			return this.quizQuestions[this.questionIndex] || null;
		},

		get quizSubjectLabel() {
			const subject = this.subjects.find((item) => item.id === this.quizSubjectId);
			const discipline = this.disciplines.find((item) => item.id === this.quizDisciplineId);
			return this.quizTopic || subject?.name || discipline?.name || 'Mixed subjects';
		},

		get resultMessage() {
			const ratio = this.quizQuestions.length ? this.quizScore / this.quizQuestions.length : 0;
			if (ratio === 1) return 'A brilliant result.';
			if (ratio >= 0.7) return 'You’re building real momentum.';
			if (ratio >= 0.4) return 'Good work showing up.';
			return 'Every question is a fresh start.';
		},

		get resultCopy() {
			return `You got ${this.quizScore} out of ${this.quizQuestions.length} questions right. Take a moment to revisit any concepts that felt tricky.`;
		},

		navigate(destination) {
			if (destination === 'home' || destination === 'subjects') {
				this.activeDisciplineId = null;
				this.activeSubjectId = null;
			}
			this.view = destination;
			this.mobileMenu = false;
			this.accountMenuOpen = false;
			if (destination !== 'quiz') this.quizActive = false;
		},

		normalizeSearchText(value) {
			return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
		},

		clearSearch() {
			this.searchQuery = '';
			this.searchOpen = false;
		},

		openFirstSearchResult() {
			const result = this.searchResults[this.searchActiveIndex];
			if (result) this.openSearchResult(result);
		},

		moveSearchSelection(direction) {
			const resultCount = this.searchResults.length;
			if (!resultCount) return;
			this.searchActiveIndex = (this.searchActiveIndex + direction + resultCount) % resultCount;
		},

		openSearchResult(result) {
			this.searchOpen = false;
			this.searchQuery = '';
			if (result.type === 'discipline') {
				this.openDiscipline(result.id);
			} else if (result.type === 'subject') {
				this.openSubject(result.subjectId);
			} else if (result.type === 'topic') {
				this.startQuiz(result.subjectId, result.topic);
			} else if (result.type === 'question') {
				this.startQuiz(result.subjectId, result.question.topic, null, null, result.question.question);
			}
		},

		openDiscipline(disciplineId) {
			this.activeDisciplineId = disciplineId;
			this.activeSubjectId = null;
			this.view = 'discipline';
			this.mobileMenu = false;
			this.accountMenuOpen = false;
			this.searchQuery = '';
		},

		openSubject(subjectId) {
			this.activeSubjectId = subjectId;
			this.activeDisciplineId = this.subjects.find((subject) => subject.id === subjectId)?.disciplineId || null;
			this.view = 'subject';
			this.mobileMenu = false;
			this.searchQuery = '';
		},

		visitBreadcrumb(item) {
			if (item.subjectId) {
				this.openSubject(item.subjectId);
				return;
			}
			if (item.disciplineId) {
				this.openDiscipline(item.disciplineId);
				return;
			}
			if (item.view === 'discipline' && this.activeDisciplineId) {
				this.openDiscipline(this.activeDisciplineId);
				return;
			}
			this.navigate(item.view);
		},

		subjectProgress(subjectId) {
			if (!subjectId) return 0;
			const subject = this.subjects.find((item) => item.id === subjectId);
			if (!subject) return 0;
			const completed = this.stats.completedTopics.filter((entry) => entry.startsWith(`${subjectId}:`)).length;
			return Math.round((completed / subject.topics.length) * 100);
		},

		isTopicDone(subjectId, topic) {
			return this.stats.completedTopics.includes(`${subjectId}:${topic}`);
		},

		topicQuestions(subjectId, topic) {
			const subject = this.subjects.find((item) => item.id === subjectId);
			return subject?.questions.filter((question) => question.topic === topic) || [];
		},

		topicQuestionCount(subjectId, topic) {
			return this.topicQuestions(subjectId, topic).length;
		},

		topicDifficultyCount(subjectId, topic, difficulty) {
			return this.topicQuestions(subjectId, topic).filter((question) => question.difficulty === difficulty).length;
		},

		recordStudySession() {
			const today = new Date().toISOString().slice(0, 10);
			if (this.stats.lastStudyDate !== today) {
				const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
				this.stats.streak = this.stats.lastStudyDate === yesterday ? this.stats.streak + 1 : 1;
				this.stats.lastStudyDate = today;
			}
			this.saveProgress();
		},

		startQuiz(subjectId = null, topic = null, disciplineId = null, difficulty = null, exactQuestion = null) {
			this.quizSubjectId = subjectId || null;
			this.quizDisciplineId = disciplineId || null;
			this.quizTopic = topic || null;
			this.selectedQuizSubject = subjectId || (disciplineId ? `discipline:${disciplineId}` : 'all');
			let pool = this.subjects.flatMap((subject) => subject.questions.map((question) => ({ ...question, subjectId: subject.id, subjectName: subject.name })));
			if (subjectId) pool = pool.filter((question) => question.subjectId === subjectId);
			else if (disciplineId) pool = pool.filter((question) => this.subjects.find((subject) => subject.id === question.subjectId)?.disciplineId === disciplineId);
			if (topic) pool = pool.filter((question) => question.topic === topic);
			if (difficulty) pool = pool.filter((question) => question.difficulty === difficulty);
			if (exactQuestion) pool = pool.filter((question) => question.question === exactQuestion);
			if (!pool.length) {
				this.authError = 'There are no questions available for that selection yet.';
				return;
			}
			this.quizQuestions = pool.sort(() => Math.random() - 0.5).slice(0, 10);
			this.questionIndex = 0;
			this.selectedAnswer = null;
			this.quizScore = 0;
			this.quizFinished = false;
			this.quizActive = true;
			this.view = 'quiz';
			this.mobileMenu = false;
			this.searchOpen = false;
			this.recordStudySession();
		},

		startSelectedQuiz() {
			if (this.selectedQuizSubject.startsWith('discipline:')) {
				this.startQuiz(null, null, this.selectedQuizSubject.slice('discipline:'.length));
				return;
			}
			this.startQuiz(this.selectedQuizSubject === 'all' ? null : this.selectedQuizSubject);
		},

		answerQuestion(index) {
			if (this.selectedAnswer !== null || !this.currentQuestion) return;
			this.selectedAnswer = index;
			const isCorrect = index === this.currentQuestion.answer;
			if (isCorrect) this.quizScore += 1;
			this.stats.answered += 1;
			if (isCorrect) this.stats.correct += 1;
			const subjectStats = this.stats.bySubject[this.currentQuestion.subjectId] || { answered: 0, correct: 0 };
			subjectStats.answered += 1;
			if (isCorrect) subjectStats.correct += 1;
			this.stats.bySubject[this.currentQuestion.subjectId] = subjectStats;
			this.saveProgress();
		},

		answerClass(index) {
			if (this.selectedAnswer === null) return '';
			if (index === this.currentQuestion?.answer) return 'answer-correct';
			if (index === this.selectedAnswer) return 'answer-incorrect';
			return 'answer-muted';
		},

		answerIcon(index) {
			if (this.selectedAnswer === null) return null;
			if (index === this.currentQuestion?.answer) return 'circle-check';
			if (index === this.selectedAnswer) return 'circle-x';
			return null;
		},

		nextQuestion() {
			if (this.questionIndex < this.quizQuestions.length - 1) {
				this.questionIndex += 1;
				this.selectedAnswer = null;
			} else {
				this.quizFinished = true;
				if (this.quizSubjectId && this.quizTopic) {
					const completedKey = `${this.quizSubjectId}:${this.quizTopic}`;
					if (!this.stats.completedTopics.includes(completedKey)) this.stats.completedTopics.push(completedKey);
				}
				this.saveProgress();
			}
		},

		leaveQuiz() {
			this.quizActive = false;
			this.navigate(this.activeSubjectId ? 'subject' : 'home');
		},

		openFlashcards() {
			this.view = 'flashcards';
			this.mobileMenu = false;
			this.flashFlipped = false;
		},

		nextFlashcard() {
			this.flashIndex = (this.flashIndex + 1) % Math.max(this.filteredCards.length, 1);
			this.flashFlipped = false;
		},

		previousFlashcard() {
			this.flashIndex = (this.flashIndex - 1 + this.filteredCards.length) % Math.max(this.filteredCards.length, 1);
			this.flashFlipped = false;
		},

		toggleFlashcard() {
			this.flashFlipped = !this.flashFlipped;
			this.playFlashcardFlipSound();
		},

		getAudioContext() {
			if (!window.AudioContext) return null;
			if (!this.audioContext) this.audioContext = new window.AudioContext();
			if (this.audioContext.state === 'suspended') this.audioContext.resume();
			return this.audioContext;
		},

		playButtonSound() {
			const context = this.getAudioContext();
			if (!context) return;

			const oscillator = context.createOscillator();
			const gain = context.createGain();
			const now = context.currentTime;
			oscillator.type = 'sine';
			oscillator.frequency.setValueAtTime(780, now);
			gain.gain.setValueAtTime(0.0001, now);
			gain.gain.exponentialRampToValueAtTime(0.018, now + 0.004);
			gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
			oscillator.connect(gain);
			gain.connect(context.destination);
			oscillator.start(now);
			oscillator.stop(now + 0.045);
		},

		playFlashcardFlipSound() {
			const context = this.getAudioContext();
			if (!context) return;

			const duration = 0.12;
			const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
			const samples = buffer.getChannelData(0);
			for (let index = 0; index < samples.length; index += 1) {
				samples[index] = (Math.random() * 2 - 1) * (1 - index / samples.length);
			}

			const source = context.createBufferSource();
			const filter = context.createBiquadFilter();
			const gain = context.createGain();
			const now = context.currentTime;
			source.buffer = buffer;
			filter.type = 'lowpass';
			filter.frequency.setValueAtTime(1800, now);
			gain.gain.setValueAtTime(0.0001, now);
			gain.gain.exponentialRampToValueAtTime(0.035, now + 0.015);
			gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
			source.connect(filter);
			filter.connect(gain);
			gain.connect(context.destination);
			source.start(now);
			source.stop(now + duration);
		},

		markFlashcard(confidence) {
			const card = this.currentFlashcard;
			if (confidence === 'known' && card && !this.stats.knownCards.includes(card.id)) this.stats.knownCards.push(card.id);
			this.saveProgress();
			this.flashIndex = Math.min(this.flashIndex, Math.max(this.filteredCards.length - 1, 0));
			this.flashFlipped = false;
		},

		async resetProgress() {
			if (!window.confirm('Reset progress saved to this account across all devices? Quiz results, completed topics, flashcards, and streak data will be cleared. Your Firebase account will remain active.')) return;
			window.clearTimeout(this.progressSaveTimer);
			this.progressSaveTimer = null;
			this.stats = emptyProgress();
			this.flashIndex = 0;
			this.flashFlipped = false;
			this.accountMenuOpen = false;
			if (!this.isAuthenticated || !this.firebase) return;
			this.syncState = 'syncing';
			await this.persistProgress(this.authUser.uid, this.authGeneration, JSON.parse(JSON.stringify(this.stats)));
		},

		applyTheme() {
			document.documentElement.dataset.theme = this.theme;
			const resolvedTheme = this.theme === 'system'
				? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
				: this.theme;
			document.documentElement.dataset.resolvedTheme = resolvedTheme;
			const themeColor = document.querySelector('meta[name="theme-color"]');
			if (themeColor) themeColor.content = resolvedTheme === 'dark' ? '#151c18' : '#f6f5ef';
		},

		setTheme(theme) {
			if (!['light', 'dark', 'system'].includes(theme)) return;
			this.theme = theme;
			this.applyTheme();
			this.themeError = '';
			try {
				window.localStorage.setItem('rezi-theme', theme);
			} catch (error) {
				this.themeError = `Theme preference could not be saved: ${error.message}`;
			}
		},

		openAuth(mode) {
			this.authMode = mode;
			this.showAuthCard = true;
			this.authError = '';
			this.authNotice = '';
		},
	}));
});
