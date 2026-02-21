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

	<footer>
		<span>&copy; Trans* Santa Kassel</span>
		<span>Impressum</span>
		<span>Kontakt</span>
		<span>Instagram</span>
	</footer>
</main>

<style lang="scss">
	main {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem;
	}

	footer {
		margin: 2rem 0 0 0;
		color: #000a;
		font-size: 0.9rem;
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
	}
</style>
