<script lang="ts" module>
    export type ActionConfig = {
        actionName: string;
        actionIconPath?: string;
        actionFunction: (value?: any) => void;
        actionClassStyle?: string;

    }

</script>

<script lang="ts">

    let {
        actionConfig,
        row,
    }: {
        actionConfig: ActionConfig;
        row: any
    } = $props();

</script>


<main>

    <div>
        <button class="{actionConfig.actionClassStyle}" onclick={()=>{
            actionConfig.actionFunction(row)
        }}>{actionConfig.actionName}</button>
    </div>

</main>