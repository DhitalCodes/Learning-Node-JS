document.addEventListener('DOMContentLoaded', function() {
    // ----- Signup validation -----
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        const username = document.getElementById('username');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        const errorDiv = document.getElementById('errorMessage'); // optional, we already have messageContainer
        const signupBtn = document.getElementById('signupBtn');

        // Helper to set input validation state
        function setValidationState(input, isValid) {
            input.classList.remove('is-valid', 'is-invalid');
            if (isValid === true) input.classList.add('is-valid');
            else if (isValid === false) input.classList.add('is-invalid');
        }

        // Username
        username.addEventListener('input', function() {
            const val = this.value.trim();
            const help = document.getElementById('userHelp');
            const isValid = /^[a-zA-Z0-9]{3,20}$/.test(val);
            if (val.length === 0) {
                help.textContent = '3-20 characters (letters & numbers only)';
                help.style.color = 'rgba(255,255,255,0.7)';
                setValidationState(this, null);
                return;
            }
            if (isValid) {
                help.textContent = '✅ Valid username';
                help.style.color = '#51cf66';
                setValidationState(this, true);
            } else {
                help.textContent = '❌ Invalid! Use 3-20 letters & numbers only';
                help.style.color = '#ff6b6b';
                setValidationState(this, false);
            }
        });

        // Password
        password.addEventListener('input', function() {
            const val = this.value;
            const help = document.getElementById('passHelp');
            const hasLetter = /[a-zA-Z]/.test(val);
            const hasNumber = /[0-9]/.test(val);
            const isLong = val.length >= 4;
            const isValid = isLong && hasLetter && hasNumber;

            if (val.length === 0) {
                help.textContent = 'Min 4 chars with letter and number';
                help.style.color = 'rgba(255,255,255,0.7)';
                setValidationState(this, null);
                return;
            }
            if (isValid) {
                help.textContent = '✅ Strong password';
                help.style.color = '#51cf66';
                setValidationState(this, true);
            } else {
                let errors = [];
                if (!isLong) errors.push('min 4 chars');
                if (!hasLetter) errors.push('letter');
                if (!hasNumber) errors.push('number');
                help.textContent = '❌ Needs: ' + errors.join(', ');
                help.style.color = '#ff6b6b';
                setValidationState(this, false);
            }
            // Re‑check confirm password if it has content
            if (confirmPassword.value.length > 0) checkPasswordsMatch();
        });

        // Confirm Password
        confirmPassword.addEventListener('input', function() {
            checkPasswordsMatch();
        });

        function checkPasswordsMatch() {
            const help = document.getElementById('confirmHelp');
            const pass = password.value;
            const confirm = confirmPassword.value;
            const match = pass === confirm && confirm.length > 0;

            if (confirm.length === 0) {
                help.textContent = 'Passwords must match';
                help.style.color = 'rgba(255,255,255,0.7)';
                setValidationState(confirmPassword, null);
                return;
            }
            if (match) {
                help.textContent = '✅ Passwords match';
                help.style.color = '#51cf66';
                setValidationState(confirmPassword, true);
            } else {
                help.textContent = '❌ Passwords do not match';
                help.style.color = '#ff6b6b';
                setValidationState(confirmPassword, false);
            }
        }

        // Form submit – final check
        signupForm.addEventListener('submit', function(e) {
            const uname = username.value.trim();
            const pass = password.value;
            const confirm = confirmPassword.value;

            let errorMsg = '';
            if (!/^[a-zA-Z0-9]{3,20}$/.test(uname)) {
                errorMsg = '❌ Username must be 3-20 characters (letters & numbers only)';
            } else if (pass.length < 4 || !/[a-zA-Z]/.test(pass) || !/[0-9]/.test(pass)) {
                errorMsg = '❌ Password must be min 4 chars with letter and number';
            } else if (pass !== confirm) {
                errorMsg = '❌ Passwords do not match';
            }

            if (errorMsg) {
                e.preventDefault();
                // Use the message container at top of form
                const container = document.getElementById('messageContainer');
                container.innerHTML = `<div class="message error">${errorMsg}</div>`;
                return;
            }

            // All good
            const container = document.getElementById('messageContainer');
            container.innerHTML = ''; // clear previous
            signupBtn.textContent = 'Creating...';
            signupBtn.disabled = true;
        });
    }

    // ----- Login validation -----
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            const username = document.querySelector('input[name="username"]').value.trim();
            const password = document.querySelector('input[name="password"]').value.trim();
            if (!username || !password) {
                e.preventDefault();
                const container = document.getElementById('messageContainer');
                container.innerHTML = `<div class="message error">Please fill in all fields!</div>`;
            }
        });
    }
});