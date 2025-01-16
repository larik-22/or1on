<script lang="ts" module>
    export type TableType = {
        columns: string[]
        rows: Row[]
    }
    export type Row = {
        row: string[],
        actionsVisibility: boolean[],
    }

</script>

<script lang="ts">
    import Action, {type ActionConfig} from "./Action.svelte";

    let {
        newTable,
        actionsSlot = true,
        actionConfigs,
    }: {
        newTable: TableType
        actionsSlot?: boolean;
        actionConfigs: ActionConfig[];
    } = $props();
</script>

<main class="w-full">
    <div class="bg-gray-50 shadow-md max-h-[70vh] w-full rounded overflow-x-scroll overflow-y-scroll">
        <table class="table-auto w-full text-left border-collapse">
            <!-- Column Headers -->
            <thead>
            <tr>
                {#each newTable.columns as column}
                    <th class="border px-4 py-2 bg-gray-200 font-bold">{column}</th>
                {/each}

                {#if actionsSlot}
                    <th class="border px-4 py-2 bg-gray-200 font-bold">Actions</th>
                {/if}
            </tr>
            </thead>

            <!-- Rows -->
            <tbody>
            {#each newTable.rows as row}
                <tr>
                    {#each row.row as rowElement}
                        <td class="border px-[2vw] py-2 text-ellipsis overflow-hidden max-w-[200px]">{rowElement}</td>
                    {/each}

                    {#if actionsSlot && actionConfigs !== undefined}
                        <td class="border py-2 flex gap-[20px] justify-center w-full h-full px-[20px]">
                            {#each actionConfigs as actionConfig, i}
                                {#if row.actionsVisibility[i]}
                                    <Action actionConfig={actionConfig} row={row}></Action>
                                {:else}
                                    <div class="py-3"></div>
                                {/if}
                            {/each}
                        </td>
                    {/if}
                </tr>
            {/each}
            </tbody>
        </table>
    </div>
</main>