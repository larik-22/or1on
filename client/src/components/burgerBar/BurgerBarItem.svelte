<script lang="ts">
    let {
        BarItem = ["", []],
        sectionNumber,
        lastClicked
    }: {
        BarItem: [string, { label: string; action: (actionType: string) => void }[]];
        sectionNumber: number
        lastClicked: string
    } = $props();

    let hiddenSubElements: boolean = $state(true)
</script>

<main class="pt-[20px] flex flex-col items-center">
    <button
            type="button"
            class="h-fit w-[90%] rounded-[2px] text-[17px]  pt-[10px] pb-[10px] content-center
            hover:bg-[#f2f2f2] font-[500] active:bg-[#ececec] border-b-[1px] border-[#cacaca]"
           onclick={() => {
      hiddenSubElements = !hiddenSubElements;
    }}
    >
        <p class="text-center">{BarItem[0]}</p>
    </button>

    {#if hiddenSubElements === false}
        <div class="h-fit w-[100%]">
            <ul class="h-fit">
                {#each BarItem[1] as item, i}
                    <li class="content-center text-center pt-[8px]">
                        <button onclick={()=>{
                            item.action(item.label);

                            lastClicked = ""
                            lastClicked = "tab" + (i+1) + "" + sectionNumber;

                        }} class:bg-[#ececec]={lastClicked === "tab" + (i+1) + "" + sectionNumber} class="h-fit w-[65%] rounded-[2px] text-[18px] text-[#374151]  pt-[8px] pb-[8px] content-center
                        hover:bg-[#f2f2f2] active:bg-[#ececec] ">{item.label}</button>
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
</main>