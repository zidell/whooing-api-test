<script>
	import { onMount } from 'svelte';
	import { getRequestToken, getAccessToken } from './store.js';

	const { appHost } = localStorage;
	
	onMount(async () => {
		const urlParams = new URLSearchParams(window.location.search);
		const token = urlParams.get('token');
		const pin = urlParams.get('pin');
		if (!!token && token.length === 40) {
			await getAccessToken(token, pin);
		} else {
			const requestToken = await getRequestToken();
			location.href = `${appHost}/app_auth/authorize?token=${requestToken}&callbackuri=${encodeURIComponent(`${location.origin}/redirect`)}`;
		}
	});
</script>