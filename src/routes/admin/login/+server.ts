import { error } from '@sveltejs/kit'
import { verifyCredentials } from '../../../backend/auth'

export async function POST({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	const formData = await request.formData()
	const credentials = {
		user: formData.get('user') as string,
		password: formData.get('password') as string,
	}

	if (!credentials.user || !credentials.password || !verifyCredentials(platform.env, credentials)) {
		return Response.redirect(new URL('/admin/loginForm?m=loginFailed', request.url), 303)
	}

	const cookieString = btoa(`${credentials.user}@${credentials.password}`).replaceAll('=', '')

	return new Response(null, {
		status: 303,
		headers: {
			Location: '/admin?m=loginSuccessful',
			'Set-Cookie': `_santaCred=${cookieString}; HttpOnly; Secure; SameSite=Strict; Path=/`,
		},
	})
}
