<script lang="ts" module>
    export type BarItem = {
        label: string,
        subitems?: BarSubItem[]
        overrideClick?: boolean
        overrideFunction?: ()=> void
    }

    type BarSubItem = {
        label: string,
        action: () => void
    }
</script>
<script lang="ts">
    import BurgerBarItem from "./BurgerBarItem.svelte";
    import page from "page";
    import type {SvelteComponent} from "svelte";
    let {
        BarItems = [],
        Location = "",
        Width = "15vw",
        MinWidth = "320px",
        AdditionalComponent,
    }: {
        BarItems: BarItem[],
        Location: string
        Width?: string
        MinWidth?: string
        AdditionalComponent?: typeof SvelteComponent
    } = $props();

    let lastClicked: string = $state("0");

    let homeButton: BarItem = {
        label: "Home",
        overrideClick: true,
        overrideFunction: () => {
            page.redirect("/")
        }
    }
</script>


<main>
    <div class="h-lvh min-w-[{MinWidth}]  w-[{Width}] bg-gray-50 shadow-md border-r-[1px] border-solid border-gray-300 overflow-hidden">
        <AdditionalComponent/>
        <div class="w-[100%] h-fit pt-[15px] pb-[15px] shadow-md bg-[#f9fafb] text-center content-center ">{Location}</div>
        <ul class="pt-[100px]">
            {#each BarItems as item, i}
                <li>
                    <BurgerBarItem Item={item} sectionNumber={(i+1)} bind:lastClicked={lastClicked}></BurgerBarItem>
                </li>
            {/each}

        </ul>
        <BurgerBarItem Item={homeButton} paddingTop="pt-[10vh]"/>
    </div>
</main>
