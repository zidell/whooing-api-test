<script>
	let appHost = 'https://whooing.com';
	let appId = '';
	let appSecret = '';

	const startTest = (e) => {
		localStorage.appHost = appHost;
		localStorage.appId = appId;
		localStorage.appSecret = appSecret;
		location.href = '/';
	};
</script>

<style lang="scss">
	section {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		form {
			h1 {
				margin-bottom: 2rem;
			}
			max-width: 400px;
			padding: 1rem;
			width: 100%;
			text-align: center;
		}
	}
</style>

<section>
	
	<form on:submit|preventDefault={startTest}>
		<h1>
			App Setting
		</h1>
		<div class="form-group">
			<input type="text" pattern="^https:\/\/([a-z0-9]+\.)?whooing\.com" bind:value={appHost} class="form-control" required placeholder="whooing_host" />
		</div>
		<div class="form-group">
			<input type="number" pattern="^\d+$" autofocus bind:value={appId} class="form-control" required placeholder="app_id" />
		</div>
		<div class="form-group">
			<input type="text" pattern="^[0-9a-z]+$" bind:value={appSecret} minlength="40" maxlength="40" required class="form-control" placeholder="app_secret" />
		</div>
		<div class="form-group">
			<button type="submit" class="btn btn-primary btn-lg btn-block">Start Test</button>
		</div>
	</form>

</section>
