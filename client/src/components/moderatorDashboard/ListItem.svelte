<script lang="ts">

let {
	user = {username: "", role: "", id: "0"},
	disableButton = false,
	enabled_popup = $bindable(false),
}:{
	user: {username: string, role: string, id: string}
	disableButton: boolean
	enabled_popup: boolean
} = $props()

</script>

<main>
<div class="w-[100%] h-[150px] border-[1px] grid grid-cols-4">
	<p class="text-[20px] flex justify-center items-center">{user.username}</p>
	<p class="text-[20px] flex justify-center items-center">{user.role}</p>
	<p class="text-[20px] flex justify-center items-center">{user.id}</p>
	{#if !disableButton}
		<button onclick="{()=>{
			enabled_popup = true;
		}}" class="rounded-[5px] shadow-md w-fit h-fit flex justify-self-center self-center
		p-[7px] bg-red-500 text-white text-[18px]">Lock Account</button>
	{/if}

</div>
</main>