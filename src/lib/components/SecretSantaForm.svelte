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
	action="/submit"
	onsubmit={event => {
		if (formError) {
			event.preventDefault()
		}
		submitClicked = true
	}}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		xml:space="preserve"
		viewBox="0 0 76.325 56.654"
		class="ribbon"
		><g style="fill:#ffeaff;fill-opacity:1;stroke:#ffceff;stroke-width:.75;stroke-linejoin:round"
			><path
				d="M12.412.375c-2.91 0-4.944 2.148-9.6 10.133L.375 14.685l.408 1.2c.79 2.317 4.205 6.41 7.564 9.066 2.136 1.688 5.115 3.134 8.25 4.078-4.424 2.848-6.425 7.86-7.765 11.93C6.968 46.617.875 51.819.875 51.819q3.711.044 8.308-.796c1.11 1.224 1.862 2.508 3.326 5.256 3.186-4.875 2.88-7.213 5.51-14.564 4.58-12.808 11.83-7.121 15.658-9.33a9.6 9.6 0 0 0 1.604-1.135h6.629c.353.402.764.788 1.238 1.135 3.57 2.604 11.076-3.478 15.656 9.33 2.63 7.351 2.325 9.69 5.51 14.564 1.465-2.748 2.216-4.032 3.326-5.256q4.596.84 8.309.795s-6.091-5.2-7.955-10.86c-1.347-4.087-3.361-9.127-7.828-11.968 6.061-1.924 11.088-5.77 14.627-11.232 1.616-2.496 1.605-2.65-.454-6.211C67.979.542 65.808-1.08 60.89 1.506c-1.005.528-2.499 1.733-4.002 3.228-2.376 2.365-3.847 4.416-7.789 10.867-1.816 2.972-3.633 5.297-4.625 5.914-.545.34-.686.298-1.652-.478-2.582-2.075-6.535-2.091-9.088-.04-.553.446-1.12.81-1.258.81-.532 0-3.24-3.27-4.717-5.692-3.99-6.551-5.76-9.028-8.132-11.39-2.624-2.612-5.508-4.35-7.215-4.35Zm54.1 13.455q.095-.004.144.039c.477.425-.675 3.861-3.875 7.053-3.639 3.627-7.955 5.04-8.22 4.767-.428-.438 2.877-4.213 4.618-6.185 1.99-2.245 6.37-5.636 7.332-5.674zm-56.598.097c.74-.018 3.668 1.013 6.46 4.262 2.08 2.262 6.077 7.116 5.676 7.506-.388.378-4.607-1.32-7.566-4.04-3.45-3.174-5.191-7.295-4.727-7.69q.042-.036.157-.038z"
			/><path
				d="M10.229 13.96c-3.57-.727-7.365.1-9.854.725m65.942-.818c2.48-1.12 6.442-.678 9.434.371M32.93 21.582c-2.674 2.505-.955 8.573 2.35 9.668m8.207-9.713c2.65 2.06.993 8.035-1.577 9.713"
			/><path
				d="M16.597 29.029c5.18-2.935 10.314.622 15.569-1.15m12.067.114c7.611 1.556 12.146-1.791 16.815 1.61"
			/></g
		></svg
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
		label2="Gib deine Adresse an. Das kann auch die Adresse von Freund*innen oder anderen Menschen sein, denen du vertraust. Du kannst hier auch den Namen angeben, der auf dem Paket stehen soll."
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
			/^(00\d{1,3}|\+\d{1,3}|0)[\d]{7,16}$/.test(phone.replaceAll(/[ .\-()/\\]/g, '').trim())
				? false
				: 'Die Telefonnummer ist ungültig'}
	/>
	<ValidatedInput
		type="textarea"
		label="Weitere Informationen"
		label2="Hast du besondere Wünsche oder möchtest etwas zu dir sagen? Dann gib es hier ein."
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
		margin-top: 5em;
		background-color: #ffeaff;
		border: 2px solid #ffceff;
		border-radius: 15px;
		padding: 0 1.5rem 1.5rem 1.5rem;
		box-sizing: border-box;

		.ribbon {
			display: block;
			height: 8rem;
			margin: -4.4rem auto -1.5rem;
		}

		@media (max-width: 38rem) {
			width: auto;
			margin-left: -2rem;
			margin-right: -2rem;
			padding: 0 2rem 2rem 2rem;
			border-left-width: 0;
			border-right-width: 0;
			border-radius: 0;

			.ribbon {
				margin-bottom: -1rem;
			}
		}
	}
</style>
