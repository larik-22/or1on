
<script lang="ts">

import BurgerBar from "./burgerBar/BurgerBar.svelte";

import page from "page";
import type {BarItem} from "./burgerBar/BurgerBar.svelte";
import {isUserLoggedIn, isUserAdmin} from "../stores/auth";
import UserManagement from "./moderatorDashboard/UserManagement.svelte";
import Homepage from "../../pages/Homepage.svelte";
import UserIndicator from "./userDashboard/UserIndicator.svelte";
import ChangePassword from "./userDashboard/ChangePassword.svelte";
import ChangeUsername from "./userDashboard/ChangeUsername.svelte";
import LogOut from "./userDashboard/LogOut.svelte";
import ToursManage from "./moderatorDashboard/ToursManage.svelte";


let {
    currentRoute,
    currentPage = $bindable(Homepage)
} : {
    currentRoute: string;
    currentPage: any;
} = $props()

let CurrentLocation: string = $state("Home")
let AdditionalComponent: any = $state("")

let BarItems : BarItem[] = $state([
    {
        label : "Placeholder",
    }
]);

$effect(()=>{
    if ($isUserLoggedIn){
        switch (currentRoute) {
            case "/":
                if (!$isUserAdmin){
                    BarItems = [
                        {
                            label: "My highlights"
                        },
                        {
                            label: "My reviews"
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
                    ]
                    AdditionalComponent = UserIndicator
                    CurrentLocation = "Home"
                }else{
                    BarItems = [
                        {
                            label: "Moderator dashboard",
                            overrideClick: true,
                            overrideFunction: () => {
                                page.redirect("/moderator-dashboard")
                            }
                        },
                    ]
                    AdditionalComponent = UserIndicator
                    CurrentLocation = "Home"
                }

                break;

            case "/test":
                    BarItems = [

                        ]
                CurrentLocation = "Test Page PLS WORK MAN"
                break;
            case "/moderator-dashboard":
                if ($isUserAdmin){
                    BarItems = [
                        {
                            label : "Users",
                            subitems: [
                                {
                                    label : "Manage",
                                    action: () => {
                                        currentPage  = UserManagement
                                    }
                                }
                            ]
                        },
                        {
                            label : "Highlights",
                            subitems: [
                                {
                                    label : "Manage",
                                    action: () => {
                                        console.log("Hi")
                                    }
                                },
                                {
                                    label : "Suggestions",
                                    action: () => {
                                        console.log("Hi")
                                    }
                                },
                                {
                                    label : "Feedback",
                                    action: () => {
                                        console.log("Hi")
                                    }
                                }
                            ]
                        },
                        {
                            label : "Tours",
                            subitems: [
                                {
                                    label : "Manage",
                                    action: () => {
                                        currentPage = ToursManage
                                    }
                                }
                            ]
                        }
                    ]
                    CurrentLocation = "Moderator Dashboard"
                    AdditionalComponent = UserIndicator
                }
                else{
                    page.redirect("/")
                }

                break;

            case "/user-dashboard":
                if (!$isUserAdmin){
                    BarItems = [
                        {
                            label : "Change Password",
                            overrideClick: true,
                            overrideFunction: () => {
                                currentPage = ChangePassword
                            }
                        },
                        {
                            label : "Change Username",
                            overrideClick: true,
                            overrideFunction: () => {
                                currentPage = ChangeUsername
                            }
                        },
                        {
                            label : "Log Out",
                            overrideClick: true,
                            overrideFunction: () => {
                                currentPage = LogOut
                            }
                        }
                    ]
                    CurrentLocation = "User Dashboard"
                    AdditionalComponent = UserIndicator
                }
                else{
                    page.redirect("/")
                }

                break;

        }

    }
    else{
        BarItems = [
            {
                label : "Login",
                overrideClick: true,
                overrideFunction: () => {
                    page.redirect("/login")
                }

            },
            {
                label : "Sign Up",
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