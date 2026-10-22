const makeQuestion = (topic, difficulty, question, options, answer, explanation) => ({
	topic,
	difficulty,
	question,
	options,
	answer,
	explanation,
});

const scienceSubjects = [
	{
		id: 'biology',
		name: 'Biology',
		category: 'LIFE SCIENCE',
		color: '#287f68',
		wash: '#e7f1e9',
		symbol: '✳',
		description: 'Explore the systems, structures, and interactions that make life possible, from tiny cells to whole ecosystems.',
		topics: ['Cell biology', 'Genetics & inheritance', 'Human body systems', 'Ecology'],
		questions: [
			makeQuestion('Cell biology', 'easy', 'Which organelle releases usable energy from glucose during cellular respiration?', ['The nucleus', 'The mitochondrion', 'The ribosome', 'The vacuole'], 1, 'Mitochondria are the main site of aerobic cellular respiration, transferring energy from glucose into ATP.'),
			makeQuestion('Cell biology', 'medium', 'What is the main role of the cell membrane?', ['To store genetic information', 'To control what enters and leaves the cell', 'To make proteins', 'To release oxygen'], 1, 'The selectively permeable cell membrane regulates the movement of substances into and out of the cell.'),
			makeQuestion('Cell biology', 'medium', 'Which cell structure assembles amino acids into proteins?', ['The ribosome', 'The lysosome', 'The centriole', 'The cell wall'], 0, 'Ribosomes read messenger RNA and join amino acids in the order specified to build proteins.'),
			makeQuestion('Cell biology', 'hard', 'A red blood cell is placed in a very dilute solution. What is most likely to happen?', ['Water leaves the cell by osmosis', 'Water enters the cell by osmosis', 'Solute leaves until the cell shrinks', 'The membrane becomes impermeable'], 1, 'Water moves by osmosis from the dilute surroundings into the cell, which can swell and potentially burst.'),
			makeQuestion('Genetics & inheritance', 'medium', 'In a DNA molecule, which base pairs with adenine?', ['Cytosine', 'Guanine', 'Thymine', 'Uracil'], 2, 'In DNA, adenine pairs with thymine. In RNA, adenine pairs with uracil instead.'),
			makeQuestion('Genetics & inheritance', 'medium', 'An organism has two different alleles for a gene. What is this condition called?', ['Homozygous', 'Heterozygous', 'Dominant', 'Recessive'], 1, 'A heterozygous organism carries two different alleles for a particular gene.'),
			makeQuestion('Genetics & inheritance', 'medium', 'Which molecule carries a copied genetic message from DNA to a ribosome?', ['Messenger RNA', 'Cellulose', 'Glycogen', 'Amino acid'], 0, 'Messenger RNA carries a copy of a gene’s instructions from DNA to a ribosome for protein synthesis.'),
			makeQuestion('Genetics & inheritance', 'hard', 'Two heterozygous parents have a child. If a recessive condition requires two recessive alleles, what is the chance the child has the condition?', ['0%', '25%', '50%', '75%'], 1, 'A cross of two heterozygous parents gives one recessive homozygous outcome out of four equally likely genotypes.'),
			makeQuestion('Human body systems', 'easy', 'Which part of the blood carries most of the oxygen around the body?', ['Platelets', 'White blood cells', 'Red blood cells', 'Plasma proteins'], 2, 'Hemoglobin in red blood cells binds oxygen in the lungs and carries it to body tissues.'),
			makeQuestion('Human body systems', 'medium', 'Where does most chemical digestion and nutrient absorption happen?', ['The esophagus', 'The small intestine', 'The large intestine', 'The stomach'], 1, 'The small intestine completes much of chemical digestion and absorbs nutrients through its folded lining.'),
			makeQuestion('Human body systems', 'medium', 'Where does oxygen move into the blood in the lungs?', ['The trachea', 'The alveoli', 'The diaphragm', 'The bronchi'], 1, 'Alveoli have thin walls and a rich blood supply, allowing oxygen to diffuse into nearby capillaries.'),
			makeQuestion('Human body systems', 'hard', 'Which kidney structure filters blood to begin forming urine?', ['The nephron', 'The alveolus', 'The villus', 'The tendon'], 0, 'Nephrons filter blood, then selectively reabsorb useful water and substances as urine is formed.'),
			makeQuestion('Ecology', 'easy', 'Which organisms make their own food and form the base of most food chains?', ['Consumers', 'Decomposers', 'Producers', 'Predators'], 2, 'Producers, such as plants and algae, capture energy and make organic molecules that support other organisms.'),
			makeQuestion('Ecology', 'medium', 'What is the term for all the populations of different species living in one area?', ['An ecosystem', 'A community', 'A habitat', 'A biome'], 1, 'A community is made up of the populations of different species living and interacting in an area.'),
			makeQuestion('Ecology', 'medium', 'What usually happens to the available energy as it moves from one trophic level to the next?', ['It increases at each level', 'It stays exactly the same', 'It decreases because organisms use and lose energy', 'It is converted entirely into matter'], 2, 'Organisms use much of the energy they obtain, and some is lost as heat, so less is available at higher trophic levels.'),
			makeQuestion('Ecology', 'hard', 'A bee gets nectar from a flower while helping pollinate it. What type of interaction is this?', ['Competition', 'Mutualism', 'Parasitism', 'Predation'], 1, 'In mutualism, both species benefit: the bee obtains food and the flower gains help with pollination.'),
		],
	},
	{
		id: 'chemistry',
		name: 'Chemistry',
		category: 'MATTER & CHANGE',
		color: '#bc6843',
		wash: '#f6ebe4',
		symbol: '◈',
		description: 'Make sense of atoms, reactions, and the materials around you by learning how matter is organized and transformed.',
		topics: ['Atoms & elements', 'Chemical bonding', 'Reactions & equations', 'Acids & bases'],
		questions: [
			makeQuestion('Atoms & elements', 'easy', 'Which subatomic particle determines the identity of an element?', ['The neutron', 'The electron', 'The proton', 'The isotope'], 2, 'An element is defined by its atomic number: the number of protons in its nucleus.'),
			makeQuestion('Atoms & elements', 'medium', 'Isotopes of the same element differ in their number of which particles?', ['Protons', 'Neutrons', 'Electron shells', 'Chemical bonds'], 1, 'Isotopes have the same number of protons but different numbers of neutrons.'),
			makeQuestion('Atoms & elements', 'medium', 'What is the atomic number of an atom with 11 protons?', ['5', '11', '22', 'It depends on its neutrons'], 1, 'An element’s atomic number is the number of protons in its nucleus, so this atom has atomic number 11.'),
			makeQuestion('Atoms & elements', 'hard', 'A neutral atom has 17 protons. How many electrons does it have?', ['8', '17', '18', '34'], 1, 'A neutral atom has equal numbers of protons and electrons, so it has 17 electrons.'),
			makeQuestion('Chemical bonding', 'medium', 'What happens to electrons when a typical ionic bond forms?', ['They are shared equally', 'They are transferred from one atom to another', 'They disappear', 'They form the nucleus'], 1, 'Ionic bonding involves electron transfer, producing oppositely charged ions that attract each other.'),
			makeQuestion('Chemical bonding', 'easy', 'A covalent bond forms when atoms do what with electrons?', ['Share them', 'Destroy them', 'Exchange protons', 'Lose their nuclei'], 0, 'Covalent bonds form when atoms share pairs of electrons.'),
			makeQuestion('Chemical bonding', 'medium', 'Why is an ionic compound such as sodium chloride electrically neutral overall?', ['Its ions have no charges', 'Positive and negative charges balance', 'It contains equal numbers of protons and neutrons', 'Its electrons are shared equally'], 1, 'The total positive and negative charges in an ionic compound balance to give no net charge.'),
			makeQuestion('Chemical bonding', 'hard', 'What holds the atoms together in a typical metallic solid?', ['Attraction between metal ions and delocalized electrons', 'Shared electron pairs between two nonmetals only', 'Hydrogen bonds between water molecules', 'Gravity between neutral atoms'], 0, 'Metallic bonding is the electrostatic attraction between positive metal ions and delocalized electrons.'),
			makeQuestion('Reactions & equations', 'medium', 'What must be equal on both sides of a balanced chemical equation?', ['The number of each type of atom', 'The number of molecules', 'The total volume', 'The number of compounds'], 0, 'Atoms are conserved in a chemical reaction, so each element must have the same atom count on both sides.'),
			makeQuestion('Reactions & equations', 'easy', 'In a chemical reaction, the substances present at the start are called what?', ['Products', 'Catalysts', 'Reactants', 'Solutions'], 2, 'Reactants are the starting substances that are changed into products during a reaction.'),
			makeQuestion('Reactions & equations', 'medium', 'In 2H₂ + O₂ → 2H₂O, what is the coefficient of oxygen gas?', ['1', '2', '3', '4'], 0, 'A coefficient of 1 is understood when no number is written before a formula, so one O₂ molecule is shown.'),
			makeQuestion('Reactions & equations', 'hard', 'How does a catalyst increase the rate of a chemical reaction?', ['By increasing the amount of product possible', 'By lowering the activation energy', 'By changing the atoms into different elements', 'By raising the reaction temperature automatically'], 1, 'A catalyst provides an alternative reaction pathway with a lower activation energy and is not used up overall.'),
			makeQuestion('Acids & bases', 'easy', 'A solution with a pH of 3 is best described as what?', ['Acidic', 'Neutral', 'Alkaline', 'Saturated'], 0, 'Values below 7 are acidic on the pH scale; a lower pH indicates greater acidity.'),
			makeQuestion('Acids & bases', 'medium', 'What are the typical products when an acid reacts with a base?', ['A salt and water', 'Hydrogen and oxygen', 'A metal and carbon dioxide', 'Only water'], 0, 'Neutralization reactions between acids and bases generally produce a salt and water.'),
			makeQuestion('Acids & bases', 'medium', 'Which ion is commonly associated with alkaline solutions in water?', ['Hydrogen, H⁺', 'Hydroxide, OH⁻', 'Chloride, Cl⁻', 'Nitrate, NO₃⁻'], 1, 'Alkaline solutions contain hydroxide ions; acids are associated with hydrogen ions in aqueous solution.'),
			makeQuestion('Acids & bases', 'hard', 'Compared with a solution at pH 5, how many times greater is the hydrogen ion concentration at pH 3?', ['2 times', '10 times', '100 times', '1,000 times'], 2, 'Each pH unit represents a tenfold change in hydrogen ion concentration, so a two-unit difference is 100-fold.'),
		],
	},
	{
		id: 'physics',
		name: 'Physics',
		category: 'ENERGY & MOTION',
		color: '#4278a1',
		wash: '#e7eef3',
		symbol: '⌁',
		description: 'Unpack the rules behind motion, forces, energy, and waves, then use them to explain the world in action.',
		topics: ['Forces & motion', 'Energy & work', 'Waves & sound', 'Electricity'],
		questions: [
			makeQuestion('Forces & motion', 'easy', 'A car travels 120 meters in 6 seconds. What is its average speed?', ['20 m/s', '720 m/s', '0.05 m/s', '126 m/s'], 0, 'Average speed equals distance divided by time: 120 m ÷ 6 s = 20 m/s.'),
			makeQuestion('Forces & motion', 'medium', 'Which equation describes Newton’s second law?', ['F = m ÷ a', 'F = m × a', 'F = a ÷ m', 'F = m + a'], 1, 'Newton’s second law states that the net force on an object equals its mass multiplied by its acceleration.'),
			makeQuestion('Forces & motion', 'medium', 'Which property makes an object resist a change in its motion?', ['Inertia', 'Pressure', 'Density', 'Elasticity'], 0, 'Inertia is an object’s tendency to resist changes in its state of motion and depends on its mass.'),
			makeQuestion('Forces & motion', 'hard', 'A moving object experiences zero net force. What happens to its velocity?', ['It steadily increases', 'It steadily decreases', 'It remains constant', 'It instantly becomes zero'], 2, 'With zero net force there is no acceleration, so the object continues with constant velocity.'),
			makeQuestion('Energy & work', 'easy', 'What is the unit of energy in the SI system?', ['Watt', 'Newton', 'Joule', 'Volt'], 2, 'The joule (J) is the SI unit for energy and work.'),
			makeQuestion('Energy & work', 'medium', 'A 10-newton force moves an object 3 meters in the force’s direction. How much work is done?', ['3 J', '13 J', '30 J', '0.3 J'], 2, 'Work equals force multiplied by displacement in the direction of the force: 10 N × 3 m = 30 J.'),
			makeQuestion('Energy & work', 'medium', 'What is the kinetic energy of a 2 kg object moving at 3 m/s?', ['6 J', '9 J', '18 J', '27 J'], 1, 'Kinetic energy is ½mv², so ½ × 2 kg × (3 m/s)² = 9 J.'),
			makeQuestion('Energy & work', 'hard', 'A device transfers 120 joules of energy in 6 seconds. What is its power?', ['20 W', '114 W', '126 W', '720 W'], 0, 'Power is energy transferred per unit time: 120 J ÷ 6 s = 20 W.'),
			makeQuestion('Waves & sound', 'easy', 'What type of wave is sound in air?', ['Transverse', 'Longitudinal', 'Electromagnetic', 'Standing only'], 1, 'Sound in air travels as a longitudinal wave made of compressions and rarefactions.'),
			makeQuestion('Waves & sound', 'medium', 'A wave has a frequency of 5 Hz and a wavelength of 2 m. What is its speed?', ['2.5 m/s', '7 m/s', '10 m/s', '0.4 m/s'], 2, 'Wave speed equals frequency multiplied by wavelength: 5 Hz × 2 m = 10 m/s.'),
			makeQuestion('Waves & sound', 'medium', 'What happens to the pitch of a sound when its frequency increases?', ['The pitch becomes higher', 'The pitch becomes lower', 'The sound travels faster in air', 'The wavelength must increase'], 0, 'A higher frequency is heard as a higher pitch; pitch does not determine the speed of sound in a given medium.'),
			makeQuestion('Waves & sound', 'hard', 'An echo is heard when sound waves do what?', ['Are absorbed completely', 'Reflect from a surface and return', 'Change into light', 'Stop vibrating at the source'], 1, 'An echo is reflected sound that returns to the listener after bouncing off a surface.'),
			makeQuestion('Electricity', 'easy', 'What is the SI unit of electric current?', ['Volt', 'Ohm', 'Ampere', 'Watt'], 2, 'Electric current is measured in amperes (A).'),
			makeQuestion('Electricity', 'medium', 'A 6-ohm resistor has a current of 2 amperes. What is the voltage across it?', ['3 V', '8 V', '12 V', '0.33 V'], 2, 'Ohm’s law is V = I × R, so 2 A × 6 Ω = 12 V.'),
			makeQuestion('Electricity', 'medium', 'In a series circuit, what is the same through every component?', ['The current', 'The voltage', 'The resistance', 'The power'], 0, 'There is only one path in a series circuit, so the same current passes through each component.'),
			makeQuestion('Electricity', 'hard', 'A lamp operates at 12 volts and draws 2 amperes. How much electrical power does it use?', ['6 W', '10 W', '14 W', '24 W'], 3, 'Electrical power is voltage multiplied by current: 12 V × 2 A = 24 W.'),
		],
	},
	{
		id: 'earth-space',
		name: 'Earth & Space',
		category: 'OUR PLANET & BEYOND',
		color: '#94713b',
		wash: '#f2efdf',
		symbol: '◎',
		description: 'Connect Earth’s changing systems with the wider universe, from moving plates and weather to stars and galaxies.',
		topics: ['Earth systems', 'Weather & climate', 'The solar system', 'Stars & the universe'],
		questions: [
			makeQuestion('Earth systems', 'easy', 'What is the rigid outer layer of Earth, made of the crust and uppermost mantle, called?', ['The core', 'The lithosphere', 'The atmosphere', 'The hydrosphere'], 1, 'The lithosphere is Earth’s rigid outer layer and is broken into moving tectonic plates.'),
			makeQuestion('Earth systems', 'medium', 'What is a common cause of earthquakes at plate boundaries?', ['The Moon’s phases', 'Sudden movement along faults', 'Daily temperature changes', 'Ocean tides alone'], 1, 'Earthquakes commonly occur when stress builds up and rocks suddenly slip along a fault.'),
			makeQuestion('Earth systems', 'medium', 'What process changes liquid water at Earth’s surface into water vapor?', ['Condensation', 'Evaporation', 'Precipitation', 'Collection'], 1, 'Evaporation occurs when liquid water gains enough energy to enter the atmosphere as water vapor.'),
			makeQuestion('Earth systems', 'hard', 'What helps drive the slow movement of tectonic plates?', ['Convection in the mantle', 'Daily ocean tides alone', 'Earth’s magnetic field', 'The changing phases of the Moon'], 0, 'Heat within Earth drives slow mantle convection, which contributes to the movement of tectonic plates.'),
			makeQuestion('Weather & climate', 'medium', 'What is the main difference between weather and climate?', ['Weather is daily; climate is a long-term pattern', 'Weather is global; climate is local', 'They mean exactly the same thing', 'Climate only describes temperature'], 0, 'Weather describes short-term atmospheric conditions; climate describes patterns over long periods.'),
			makeQuestion('Weather & climate', 'easy', 'Which gas is a major contributor to the enhanced greenhouse effect from human activities?', ['Oxygen', 'Carbon dioxide', 'Argon', 'Neon'], 1, 'Human activities release carbon dioxide, which absorbs outgoing infrared energy and contributes to warming.'),
			makeQuestion('Weather & climate', 'medium', 'What usually happens to warm, moist air as it rises and cools?', ['Water vapor may condense into clouds', 'It becomes denser and sinks immediately', 'Its humidity always becomes zero', 'It stops exerting pressure'], 0, 'As rising air cools, water vapor can condense into tiny droplets or ice crystals that form clouds.'),
			makeQuestion('Weather & climate', 'hard', 'A surface with a high albedo reflects what fraction of incoming sunlight?', ['A large fraction', 'No sunlight at all', 'Only infrared radiation', 'The same amount it absorbs'], 0, 'Albedo describes reflectivity: a high-albedo surface reflects a large proportion of incoming sunlight.'),
			makeQuestion('The solar system', 'easy', 'Which planet is closest to the Sun?', ['Venus', 'Earth', 'Mercury', 'Mars'], 2, 'Mercury is the innermost planet in our solar system.'),
			makeQuestion('The solar system', 'medium', 'Why does the Moon appear to change shape during the month?', ['Earth’s shadow always covers part of it', 'We see different portions of its sunlit half', 'The Moon changes its own brightness', 'Clouds cover it in a regular cycle'], 1, 'As the Moon orbits Earth, we see changing fractions of its half illuminated by the Sun.'),
			makeQuestion('The solar system', 'medium', 'What is the main reason Earth has seasons?', ['Earth’s axis is tilted as it orbits the Sun', 'Earth is much closer to the Sun in summer', 'The Sun changes its temperature each season', 'The Moon blocks different amounts of sunlight'], 0, 'Earth’s axial tilt changes the angle and duration of sunlight received by each hemisphere through the year.'),
			makeQuestion('The solar system', 'hard', 'Which planet is the largest in our solar system?', ['Saturn', 'Jupiter', 'Neptune', 'Earth'], 1, 'Jupiter is the largest planet in our solar system by both diameter and mass.'),
			makeQuestion('Stars & the universe', 'easy', 'What is the Sun?', ['A planet', 'A moon', 'A star', 'A galaxy'], 2, 'The Sun is a star: a sphere of hot plasma that produces energy through nuclear fusion.'),
			makeQuestion('Stars & the universe', 'medium', 'What does the light-year measure?', ['Time', 'Brightness', 'Distance', 'Temperature'], 2, 'A light-year is the distance light travels in one year, about 9.46 trillion kilometers.'),
			makeQuestion('Stars & the universe', 'medium', 'Which process releases most of the energy produced by the Sun?', ['Nuclear fusion', 'Chemical combustion', 'Nuclear fission of iron', 'Gravitational attraction between planets'], 0, 'The Sun releases energy by fusing hydrogen nuclei into helium in its core.'),
			makeQuestion('Stars & the universe', 'hard', 'What observation supports the idea that the universe is expanding?', ['Light from many distant galaxies is redshifted', 'All stars have the same brightness', 'The Moon is moving away from the Sun', 'Planets orbit in perfect circles'], 0, 'The redshift of light from distant galaxies indicates that many are moving away as space expands.'),
		],
	},
];

