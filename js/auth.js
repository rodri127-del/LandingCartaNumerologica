// js/auth.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Elementos del DOM ---
    const modal = document.getElementById('authModal');
    const loginForm = document.getElementById('login-form');
    const closeModalBtn = document.querySelector('.close-modal');
    const userHeaderInfo = document.getElementById('user-header-info');
    const googleSignInBtn = document.getElementById('google-signin-btn');

    // --- Funciones de la UI ---
    function showModal() {
        modal.style.display = 'flex';
    }

    function hideModal() {
        modal.style.display = 'none';
        loginForm.reset();
        document.getElementById('login-error').textContent = '';
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

    // NUEVO: Manejar el inicio de sesión con Google
    async function handleGoogleSignIn() {
        const { error } = await window.supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'https://eloraculodiario.novaproflow.com/tirada/resultado.html' // Redirige directamente al resultado tras el login
            }
        });
        if (error) {
            console.error('Error al iniciar sesión con Google:', error.message);
            alert('No se pudo iniciar sesión con Google.');
        }
        // No necesitamos cerrar el modal aquí, Supabase redirigirá la página.
    }

    async function handleLogout() {
        await window.supabase.auth.signOut();
    }

    // --- Listener Principal de Estado de Autenticación ---
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
    loginForm.addEventListener('submit', handleLogin);
    googleSignInBtn.addEventListener('click', handleGoogleSignIn);
});
