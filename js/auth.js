// js/auth.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Elementos del DOM ---
    const modal = document.getElementById('authModal');
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const closeModalBtn = document.querySelector('.close-modal');
    const userHeaderInfo = document.getElementById('user-header-info');

    // --- Funciones de la UI ---
    function showModal() {
        modal.style.display = 'flex';
    }

    function hideModal() {
        modal.style.display = 'none';
        clearForms();
    }

    function showTab(tabName) {
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
        
        if (tabName === 'login') {
            document.getElementById('login-content').classList.add('active');
            loginTab.classList.add('active');
        } else {
            document.getElementById('signup-content').classList.add('active');
            signupTab.classList.add('active');
        }
    }

    function clearForms() {
        loginForm.reset();
        signupForm.reset();
        document.querySelectorAll('.error-message').forEach(msg => msg.textContent = '');
    }

    // --- Lógica de Autenticación ---
    async function handleLogin(e) {
        e.preventDefault();
        const email = loginForm.email.value;
        const password = loginForm.password.value;
        const { error } = await window.supabase.auth.signInWithPassword({ email, password });
        if (error) {
            document.getElementById('login-error').textContent = error.message;
        } else {
            hideModal();
        }
    }

    async function handleSignup(e) {
        e.preventDefault();
        const email = signupForm.email.value;
        const password = signupForm.password.value;
        const { error } = await window.supabase.auth.signUp({ email, password });
        if (error) {
            document.getElementById('signup-error').textContent = error.message;
        } else {
            document.getElementById('signup-error').textContent = '¡Registro exitoso! Por favor, revisa tu email para confirmar.';
            setTimeout(hideModal, 3000);
        }
    }

    async function handleLogout() {
        await window.supabase.auth.signOut();
    }

    // --- Listener Principal de Estado de Autenticación ---
    // Este es el corazón de la UI. Se ejecuta cada vez que el estado de la sesión cambia.
    window.supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
            // Usuario logueado
            userHeaderInfo.innerHTML = `
                <span>Bienvenido, ${session.user.email}</span>
                <button id="logout-btn">Cerrar Sesión</button>
            `;
            document.getElementById('logout-btn').addEventListener('click', handleLogout);
        } else {
            // Usuario no logueado
            userHeaderInfo.innerHTML = `
                <button id="login-btn">Iniciar Sesión</button>
            `;
            document.getElementById('login-btn').addEventListener('click', showModal);
        }
    });

    // --- Event Listeners ---
    closeModalBtn.addEventListener('click', hideModal);
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            hideModal();
        }
    });
    loginTab.addEventListener('click', () => showTab('login'));
    signupTab.addEventListener('click', () => showTab('signup'));
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);
});
