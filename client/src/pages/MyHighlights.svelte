<script lang="ts">
    import { decodeToken, authToken } from "../lib/stores/auth";
    import MyHighlightWindow from "../lib/components/myHighlights/MyHighlightWindow.svelte";

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let currentUserId: string | null = null;
    //let myHighlights: any[] | undefined = $state(undefined);

    let myHighlights = [
        {
            name: "Gemeente Deventer",
            description: "Description for Gemeente Deventer.",
            category: "Architecture",
            latitude: 52.251891,
            longitude: 6.156158,
            is_approved: true,
            businessDescription: "Free entrance",
        },
        {
            name: "Deventer Koekhuisje",
            description: "Famous for its traditional spiced cakes.",
            category: "Cultural",
            latitude: 52.254564,
            longitude: 6.162345,
            is_approved: false,
            businessDescription: "Bakery and small museum.",
        },
        {
            name: "Toy Museum Deventer",
            description: "A fascinating museum for children and adults.",
            category: "Museum",
            latitude: 52.251432,
            longitude: 6.158765,
            is_approved: true,
            businessDescription: "Tickets: €80 for adults, €40 for kids.",
        },
        {
            name: "Gemeente Deewerventer",
            description: "Description for Gemeente Deventer.",
            category: "Architecture",
            latitude: 52.251891,
            longitude: 6.156158,
            is_approved: true,
            businessDescription: "Free entrance",
        },
        {
            name: "Deventer Kowrwrwerekhuisje",
            description: "Famous for its traditional spiced cakes.",
            category: "Cultural",
            latitude: 52.254564,
            longitude: 6.162345,
            is_approved: false,
            businessDescription: "Bakery and small museum.",
        },
        {
            name: "Toy Museum Dewwwrbbventer",
            description: "A fascinating museum for children and adults.",
            category: "Museum",
            latitude: 52.251432,
            longitude: 6.158765,
            is_approved: true,
            businessDescription: "Tickets: €8 for adults, €4 for kids.",
        },
        {
            name: "Gemeente nghfbcvxventer",
            description: "Description for Gemeente Deventer.",
            category: "Architecture",
            latitude: 52.251891,
            longitude: 6.156158,
            is_approved: true,
            businessDescription: "Free entrance",
        },
        {
            name: "Deventer Koekhcvbcvbuisje",
            description: "Famous for its traditional spiced cakes.",
            category: "Cultural",
            latitude: 52.254564,
            longitude: 6.162345,
            is_approved: false,
            businessDescription: "Bakery and small museum.",
        },
        {
            name: "Toy Museum Devzxcvxvxventer",
            description: "A fascinating museum for children and adults.",
            category: "Museum",
            latitude: 52.251432,
            longitude: 6.158765,
            is_approved: true,
            businessDescription: "Tickets: €8 for adults, €4 for kids.",
        },
    ];

    /**
     * Gets user ID from token ?
     */
    authToken.subscribe((token) => {
        if (token) {
            try {
                const payload = decodeToken(token);
                currentUserId = payload?.id || null;
            } catch {
                currentUserId = null;
            }
        } else {
            currentUserId = null;
        }
    });

    // Fetch user highlights
    //const fetchUserHighlights = async (userId: string): Promise<any[]> => {
    //    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/highlights/users/${userId}`);
    //    if (!response.ok) {
    //        throw new Error("Failed to fetch user highlights");
    //    }
    //   const data = await response.json();
    //    return data.highlights || [];
    //};

</script>

<!--
<div class="w-full h-screen flex justify-center items-center bg-gray-100">
    {#await fetchUserHighlights(currentUserId)}
        <p class="text-center text-gray-500">Loading your highlights...</p>
    {:then data}
        <MyHighlightWindow {data} />
    {:catch error}
        <p class="text-center text-red-500">Failed to load your highlights: {error.message}</p>
    {/await}
</div>-->

<div class="w-full h-screen flex justify-center items-center bg-gray-100">
    <MyHighlightWindow {myHighlights} />
</div>
