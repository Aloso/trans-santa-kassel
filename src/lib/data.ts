export interface Registration {
	id: string
	created: number
	name: string
	phone: string
	address: string
	age: number
	moreInfo?: string
	verified: boolean
	notes?: string
}

export interface DbRegistration {
	id: string
	created: number
	name: string
	phone: string
	address: string
	age: number
	moreInfo: string | null
	verified: number
	notes: string | null
}

export function registrationFromDb(r: DbRegistration): Registration {
	return {
		id: r.id,
		created: r.created,
		name: r.name,
		phone: r.phone,
		address: r.address,
		age: r.age,
		moreInfo: r.moreInfo ?? undefined,
		verified: r.verified === 1,
		notes: r.notes ?? undefined,
	}
}
