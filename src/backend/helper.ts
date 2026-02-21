import { error } from '@sveltejs/kit'

export function formDataText(formData: FormData, name: string): string | undefined {
	const value = formData.get(name)
	if (!value) return
	if (value instanceof File) error(400, 'Unexpected file upload')
	return value.replaceAll('\r\n', '\n')
}
