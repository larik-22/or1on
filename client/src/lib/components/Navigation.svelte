<script lang="ts">

    import BurgerBar from "./burgerBar/BurgerBar.svelte";

    import page from "page";
    import type {BarItem} from "./burgerBar/BurgerBar.svelte";
    import {isUserLoggedIn, isUserAdmin} from "../stores/auth";
    import Homepage from "../../pages/Homepage.svelte";
    import UserIndicator from "./userDashboard/UserIndicator.svelte";

	let {
		currentRoute,
		currentPage = $bindable(Homepage),
		FullWidth = $bindable()
    }: {
		currentRoute: string;
		currentPage: any;
		FullWidth: boolean;
	} = $props();

    let CurrentLocation: string = $state("Home");
    let AdditionalComponent: any = $state("");

    let BarItems: BarItem[] = $state([
        {
            label: "Placeholder",
        }
    ]);


    let UserBarItems: BarItem[] = $state([
        {
            label: "Tours",
            overrideClick: true,
            overrideFunction: () => {
                page.redirect("/tours");
            }
        },
        {
            label: "My highlights",
            overrideClick: true,
            overrideFunction: () => {
                page.redirect("/my-highlights");
            }
        },
        {
            label: "My reviews"
        },
        {
            label: "My feedbacks",
            overrideClick: true,
            overrideFunction: () => {
                page.redirect("/feedbacks");
            }
        },
        {
            label: "Suggest highlight",
            overrideClick: true,
            overrideFunction: () => {
                page.redirect("/suggest-highlight");
            }
        },
        {
            label: "User dashboard",
            overrideClick: true,
            overrideFunction: () => {
                page.redirect("/logout")
            }
        }
    ]);
    let AdminBarItems: BarItem[] = $state([
        {
            label: "Moderator dashboard",
            overrideClick: true,
            overrideFunction: () => {
                page.redirect("/user-management")
            }
        },
    ]);
    let AdminDashboardBarItems: BarItem[] = $state([
        {
            label: "Users",
            subitems: [
                {
                    label: "Manage",
                    action: () => {
                        page.redirect("/user-management");
                    }
                }
            ]
        },
        {
            label: "Highlights",
            subitems: [
                {
                    label: "Manage",
                    action: () => {
                        page.redirect("/manage-highlights")
                    }
                },
                {
                    label: "Suggestions",
                    action: () => {
                        page.redirect("/manage-suggestions")
                    }
                },
                {
                    label: "Feedback",
                    action: () => {
                        page.redirect("/feedbacks-management");
                    }
                }
            ]
        },
        {
            label: "Tours",
            subitems: [
                {
                    label: "Manage",
                    action: () => {
                        page.redirect("/manage-tours")
                    }
                }
            ]
        }
    ]);
    let UserDashboardBarItems: BarItem[] = $state([
        {
            label: "Change Password",
            overrideClick: true,
            overrideFunction: () => {
                page.redirect("change-password");
            }
        },
        {
            label: "Change Username",
            overrideClick: true,
            overrideFunction: () => {
                page.redirect("change-username");
            }
        },
        {
            label: "Log Out",
            overrideClick: true,
            overrideFunction: () => {
                page.redirect("logout");
            }
        }
    ]);

    $effect(() => {
        if ($isUserLoggedIn) {

            switch (true) {
                case currentRoute === "/":
                    if ($isUserAdmin) {
                        BarItems = AdminBarItems;
                        AdditionalComponent = UserIndicator;
                        CurrentLocation = "Home";
                    } else {
                        BarItems = UserBarItems;
                        AdditionalComponent = UserIndicator;
                        CurrentLocation = "Home";
                    }
                    break;

                case currentRoute === "/test":
                    BarItems = [];
                    CurrentLocation = "Test Page PLS WORK MAN";
                    break;

                case currentRoute === "/moderator-dashboard":
                    BarItems = AdminDashboardBarItems;
                    CurrentLocation = "Moderator Dashboard";
                    AdditionalComponent = UserIndicator;
                    break;
                case currentRoute === "/my-highlights":
                    if ($isUserAdmin) {
                        page.redirect("/");
                    } else {
                        BarItems = UserBarItems;
                        CurrentLocation = "My highlights";
                        AdditionalComponent = UserIndicator;
                    }
                    break;
                case currentRoute === "/user-dashboard":
                    if ($isUserAdmin) {
                        page.redirect("/");
                    } else {
                        BarItems = UserDashboardBarItems;
                        CurrentLocation = "User Dashboard";
                        AdditionalComponent = UserIndicator;
                    }
                    break;

                case currentRoute === "/user-management":
                    CurrentLocation = "User Management";
                    BarItems = AdminDashboardBarItems;
                    AdditionalComponent = UserIndicator;
                    break;

                case currentRoute === "/feedbacks":
                    if ($isUserAdmin) {
                        page.redirect("/");
                    } else {
                        CurrentLocation = "My Feedbacks";
                        BarItems = UserBarItems;
                        AdditionalComponent = UserIndicator;
                    }
                    break;

                case currentRoute === "/suggest-highlight":
                    if ($isUserAdmin) {
                        page.redirect("/");
                    } else {
                        CurrentLocation = "Suggest Highlight";
                        BarItems = UserBarItems;
                        AdditionalComponent = UserIndicator;
                    }
                    break;
                case  currentRoute === "/tours" || /^\/tours\/\d+$/.test(currentRoute):   // regex.test(currentRouter)
                    if ($isUserAdmin) {
                        page.redirect("/");
                    } else {
                        BarItems = UserBarItems;
                        CurrentLocation = "Tours";
                        AdditionalComponent = UserIndicator;
                    }
                    break;
                case currentRoute === "/change-username":
                    if ($isUserAdmin) {
                        page.redirect("/");
                    } else {
                        BarItems = UserDashboardBarItems;
                        CurrentLocation = "User Dashboard";
                        AdditionalComponent = UserIndicator;
                    }
                    break;
                case currentRoute === "/change-password":
                    if ($isUserAdmin) {
                        page.redirect("/");
                    } else {
                        BarItems = UserDashboardBarItems;
                        CurrentLocation = "User Dashboard";
                        AdditionalComponent = UserIndicator;
                    }
                    break;
                case currentRoute === "/logout":
                    if ($isUserAdmin) {
                        page.redirect("/");
                    } else {
                        BarItems = UserDashboardBarItems;
                        CurrentLocation = "User Dashboard";
                        AdditionalComponent = UserIndicator;
                    }
                    break;
                case currentRoute === "/feedbacks-management":
                    BarItems = AdminDashboardBarItems;
                    CurrentLocation = "Feedbacks Management";
                    AdditionalComponent = UserIndicator;
                    break;

                case currentRoute === "/manage-suggestions":
                    BarItems = AdminDashboardBarItems;
                    CurrentLocation = "Manage Suggestions";
                    AdditionalComponent = UserIndicator;
                    break;
                case currentRoute === "/manage-highlights":
                    BarItems = AdminDashboardBarItems;
                    CurrentLocation = "Manage Highlights";
                    AdditionalComponent = UserIndicator;
                    break;
            }
        } else {
            BarItems = [
                {
                    label: "Login",
                    overrideClick: true,
                    overrideFunction: () => {
                        page.redirect("/login");
                    }

                },
                {
                    label: "Sign Up",
                    overrideClick: true,
                    overrideFunction: () => {
                        page.redirect("/register");
                    }

                }
            ];
        }
    });
</script>

<main class="h-fit w-fit">
    {#key currentPage}
        <BurgerBar Location={CurrentLocation} FullWidth={FullWidth} BarItems={BarItems}
                   AdditionalComponent={AdditionalComponent}/>
    {/key}
</main>