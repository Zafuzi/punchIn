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

// Function to update the timer display
function updateTimer() {
	if (isClockedIn && clockIn) {
		// Calculate real elapsed time
		let now = Date.now();
		let elapsedTime = Math.floor((now - clockIn) / 1000);
		timer = elapsedTime;
		localStorage.setItem("timer", timer);
	}

	// Show/hide clear button
	if (timer > 0) {
		clearDayEl.classList.remove("hid");
	} else {
		clearDayEl.classList.add("hid");
	}

	// Convert elapsed time to HH:MM:SS
	let formattedTime = moment
		.utc()
		.startOf("day")
		.add(timer, "seconds")
		.format("HH:mm:ss");

	timerEl.innerHTML = formattedTime;
}

// Function to toggle clock-in state
function toggle() {
	isClockedIn = !isClockedIn;
	if (isClockedIn) {
		clockIn = Date.now();
		localStorage.setItem("clockIn", clockIn);
	} else {
		localStorage.removeItem("clockIn"); // Stop tracking
	}

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

// Start the timer loop
setInterval(updateTimer, 1000);
updateTimer();
