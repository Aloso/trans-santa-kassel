<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		disabled?: boolean
		children: Snippet
	}

	let { disabled, children }: Props = $props()
</script>

<button type="submit" class:disabled>
	{@render children()}
</button>

<style lang="scss">
	button {
		background-color: #006dcd;
		color: white;
		padding: 12px 20px;
		font: inherit;
		font-weight: bold;
		color: white;
		border: none;
		border-radius: 7px;
		margin: 1.5rem 0 0 0;
		transition: background-color 0.2s;

		&:hover,
		&:focus {
			background-color: #00529a;
		}

		&.disabled {
			background-color: #000a;
		}
	}
</style>
