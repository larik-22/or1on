<script lang="ts">

    import BurgerBar from "./burgerBar/BurgerBar.svelte";

    let actionT = $state("none")
    import page from "page";
    import type {BarItem} from "./burgerBar/BurgerBar.svelte";
    import {isUserLoggedIn, isUserAdmin} from "../stores/auth";
    import UserManagement from "./moderatorDashboard/UserManagement.svelte";
    import Homepage from "../../pages/Homepage.svelte";
    import UserIndicator from "./userDashboard/UserIndicator.svelte";
    import ChangePassword from "./userDashboard/ChangePassword.svelte";
    import ChangeUsername from "./userDashboard/ChangeUsername.svelte";
    import LogOut from "./userDashboard/LogOut.svelte";

    let {
        currentRoute,
        currentPage = $bindable(Homepage)
    }: {
        currentRoute: string;
        currentPage: any;
    } = $props()

    let CurrentLocation: string = $state("Home")
    let AdditionalComponent: any = $state("")

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
                page.redirect("/tours")
            }
        },
        {
            label: "My highlights"
        },
        {
            label: "My reviews"
        },
        {
            label: "My feedbacks",
            overrideClick: true,
            overrideFunction: () => {
                page.redirect("/feedbacks")
            }
        },
        {
            label: "Suggest highlight",
            overrideClick: true,
            overrideFunction: () => {
                page.redirect("/suggest-highlight")
            }
        },
        {
            label: "User dashboard",
            overrideClick: true,
            overrideFunction: () => {
                page.redirect("/user-dashboard")
            }
        },
        {
            label: "Test Path",
            overrideClick: true,
            overrideFunction: () => {
                page.redirect("/test")
            }
        },
    ])
    let AdminBarItems: BarItem[] = $state([
        {
            label: "Moderator dashboard",
            overrideClick: true,
            overrideFunction: () => {
                page.redirect("/moderator-dashboard")
            }
        },
    ])

    let AdminDashboardBarItems: BarItem[] = $state([
        {
            label: "Users",
            subitems: [
                {
                    label: "Manage",
                    action: () => {
                        page.redirect("/user-management")
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
                        console.log("Hi")
                    }
                },
                {
                    label: "Suggestions",
                    action: () => {
                        console.log("Hi")
                    }
                },
                {
                    label: "Feedback",
                    action: () => {
                        page.redirect("/feedbacks-management")
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
                        console.log("Hi")
                    }
                }
            ]
        }
    ])
    let UserDashboardBarItems: BarItem[] = $state([
        {
            label: "Change Password",
            overrideClick: true,
            overrideFunction: () => {
                page.redirect("change-password")
            }
        },
        {
            label: "Change Username",
            overrideClick: true,
            overrideFunction: () => {
                page.redirect("change-username")
            }
        },
        {
            label: "Log Out",
            overrideClick: true,
            overrideFunction: () => {
                page.redirect("logout")
            }
        }
    ])


    $effect(() => {
        if ($isUserLoggedIn) {
            switch (currentRoute) {
                case "/":
                    if ($isUserAdmin) {
                        BarItems = AdminBarItems;
                        AdditionalComponent = UserIndicator
                        CurrentLocation = "Home"
                    } else {
                        BarItems = UserBarItems;
                        AdditionalComponent = UserIndicator
                        CurrentLocation = "Home"
                    }
                    break;

                case "/test":
                    BarItems = []
                    CurrentLocation = "Test Page PLS WORK MAN"
                    break;

                case "/moderator-dashboard":
                    BarItems = AdminDashboardBarItems;
                    CurrentLocation = "Moderator Dashboard"
                    AdditionalComponent = UserIndicator
                    break;

                case "/user-dashboard":
                    if ($isUserAdmin) {
                        page.redirect("/")
                    } else {
                        BarItems = UserDashboardBarItems;
                        CurrentLocation = "User Dashboard"
                        AdditionalComponent = UserIndicator
                    }
                    break;

                case "/user-management":
                    CurrentLocation = "User Management"
                    BarItems = AdminDashboardBarItems;
                    AdditionalComponent = UserIndicator
                    break;

                case "/feedbacks":
                    if ($isUserAdmin) {
                        page.redirect("/")
                    } else {
                        CurrentLocation = "My Feedbacks"
                        BarItems = UserBarItems;
                        AdditionalComponent = UserIndicator
                    }
                    break;

                case "/suggest-highlight":
                    if ($isUserAdmin) {
                        page.redirect("/")
                    } else {
                        CurrentLocation = "Suggest Highlight"
                        BarItems = UserBarItems;
                        AdditionalComponent = UserIndicator
                    }
                    break;

                case "/change-username":
                    if ($isUserAdmin) {
                        page.redirect("/")
                    } else {
                        BarItems = UserDashboardBarItems;
                        CurrentLocation = "User Dashboard"
                        AdditionalComponent = UserIndicator
                    }
                    break;
                case "/change-password":
                    if ($isUserAdmin) {
                        page.redirect("/")
                    } else {
                        BarItems = UserDashboardBarItems;
                        CurrentLocation = "User Dashboard"
                        AdditionalComponent = UserIndicator
                    }
                    break;
                case "/logout":
                    if ($isUserAdmin) {
                        page.redirect("/")
                    } else {
                        BarItems = UserDashboardBarItems;
                        CurrentLocation = "User Dashboard"
                        AdditionalComponent = UserIndicator
                    }
                    break;
                case "/feedbacks-management":
                    BarItems = AdminDashboardBarItems;
                    CurrentLocation = "Feedbacks Management"
                    AdditionalComponent = UserIndicator
                    break;
            }
        } else {
            BarItems = [
                {
                    label: "Login",
                    overrideClick: true,
                    overrideFunction: () => {
                        page.redirect("/login")
                    }

                },
                {
                    label: "Sign Up",
                    overrideClick: true,
                    overrideFunction: () => {
                        page.redirect("/register")
                    }

                }
            ]
        }
    })
</script>

<main class="h-fit w-fit">
    {#key currentPage}
        <BurgerBar Location={CurrentLocation} BarItems={BarItems} AdditionalComponent={AdditionalComponent}/>
    {/key}
</main>