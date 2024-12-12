import {isUserAdmin} from "../stores/auth";
import {type Context} from "page";
import { get } from 'svelte/store';
import page from "page";

/**
 * Middleware to check if the user is an admin.
 * Since we store the decoded boolean value in a store, we can simply check the value of the store.
 * @param ctx - The context object.
 * @param next - The next function to call.
 */
const isAdmin = (ctx: Context, next: () => void) => {
	if (get(isUserAdmin)) {
		next();
	} else {
		page.redirect('/');
	}
}

export default isAdmin;