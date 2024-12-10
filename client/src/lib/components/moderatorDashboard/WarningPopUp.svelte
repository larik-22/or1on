<script lang="ts">

    let {
        popupText = "Placeholder",
        enabled_popup = $bindable(false),
        onConfirmFunction,
    }: {
        popupText: string
        enabled_popup: boolean
        onConfirmFunction: (value?: any) => void
    } = $props();

</script>

{#if enabled_popup}
    <main class="bg-[#00000033] h-[100%] w-[100%] absolute left-[0]">

        <div class="h-[400px] w-[700px] bg-white shadow-md rounded-[5px] absolute left-[40vw] right-[0vw] top-[30vh] grid">
            <!--Close button-->
            <button onclick="{()=>{
					enabled_popup = false;
			}}" class="text-[40px] absolute right-[0] pr-[30px]">x
            </button>

            <!--Warning text-->
            <div class="flex h-[100%] w-[100%] justify-center items-center">
                <p class="h-fit w-fit">{popupText}</p>
            </div>

            <!--Yes and No buttons-->
            <div class="flex justify-center items-end gap-[80px] pb-[30px]">


                <div class="h-[60px] w-[200px] bg-blue-500 text-center content-center text-[25px] rounded-[4px]">
                    <button class="w-[100%] h-[100%]" onclick={()=>{
                        onConfirmFunction();
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
