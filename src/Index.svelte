<script>
	import { onMount } from "svelte";
	import { logout, getFetchHeader } from "./store.js";
	import Bs from "./Bs.svelte";
	import Pl from "./Pl.svelte";
	import Insert from "./Insert.svelte";

	const { appHost } = localStorage;

	let sections = [];
	let currentSectionId = "";
	let accounts = {};

	let route = "insert";

	onMount(async () => {
		const userResponse = await fetch(
			`${appHost}/api/user.json_array`,
			getFetchHeader(),
		).then((res) => res.json());
		console.log("userResponse", userResponse);
		if (userResponse.code !== 200) {
			throw new Error(userResponse.message);
		}

		const sectionResponse = await fetch(
			`${appHost}/api/sections.json_array`,
			getFetchHeader(),
		).then((res) => res.json());
		if (sectionResponse.code !== 200) {
			throw new Error(sectionResponse.message);
		}
		sections = sectionResponse.results;

		if (currentSectionId === "") {
			currentSectionId = sections[0].section_id;
		}
	});

	const fetchAccounts = async () => {
		// request accounts and latest entries when current section changed
		const accountResponse = await fetch(
			`${appHost}/api/accounts.json?section_id=${currentSectionId}`,
			getFetchHeader(),
		).then((res) => res.json());
		if (accountResponse.code !== 200) {
			throw new Error(accountResponse.message);
		}
		accounts = accountResponse.results;
	};

	$: {
		if (currentSectionId !== "") {
			fetchAccounts();
		}
	}
</script>

<div class="inner">
	<div class="header">
		<select class="form-control" bind:value={currentSectionId}>
			{#each sections as section, index (section.section_id)}
				<option value={section.section_id}
					>{index + 1}. {section.title} / {section.currency}</option
				>
			{/each}
		</select>
		<button class="btn btn-outline-light" on:click={logout}>Logout</button>
	</div>

	<nav class="navbar navbar-custom">
		<ul class="nav nav-pills justify-content-center w-100">
			<li class="nav-item">
				<button
					type="button"
					class="nav-link {route === 'insert' ? 'active' : ''}"
					on:click={() => (route = "insert")}
				>
					Insert
				</button>
			</li>
			<li class="nav-item">
				<button
					type="button"
					class="nav-link {route === 'bs' ? 'active' : ''}"
					on:click={() => (route = "bs")}
				>
					BS
				</button>
			</li>
			<li class="nav-item">
				<button
					type="button"
					class="nav-link {route === 'pl' ? 'active' : ''}"
					on:click={() => (route = "pl")}
				>
					PL
				</button>
			</li>
		</ul>
	</nav>

	<div class="body">
		{#if route === "insert"}
			<Insert {accounts} {currentSectionId} />
		{:else if route === "bs"}
			<Bs {accounts} {currentSectionId} />
		{:else if route === "pl"}
			<Pl {accounts} {currentSectionId} />
		{/if}
	</div>
</div>

<style lang="scss">
	.inner {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;

		.header {
			background: #007bff;
			height: 65px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 3px -2px;
			> * {
				margin: 0 0.75rem;
			}
		}

		:global(.navbar-custom) {
			background: #375473;
			padding: 0.5rem 0;
			box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;
			z-index: 10;

			:global(.nav-link) {
				color: rgba(255, 255, 255, 0.8);
				font-weight: 500;
				padding: 0.5rem 1.5rem;
				margin: 0 0.25rem;
				border-radius: 0.25rem;
				transition: all 0.2s ease;
				border: none;
				background: none;
				cursor: pointer;

				&:hover {
					color: #fff;
					background: rgba(255, 255, 255, 0.1);
				}

				&:global(.active) {
					color: #007bff;
					background: #fff;
				}

				&:focus {
					outline: none;
					box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.3);
				}
			}
		}

		.body {
			flex: 1;
			padding: 2rem 1rem;
			overflow: auto;
		}
	}
</style>
