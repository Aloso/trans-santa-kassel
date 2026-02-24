<script lang="ts">
	import { marked } from 'marked'
	import datenschutz from './datenschutz.md?raw'
</script>

{@html marked(datenschutz)}
