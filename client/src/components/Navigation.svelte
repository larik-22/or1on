<script lang="ts">

import BurgerBar from "./burgerBar/BurgerBar.svelte";
let actionT = $state("none")
import page from "page";
import type {BarItem} from "./burgerBar/BurgerBar.svelte";
import {isUserLoggedIn, isUserAdmin} from "../lib/stores/auth";
import UserManagement from "./moderatorDashboard/UserManagement.svelte";
import Homepage from "../pages/Homepage.svelte";
import UserIndicator from "./userDashboard/UserIndicator.svelte";
import ChangePassword from "./userDashboard/ChangePassword.svelte";
import ChangeUsername from "./userDashboard/ChangeUsername.svelte";
import LogOut from "./userDashboard/LogOut.svelte";


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
                            label: "User dashboard",
                            overrideClick: true,
                            overrideFunction: () => {
                                page.redirect("/user-dashboard")
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
                                        console.log("Hi")
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
                label : "Login / Sign up",
                overrideClick: true,
                overrideFunction: () => {
                    page.redirect("/login")
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