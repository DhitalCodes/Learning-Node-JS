document.addEventListener('DOMContentLoaded', function() {

    // sign up validation
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) {
        const username = document.getElementById('username');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        const errorDiv = document.getElementById('errorMessage');
        const signupBtn = document.getElementById('signupBtn');

        // Real-time validation for username
        username.addEventListener('input', function() {
            const val = this.value.trim();
            const help = document.getElementById('userHelp');
            
            if (val.length === 0) {
                help.textContent = '3-20 characters (letters & numbers only)';
                help.style.color = '#888';
                return;
            }

            if (!/^[a-zA-Z0-9]{3,20}$/.test(val)) {
                help.textContent = '❌ Invalid! Use 3-20 letters & numbers only';
                help.style.color = 'red';
            } else {
                help.textContent = '✅ Valid username';
                help.style.color = 'green';
            }
        });

        // Real-time validation for password
        password.addEventListener('input', function() {
            const val = this.value;
            const help = document.getElementById('passHelp');
            
            if (val.length === 0) {
                help.textContent = 'Min 4 chars with letter and number';
                help.style.color = '#888';
                return;
            }

            const hasLetter = /[a-zA-Z]/.test(val);
            const hasNumber = /[0-9]/.test(val);
            const isLong = val.length >= 4;

            if (isLong && hasLetter && hasNumber) {
                help.textContent = '✅ Strong password';
                help.style.color = 'green';
            } else {
                let errors = [];
                if (!isLong) errors.push('min 4 chars');
                if (!hasLetter) errors.push('letter');
                if (!hasNumber) errors.push('number');
                help.textContent = '❌ Needs: ' + errors.join(', ');
                help.style.color = 'red';
            }

            // Also check confirm password
            if (confirmPassword.value.length > 0) {
                checkPasswordsMatch();
            }
        });

        // Real-time validation for confirm password
        confirmPassword.addEventListener('input', function() {
            checkPasswordsMatch();
        });

        function checkPasswordsMatch() {
            const help = document.getElementById('confirmHelp');
            
            if (confirmPassword.value.length === 0) {
                help.textContent = 'Passwords must match';
                help.style.color = '#888';
                return;
            }

            if (password.value === confirmPassword.value) {
                help.textContent = '✅ Passwords match';
                help.style.color = 'green';
            } else {
                help.textContent = '❌ Passwords do not match';
                help.style.color = 'red';
            }
        }

        // Before submitting - final validation
        signupForm.addEventListener('submit', function(e) {
            const uname = username.value.trim();
            const pass = password.value;
            const confirm = confirmPassword.value;

            // Check username
            if (!/^[a-zA-Z0-9]{3,20}$/.test(uname)) {
                e.preventDefault();
                errorDiv.style.display = 'block';
                errorDiv.textContent = '❌ Username must be 3-20 characters (letters & numbers only)';
                return;
            }

            // Check password strength
            const hasLetter = /[a-zA-Z]/.test(pass);
            const hasNumber = /[0-9]/.test(pass);
            if (pass.length < 4 || !hasLetter || !hasNumber) {
                e.preventDefault();
                errorDiv.style.display = 'block';
                errorDiv.textContent = '❌ Password must be min 4 chars with letter and number';
                return;
            }

            // Check password match
            if (pass !== confirm) {
                e.preventDefault();
                errorDiv.style.display = 'block';
                errorDiv.textContent = '❌ Passwords do not match';
                return;
            }

            // All good - let form submit
            errorDiv.style.display = 'none';
            signupBtn.textContent = 'Creating...';
            signupBtn.disabled = true;
        });
    }

//login validation
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            const username = document.querySelector('input[name="username"]').value.trim();
            const password = document.querySelector('input[name="password"]').value.trim();

            if (!username || !password) {
                e.preventDefault();
                alert('Please fill in all fields!');
            }
        });
    }
});