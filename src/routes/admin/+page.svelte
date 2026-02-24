<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import { SvelteSet } from 'svelte/reactivity'
	import type { AdminSantaData } from './+page.server'

	interface Props {
		data: AdminSantaData
	}

	let { data }: Props = $props()
	let dirty = $state(new SvelteSet<string>())

	const rtf1 = new Intl.RelativeTimeFormat('de', { style: 'short', localeMatcher: 'best fit' })
	const now = $state(Date.now())

	async function deleteReg(id: string) {
		await fetch(`/admin/api/registration?id=${id}`, { method: 'DELETE' })
		invalidateAll()
	}

	async function patchReg(
		update: { id: string; verified?: boolean; notes?: string },
		invalidate = true,
	) {
		await fetch(`/admin/api/registration`, { method: 'PATCH', body: JSON.stringify(update) })
		if (invalidate) invalidateAll()
	}

	function formatCreated(timestamp: number) {
		const seconds = (timestamp - now) / 1000
		return seconds > -60
			? 'gerade eben'
			: seconds > -3600
				? rtf1.format(Math.round(seconds / 60), 'minute')
				: seconds > -86400
					? rtf1.format(Math.round(seconds / 3600), 'hour')
					: new Date(timestamp).toLocaleDateString('de', {
							year: '2-digit',
							month: '2-digit',
							day: '2-digit',
						})
	}

	function auto_grow(element: HTMLTextAreaElement) {
		element.style.height = '5px'
		element.style.height = element.scrollHeight + 'px'
	}
</script>

<svelte:head>
	<title>Admin | Trans* Santa Kassel</title>
</svelte:head>

<h1>Administration</h1>

<h2>Registrierungen</h2>

<table class="reg-table">
	<thead>
		<tr>
			<th>Telefon</th>
			<th>Anmeldung</th>
			<th>Name</th>
			<th>Adresse</th>
			<th>Alter</th>
			<th>Mehr Infos</th>
			<th>Verifiziert</th>
			<th>Notizen</th>
			<th></th>
		</tr>
	</thead>

	<tbody>
		{#each data.registrations as reg (reg.id)}
			<tr>
				<td>{reg.phone}</td>
				<td title={new Date(reg.created).toLocaleString()}>{formatCreated(reg.created)}</td>
				<td>{reg.name}</td>
				<td class="multiline">{reg.address}</td>
				<td>{reg.age}</td>
				<td>{reg.moreInfo}</td>
				<td>
					<input
						type="checkbox"
						checked={reg.verified}
						oninput={e => {
							const verified = e.currentTarget.checked
							patchReg({ id: reg.id, verified })
						}}
					/>
				</td>
				<td>
					<textarea
						oninput={e => {
							dirty.add(reg.id)
							auto_grow(e.currentTarget)
						}}
						onblur={e => {
							const notes = e.currentTarget.value
							patchReg({ id: reg.id, notes }, false).then(() => {
								dirty.delete(reg.id)
							})
						}}
						{@attach auto_grow}
						value={reg.notes}
						class:dirty={dirty.has(reg.id)}
					></textarea>
				</td>
				<td>
					<button class="formi action" onclick={() => deleteReg(reg.id)}>Löschen</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<style lang="scss">
	:global(main) {
		max-width: 1400px !important;
	}

	.reg-table {
		display: table;
		width: 100%;
		border-collapse: collapse;
		font-size: 0.8rem;
		line-height: 150%;
	}

	td,
	th {
		border: 1px solid #0007;
		padding: 5px 8px;
		vertical-align: top;
		text-align: left;
	}

	.multiline {
		white-space: pre-wrap;
	}

	textarea {
		box-sizing: border-box;
		resize: none;
		overflow: hidden;
		width: calc(100% + 16px);
		height: 36px;
		min-height: 36px;
		border: none;
		margin: -5px -8px;
		padding: 5px 8px;
		font: inherit;
		border-radius: 1px;

		&:focus {
			outline: 2.4px solid #3784ff;
		}

		&.dirty {
			outline: 2.4px solid #e0914c;
		}
	}

	.action {
		font-size: 0.7rem;
		padding: 2px 5px;
	}
</style>
