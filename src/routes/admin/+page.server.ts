import { error, redirect } from '@sveltejs/kit'
import { tryAuthentication } from '../../backend/auth'
import { registrationFromDb, type DbRegistration, type Registration } from '$lib/data.js'

export interface AdminSantaData {
	registrations: Registration[]
}

export async function load({ platform, request }): Promise<AdminSantaData> {
	if (!platform) error(500, 'Platform not available')

	if (!tryAuthentication(request, platform.env)) {
		redirect(303, new URL('/admin/loginForm', request.url))
	}

	const registrations = await platform.env.DB.prepare(
		'SELECT * FROM secret_santa ORDER BY created DESC',
	).all<DbRegistration>()

	return {
		registrations: registrations.results.map(registrationFromDb),
	}
}
