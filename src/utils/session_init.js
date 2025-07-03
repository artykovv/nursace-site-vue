(async function() {
    const SiteUrlAndPort = window.AppConfig ? window.AppConfig.siteUrl : window.SiteUrlAndPort || window.SiteUrl;
    const storageKey = 'session_id';
    let sessionId = localStorage.getItem(storageKey);

    if (sessionId) {
        const response = await fetch(`${SiteUrlAndPort}/session/${sessionId}`);
        if (!response.ok) {
            sessionId = null;
        }
    }

    if (!sessionId) {
        const getParam = name => new URLSearchParams(window.location.search).get(name) || null;

        const payload = {
            referer: document.referrer || null,
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            browser_language: navigator.language || null,
            utm_source: getParam('utm_source'),
            utm_medium: getParam('utm_medium'),
            utm_campaign: getParam('utm_campaign'),
            utm_term: getParam('utm_term'),
            utm_content: getParam('utm_content'),
            time_spent: 0,
        };

        try {
            const ipRes = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipRes.json();
            payload.ip_address = ipData.ip;
        } catch (e) {
            payload.ip_address = null;
        }

        const createRes = await fetch(`${SiteUrlAndPort}/session/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (createRes.ok) {
            const data = await createRes.json();
            sessionId = data.session_id;
            localStorage.setItem(storageKey, sessionId);
        } else {
            console.error("Не удалось создать сессию");
        }
    }
})();

window.getSessionId = function() {
    return localStorage.getItem('session_id');
};

window.initSession = async function() {
    const SiteUrlAndPort = window.AppConfig ? window.AppConfig.siteUrl : window.SiteUrlAndPort || window.SiteUrl;
    const storageKey = 'session_id';
    let sessionId = localStorage.getItem(storageKey);

    if (sessionId) {
        const response = await fetch(`${SiteUrlAndPort}/session/${sessionId}`);
        if (!response.ok) {
            sessionId = null;
        }
    }

    if (!sessionId) {
        const getParam = name => new URLSearchParams(window.location.search).get(name) || null;

        const payload = {
            referer: document.referrer || null,
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            browser_language: navigator.language || null,
            utm_source: getParam('utm_source'),
            utm_medium: getParam('utm_medium'),
            utm_campaign: getParam('utm_campaign'),
            utm_term: getParam('utm_term'),
            utm_content: getParam('utm_content'),
            time_spent: 0,
        };

        try {
            const ipRes = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipRes.json();
            payload.ip_address = ipData.ip;
        } catch (e) {
            payload.ip_address = null;
        }

        const createRes = await fetch(`${SiteUrlAndPort}/session/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (createRes.ok) {
            const data = await createRes.json();
            sessionId = data.session_id;
            localStorage.setItem(storageKey, sessionId);
        } else {
            console.error("Не удалось создать сессию");
        }
    }
    return sessionId;
};

export async function ensureSessionId() {
    let sessionId = window.getSessionId();
    if (sessionId) return sessionId;
    if (window.initSession) {
        sessionId = await window.initSession();
        if (sessionId) return sessionId;
    }
    return new Promise(resolve => {
        const interval = setInterval(() => {
            const id = window.getSessionId();
            if (id) {
                clearInterval(interval);
                resolve(id);
            }
        }, 100);
    });
} 