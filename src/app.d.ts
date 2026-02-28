import type { D1Database, IncomingRequestCfProperties } from '@cloudflare/workers-types'

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	var onloadTurnstileCallback: () => void
	var turnstile: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		render: (id: string, options: any) => void
	}

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}

		type EnvVars = Record<`ADMIN__${string}`, string> & {
			DB: D1Database

			ADMIN_RECIPIENTS: string
			SMTP_USERNAME: string
			SMTP_PASSWORD: string
			SMTP_HOST: string

			TURNSTILE_SECRET_KEY: string
		}

		interface Platform {
			env: EnvVars
			context: {
				waitUntil(promise: Promise<unknown>): void
			}
			caches: CacheStorage & { default: Cache }
			cf?: IncomingRequestCfProperties
		}
	}
}

export {}
