// Utilidades de tempo e formatação
function parseTimeText(input) {
	if (!input) return null;
	const parts = input.trim().split(':');
	if (parts.length < 2 || parts.length > 3) return null;
	const nums = parts.map(p => Number(p));
	if (nums.some(isNaN)) return null;
	let h = 0, m = 0, s = 0;
	if (parts.length === 2) {
		[m, s] = nums;
	} else {
		[h, m, s] = nums;
	}
	if (m > 59 || s > 59 || h < 0 || m < 0 || s < 0) return null;
	return h * 3600 + m * 60 + s;
}

function pad2(n) { return n < 10 ? '0' + n : '' + n; }
function formatPace(secondsPerKm) {
	if (!isFinite(secondsPerKm) || secondsPerKm <= 0) return '–:––';
	const total = Math.round(secondsPerKm);
	const m = Math.floor(total / 60);
	const s = total % 60;
	return `${m}:${pad2(s)}`;
}

function formatDuration(totalSeconds) {
	const h = Math.floor(totalSeconds / 3600);
	const rem = totalSeconds % 3600;
	const m = Math.floor(rem / 60);
	const s = rem % 60;
	if (h > 0) return `${h}:${pad2(m)}:${pad2(s)}`;
	return `${m}:${pad2(s)}`;
}

// Cálculo principal de pace
function calcPace(distanceKm, totalSeconds) {
	const secondsPerKm = totalSeconds / distanceKm;
	const paceStr = formatPace(secondsPerKm);
	const speed = 3600 / secondsPerKm; // km/h
	return { secondsPerKm, paceStr, speed };
}

function kmFromDistance(value, unit) {
	if (unit === 'km') return value;
	if (unit === 'm') return value / 1000;
	if (unit === 'mi') return value * 1.609344;
	return value;
}

function updateRacePredict(paceSecondsPerKm) {
	const races = [
		{ id: 'stat5k', km: 5 },
		{ id: 'stat10k', km: 10 },
		{ id: 'stat21k', km: 21.0975 },
		{ id: 'stat42k', km: 42.195 }
	];
	races.forEach(r => {
		const el = document.getElementById(r.id);
		if (!el) return;
		if (!isFinite(paceSecondsPerKm) || paceSecondsPerKm <= 0) {
			el.textContent = '–:––';
		} else {
			const total = Math.round(paceSecondsPerKm * r.km);
			el.textContent = formatDuration(total);
		}
	});
}

function handlePaceForm() {
	const form = document.getElementById('paceForm');
	if (!form) return;
	const distanceInput = document.getElementById('distance');
	const distanceUnit = document.getElementById('distanceUnit');
	const hours = document.getElementById('hours');
	const minutes = document.getElementById('minutes');
	const seconds = document.getElementById('seconds');
	const orTimeText = document.getElementById('orTimeText');
	const results = document.getElementById('paceResults');

	form.addEventListener('submit', e => {
		e.preventDefault();
		results.classList.remove('error');
		const distVal = Number(distanceInput.value);
		if (!distVal || distVal <= 0) {
			showError(results, 'Informe uma distância válida.');
			return;
		}
		let totalSeconds = null;
		if (orTimeText.value.trim()) {
			totalSeconds = parseTimeText(orTimeText.value.trim());
			if (totalSeconds === null) {
				showError(results, 'Tempo em texto inválido. Use mm:ss ou hh:mm:ss');
				return;
			}
		} else {
			const h = Number(hours.value) || 0;
			const m = Number(minutes.value) || 0;
			const s = Number(seconds.value) || 0;
			if ((m > 0 || s > 0 || h > 0) === false) {
				showError(results, 'Informe o tempo.');
				return;
			}
			if (m > 59 || s > 59) {
				showError(results, 'Minutos e segundos devem ser ≤ 59.');
				return;
			}
			totalSeconds = h * 3600 + m * 60 + s;
		}
		const km = kmFromDistance(distVal, distanceUnit.value);
		if (km <= 0) {
			showError(results, 'Distância inválida.');
			return;
		}
		const { paceStr, speed, secondsPerKm } = calcPace(km, totalSeconds);
		updateRacePredict(secondsPerKm);
		results.innerHTML = `
			<h4>Resultado</h4>
			<p><strong>Pace médio:</strong> ${paceStr} min/km</p>
			<p><strong>Velocidade média:</strong> ${speed.toFixed(2)} km/h</p>
			<p><strong>Tempo total:</strong> ${formatDuration(totalSeconds)} (${(totalSeconds/60).toFixed(2)} min)</p>
		`;
		results.classList.remove('hidden');
	});
}

function showError(container, msg) {
	container.innerHTML = `<p>${msg}</p>`;
	container.classList.remove('hidden');
	container.classList.add('error');
}

function handleConverter() {
	const paceText = document.getElementById('paceText');
	const paceType = document.getElementById('paceType');
	const speedInput = document.getElementById('speed');
	const btnPaceToSpeed = document.getElementById('btnPaceToSpeed');
	const btnSpeedToPace = document.getElementById('btnSpeedToPace');
	const results = document.getElementById('convertResults');

	btnPaceToSpeed.addEventListener('click', () => {
		results.classList.remove('error');
		const secs = parseTimeText(paceText.value.trim());
		if (secs === null) {
			showError(results, 'Informe um pace válido (mm:ss ou hh:mm:ss).');
			return;
		}
		const perKm = paceType.value === 'per_km' ? secs : secs / 1.609344; // se for por milha, converte para km
		const speed = 3600 / perKm;
		results.innerHTML = `<h4>Resultado</h4><p><strong>Velocidade:</strong> ${speed.toFixed(2)} km/h</p>`;
		results.classList.remove('hidden');
	});

	btnSpeedToPace.addEventListener('click', () => {
		results.classList.remove('error');
		const speed = Number(speedInput.value);
		if (!speed || speed <= 0) {
			showError(results, 'Informe uma velocidade válida.');
			return;
		}
		const perKm = 3600 / speed; // segundos por km
		const displaySecs = paceType.value === 'per_km' ? perKm : perKm * 1.609344; // se quer pace por milha
		results.innerHTML = `<h4>Resultado</h4><p><strong>Pace:</strong> ${formatPace(displaySecs)} ${paceType.value === 'per_km' ? 'min/km' : 'min/milha'}</p>`;
		results.classList.remove('hidden');
	});
}

function init() {
	handlePaceForm();
	handleConverter();
}

document.addEventListener('DOMContentLoaded', init);
