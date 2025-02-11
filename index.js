import moment from "https://esm.sh/moment";

// Load stored values from localStorage or use defaults
let timer = parseInt(localStorage.getItem("timer")) || 0;
let clockIn = localStorage.getItem("clockIn")
	? parseInt(localStorage.getItem("clockIn"))
	: null;
let isClockedIn = localStorage.getItem("isClockedIn") === "true";

const timerEl = document.querySelector("#timer");
const punchInEl = document.querySelector("#punchIn");
const punchOutEl = document.querySelector("#punchOut");
const clearDayEl = document.querySelector("#clearDay");

let lastUpdate = Date.now();
let accumulatedTime = timer;

// Function to update the timer display
function updateTimer() {
	let now = Date.now();
	if (isClockedIn && clockIn) {
		accumulatedTime = timer + Math.floor((now - clockIn) / 1000);
	}

	// Convert elapsed time to HH:MM:SS
	let formattedTime = moment
		.utc()
		.startOf("day")
		.add(accumulatedTime, "seconds")
		.format("HH:mm:ss");

	timerEl.innerHTML = formattedTime;
}

function animate() {
	let now = Date.now();
	if (now - lastUpdate >= 1000) {
		updateTimer();
		lastUpdate = now;
	}
	requestAnimationFrame(animate);
}

// Function to toggle clock-in state
function toggle() {
	if (isClockedIn) {
		// If clocking out, store the accumulated time
		if (clockIn) {
			let now = Date.now();
			timer += Math.floor((now - clockIn) / 1000);
			clockIn = null;
			localStorage.setItem("timer", timer);
		}
		localStorage.removeItem("clockIn");
	} else {
		// If clocking in, set a new timestamp
		clockIn = Date.now();
		localStorage.setItem("clockIn", clockIn);
	}

	isClockedIn = !isClockedIn;
	localStorage.setItem("isClockedIn", isClockedIn);
	punchInEl.classList.toggle("hid");
	punchOutEl.classList.toggle("hid");
}

// Event Listeners
punchInEl.addEventListener("click", toggle);
punchOutEl.addEventListener("click", toggle);

clearDayEl.addEventListener("click", () => {
	localStorage.removeItem("timer");
	localStorage.removeItem("clockIn");
	localStorage.removeItem("isClockedIn");

	timer = 0;
	isClockedIn = false;
	clockIn = null;

	punchInEl.classList.remove("hid");
	punchOutEl.classList.add("hid");

	updateTimer();
});

// Ensure correct UI state on load
if (isClockedIn) {
	punchInEl.classList.add("hid");
	punchOutEl.classList.remove("hid");
} else {
	punchInEl.classList.remove("hid");
	punchOutEl.classList.add("hid");
}

// Start the animation loop
requestAnimationFrame(animate);
updateTimer();