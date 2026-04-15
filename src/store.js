import { writable, get } from 'svelte/store';
import sha1 from 'sha1';

export const routes = (() => {
	const { subscribe, set } = writable([]);

	const update = () => {
		const paths = location.pathname.replace('/', '').split('/');
		if (paths[0] === '') {
			if (!localStorage.appSecret) {
				paths[0] = 'setting';
			} else if (!localStorage.token && !localStorage.accessToken) {
				paths[0] = 'login';
			} else {
				paths[0] = 'index';
			}
		}

		set(paths);
	};

	return { subscribe, update };
})();

export const getRequestToken = async () => {
	const { appHost, appId, appSecret } = localStorage;
	const res = await fetch(
		`${appHost}/app_auth/request_token?app_id=${appId}&app_secret=${appSecret}`
	)
		.then((res) => {
			return res.json();
		})
		.catch(() => {
			alert('The app information is wrong.');
			localStorage.clear();
			location.href = '/';
		});

	return res.token;
};

export const getAccessToken = async (requestToken, pin) => {
	const { appHost, appId, appSecret } = localStorage;

	const res = await fetch(
		`${appHost}/app_auth/access_token?app_id=${appId}&app_secret=${appSecret}&token=${requestToken}&pin=${pin}`
	).then((res) => res.json());

	localStorage.token = res.token;
	localStorage.tokenSecret = res.token_secret;

	location.href = '/';
};

export const getOAuth2AccessToken = async (code) => {
	const { appHost, appId } = localStorage;
	const redirectUri = `${location.origin}/redirect2`;

	const res = await fetch(`${appHost}/oauth2/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
		},
		body: new URLSearchParams({
			grant_type: 'authorization_code',
			code,
			redirect_uri: redirectUri,
			client_id: appId,
		}),
	}).then((res) => res.json());

	if (res.access_token) {
		localStorage.authType = 'oauth2';
		localStorage.accessToken = res.access_token;
		localStorage.refreshToken = res.refresh_token;
		location.href = '/';
	} else {
		alert('OAuth2 token exchange failed.');
		location.href = '/login';
	}
};

export const getFetchHeader = (opts) => {
	if (localStorage.authType === 'oauth2') {
		return {
			...opts,
			headers: {
				'Authorization': `Bearer ${localStorage.accessToken}`,
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
			},
		};
	}

	const { appId, appSecret } = localStorage;

	const data = {
		app_id: appId,
		token: localStorage.token,
		signiture: sha1(`${appSecret}|${localStorage.tokenSecret}`),
		nounce: `${+new Date()}-${Math.random()}`,
		timestamp: +new Date() / 1000,
	};

	let xApiKey = Object.keys(data).map((k) => {
		return `${k}=${data[k]}`;
	});

	return {
		...opts,
		headers: {
			'x-api-key': xApiKey.join(','),
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
		},
	};
};

export const logout = () => {
	localStorage.removeItem('token');
	localStorage.removeItem('tokenSecret');
	localStorage.removeItem('authType');
	localStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');

	location.href = '/';
};

routes.update();
