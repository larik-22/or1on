import page from 'page';
import type {Context} from "page";
import {get} from "svelte/store";
import {authToken} from "../stores/auth";

/**
 * Checks if the user is not logged in by inspecting the auth token.
 * @param ctx
 * @param next
 */
const isNotLoggedIn = (ctx: Context, next: () => void) => {
	if (!get(authToken)) {
		next();
	} else {
		page.redirect('/');
	}
}

export default isNotLoggedIn;