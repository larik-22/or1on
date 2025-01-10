<script lang="ts">
    let {
        enabled_popup = $bindable(false),
        commentValue = $bindable(),
        onConfirmEdit,
    }: {
        enabled_popup: boolean
        commentValue: string
        onConfirmEdit: (newText: string) => void
    } = $props();

</script>

{#if enabled_popup}
    <main class="bg-[#00000033] h-[100%] w-[100%] absolute left-[0]">

        <div class="overflow-y-scroll min-w-fit min-h-fit  bg-white shadow-md rounded-[5px] absolute left-[50%] right-[50%] top-[40vh] grid translate-x-[-50%] translate-y-[-50%]">
            <!--Close button-->
            <button onclick="{()=>{
					enabled_popup = false;
			}}" class="text-[40px] h-fit pl-[85%]">x
            </button>

            <!--Editing text area-->
            <div class="flex h-[100%] w-[100%] justify-center items-center min-h-[15vh] pb-[1vh] px-[1vw]">
                <textarea bind:value={commentValue} class="border-[3px] w-[100%] min-h-[100%]">{commentValue}</textarea>
            </div>

            <!--Yes and No buttons-->
            <div class="flex justify-center items-end gap-[80px] pb-[30px]  px-[5vw]">


                <div class="h-[60px] w-[200px] bg-blue-500 text-center content-center  text-[25px] rounded-[4px]">
                    <button class="w-[100%] h-[100%]" onclick={()=>{
                        onConfirmEdit(commentValue)
                        enabled_popup = false
                    }}>Yes
                    </button>
                </div>

                <div class="h-[60px] w-[200px] bg-red-500 text-center content-center text-[25px] rounded-[4px]">
                    <button class="w-[100%] h-[100%]" onclick="{()=>{
					enabled_popup = false;
				}}">No
                    </button>
                </div>


            </div>
        </div>

    </main>
{/if}
