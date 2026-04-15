<script>
	import { onMount } from 'svelte';
	import { getOAuth2AccessToken } from './store.js';

	const { appHost, appId } = localStorage;

	onMount(async () => {
		const urlParams = new URLSearchParams(window.location.search);
		const error = urlParams.get('error');
		const code = urlParams.get('code');
		if (error) {
			alert('인증이 거부되었습니다.');
			location.href = '/login';
		} else if (code) {
			await getOAuth2AccessToken(code);
		} else {
			const redirectUri = `${location.origin}/redirect2`;
			location.href = `${appHost}/oauth2/authorize?response_type=code&client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read,write`;
		}
	});
</script>
