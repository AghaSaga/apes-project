const progress = document.getElementById("pageProgress");

function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  progress.style.width = pct + "%";
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

let checkpointScore = 0;
let checkpointAnswered = 0;
const scoreEl = document.getElementById("score");

function feedbackText(isCorrect) {
  return isCorrect
    ? "Correct. Nice choice."
    : "Not quite. The correct answer is highlighted.";
}

document.querySelectorAll(".quiz-card").forEach(card => {
  const correct = Number(card.dataset.correct);
  const buttons = [...card.querySelectorAll(".answers button")];
  const feedback = card.querySelector(".feedback");
  let answered = false;

  buttons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      if (answered) return;
      answered = true;
      checkpointAnswered += 1;

      buttons.forEach((b, i) => {
        b.disabled = true;
        if (i === correct) b.classList.add("correct");
        else if (i === index) b.classList.add("wrong");
        else b.classList.add("dimmed");
      });

      const isCorrect = index === correct;
      if (isCorrect) {
        checkpointScore += 1;
        scoreEl.textContent = checkpointScore;
      }

      feedback.textContent = feedbackText(isCorrect);
      tryShowResult();
    });
  });
});

let finalScore = 0;
let finalAnswered = 0;

document.querySelectorAll(".final-question").forEach(card => {
  const correct = Number(card.dataset.correct);
  const buttons = [...card.querySelectorAll(".answers button")];
  const feedback = card.querySelector(".feedback");
  let answered = false;

  buttons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      if (answered) return;
      answered = true;
      finalAnswered += 1;

      buttons.forEach((b, i) => {
        b.disabled = true;
        if (i === correct) b.classList.add("correct");
        else if (i === index) b.classList.add("wrong");
        else b.classList.add("dimmed");
      });

      const isCorrect = index === correct;
      if (isCorrect) finalScore += 1;

      feedback.textContent = feedbackText(isCorrect);
      tryShowResult();
    });
  });
});

function tryShowResult() {
  if (finalAnswered !== 5) return;

  const total = checkpointScore + finalScore;
  const card = document.getElementById("resultCard");
  const score = document.getElementById("totalScore");
  const title = document.getElementById("resultTitle");
  const text = document.getElementById("resultText");

  score.textContent = total;

  if (total >= 9) {
    title.textContent = "PACK GUARDIAN";
    text.textContent = "You understood the red wolf, the threats it faces, and the choices that can help protect it.";
  } else if (total >= 7) {
    title.textContent = "FIELD BIOLOGIST";
    text.textContent = "Strong work. You have a solid understanding of the species and its recovery.";
  } else if (total >= 5) {
    title.textContent = "TRACKER";
    text.textContent = "You have the basics. Review the stations you missed and try again.";
  } else {
    title.textContent = "RESTART THE MISSION";
    text.textContent = "Go back through the stations, look at the feedback, and take another shot.";
  }

  card.hidden = false;
  card.scrollIntoView({ behavior: "smooth", block: "center" });
}

document.getElementById("restartButton").addEventListener("click", () => {
  window.location.reload();
});