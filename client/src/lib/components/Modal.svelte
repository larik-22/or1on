<script lang="ts" module>
    export type ModalType = {
        title: string,
        sections: ModalSection[];
        confirmFunction: () => void;
    }
    export type ModalSection = {
        sectionTitle: string,
        sectionType: string,
        maxValue?: number,
        minValue?: number
        getValue : () => any,
        setValue : (value: any) => void,
    }
</script>

<script lang="ts">

    let {
        modal = $bindable(),
        enableEditModal = $bindable(),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        customCss = "",
    }: {
        modal: ModalType;
        enableEditModal: boolean,
        customCss?: string
    } = $props()

</script>

<main>
    {#if modal !== undefined}
        <div class="absolute top-[50%] left-[50%] -translate-y-[80%]">
            <div class="bg-white p-6 rounded shadow-md">
                <h2 class="text-lg font-semibold mb-4">{modal.title}</h2>
                {#each modal.sections as section}
                    <div class="mb-4">
                        <label class="block mb-2 font-medium">
                            {section.sectionTitle}
                        {#if section.sectionType === "basic"}
                            <input type="text" value={section.getValue()} oninput={(e) => {
                                if (e != null && e.target != null) {
                                    section.setValue(e.target.value);
                                }
                            }} class="w-full border px-2 py-1 rounded"/>
                        {:else if section.sectionType === "descriptive"}
                            <textarea value={section.getValue()} oninput={(e) => {
                                if (e != null && e.target != null) {
                                    section.setValue(e.target.value);
                                }
                            }} class="w-full border px-2 py-1 rounded"></textarea>
                        {:else if section.sectionType === "number" && section.maxValue !== undefined && section.minValue !== undefined}
                            <input type="number" bind:value={section.value} oninput={(e) => {
                                if (e != null && e.target != null) {
                                    section.setValue(e.target.value);
                                }
                            }} max="{section.maxValue}"
                                   min="{section.minValue}" class="w-full border px-2 py-1 rounded">
                        {/if}
                        </label>
                    </div>
                {/each}
                <div class="flex justify-end gap-4">
                    <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            onclick={() => (enableEditModal = false)}>
                        Cancel
                    </button>
                    <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            onclick={() => {
                                enableEditModal = false;
                                modal.confirmFunction();
                            }}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    {/if}
</main>


<style>
    main {
        background-color: #f8f9fa;
        display: flex;
        align-items: center;
        justify-content: center;
    }


</style>