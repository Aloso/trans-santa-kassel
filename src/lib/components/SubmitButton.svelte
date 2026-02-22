<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		disabled?: boolean
		children: Snippet
	}

	let { disabled, children }: Props = $props()
</script>

<button type="submit" class="formi primary" class:disabled>
	{@render children()}
</button>

<style lang="scss">
	button {
		padding: 12px 20px;
		margin: 1.5rem 0 0 0;
	}
</style>
