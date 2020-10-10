import { writable, get } from 'svelte/store';
import sha1 from 'sha1';

export const routes = (() => {
	const { subscribe, set } = writable([]);

	const update = () => {
		const paths = location.pathname.replace('/', '').split('/');
		if (paths[0] === '') {
			if (!localStorage.appSecret) {
				paths[0] = 'setting';
			} else if (!localStorage.token) {
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

export const getFetchHeader = (opts) => {
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

	location.href = '/';
};

routes.update();
