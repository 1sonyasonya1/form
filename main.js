const form = document.querySelector('#form')
const allFields = document.querySelectorAll('#form input, #form textarea, #form select');

let obj = {};
let errors = {};

allFields.forEach((field) => {
    field.addEventListener('change', (event) => {
        const target = event.target;
        if (!target.name) return
        if (target.type === 'checkbox') {
            obj[target.name] = target.checked;
            return
        };
        if (target.type === 'radio') {
            if (!target.checked) return;
            obj[target.name] = target.value;
            return
        };
        const message = validateField(target.name, target.value);
        updateFieldError(target.name, message)
        obj[target.name] = target.value;
    })
})

form.addEventListener('submit', (event) => {
    errors = {};
    allFields.forEach((field) => {
        if (!field.name) return;
        if (field.type === 'checkbox' || field.type === 'radio') return;
        const message = validateField(field.name, field.value);
        updateFieldError(field.name, message);
    });

    if (Object.keys(errors).length > 0) {
        event.preventDefault();
        return;
    }

    event.preventDefault();
    console.log(obj);
    form.reset();
    obj = {};
    errors = {};
});

function validateField(nameField, userValue) {
    const value = userValue.trim();
    if (!value) return 'пустое поле';
    if (value.length < 5 || value.length > 30) {
        return 'длина строки должна быть от 5 до 30 символов'
    }
    if (nameField !== 'email' && /[@#$%&*()_+=]/.test(value)) {
        return 'запрещенные спецсимволы'
    }
    return '';
}

function updateFieldError(field, message) {
    const elems = form.querySelectorAll(`[name="${field}"]`)
    if (message) {
        errors[field] = message;
        elems.forEach((e) => {
            e.classList.add('error')
            const nextEl = e.nextElementSibling;
            if (nextEl && nextEl.classList.contains('error-message')) {
                nextEl.textContent = message;
            } else {
                const span = document.createElement('span');
                span.classList.add('error-message');
                e.after(span);
                span.textContent = message;
            }
        });

    } else {
        delete errors[field];
        elems.forEach((e) => {
            e.classList.remove('error');
            const nextEl = e.nextElementSibling;
            if (nextEl && nextEl.classList.contains('error-message')) {
                nextEl.textContent = '';
            }
        });
    }
}