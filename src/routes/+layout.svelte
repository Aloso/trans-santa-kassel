<script lang="ts">
	// import favicon from '$lib/assets/favicon.svg';
	import './global.scss'

	let { children } = $props()
</script>

<svelte:head>
	<!-- <link rel="icon" href={favicon} /> -->
</svelte:head>

<main>
	{@render children()}
</main>

<footer>
	<span>Trans* Santa Kassel</span>
	<a href="/">Startseite</a>
	<a href="/datenschutz">Datenschutz</a>
	<span>Impressum</span>
	<span>Kontakt</span>
</footer>

<style lang="scss">
	main {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem;
	}

	footer {
		max-width: 900px;
		margin: 2rem auto;
		padding: 0 2rem;
		color: #000a;
		font-size: 0.9rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1rem 2rem;

		a {
			text-decoration: none;

			&:hover,
			&:focus {
				text-decoration: underline;
				text-underline-offset: 4px;
				text-decoration-thickness: 1.4px;
			}
		}
	}
</style>
