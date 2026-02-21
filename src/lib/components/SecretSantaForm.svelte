<script lang="ts">
	import SubmitButton from '$lib/components/SubmitButton.svelte'

	import ValidatedInput from '$lib/components/ValidatedInput.svelte'

	let name = $state('')
	let age = $state<number>()
	let address = $state('')
	let phone = $state('')
	let moreInfo = $state('')

	let nameError = $state<string | false>(false)
	let ageError = $state<string | false>(false)
	let addressError = $state<string | false>(false)
	let phoneError = $state<string | false>(false)
	let moreInfoError = $state<string | false>(false)
	let formError = $derived(nameError || ageError || addressError || phoneError)

	let submitClicked = $state(false)
</script>

<form
	method="POST"
	action="/api/forms/secret-santa-form"
	onsubmit={event => {
		if (formError) {
			event.preventDefault()
		}
		submitClicked = true
	}}
>
	<ValidatedInput
		type="text"
		label="Dein Name"
		label2="Der Name, mit dem du angesprochen werden möchtest. Das muss nicht der Name in deinem Ausweis sein."
		name="name"
		bind:value={name}
		bind:error={nameError}
		required="Dieses Feld darf nicht leer sein"
		{submitClicked}
	/>
	<ValidatedInput
		type="number"
		label="Dein Alter"
		name="age"
		bind:value={age}
		bind:error={ageError}
		required="Dieses Feld darf nicht leer sein"
		{submitClicked}
		hasError={age =>
			(age ?? 0) >= 12 ? false : 'Um teilzunehmen, musst du mindestens 12 Jahre alt sein.'}
	/>
	<ValidatedInput
		type="textarea"
		label="Bevorzugte Anschrift"
		label2="Gib deine Adresse an. Du kannst hier auch den Namen angeben, der auf dem Paket stehen soll."
		name="address"
		bind:value={address}
		bind:error={addressError}
		required="Dieses Feld darf nicht leer sein"
		{submitClicked}
		hasError={address => {
			const lines = address.split(/[\n,]/)
			return lines.length >= 2 && lines.every(line => line.length > 5)
				? false
				: 'Gib eine Adresse mit Straße, Hausnummer, Postleitzahl und Ort ein'
		}}
		style="--min-height: 100px"
	/>
	<ValidatedInput
		type="tel"
		label="Telefonnummer"
		label2="Vor dem Versand werden wir dir eine SMS schicken. Du musst auf die SMS antworten, um den Versand zu bestätigen."
		name="phone"
		bind:value={phone}
		bind:error={phoneError}
		required="Dieses Feld darf nicht leer sein"
		{submitClicked}
		hasError={phone =>
			/^(00\d{1,2}|\+\d{1,2}|0)[\d]{7,16}$/.test(phone.replaceAll(/[ .\-()/\\]/g, '').trim())
				? false
				: 'Die Telefonnummer ist ungültig'}
	/>
	<ValidatedInput
		type="textarea"
		label="Weitere Informationen"
		label2="Hast du besondere Wünsche oder möchtest etwas über zu dir sagen? Dann gib es hier ein."
		name="moreInfo"
		bind:value={moreInfo}
		bind:error={moreInfoError}
		{submitClicked}
		style="--min-height: 150px"
	/>

	<SubmitButton disabled={submitClicked && !!formError}>Anmelden</SubmitButton>
</form>

<style lang="scss">
	form {
		background-color: #ffeaff;
		border: 2px solid #ffceff;
		border-radius: 15px;
		padding: 24px;
		box-sizing: border-box;

		@media (max-width: 38rem) {
			width: auto;
			margin-left: -2rem;
			margin-right: -2rem;
			padding: 2rem;
			border-left-width: 0;
			border-right-width: 0;
			border-radius: 0;
		}
	}
</style>
