<script>
	import { onMount } from 'svelte';
	import { logout, getFetchHeader } from './store.js';
	import Entries from './Entries.svelte';

	const { appHost } = localStorage;

	let sections = [];
	let currentSectionId = '';
	let accounts = {};

	onMount(async () => {
		const sectionResponse = await fetch(`${appHost}/api/sections.json_array`, getFetchHeader()).then(res => res.json());
		if (sectionResponse.code !== 200) {
			throw new Error(sectionResponse.message);
		}
		sections = sectionResponse.results;

		if (currentSectionId === '') {
			currentSectionId = sections[0].section_id;
		}
	});

	const fetchAccounts = async () => {
		// request accounts and latest entries when current section changed
		const accountResponse = await fetch(`${appHost}/api/accounts.json?section_id=${currentSectionId}`, getFetchHeader()).then(res => res.json());
		if (accountResponse.code !== 200) {
			throw new Error(accountResponse.message);
		}
		accounts = accountResponse.results;
	}

	$: {
		if (currentSectionId !== '') {
			fetchAccounts();
		}
	}

</script>

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
			box-shadow: rgba(0,0,0,0.2) 0px 3px 3px -2px;
			> * {
				margin: 0 0.75rem;
			}
		}
		.body {
			flex: 1;
			padding: 2rem 1rem;
			overflow: auto;
		}
	}
</style>

<div class="inner">
	<div class="header">
		<select class="form-control" bind:value={currentSectionId}>
			{#each sections as section, index (section.section_id)}
				<option value={section.section_id}>{index + 1}. {section.title} / {section.currency}</option>
			{/each}
		</select>
		<button class="btn btn-outline-light" on:click={logout}>Logout</button>
	</div>

	<div class="body">
		<Entries accounts={accounts} currentSectionId={currentSectionId}/>
	</div>
</div>