const emptyProgress = () => ({
	answered: 0,
	correct: 0,
	bySubject: {},
	completedTopics: [],
	knownCards: [],
	streak: 0,
	lastStudyDate: null,
});

document.addEventListener('alpine:init', () => {
	Alpine.data('reziQuiz', () => ({
		subjects: scienceSubjects,
		view: 'home',
		activeSubjectId: null,
		mobileMenu: false,
		searchQuery: '',
		flashSubject: 'all',
		flashIndex: 0,
		flashFlipped: false,
		selectedQuizSubject: 'all',
		quizActive: false,
		quizFinished: false,
		quizQuestions: [],
		quizSubjectId: null,
		quizTopic: null,
		questionIndex: 0,
		selectedAnswer: null,
		quizScore: 0,
		stats: emptyProgress(),
		weekDays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],

		init() {
			this.loadProgress();
			this.$nextTick(() => this.renderIcons());
			this.$watch('view', () => this.$nextTick(() => this.renderIcons()));
			this.$watch('questionIndex', () => this.$nextTick(() => this.renderIcons()));
			this.$watch('selectedAnswer', () => this.$nextTick(() => this.renderIcons()));
			this.$watch('flashFlipped', () => this.$nextTick(() => this.renderIcons()));
			this.$watch('flashSubject', () => {
				this.flashIndex = 0;
				this.flashFlipped = false;
			});
			window.addEventListener('keydown', (event) => {
				if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
					event.preventDefault();
					document.querySelector('.search-box input')?.focus();
				}
				if (event.key === 'Escape') this.mobileMenu = false;
			});
		},

		loadProgress() {
			try {
				const saved = JSON.parse(localStorage.getItem('reziquiz-progress') || 'null');
				if (saved && typeof saved === 'object') this.stats = { ...emptyProgress(), ...saved };
			} catch {
				this.stats = emptyProgress();
			}
		},

		saveProgress() {
			localStorage.setItem('reziquiz-progress', JSON.stringify(this.stats));
		},

		renderIcons() {
			if (window.lucide?.createIcons) window.lucide.createIcons();
		},

		get pageTitle() {
			if (this.view === 'subject') return this.activeSubject?.name || 'Subject';
			return ({ home: 'Overview', subjects: 'Subjects', quiz: 'Quick quiz', flashcards: 'Flashcards', progress: 'My progress' })[this.view] || 'Overview';
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

		get filteredSubjects() {
			const query = this.searchQuery.trim().toLowerCase();
			if (!query) return this.subjects;
			return this.subjects.filter((subject) => `${subject.name} ${subject.category} ${subject.description} ${subject.topics.join(' ')}`.toLowerCase().includes(query));
		},

		get allFlashcards() {
			return this.subjects.flatMap((subject) => subject.questions.map((question, index) => ({
				id: `${subject.id}-${index}`,
				subjectId: subject.id,
				subjectName: subject.name,
				topic: question.topic,
				question: question.question,
				answer: `${question.options[question.answer]} ${question.explanation}`,
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
			return this.quizTopic || subject?.name || 'Mixed science';
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
			this.view = destination;
			this.mobileMenu = false;
			if (destination !== 'quiz') this.quizActive = false;
		},

		searchTopics() {
			if (!this.searchQuery.trim()) return;
			this.view = 'subjects';
			this.mobileMenu = false;
		},

		openSubject(subjectId) {
			this.activeSubjectId = subjectId;
			this.view = 'subject';
			this.mobileMenu = false;
			this.searchQuery = '';
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

		recordStudySession() {
			const today = new Date().toISOString().slice(0, 10);
			if (this.stats.lastStudyDate !== today) {
				const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
				this.stats.streak = this.stats.lastStudyDate === yesterday ? this.stats.streak + 1 : 1;
				this.stats.lastStudyDate = today;
			}
			this.saveProgress();
		},

		startQuiz(subjectId = null, topic = null) {
			this.quizSubjectId = subjectId || null;
			this.quizTopic = topic || null;
			this.selectedQuizSubject = subjectId || 'all';
			let pool = this.subjects.flatMap((subject) => subject.questions.map((question) => ({ ...question, subjectId: subject.id, subjectName: subject.name })));
			if (subjectId) pool = pool.filter((question) => question.subjectId === subjectId);
			if (topic) pool = pool.filter((question) => question.topic === topic);
			this.quizQuestions = pool.sort(() => Math.random() - 0.5).slice(0, 10);
			this.questionIndex = 0;
			this.selectedAnswer = null;
			this.quizScore = 0;
			this.quizFinished = false;
			this.quizActive = true;
			this.view = 'quiz';
			this.mobileMenu = false;
			this.recordStudySession();
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

		markFlashcard(confidence) {
			const card = this.currentFlashcard;
			if (confidence === 'known' && card && !this.stats.knownCards.includes(card.id)) this.stats.knownCards.push(card.id);
			this.saveProgress();
			this.flashIndex = Math.min(this.flashIndex, Math.max(this.filteredCards.length - 1, 0));
			this.flashFlipped = false;
		},

		resetProgress() {
			if (!window.confirm('Reset all saved quiz, streak, and flashcard progress? This cannot be undone.')) return;
			this.stats = emptyProgress();
			this.saveProgress();
			this.flashIndex = 0;
		},
	}));
});
