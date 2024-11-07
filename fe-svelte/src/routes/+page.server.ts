import { redirect } from '@sveltejs/kit';

import { urls } from '$lib/api.js';

export const actions = {
  delete: async ({ request, fetch }) => {
    const formData = await request.formData();
    const ids = formData.getAll('id').map((v) => Number(v));
    await fetch(urls.delete, {
      method: 'POST',
      body: JSON.stringify(ids),
    });
    redirect(302, '/');
  },
};
