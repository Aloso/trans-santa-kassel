<script lang="ts">
	import { onMount } from 'svelte'

	let username = $state('')
	let password = $state('')
	let submitted = $state(false)
	let status = $state<'loginFailed' | 'loggedOut'>()

	function submit(e: SubmitEvent) {
		if (username === '' || password === '') {
			e.preventDefault()
			return
		}
	}

	onMount(() => {
		const url = new URL(window.location.href)

		if (url.searchParams.get('m') === 'loginFailed') {
			status = 'loginFailed'
		} else if (url.searchParams.get('m') === 'loggedOut') {
			status = 'loggedOut'
		}
	})
</script>

<svelte:head>
	<title>Admin Login | Trans* Santa Kassel</title>
</svelte:head>

<form onsubmit={submit} method="POST" action="/admin/login">
	<h1>Admin-Login</h1>
	<label>
		Name:
		<input
			name="user"
			type="text"
			bind:value={username}
			class="formi"
			class:invalid={submitted && username === ''}
		/>
	</label>
	<label>
		Passwort:
		<input
			name="password"
			type="password"
			bind:value={password}
			class="formi"
			class:invalid={submitted && password === ''}
		/>
	</label>
	<button
		type="submit"
		class="formi primary"
		disabled={submitted && (username === '' || password === '')}
	>
		Anmelden
	</button>

	{#if status === 'loginFailed'}
		<p class="error">Login fehlgeschlagen</p>
	{:else if status === 'loggedOut'}
		<p class="info">Du wurdest abgemeldet</p>
	{/if}
</form>

<style lang="scss">
	:global(main) {
		max-width: 450px !important;
	}

	h1 {
		text-align: center;
	}

	form {
		display: block;
		margin: max(0px, 45vh - 500px) auto 0;
	}

	label {
		display: block;
		margin: 1rem 0;
	}

	button[type='submit'] {
		margin: 1rem 0;
	}

	.error {
		color: red;
		text-align: center;
	}

	.info {
		color: #007a37;
		text-align: center;
	}
</style>
