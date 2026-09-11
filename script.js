document.addEventListener('DOMContentLoaded', () => {
    // Start Screen Elements
    const startContainer = document.getElementById('start-container');
    const startForm = document.getElementById('start-form');
    const studentNameInput = document.getElementById('student-name');
    
    // Quiz Elements
    const quizWrapper = document.getElementById('quiz-wrapper');
    const questionsContainer = document.getElementById('questions-container');
    const quizForm = document.getElementById('quiz-form');
    const displayName = document.getElementById('display-name');
    const timerDisplay = document.getElementById('timer-display');
    
    // Warning Elements
    const warningOverlay = document.getElementById('warning-overlay');
    const warningSound = document.getElementById('warning-sound');
    
    // Result Elements
    const resultContainer = document.getElementById('result-container');
    const scoreSpan = document.getElementById('score');
    const scoreMessage = document.getElementById('score-message');
    const resultStudentName = document.getElementById('result-student-name');
    const reviewList = document.getElementById('review-list');

    let testStarted = false;
    let testSubmitted = false;
    let timerInterval;
    let timeLeft = 25 * 60; // 25 minutes in seconds

    // Render questions initially
    questions.forEach((q, index) => {
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';

        const questionText = document.createElement('div');
        questionText.className = 'question-text';
        questionText.textContent = `${q.id}. ${q.question}`;
        questionCard.appendChild(questionText);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-container';

        for (const [key, value] of Object.entries(q.options)) {
            const label = document.createElement('label');
            label.className = 'option-label';

            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `q${q.id}`;
            input.value = key;
            input.required = true;

            const text = document.createTextNode(` ${key}. ${value}`);

            label.appendChild(input);
            label.appendChild(text);
            optionsContainer.appendChild(label);
        }

        questionCard.appendChild(optionsContainer);
        questionsContainer.appendChild(questionCard);
    });

    // Start Test
    startForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = studentNameInput.value.trim();
        if (name) {
            displayName.textContent = name;
            resultStudentName.textContent = name;
            startContainer.classList.add('hidden');
            quizWrapper.classList.remove('hidden');
            testStarted = true;
            startTimer();
        }
    });

    function startTimer() {
        updateTimerDisplay();
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 60) {
                timerDisplay.classList.add('warning');
            }

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                submitTest();
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Handle form submission
    quizForm.addEventListener('submit', (e) => {
        if(e) e.preventDefault();
        submitTest();
    });

    function submitTest() {
        if (testSubmitted) return;
        testSubmitted = true;
        clearInterval(timerInterval);
        
        let score = 0;
        const formData = new FormData(quizForm);
        reviewList.innerHTML = ''; // clear any existing

        questions.forEach((q) => {
            const selected = formData.get(`q${q.id}`);
            const isCorrect = (selected === q.answer);
            if (isCorrect) score++;

            // Create review item
            const reviewCard = document.createElement('div');
            reviewCard.className = `review-item ${isCorrect ? 'correct-border' : 'incorrect-border'}`;

            const qTitle = document.createElement('div');
            qTitle.className = 'review-question';
            qTitle.textContent = `${q.id}. ${q.question}`;
            reviewCard.appendChild(qTitle);

            // Options review
            for (const [key, value] of Object.entries(q.options)) {
                const optDiv = document.createElement('div');
                optDiv.className = 'review-option';
                optDiv.textContent = `${key}. ${value}`;
                
                if (key === q.answer) {
                    optDiv.classList.add('correct-ans');
                } else if (key === selected && !isCorrect) {
                    optDiv.classList.add('wrong-ans');
                }

                reviewCard.appendChild(optDiv);
            }

            // Status message
            const statusDiv = document.createElement('div');
            statusDiv.className = 'review-status';
            if (isCorrect) {
                statusDiv.classList.add('status-correct');
                statusDiv.textContent = '✓ Correct';
            } else {
                statusDiv.classList.add('status-incorrect');
                statusDiv.textContent = selected ? `✗ Incorrect (You chose ${selected})` : '✗ Not Attempted';
            }
            reviewCard.appendChild(statusDiv);

            reviewList.appendChild(reviewCard);
        });

        quizWrapper.classList.add('hidden');
        resultContainer.classList.remove('hidden');
        scoreSpan.textContent = score;

        if (score >= 45) {
            scoreMessage.textContent = 'Excellent! You have a great understanding of physical and chemical changes.';
        } else if (score >= 35) {
            scoreMessage.textContent = 'Good job! Review the questions you missed to improve your score.';
        } else {
            scoreMessage.textContent = 'Keep practicing! Review the detailed answers below.';
        }
        
        // Disable warning
        hideWarning();
        window.scrollTo(0, 0);
    }

    // Anti-cheat mechanism: detect tab/window switching
    document.addEventListener('visibilitychange', () => {
        if (testStarted && !testSubmitted) {
            if (document.hidden) {
                showWarning();
            } else {
                setTimeout(hideWarning, 3000);
            }
        }
    });

    window.addEventListener('blur', () => {
        if (testStarted && !testSubmitted) {
            showWarning();
        }
    });

    window.addEventListener('focus', () => {
        if (testStarted && !testSubmitted) {
            setTimeout(hideWarning, 3000);
        }
    });

    function showWarning() {
        warningOverlay.classList.remove('hidden');
        warningSound.volume = 1.0;
        warningSound.play().catch(e => console.log('Audio play prevented by browser policy'));
    }

    function hideWarning() {
        warningOverlay.classList.add('hidden');
        warningSound.pause();
        warningSound.currentTime = 0;
    }
});
