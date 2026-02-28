import type { D1Database, IncomingRequestCfProperties } from '@cloudflare/workers-types'

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
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
