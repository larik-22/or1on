<script lang="ts">

import {enabled} from  "../../stores/popup"
import {get} from "svelte/store";

let {
	user = {username: "", role: "", id: "0"},
	disableButton = false
}:{
	user: {username: string, role: string, id: string}
	disableButton: boolean
} = $props()

</script>

<main>
<div class="w-[100%] h-[150px] border-[1px] grid grid-cols-4">
	<p class="text-[20px] flex justify-center items-center">{user.username}</p>
	<p class="text-[20px] flex justify-center items-center">{user.role}</p>
	<p class="text-[20px] flex justify-center items-center">{user.id}</p>
	{#if !disableButton}
		<button onclick="{()=>{
			enabled.set(true);
			console.log(get(enabled))
		}}" class="rounded-[5px] shadow-md w-fit h-fit flex justify-self-center self-center
		p-[7px] bg-red-500 text-white text-[18px]">Lock Account</button>
	{/if}

	<!--<a class="flex justify-center items-center">a</a>-->
	<!--<a class="flex justify-center items-center">a</a>-->


</div>
</main>