import { error } from '@sveltejs/kit'
import { formDataText } from '../../backend/helper'
import { escapeHtml } from '../../backend/sanitize'
import { v4 } from 'uuid'

export async function POST({ request, platform, getClientAddress }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	if ((platform.cf?.botManagement.score ?? 100) < 30) {
		error(403, 'Error: bot detected')
	}

	const formData = await request.formData()
	const name = formDataText(formData, 'name') ?? error(400, 'Missing name')
	const age = +(formDataText(formData, 'age') ?? error(400, 'Missing age'))
	const address = formDataText(formData, 'address') ?? error(400, 'Missing address')
	const phone = formDataText(formData, 'phone') ?? error(400, 'Missing phone')
	const moreInfo = formDataText(formData, 'moreInfo')

	const turnstile =
		formDataText(formData, 'cf-turnstile-response') ?? error(400, 'Captcha not solved')
	verifyCaptcha(turnstile, getClientAddress(), platform)

	if (name === '') error(400, 'Invalid name')
	if (Number.isNaN(age) || age < 12) error(400, 'Invalid age')
	const addressLines = address.split(/[\n,]/)
	if (addressLines.length < 2 || addressLines.some(line => line.length <= 5))
		error(400, 'Invalid address')
	if (!/^(00\d{1,2}|\+\d{1,2}|0)[\d]{7,16}$/.test(phone.replaceAll(/[ .\-()/\\]/g, '').trim()))
		error(400, 'Invalid phone number')

	await platform.env.DB.prepare(
		`INSERT INTO secret_santa (id, created, name, phone, address, age, moreInfo, verified)
		VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)`,
	)
		.bind(v4(), Date.now(), name, phone, address, age, moreInfo ?? null, 0)
		.run()

	const { WorkerMailer } = await import('worker-mailer')

	// Connect to SMTP server
	const mailer = await WorkerMailer.connect({
		credentials: {
			username: platform.env.SMTP_USERNAME,
			password: platform.env.SMTP_PASSWORD,
		},
		authType: 'plain',
		host: platform.env.SMTP_HOST,
		port: 465, // try 587 if this fails
		secure: true,
	})

	// Send email
	await mailer.send({
		from: { name: 'Trans* Santa', email: 'contact@queereszentrumkassel.de' },
		to: platform.env.ADMIN_RECIPIENTS.split(','),
		subject: `Anmeldung: ${name}`,
		html: `<!DOCTYPE html>
<html>
<body style="font-family: Segoe UI, Roboto, sans-serif; font-size: 16px;">
  <p><b>Name</b>: ${escapeHtml(name)}</p>
  <p><b>Alter</b>: ${age} Jahre</p>
  <p style="white-space: pre-wrap"><b>Anschrift</b>: ${escapeHtml(address)}</p>
  <p><b>Telefon</b>: ${escapeHtml(phone)}</p>
  <p><b>Weitere Informationen</b>: ${escapeHtml(moreInfo ?? '')}</p>
</body>
</html>`,
	})

	const url = new URL('/angemeldet', request.url)
	url.searchParams.set('id', v4())
	return Response.redirect(url, 303)
}

async function verifyCaptcha(token: string, ip: string, platform: App.Platform) {
	const formData = new FormData()
	formData.append('secret', platform.env.TURNSTILE_SECRET_KEY)
	formData.append('response', token)
	formData.append('remoteip', ip)

	const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		body: formData,
		method: 'POST',
	})
	const outcome = await result.json()

	if (!outcome.success) {
		error(403, 'Turnstile captcha verification failed')
	}
}
