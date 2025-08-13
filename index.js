//Index JS Implementation
document.addEventListener('DOMContentLoaded', () => {
    const askAiBtn = document.getElementById('ask-ai');
    const questionInput = document.getElementById('question');
    const aiResponseElem = document.getElementById('ai-response');
    const responseArea = document.querySelector('.response-area');
    const typeBtns = document.querySelectorAll('.type-btn');
    const questionTypeIndicator = document.getElementById('question-type-indicator');
    const mainTitle = document.getElementById('main-title');
    const subtitle = document.getElementById('subtitle');

    let selectedType = 'auto';

    // Question type for detection of eac patterns
    const mathPatterns = [
        /\d[\+\-\*\/\^\(\)\=]/,
        /\b(solve|calculate|compute|find|evaluate|simplify|factor|integrate|differentiate|equation|formula)\b/i,
        /\b(algebra|geometry|calculus|trigonometry|statistics|probability)\b/i,
        /[0-9]+\s*[\+\-\*\/]\s*[0-9]+/,
        /\b(percent|percentage|ratio|proportion)\b/i
    ];

    const generalPatterns = [
        /\b(what|how|why|when|where|who|which|explain|describe|tell me about)\b/i,
        /\b(history|science|technology|culture|philosophy|literature)\b/i,
        /\b(definition|meaning|concept|theory|principle)\b/i
    ];

    // Question type detection function
    function detectQuestionType(question) {
        const hasMathPatterns = mathPatterns.some(pattern => pattern.test(question));
        const hasGeneralPatterns = generalPatterns.some(pattern => pattern.test(question));

        if (hasMathPatterns && !hasGeneralPatterns) return 'math';
        if (hasGeneralPatterns && !hasMathPatterns) return 'general';
        if (hasMathPatterns && hasGeneralPatterns) return 'mixed';
        return 'general'; // default to general if unclear
    }

    // Update UI based on question type
    function updateUIForQuestionType(type) {
        const typeLabels = {
            'math': '🧮 Math Question',
            'general': '💭 General Question',
            'mixed': '🤖 Mixed Question',
            'auto': '🤖 Auto Detect'
        };

        // Show indicator for manual modes (math, general) or detected types
        if (type === 'math' || type === 'general' || type === 'mixed') {
            questionTypeIndicator.textContent = typeLabels[type];
            questionTypeIndicator.style.display = 'block';

            // Update input placeholder
            if (type === 'math') {
                questionInput.placeholder = 'Type your math problem here... (e.g., 2x + 5 = 15)';
            } else if (type === 'general') {
                questionInput.placeholder = 'Ask me anything... (e.g., What is photosynthesis?)';
            }
        } else if (type === 'auto') {
            // Hide indicator for auto mode unless there's a detected type
            questionTypeIndicator.style.display = 'none';
            questionInput.placeholder = 'Type your question here...';
        }
    }

    // Type button event listeners
    typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            typeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedType = btn.dataset.type;
            updateUIForQuestionType(selectedType);
        });
    });

    if (askAiBtn && questionInput && aiResponseElem) {
        askAiBtn.addEventListener('click', async () => {
            const question = questionInput.value.trim();

            if (!question) {
                aiResponseElem.textContent = "Please enter a question before asking!";
                aiResponseElem.style.color = 'var(--accent-red)';
                return;
            }

            // Detect question type if auto mode
            let questionType = selectedType;
            if (selectedType === 'auto') {
                questionType = detectQuestionType(question);
            }

            // Update UI for detected type
            updateUIForQuestionType(questionType);

            // Set loading states
            askAiBtn.classList.add('loading');
            responseArea.classList.add('loading');
            aiResponseElem.style.color = 'var(--text-secondary)';
            aiResponseElem.textContent = questionType === 'math' ? 'Solving your problem...' : 'Thinking...';

            try {
                const response = await fetch('http://localhost:4000/ai', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt: question,
                        questionType: questionType
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text ||
                    'No answer found. Please try a different question.';

                // Typewriter effect for response
                typeWriterEffect(aiResponseElem, aiText);
            } catch (err) {
                console.error('Error:', err);
                aiResponseElem.textContent = `Error: ${err.message || 'Could not connect to the AI service'}`;
                aiResponseElem.style.color = 'var(--accent-red)';
            } finally {
                // Remove loading states
                askAiBtn.classList.remove('loading');
                responseArea.classList.remove('loading');
            }
        });

        // Add enter key support
        questionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                askAiBtn.click();
            }
        });

        // Real-time question type detection for auto mode
        questionInput.addEventListener('input', () => {
            if (selectedType === 'auto') {
                const question = questionInput.value.trim();
                if (question) {
                    const detectedType = detectQuestionType(question);
                    updateUIForQuestionType(detectedType);
                } else {
                    questionTypeIndicator.style.display = 'none';
                }
            }
        });
    }

    function typeWriterEffect(element, text, speed = 20) {
        let i = 0;
        element.textContent = '';

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }

        type();
    }
});
