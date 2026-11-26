const skills = [
    {
        name: "Daugiasluoksnių PCB projektavimas",
        status: "Planuojama",
        xp: 50
    },
    {
        name: "Elektroninių grandinių modeliavimas",
        status: "Planuojama",
        xp: 40
    },
    {
        name: "Mikrokontrolerių programavimas",
        status: "Mokomasi",
        xp: 50
    },
    {
        name: "Skaitmeninis signalų apdorojimas",
        status: "Mokomasi",
        xp: 40
    },
    {
        name: "SMD ir THT komponentų litavimas",
        status: "Atlikta",
        xp: 30
    },
    {
        name: "Automatizuotas plokščių testavimas",
        status: "Atlikta",
        xp: 30
    },
    {
        name: "Matavimų ir signalų analizė",
        status: "Atlikta",
        xp: 30
    },
    {
        name: "Elektrinių schemų braižymas ir dokumentacija",
        status: "Atlikta",
        xp: 30
    }
];


// Įgūdžių kortelių atvaizdavimas
function renderSkills() {

    document.getElementById("plan-list").innerHTML = "";
    document.getElementById("studying-list").innerHTML = "";
    document.getElementById("done-list").innerHTML = "";

    skills.forEach(function (skill, index) {

        let containerId;
        let statusClass;

        if (skill.status === "Planuojama") {
            containerId = "plan-list";
            statusClass = "status-plan";
        } else if (skill.status === "Mokomasi") {
            containerId = "studying-list";
            statusClass = "status-studying";
        } else {
            containerId = "done-list";
            statusClass = "status-done";
        }

        const card = document.createElement("div");
        card.className = "skill-item";

        card.innerHTML = `
      <div class="item-name">
        <p>${skill.name}</p>
      </div>

      <div class="status-xp">
        <div class="status ${statusClass}">
          <p>Būsena: ${skill.status}</p>
        </div>
        <div class="xp">
          <p>XP: ${skill.xp}</p>
        </div>
      </div>

      <select class="skill-select">
        <option value="Planuojama">Planuojama</option>
        <option value="Mokomasi">Mokomasi</option>
        <option value="Atlikta">Atlikta</option>
      </select>
    `;

        const select = card.querySelector("select");
        select.value = skill.status;

        select.addEventListener("change", function () {
            changeStatus(index, select.value);
        });

        document.getElementById(containerId).appendChild(card);

    });
}

// Įgūdžio būsenos keitimas
function changeStatus(index, newStatus) {

    skills[index].status = newStatus;

    saveSkills();

    renderSkills();
    updateProgress();
    updateStatistics();
}

// XP, lygio, rango ir progreso atnaujinimas
function updateProgress() {

    let totalXP = 0;

    skills.forEach(function (skill) {
        if (skill.status === "Atlikta") {
            totalXP += skill.xp;
        }
    });

    let level;
    let rank;
    let progress;

    if (totalXP < 50) {

        level = 1;
        rank = "Pradedantysis";
        progress = totalXP / 50 * 100;

    } else if (totalXP < 150) {

        level = 2;
        rank = "Praktikantas";
        progress = (totalXP - 50) / 100 * 100;

    } else if (totalXP < 300) {

        level = 3;
        rank = "Specialistas";
        progress = (totalXP - 150) / 150 * 100;

    } else {

        level = 4;
        rank = "Profesionalas";
        progress = 100;

    }

    progress = Math.round(progress);

    document.getElementById("total-xp").textContent = totalXP;

    document.getElementById("current-level").textContent = level;

    document.getElementById("current-rank").textContent = rank;

    const progressBar = document.getElementById("xp-progress");

    progressBar.style.width = progress + "%";
    progressBar.textContent = progress + "%";
}

// Įgūdžių statistikos atnaujinimas
function updateStatistics() {

    const total = skills.length;

    let done = 0;

    skills.forEach(function (skill) {
        if (skill.status === "Atlikta") {
            done++;
        }
    });

    const percent = Math.round(done / total * 100);

    document.getElementById("total-skills").textContent = total;

    document.getElementById("done-skills").textContent = done;

    document.getElementById("done-percent").textContent = percent + "%";
}

// Duomenų išsaugojimas
function saveSkills() {

    localStorage.setItem(
        "cvSkills",
        JSON.stringify(skills)
    );

}

// Išsaugotų duomenų atkūrimas
function loadSkills() {

    const saved = localStorage.getItem("cvSkills");

    if (saved !== null) {

        const savedSkills = JSON.parse(saved);

        skills.forEach(function (skill) {

            const savedSkill = savedSkills.find(function (item) {
                return item.name === skill.name;
            });

            if (savedSkill) {
                skill.status = savedSkill.status;
            }

        });

    }
}

// Modulio paleidimas
document.addEventListener("DOMContentLoaded", function () {

    loadSkills();
    renderSkills();
    updateProgress();
    updateStatistics();

});
