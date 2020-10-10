<script>
	import { onMount } from "svelte";
	import { routes } from './store.js';
	import Index from './Index.svelte';
	import Setting from './Setting.svelte';
	import Login from './Login.svelte';
	import Iframe from './Iframe.svelte';
	import Redirect from './Redirect.svelte';

	const dymanicComponent = {
		index: Index,
		setting: Setting,
		login: Login,
		iframe: Iframe,
		redirect : Redirect
	};

	const finishTest = () => {
		if (confirm('Are you sure you want to finish test?')) {
			localStorage.clear();
			location.href = '/';
		}
	};

	const { appHost, appId, appSecret } = localStorage;
</script>

<style lang="scss">
	main {
		background: #ddd;
		section {
			display: flex;
			flex-direction: column;
			height: 100vh;
			.header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 60px;
				padding: 0 1rem;
				background: #fff;
				box-shadow: rgba(0,0,0,0.2) 0px 3px 3px -2px;
			}
			.body {
				padding: 1rem;
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: center;
				overflow: hidden;
				.mobile-frame {
					border: 10px solid #222;
					width: 100%;
					height: 100%;
					max-width: 360px;
					max-height: 700px;
					border-radius: 30px;
					margin: 20px;
					background: #fff;
					position: relative;
					overflow: hidden;
				}
			}
			.footer {
				padding: 10px;
			}
		}
	}
</style>

<main>
	{#if $routes[0] === 'setting'}
		<Setting />
	{:else}
		<section>
			<div class="header">
				{appHost}, {appId}, {appSecret.substr(0, 10)}...
				<button class="btn btn-outline-dark" on:click={finishTest}>Exit Test</button>
			</div>
			<div class="body">
				<div class="mobile-frame">
					<svelte:component this={dymanicComponent[$routes[0]]} />
				</div>
			</div>
			<div class="footer text-center">
				<a href="https://whooing.com/#forum/developer/ko/api_reference" target="_blank" class="btn btn-link">API Reference</a>
			</div>
		</section>
	{/if}
	<a class="github-fork-ribbon right-bottom" target="_blank" href="https://github.com/zidell/whooing-api-test" data-ribbon="Fork me on GitHub" title="Fork me on GitHub">Fork me on GitHub</a>
</main>
