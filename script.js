document.addEventListener("DOMContentLoaded", function () {
  const startDate = new Date(2025, 6, 21, 0, 0, 0, 0);
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  const timeDiff = today.getTime() - startDate.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;

  let r = Math.abs((day * 179 * month) % 256);
  let g = Math.abs((month * 251 * year) % 256);
  let b = Math.abs((year * 373 * day) % 256);

  let components = [r, g, b].sort((a, b) => a - b);
  const diffThreshold = 64;

  if (components[1] - components[0] < diffThreshold) {
    components[1] = (components[0] + diffThreshold) % 256;
  }
  if (components[2] - components[1] < diffThreshold) {
    components[2] = (components[1] + diffThreshold) % 256;
  }

  r = components[day % 3];
  g = components[(day + 1) % 3];
  b = components[(day + 2) % 3];

  const colorDisplay = document.getElementById("colorBox");
  colorDisplay.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

  const inputBoxes = document.querySelectorAll(".input-box");
  const submitButton = document.querySelector(".submit-button");
  const submissionHistory = document.getElementById("submissionHistory");

  let isSubmitting = false;
  let guessCount = 0;

  inputBoxes.forEach((box, index) => {
    box.addEventListener("input", (e) => {
      if (e.target.value) {
        if (index < inputBoxes.length - 1) {
          inputBoxes[index + 1].focus();
        }
      }

      updateSubmitButtonState();
    });

    box.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !e.target.value && index > 0) {
        inputBoxes[index - 1].focus();
      }
    });
  });

  function updateSubmitButtonState() {
    const allFilled = Array.from(inputBoxes).every((box) => box.value);
    submitButton.disabled = !allFilled || isSubmitting;
  }

  submitButton.addEventListener("click", handleSubmit, { once: true });

  function handleSubmit(event) {
    if (event) event.preventDefault();
    if (isSubmitting) {
      return;
    }
    isSubmitting = true;

    submitButton.disabled = true;
    setTimeout(() => {
      const allVal = Array.from(inputBoxes).map((box) =>
        box.value.toLowerCase()
      );
      if (allVal.every((val) => !val)) {
        isSubmitting = false;
        updateSubmitButtonState();
        return;
      }

      guessCount++;
      const submissionItem = createSubmissionItem(allVal);

      if (submissionHistory.firstChild.className === "empty") {
        submissionHistory.removeChild(submissionHistory.firstChild);
      }

      submissionHistory.insertBefore(
        submissionItem,
        submissionHistory.firstChild
      );

      inputBoxes.forEach((box) => (box.value = ""));
      inputBoxes[0].focus();

      isSubmitting = false;
      updateSubmitButtonState();

      submitButton.addEventListener("click", handleSubmit, { once: true });

      if (isCorrectGuess(allVal)) {
        showWinModal(guessCount);
      }
    }, 100);
  }

  function isCorrectGuess(values) {
    const guessedR = values[0] * 16 + values[1];
    const guessedG = values[2] * 16 + values[3];
    const guessedB = values[4] * 16 + values[5];
    return (
      r - 1 <= guessedR &&
      guessedR <= r + 1 &&
      g - 1 <= guessedG &&
      guessedG <= g + 1 &&
      b - 1 <= guessedB &&
      guessedB <= b + 1
    );
  }

  function createSubmissionItem(values) {
    const item = document.createElement("div");
    item.className = "submission-item";

    const valuesContainer = document.createElement("div");
    valuesContainer.className = "submission-values";

    values.forEach((value) => {
      const valueBox = document.createElement("div");
      valueBox.className = "submission-value";
      valueBox.textContent = value;
      valuesContainer.appendChild(valueBox);
    });
    for (let i = 0; i < 6; i++) {
      if (values[i] === "1") {
        values[i] = 1;
      } else if (values[i] === "2") {
        values[i] = 2;
      } else if (values[i] === "3") {
        values[i] = 3;
      } else if (values[i] === "4") {
        values[i] = 4;
      } else if (values[i] === "5") {
        values[i] = 5;
      } else if (values[i] === "6") {
        values[i] = 6;
      } else if (values[i] === "7") {
        values[i] = 7;
      } else if (values[i] === "8") {
        values[i] = 8;
      } else if (values[i] === "9") {
        values[i] = 9;
      } else if (values[i] === "0") {
        values[i] = 0;
      } else if (values[i] === "a") {
        values[i] = 10;
      } else if (values[i] === "b") {
        values[i] = 11;
      } else if (values[i] === "c") {
        values[i] = 12;
      } else if (values[i] === "d") {
        values[i] = 13;
      } else if (values[i] === "e") {
        values[i] = 14;
      } else if (values[i] === "f") {
        values[i] = 15;
      }
    }

    const timestamp = document.createElement("span");
    timestamp.textContent = "";
    timestamp.textContent += "🔴";
    if (
      r - 1 <= values[0] * 16 + values[1] &&
      values[0] * 16 + values[1] <= r + 1
    ) {
      //timestamp.textContent += values[0] + "" + values[1];
      timestamp.textContent += "✅";
    } else if (values[0] * 16 + values[1] < r) {
      timestamp.textContent += "⬆️";
    } else if (values[0] * 16 + values[1] > r) {
      timestamp.textContent += "⬇️";
    } else {
      timestamp.textContent += "🚫";
    }

    timestamp.textContent += "🟢";
    if (
      g - 1 <= values[2] * 16 + values[3] &&
      values[2] * 16 + values[3] <= g + 1
    ) {
      //timestamp.textContent += values[2] + "" + values[3];
      timestamp.textContent += "✅";
    } else if (values[2] * 16 + values[3] < g) {
      timestamp.textContent += "⬆️";
    } else if (values[2] * 16 + values[3] > g) {
      timestamp.textContent += "⬇️";
    } else {
      timestamp.textContent += "🚫";
    }

    timestamp.textContent += "🔵";
    if (
      b - 1 <= values[4] * 16 + values[5] &&
      values[4] * 16 + values[5] <= b + 1
    ) {
      //timestamp.textContent += values[4] + "" + values[5];
      timestamp.textContent += "✅";
    } else if (values[4] * 16 + values[5] < b) {
      timestamp.textContent += "⬆️";
    } else if (values[4] * 16 + values[5] > b) {
      timestamp.textContent += "⬇️";
    } else {
      timestamp.textContent += "🚫";
    }

    //timestamp.textContent += r + "" + g + "" + b;

    item.appendChild(valuesContainer);
    item.appendChild(timestamp);
    return item;
  }

  function showWinModal(guessCount) {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
    <div class="modal">
        <h2>Congrats!</h2>
        <p>You guessed the correct-ish color!</p>
        <p>It took you <span id="guessCountDisplay">${guessCount}</span> guesses.</p>
        <button id="copyScoreButton">Copy Score</button>
        <button id="closeModalButton">Close</button>
    </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("copyScoreButton").addEventListener("click", () => {
      navigator.clipboard
        .writeText(
          `🎨 Hue Are You #${daysDiff.toString().padStart(2, "0")}
${month.toString().padStart(2, "0")}.${day.toString().padStart(2, "0")}.${year}
Attempts: ${guessCount}
https://cinpear.github.io/hueareyou/`
        )
        .then(() => alert("Score copied to clipboard!"))
        .catch((err) => console.error("Failed to copy: ", err));
    });

    document
      .getElementById("closeModalButton")
      .addEventListener("click", () => {
        document.body.removeChild(modal);
      });
  }

  updateSubmitButtonState();
});
