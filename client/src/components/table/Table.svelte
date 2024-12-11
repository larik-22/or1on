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
    <div class="bg-gray-50 shadow-md rounded overflow-x-scroll max-w-[65vw] overflow-y-scroll max-h-[70vh]">
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
                        <td class="border px-[2vw] py-2 ">{rowElement}</td>
                    {/each}

                    {#if actionsSlot && actionConfigs !== undefined}
                        <td class="border px-[1.5vw] py-[1vh] flex gap-[20px] justify-center">
                            {#each actionConfigs as actionConfig, i}
                                {#if row.actionsVisibility[i]}
                                    <Action actionConfig={actionConfig} row={row}></Action>
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