import page from 'page';
import type {Context} from "page";
import {get} from "svelte/store";
import {authToken} from "../stores/auth";

/**
 * Middleware to check if the user is logged in.
 * @param ctx
 * @param next
 */
const isLoggedIn = (ctx: Context, next: () => void) => {
	if (!get(authToken)) {
		page.redirect('/');
	} else {
		next();
	}
}

export default isLoggedIn;