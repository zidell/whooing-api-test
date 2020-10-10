<script>
	import { getFetchHeader } from './store.js';

	const { appHost } = localStorage;
	export let accounts = {};
	export let currentSectionId = '';
	let itemRef;
	let entries = [];
	let item = '';
	let money = '';
	let firstAssetAccountId = '';

	const fetchEntries = async () => {
		const entryResponse = await fetch(`${appHost}/api/entries/latest.json?section_id=${currentSectionId}`, getFetchHeader()).then(res => res.json());
		if (entryResponse.code !== 200) {
			throw new Error(entryResponse.message);
		}
		entries = entryResponse.results;
	}

	const getAccountTitle = (account, accountId) => {
		const acc =accounts[account][accountId];
		return !!acc ? acc.title : 'Deleted';
	}

	const handelInsert = async(e) => {
		const data = {
			section_id: currentSectionId,
			item: item,
			money: money,
			l_account: 'assets',
			l_account_id: firstAssetAccountId,
			r_account: 'assets',
			r_account_id: firstAssetAccountId,
		};
		const formArr = [];
		Object.keys(data).map(k => {
			formArr.push(`${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`);
		})

		const entryResponse = await fetch(`${appHost}/api/entries.json`, getFetchHeader({
			method: 'POST',
			cache: 'no-cache',
			body: formArr.join('&')
		})).then(res => res.json());
		if (entryResponse.code !== 200) {
			throw new Error(entryResponse.message);
		}

		item = '';
		money = '';
		itemRef.focus();
		
		entries = [...entryResponse.results, ...entries];
	};

	const handleDelete = async (entryId) => {
		if(confirm('Do you want to delete this entry?')) {
			const entryResponse = await fetch(`${appHost}/api/entries/${entryId}.json`, getFetchHeader({
				method: 'DELETE',
				cache: 'no-cache'
			})).then(res => res.json());
			if (entryResponse.code !== 200) {
				throw new Error(entryResponse.message);
			}
			entries = entries.filter(entry => entry.entry_id !== entryId);
		}
	};

	$: {
		if (currentSectionId !== '' && Object.keys(accounts).length > 0) {
			firstAssetAccountId = Object.keys(accounts.assets)[0];
			item = '';
			money = '';
	
			fetchEntries();
		}
	}

</script>

<style lang="scss">
	form {
		margin-bottom: 2rem;
	}
	#entries {
		.entry {
			position: relative;
			padding: 0.25rem 0.65rem;
			&:hover {
				background: rgba(0, 0, 0, 0.05);
			}
			.r {
				display: flex;
				margin: 5px 0;
				align-items: center;
				> span:first-child {
					background: rgba(0, 0, 0, 0.05);
					padding: 0.2rem 0.5rem;
					font-size: 0.9em;
					width: 5rem;
				}
				> span:last-child {
					flex: 1;
					padding: 0 1rem;
				}
			}
			button {
				position: absolute;
				top: 0;
				right: 0;
			}
		}
	}
</style>

<div>
	<form on:submit|preventDefault={handelInsert}>
		<div class="input-group">
			<input
				type="text"
				bind:this={itemRef}
				bind:value={item}
				required
				autofocus
				class="form-control"
				placeholder="Item"
			/>
			<input
				type="number"
				bind:value={money}
				class="form-control"
				placeholder="Money"
			/>
			<div class="input-group-append">
				<button type="submit" class="btn btn-primary">Go</button>
			</div>
		</div>
	</form>

	<ul id="entries" class="list-group">
		{#each entries as entry, index (entry.entry_id)}
			<div class="list-group-item entry">
				<button on:click={handleDelete.bind(null, entry.entry_id)} class="btn btn-link">
					<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
						<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
						<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
					</svg>
				</button>
				<div class="r">
					<span>entry_id</span>
					<span>{entry.entry_id}</span>
				</div>
				<div class="r">
					<span>item</span>
					<span>{entry.item}</span>
				</div>
				<div class="r">
					<span>money</span>
					<span>{entry.money}</span>
				</div>
				<div class="r">
					<span>left</span>
					<span>{getAccountTitle(entry.l_account, entry.l_account_id)}</span>
				</div>
				<div class="r">
					<span>right</span>
					<span>{getAccountTitle(entry.r_account, entry.r_account_id)}</span>
				</div>
			</div>
		{/each}
	</ul>
</div>