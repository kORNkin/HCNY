let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let selectedChoice = null;

const questions = [
    {
        question: "วันนี้วันอะไร?",
        choices: ["ข้างแรมที่ 9", "29/1/2025", "พุธ", "ตรุษจืน"],
        correct: 2,
    },
    {
        question: "ตอนนี้ IG ห้องมีผู้ติดตามประมาณกี่คน?",
        choices: ["310+", "320+", "330+", "340+"],
        correct: 2,
    },
    {
        question: "ตอนนี้ IG ห้องกดติดตามกี่แอค?",
        choices: ["33", "31", "29", "27"],
        correct: 1,
    },
    {
        question: "โพสต์พระศาสตราจารย์ลูกศร วัดอวตาร #ภูมิปกรณ์ มีจำนวนกดไลก์เท่าไหร่?",
        choices: ["48", "59", "67", "70"],
        correct: 2,
    },
    {
        question: "โพสต์แรก IG ห้อง โพสต์วันที่?",
        choices: ["17 May", "20 May", "22 May", "19 May"],
        correct: 0,
    },
    {
        question: "?",
        choices: [" ", " ", " ", " "],
        correct: 3,
    }
    
];

function startQuiz() {
    const name = document.getElementById('userName').value;
    
    if (!name) {
        alert("Please fill your name!");
        return;
    }

    document.querySelector('.user-data').style.display = 'none';
    document.getElementById('quiz-content').style.display = 'block';

    showQuestion();

    const webhookUrl = 'https://discord.com/api/webhooks/1334058737106685952/9X5Wvn99zmnqT35hnsmuZbMkeLHhrh-AdAuLUxZo9V85UDKm2KhC-71Gz2FutQnhvK-t';  // Replace with your actual webhook URL

    const message = {
        content: `${name} | comes in!`,
    };

    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    })
    .then(response => console.log('Data sent to Discord:', response))
    .catch(error => console.error('Error sending data:', error));

    
}

function showQuestion() {
    const question = questions[currentQuestion];
    document.getElementById('question').textContent = question.question;
    
    const choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = '';
    
    question.choices.forEach((choice, index) => {
        const div = document.createElement('div');
        div.className = 'choice';
        div.textContent = choice;
        div.onclick = () => selectAnswer(index);
        choicesContainer.appendChild(div);
    });
}

function selectAnswer(index) {
    if (selectedChoice !== null) {
        choices.children[selectedChoice].classList.remove('selected');
    }
    selectedChoice = index;
    choices.children[index].classList.add('selected');
}

function lastSubmit(){
    document.getElementById('submit-answer').style.display = 'none';
    document.getElementById('last-sumbit').style.display = 'block';
}

function submitAnswer() {
    if (selectedChoice === null) {
        alert("Please select an answer");
        return;
    }

    document.getElementById('submit-answer').style.display = 'none';

    const question = questions[currentQuestion];
    const choices = document.getElementById('choices').children;
    
    // Show correct/wrong answers
    choices[question.correct].classList.add('correct');
    if (selectedChoice !== question.correct) {
        choices[selectedChoice].classList.add('wrong');
    }

    // Update score and store answer
    if (selectedChoice === question.correct) score++;
    userAnswers.push({
        question: question.question,
        selected: selectedChoice,
        correct: question.correct
    });
    
    // Prepare for next question
    setTimeout(() => {
        currentQuestion++;
        selectedChoice = null;

        document.getElementById('submit-answer').style.display = 'block';
        
        if (currentQuestion < questions.length - 1) {
            showQuestion();
        } else if (currentQuestion === questions.length - 1) {
            showQuestion();
            lastSubmit();
        }
        else {
            showResult();
        }
    }, 0);
}

function sendScoreToDiscord(userData) {
    const webhookUrl = 'https://discord.com/api/webhooks/1334056406919286784/QyxrPoVMT50-cps4MJAHw4421OQjswxw05kumXwRuLr_Tulj71pDJznsp46d97Si8mGA';  // Replace with your actual webhook URL

    const message = {
        content: `**Name**: ${userData.name}\n**Score**: ${userData.score}/${questions.length}`,
    };

    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    })
    .then(response => console.log('Data sent to Discord:', response))
    .catch(error => console.error('Error sending data:', error));
}

function showResult() {
    document.getElementById('last-sumbit').style.display = 'none';
    
    const quizContent = document.getElementById('quiz-content');
    quizContent.innerHTML = `
        <h2>Quiz Completed!</h2>
        <p>Your score: ${score}/${questions.length}</p>
    `;

    if (score === questions.length) {
        const resultLink = document.createElement('a');
        resultLink.href = 'https://gift.truemoney.com/campaign?v=0194b10360797c42a77221073a0133e79e5';
        resultLink.textContent = 'เก่งมากครับพี่ชาย';
        quizContent.appendChild(resultLink);
    }

    sendScoreToDiscord({
        name: document.getElementById('userName').value,
        score: score,
        answers: userAnswers
    });
}