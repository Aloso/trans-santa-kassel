import { error } from '@sveltejs/kit'
import { formDataText } from '../../backend/helper'
import { escapeHtml } from '../../backend/sanitize'
import { v4 } from 'uuid'

export async function POST({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	const formData = await request.formData()
	const name = formDataText(formData, 'name') ?? error(400, 'Missing name')
	const age = +(formDataText(formData, 'age') ?? error(400, 'Missing age'))
	const address = formDataText(formData, 'address') ?? error(400, 'Missing address')
	const phone = formDataText(formData, 'phone') ?? error(400, 'Missing phone')
	const moreInfo = formDataText(formData, 'moreInfo')

	if (name === '') error(400, 'Invalid name')
	if (Number.isNaN(age) || age < 12) error(400, 'Invalid age')
	const addressLines = address.split(/[\n,]/)
	if (addressLines.length < 2 || addressLines.some(line => line.length <= 5))
		error(400, 'Invalid address')
	if (!/^(00\d{1,2}|\+\d{1,2}|0)[\d]{7,16}$/.test(phone.replaceAll(/[ .\-()/\\]/g, '').trim()))
		error(400, 'Invalid phone number')

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
