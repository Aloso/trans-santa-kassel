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
	<span>&copy; Trans* Santa Kassel</span>
	<span>Impressum</span>
	<span>Kontakt</span>
	<span>Instagram</span>
</footer>

<style lang="scss">
	main {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem;
	}

	footer {
		max-width: 900px;
		margin: 2rem auto 0 auto;
		color: #000a;
		font-size: 0.9rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 2rem;
	}
</style>
