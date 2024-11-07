import { urls } from '$lib/api.js';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
  default: async ({ fetch, request }) => {
    const formData = await request.formData();

    try {
      await fetch(urls.add, {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
      });
    } catch (err) {
      console.log(err);
      fail(400);
    }

    redirect(302, '/');
  },
};

export const csr = true;
