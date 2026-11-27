
document.addEventListener("DOMContentLoaded", function () {

    // HTML elementų pasirinkimas
    const form = document.getElementById("contact-form");

    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const clearBtn = document.getElementById("clear-btn");
    const result = document.getElementById("form-result");

    const name = form.elements["name"];
    const surname = form.elements["surname"];
    const email = form.elements["email"];
    const tel = form.elements["tel"];
    const address = form.elements["address"];

    const sliders = form.querySelectorAll(".slider");
    const fields = [name, surname, email, tel, address];

    // Slankiklių reikšmių atnaujinimas
    function updateSliders() {

        sliders.forEach(function (slider) {

            const span = slider.parentElement.querySelector("span");

            span.textContent = slider.value;

        });
    }

    // Telefono numerio formatavimas
    function formatPhone() {

        let digits = tel.value.replace(/\D/g, "");

        if (digits.startsWith("370")) {
            digits = digits.slice(3);
        } else if (digits.startsWith("0") ||
            digits.startsWith("8")) {
            digits = digits.slice(1);
        }

        digits = digits.slice(0, 8);

        if (digits.length === 0) {
            tel.value = "";
            return;
        }

        let formatted = "+370 " + digits.slice(0, 3);

        if (digits.length > 3) {
            formatted += " " + digits.slice(3);
        }

        tel.value = formatted;
    }

    // Klaidos pranešimo atvaizdavimas
    function showError(field, message) {

        let error = field.parentElement.querySelector(".field-error");

        if (!error) {

            error = document.createElement("small");
            error.className = "field-error";

            field.parentElement.appendChild(error);
        }

        error.textContent = message;

        field.classList.toggle("invalid-field", message !== "");
    }

    // Duomenų validacija
    function validateField(field) {

        const value = field.value.trim();

        if (value === "") {
            return "Šis laukas yra privalomas.";
        }

        if (field === name || field === surname) {

            if (!/^\p{L}+$/u.test(value)) {
                return "Galima įvesti tik raides.";
            }
        }

        if (field === email) {

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                return "Neteisingas el. pašto formatas.";
            }
        }

        if (field === tel) {

            if (!/^\+370 6\d{2} \d{5}$/.test(value)) {
                return "Formatas: +370 6xx xxxxx";
            }
        }

        return "";
    }

    // Visos formos tikrinimas
    function validateForm() {

        let valid = true;

        fields.forEach(function (field) {

            if (validateField(field) !== "") {
                valid = false;
            }

        });

        sliders.forEach(function (slider) {

            const value = Number(slider.value);

            const correct = Number.isInteger(value)
                && value >= 1 && value <= 10;

            showError(
                slider,
                correct ? "" : "Reikšmė turi būti nuo 1 iki 10."
            );

            if (!correct) {
                valid = false;
            }

        });

        submitBtn.disabled = !valid;

        return valid;
    }

    // Validacija realiu laiku
    fields.forEach(function (field) {

        field.addEventListener("input", function () {

            if (field === tel) {
                formatPhone();
            }

            showError(field, validateField(field));

            validateForm();

        });

        field.addEventListener("blur", function () {

            showError(field, validateField(field));

            validateForm();

        });

    });

    // Slankiklių įvykiai
    sliders.forEach(function (slider) {

        slider.addEventListener("input", function () {

            updateSliders();
            validateForm();

        });

    });

    // Formos duomenų apdorojimas
    form.addEventListener("submit", function (event) {

        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        // JavaScript objekto sukūrimas
        const data = {

            vardas: name.value.trim(),
            pavarde: surname.value.trim(),
            email: email.value.trim(),
            telefonas: tel.value,
            adresas: address.value.trim(),

            dizainas: Number(form.elements["design"].value),

            funkcionalumas: Number(
                form.elements["functionality"].value
            ),

            aiskumas: Number(form.elements["clarity"].value)

        };

        // Objekto išvedimas konsolėje
        console.log(data);

        // Vidurkio apskaičiavimas
        const average = (
            data.dizainas +
            data.funkcionalumas +
            data.aiskumas
        ) / 3;

        // Ankstesnių rezultatų išvalymas
        result.replaceChildren();

        // Duomenų atvaizdavimas svetainėje
        const rows = [
            ["Vardas", data.vardas],
            ["Pavardė", data.pavarde],
            ["El. paštas", data.email],
            ["Tel. numeris", data.telefonas],
            ["Adresas", data.adresas],
            ["Dizaino įvertinimas", data.dizainas],
            ["Funkcionalumo įvertinimas", data.funkcionalumas],
            ["Turinio aiškumas", data.aiskumas]
        ];

        rows.forEach(function (row) {

            const p = document.createElement("p");

            p.textContent = row[0] + ": " + row[1];

            result.appendChild(p);

        });

        // Vidurkio atvaizdavimas
        const averageText = document.createElement("b");

        averageText.textContent =
            data.vardas + " " +
            data.pavarde + ": " +
            average.toFixed(2);

        result.appendChild(averageText);

        result.classList.add("result-visible");

    });

    // Formos išvalymas
    clearBtn.addEventListener("click", function () {

        form.reset();

        result.replaceChildren();

        result.classList.remove("result-visible");

        form.querySelectorAll(".field-error").forEach(
            function (error) {
                error.remove();
            }
        );

        form.querySelectorAll(".invalid-field").forEach(
            function (field) {
                field.classList.remove("invalid-field");
            }
        );

        updateSliders();

        submitBtn.disabled = true;

    });

    // Pradinė formos būsena
    updateSliders();
    validateForm();

});
