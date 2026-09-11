document.addEventListener('DOMContentLoaded', () => {
    const questionsContainer = document.getElementById('questions-container');
    const quizForm = document.getElementById('quiz-form');
    const warningOverlay = document.getElementById('warning-overlay');
    const warningSound = document.getElementById('warning-sound');
    const quizContainer = document.getElementById('quiz-container');
    const resultContainer = document.getElementById('result-container');
    const scoreSpan = document.getElementById('score');
    const scoreMessage = document.getElementById('score-message');

    let testSubmitted = false;

    // Render questions
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

            const text = document.createTextNode(` ${value}`);

            label.appendChild(input);
            label.appendChild(text);
            optionsContainer.appendChild(label);
        }

        questionCard.appendChild(optionsContainer);
        questionsContainer.appendChild(questionCard);
    });

    // Handle form submission
    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        testSubmitted = true;
        
        let score = 0;
        const formData = new FormData(quizForm);

        questions.forEach((q) => {
            const selected = formData.get(`q${q.id}`);
            if (selected === q.answer) {
                score++;
            }
        });

        quizContainer.classList.add('hidden');
        resultContainer.classList.remove('hidden');
        scoreSpan.textContent = score;

        if (score >= 45) {
            scoreMessage.textContent = 'Excellent! You have a great understanding of physical and chemical changes.';
        } else if (score >= 35) {
            scoreMessage.textContent = 'Good job! Review the questions you missed to improve your score.';
        } else {
            scoreMessage.textContent = 'Keep practicing! Review the chapter carefully and try again.';
        }
        
        // Ensure any warning is removed when test is over
        warningOverlay.classList.add('hidden');
        warningSound.pause();
    });

    // Anti-cheat mechanism: detect tab/window switching
    document.addEventListener('visibilitychange', () => {
        if (!testSubmitted) {
            if (document.hidden) {
                // Tab changed or window minimized
                showWarning();
            } else {
                // Returned to tab (maybe hide warning or keep it until acknowledged?)
                // We'll hide it to allow them to continue, but the prompt says: 
                // "if user swtich the screen become red and shows warning with a loud sound"
                // Let's keep the warning on for 3 seconds after they return, or just hide it when they return.
                setTimeout(hideWarning, 3000);
            }
        }
    });

    // Also trigger on window blur
    window.addEventListener('blur', () => {
        if (!testSubmitted) {
            showWarning();
        }
    });

    window.addEventListener('focus', () => {
        if (!testSubmitted) {
            setTimeout(hideWarning, 3000);
        }
    });

    function showWarning() {
        warningOverlay.classList.remove('hidden');
        // Play loud sound (browsers might block autoplay if no interaction, 
        // but typically allowed if user has interacted with the page already)
        warningSound.volume = 1.0;
        warningSound.play().catch(e => console.log('Audio play prevented by browser policy'));
    }

    function hideWarning() {
        warningOverlay.classList.add('hidden');
        warningSound.pause();
        warningSound.currentTime = 0;
    }
});
