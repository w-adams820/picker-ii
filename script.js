// DOM Selector Nodes
const nameInput = document.getElementById('nameInput');
const nameCount = document.getElementById('nameCount');
const spinBtn = document.getElementById('spinBtn');
const displayStage = document.getElementById('displayStage');

const idleState = document.getElementById('idleState');
const shufflingState = document.getElementById('shufflingState');
const winnerState = document.getElementById('winnerState');

const shuffleText = document.getElementById('shuffleText');
const winnerName = document.getElementById('winnerName');
const progressBar = document.getElementById('progressBar');

let isSpinning = false;
let usedNames = new Set();

// Event Interceptor Listeners
nameInput.addEventListener('input', () => {
    updateNameCount();
});

spinBtn.addEventListener('click', startPicker);

// Initialize count display when page loads
updateNameCount();

// Converts raw user lines to sanitized arrays
function getNames() {
    return nameInput.value.split('\n')
        .map(n => n.trim())
        .filter(n => n.length > 0);
}

// Resets internal configurations
function clearList() {
    nameInput.value = '';
    usedNames.clear();
    updateNameCount();
    idleState.classList.remove('hidden');
    shufflingState.classList.add('hidden');
    winnerState.classList.add('hidden');
    displayStage.classList.remove('winner-glow');
}

function getUniqueNames(names) {
    return Array.from(new Set(names));
}

function updateNameCount() {
    const uniqueNames = getUniqueNames(getNames());
    const remainingNames = uniqueNames.filter(name => !usedNames.has(name));
    nameCount.innerText = `${remainingNames.length} STUDENTS READY`;
}

// Begins selection calculation mechanics
function startPicker() {
    const uniqueNames = getUniqueNames(getNames());
    const availableNames = uniqueNames.filter(name => !usedNames.has(name));

    if (availableNames.length === 0) {
        if (uniqueNames.length === 0) {
            alert('Please add some student names first!');
        } else {
            alert('All names have already been picked. Clear the list or add new names to continue.');
        }
        return;
    }

    if (isSpinning) return;

    isSpinning = true;
    spinBtn.disabled = true;
    
    // UI Pipeline Resets
    idleState.classList.add('hidden');
    winnerState.classList.add('hidden');
    shufflingState.classList.remove('hidden');
    displayStage.classList.add('shuffling');
    progressBar.style.width = '0%';
    
    // Initialize High Stakes Shuffling Loop
    let shuffleInterval = setInterval(() => {
        const randomName = availableNames[Math.floor(Math.random() * availableNames.length)];
        shuffleText.innerText = randomName;
    }, 80);

    // Synchronize progress animation timing
    setTimeout(() => {
        progressBar.style.width = '100%';
    }, 10);

    // Complete calculation sequence after 2000 milliseconds
    setTimeout(() => {
        clearInterval(shuffleInterval);
        const finalWinner = availableNames[Math.floor(Math.random() * availableNames.length)];
        announceWinner(finalWinner);
    }, 2000);
}

// Handles post-selection reveal orchestration
function announceWinner(name) {
    isSpinning = false;
    spinBtn.disabled = false;
    usedNames.add(name);
    updateNameCount();
    
    displayStage.classList.remove('shuffling');
    shufflingState.classList.add('hidden');
    
    winnerName.innerText = name;
    winnerState.classList.remove('hidden');
    
    // CSS-in-JS Animation Matrix for Reveal Punchiness
    winnerState.animate([
        { opacity: 0, transform: 'scale(0.8)' },
        { opacity: 1, transform: 'scale(1)' }
    ], {
        duration: 500,
        easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    });

    // Flash celebratory status glows across components
    displayStage.classList.add('winner-glow');
    setTimeout(() => {
        displayStage.classList.remove('winner-glow');
    }, 3000);
}