document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('authModal');
    const loginForm = document.getElementById('login-form');
    const closeModalBtn = document.querySelector('.close-modal');
    const userHeaderInfo = document.getElementById('user-header-info');
    const googleSignInBtn = document.getElementById('google-signin-btn');

    function showModal() { modal.style.display = 'flex'; }
    function hideModal() { modal.style.display = 'none'; loginForm.reset(); document.getElementById('login-error').textContent = ''; }

    async function handleLogin(e) {
        e.preventDefault();
        const email = loginForm.email.value;
        const password = loginForm.password.value;
        const { error } = await window.supabase.auth.signInWithPassword({ email, password });
        if (error) document.getElementById('login-error').textContent = error.message;
        else hideModal();
    }

    async function handleGoogleSignIn() {
        const { error } = await window.supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin + '/tirada/resultado.html' }
        });
        if (error) console.error('Error con Google:', error.message);
    }

    async function handleLogout() { await window.supabase.auth.signOut(); }

    window.supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
            userHeaderInfo.innerHTML = `<span>Hola, ${session.user.email.split('@')[0]}</span><button id="logout-btn">Cerrar Sesión</button>`;
            document.getElementById('logout-btn').addEventListener('click', handleLogout);
        } else {
            userHeaderInfo.innerHTML = `<button id="login-btn">Iniciar Sesión</button>`;
            document.getElementById('login-btn').addEventListener('click', showModal);
        }
    });

    closeModalBtn.addEventListener('click', hideModal);
    window.addEventListener('click', (event) => { if (event.target == modal) hideModal(); });
    loginForm.addEventListener('submit', handleLogin);
    googleSignInBtn.addEventListener('click', handleGoogleSignIn);
});
