const creationArea = document.getElementById('creation-area');
const displayArea = document.getElementById('display-area');
const messageInput = document.getElementById('message');
const dateInput = document.getElementById('date-input');
const lockBtn = document.getElementById('lock-btn');
const statusMessage = document.getElementById('status-message');
const secretContent = document.getElementById('secret-content');
const resetBtn = document.getElementById('reset-btn');
const timerElement = document.getElementById('timer');

let countdownInterval; 

window.onload = function() {
    checkCapsule();
};

lockBtn.addEventListener('click', function() {
    const message = messageInput.value;
    const unlockDate = dateInput.value;

    if (message === "" || unlockDate === "") {
        alert("Please enter both a message and a date!");
        return;
    }

    
    const encodedMessage = btoa(message); 

    localStorage.setItem('capsuleMessage', encodedMessage);
    localStorage.setItem('unlockDate', unlockDate);

    checkCapsule();
});

function checkCapsule() {
    const storedMessage = localStorage.getItem('capsuleMessage');
    const storedDate = localStorage.getItem('unlockDate');

    if (storedMessage && storedDate) {
        creationArea.classList.add('hidden');
        displayArea.classList.remove('hidden');
        
        const now = new Date().getTime();
        const target = new Date(storedDate).getTime();

        if (now >= target) {
            
            clearInterval(countdownInterval); 
            timerElement.classList.add('hidden'); 
            
            statusMessage.innerHTML = "🔓 Capsule Unlocked!";
            
            
            secretContent.textContent = atob(storedMessage);
            
            secretContent.classList.remove('blur-effect');
            secretContent.classList.add('revealed');
            resetBtn.classList.remove('hidden');
            
            
            secretContent.onclick = null; 

        } else {
            
            statusMessage.innerHTML = `🔒 Capsule Locked.`;
            secretContent.textContent = "ENCRYPTED CONTENT";
            secretContent.classList.add('blur-effect');
            
            timerElement.classList.remove('hidden');

            
            startCountdown(target);

            
            secretContent.onclick = function() {
                secretContent.classList.add('shake-it');
                setTimeout(() => {
                    secretContent.classList.remove('shake-it');
                }, 500); 
            };
        }
    }
}

function startCountdown(targetTime) {
    
    if (countdownInterval) clearInterval(countdownInterval);

    countdownInterval = setInterval(function() {
        const now = new Date().getTime();
        const distance = targetTime - now;

        
        if (distance < 0) {
            clearInterval(countdownInterval);
            checkCapsule(); 
            return;
        }

        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        
        timerElement.innerHTML = `
            ${days}d 
            ${String(hours).padStart(2, '0')}h 
            ${String(minutes).padStart(2, '0')}m 
            ${String(seconds).padStart(2, '0')}s
        `;

    }, 1000); 
}

resetBtn.addEventListener('click', function() {
    localStorage.clear();
    location.reload();
});