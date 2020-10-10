<script>
	import { onMount } from 'svelte';
	import { getRequestToken, getAccessToken } from './store.js';
	
	let requestToken = '';
	let pin = '';

	onMount(async () => {
		requestToken = await getRequestToken();
	});

	const handleSubmit = async () => {
		await getAccessToken(requestToken, pin);
	};
	const { appHost } = localStorage;
</script>

<style lang="scss">
	.inner {
		display: flex;
		width: 100%;
		flex-direction: column;
		height: 100%;
		justify-content: center;
		text-align: center;
		iframe {
			flex: 1;
			border-top-left-radius: 20px;
			border-top-right-radius: 20px;
		}
		form {
			border-bottom-left-radius: 20px;
			border-bottom-right-radius: 20px;
			input {
				border-bottom-left-radius: 20px;
			}
			button {
				border-radius: 0;
				border-bottom-right-radius: 20px;
			}
		}
	}
</style>

<div class="inner">
	{#if requestToken.length === 40}
		<iframe src={`${appHost}/app_auth/authorize?token=${requestToken}`} frameborder="0"></iframe>
		<form on:submit|preventDefault={handleSubmit}>
			<div class="input-group input-group-lg">
				<input
					type="number"
					bind:value={pin}
					pattern="^\d+$"
					minlength="6"
					maxlength="6"
					required
					autofocus
					class="form-control input-lg"
					placeholder="******"
				/>
				<div class="input-group-append">
					<button type="submit" class="btn btn-primary btn-lg">Confirm</button>
				</div>
			</div>
		</form>
	{:else}
		requesting tokens...
	{/if}
</div>