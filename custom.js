document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.slidecontainer').forEach(container => {
        const slider = container.querySelector('.slider');
        const output = container.querySelector('.slider-value span');
        output.textContent = slider.value;
        slider.addEventListener('input', () => {
            output.textContent = slider.value;
        });
    });

    const form = document.querySelector('#contact-form');
    const result = document.querySelector('#form-result');

    const submitBtn = form.querySelector('button[type="submit"]');

    const clearBtn = document.querySelector('#clear-btn');

    clearBtn.addEventListener('click', () => {

        form.reset();

        result.innerHTML = '';

        form.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
        form.querySelectorAll('.field-error').forEach((box) => (box.textContent = ''));

        form.querySelectorAll('.slidecontainer').forEach((container) => {
            const slider = container.querySelector('.slider');
            container.querySelector('.slider-value span').textContent = slider.value;
        });

        form.querySelectorAll('input[name]').forEach((input) => validateField(input, false));
        updateButtonState();
    });

    form.noValidate = true;

    const rules = {
        name: (v) => {
            if (v.trim() === '') return 'Laukas privalomas';
            if (!/^\p{L}+$/u.test(v.trim())) return 'Vardą gali sudaryti tik raidės';
            return '';
        },
        surename: (v) => {
            if (v.trim() === '') return 'Laukas privalomas';
            if (!/^\p{L}+$/u.test(v.trim())) return 'Pavardę gali sudaryti tik raidės';
            return '';
        },
        email: (v) => {
            if (v.trim() === '') return 'Laukas privalomas';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'Neteisingas el. pašto formatas';
            return '';
        },
        address: (v) => {
            if (v.trim() === '') return 'Laukas privalomas';
            return '';
        },

        tel: (v) => {
            if (v.trim() === '') return 'Laukas privalomas';
            if (!/^\+370 6\d{2} \d{5}$/.test(v)) return 'Numeris turi atitikti formatą +370 6xx xxxxx';
            return '';
        },

        design: validateRating,
        functionality: validateRating,
        clarity: validateRating
    };

    function validateRating(v) {
        const n = Number(v);
        if (v === '' || !Number.isInteger(n) || n < 1 || n > 10) {
            return 'Vertė turi būti nuo 1 iki 10';
        }
        return '';
    }

    function getErrorBox(input) {
        const parent = input.closest('.slidecontainer') || input.parentElement;
        let box = parent.querySelector('.field-error');
        if (!box) {
            box = document.createElement('div');
            box.className = 'field-error';
            parent.appendChild(box);
        }
        return box;
    }

    function validateField(input, showError) {
        const rule = rules[input.name];
        if (!rule) return true;

        const message = rule(input.value);
        input.setCustomValidity(message);

        if (showError) {
            input.classList.toggle('is-invalid', message !== '');
            getErrorBox(input).textContent = message;
        }
        return message === '';
    }

    function updateButtonState() {
        submitBtn.disabled = !form.checkValidity();
    }

    function formatPhone(raw) {
        const digits = raw.replace(/\D/g, '').slice(0, 11);   // только цифры, максимум 11

        if (digits === '') return '';

        let result = '+' + digits.slice(0, 3);                // +370
        if (digits.length > 3) result += ' ' + digits.slice(3, 6);    // 6xx
        if (digits.length > 6) result += ' ' + digits.slice(6);       // xxxxx
        return result;
    }

    form.addEventListener('input', (event) => {
        if (event.target.name === 'tel') {
            event.target.value = formatPhone(event.target.value);
        }
        validateField(event.target, true);
        updateButtonState();
    });

    form.addEventListener('focusout', (event) => {
        validateField(event.target, true);
        updateButtonState();
    });

    form.addEventListener('input', (event) => {
        validateField(event.target, true);
        updateButtonState();
    });

    form.addEventListener('focusout', (event) => {
        validateField(event.target, true);
        updateButtonState();
    });

    form.querySelectorAll('input[name]').forEach((input) => validateField(input, false));
    updateButtonState();

    const labels = {
        name: 'Vardas',
        surename: 'Pavardė',
        email: 'El. paštas',
        tel: 'Tel. numeris',
        address: 'Adresas',
        design: 'Dizaino įvertinimas',
        functionality: 'Funkcionalumo įvertinimas',
        clarity: 'Turinio aiškumas'
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        console.log(data);

        result.innerHTML = '';
        for (const [key, value] of Object.entries(data)) {
            const p = document.createElement('p');
            p.textContent = `${labels[key]}: ${value}`;
            result.appendChild(p);
        }

        const average = (
            Number(data.design) +
            Number(data.functionality) +
            Number(data.clarity)
        ) / 3;

        const avgP = document.createElement('p');
        avgP.textContent = `${data.name} ${data.surename}: ${average.toFixed(1)}`;
        avgP.style.fontWeight = 'bold';
        result.appendChild(avgP);
    });
});