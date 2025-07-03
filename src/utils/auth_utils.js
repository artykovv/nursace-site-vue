import { ref } from 'vue'
import { ensureSessionId } from './session_init'

const isAuthenticated = ref(false)
const user = ref(null)
const sessionId = ref(null)

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

async function checkAuth() {
    const siteUrl = window.AppConfig.siteUrl;
    const token = getCookie('Bearer');
    try {
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const res = await fetch(`${siteUrl}/user/me`, {
            credentials: 'include',
            headers
        });
        isAuthenticated.value = res.ok;
        if (res.ok) {
            const userData = await res.json();
            user.value = userData;
            if (userData.session_id) {
                localStorage.setItem('session_id', userData.session_id);
                sessionId.value = userData.session_id;
            } else {
                sessionId.value = await ensureSessionId();
            }
        } else {
            user.value = null;
            sessionId.value = await ensureSessionId();
        }
    } catch (e) {
        isAuthenticated.value = false;
        user.value = null;
        sessionId.value = await ensureSessionId();
    }
}

async function getAuthParam() {
    await checkAuth();
    return `session_id=${sessionId.value || await ensureSessionId()}`;
}

function logout() {
    document.cookie = 'Bearer=; Max-Age=0; path=/;';
    localStorage.removeItem('session_id');
    isAuthenticated.value = false;
    user.value = null;
    sessionId.value = null;
}

export function useAuth() {
    return {
        isAuthenticated,
        user,
        sessionId,
        checkAuth,
        getAuthParam,
        logout
    };
}

// Для обратной совместимости с window.getAuthParam
if (typeof window !== 'undefined') {
  window.getAuthParam = async () => {
    const { getAuthParam } = useAuth()
    return await getAuthParam()
  }
} 