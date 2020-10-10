<style lang="scss">
	.inner {
		display: flex;
		padding: 1rem;
		width: 100%;
		flex-direction: column;
		height: 100%;
		justify-content: center;
		text-align: center;
		h1 {
			margin-bottom: 4rem;
		}
		.or {
			position: relative;
			height: 4rem;
			&:before {
				content: '';
				position: absolute;
				width: 100%;
				height: 1px;
				top: 50%;
    			left: 0;
				background: #bbb;
			}
			&:after {
				content: 'OR';
				position: absolute;
				background: #fff;
				color: #bbb;
				left: 50%;
				top: 50%;
				transform: translate3d(-50%, -50%, 0);
				padding: 0 1rem;
			}
		}
	}
</style>

<div class="inner">
	<h1>Welcome</h1>
	
	<div>
		<button type="button" class="btn btn-primary btn-block" on:click={() => location.href = '/iframe'}>Login with iframe</button>
		<div class="or" />
		<button type="button" class="btn btn-primary btn-block" on:click={() => location.href = '/redirect'}>Login with redirection</button>
	</div>
</div>