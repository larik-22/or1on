<script lang="ts">

    import {authToken, decodeToken} from "../../stores/auth";

    let username : string = $state(getUsername());

    function getUsername(): string {
        let name: string | undefined = decodeToken($authToken)?.username
        return name == null ? "username" : name
    }
</script>

<main>
    <div class="bg-gray-200 border-r border-gray-300 min-w-[320px] w-[15vw]">
        <div class="text-center mb-6 ">
            <div class="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-gray-300 flex items-center justify-center bg-gray-400 text-white text-xl">
                {username.charAt(0)}
            </div>
            <h3 class="text-xl font-semibold text-gray-800">Hello, {username}</h3>
        </div>
    </div>
</main>