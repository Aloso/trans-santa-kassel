type Env = App.Platform['env']

interface Credentials {
	user: string
	password: string
}

export function tryAuthentication(request: Request, env: Env): boolean {
	const credentials = getCredentials(request)
	if (!credentials) return false
	return verifyCredentials(env, credentials)
}

export function getCredentials(request: Request): Credentials | undefined {
	const auth = request.headers.get('Authorization') ?? getCookie(request.headers.get('Cookie'))
	const match = auth?.match(/^(?<user>[^@]*?)@(?<password>.*)$/)
	if (!match) {
		return
	}

	const { user, password } = match.groups!
	return { user, password }
}

export function verifyCredentials(env: Env, { user, password }: Credentials): boolean {
	const variable = `ADMIN__${user}` as const
	return variable in env && env[variable] === password
}

function getCookie(cookieString: string | null): string | undefined {
	if (!cookieString) return

	const match = cookieString.match(/_santaCred=(.*?)(?:;|$)/)?.[1]
	if (!match) return

	try {
		return atob(match)
	} catch {
		return
	}
}
