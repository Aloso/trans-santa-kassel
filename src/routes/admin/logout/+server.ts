export async function GET(): Promise<Response> {
	return new Response(null, {
		status: 303,
		headers: {
			Location: '/admin?m=loggedOut',
			'Set-Cookie': `_santaCred=0; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
		},
	})
}
