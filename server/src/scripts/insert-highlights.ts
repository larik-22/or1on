import { MikroORM } from '@mikro-orm/core';
import mikroConfig from '../../mikro-orm.config.js';
import {User} from "../models/user.js";
import {createHighlightWithUser} from "../controllers/highlightController.js";

(async () => {
    const orm = await MikroORM.init(mikroConfig);
    const em = orm.em.fork();

    const descriptions = [
        "Free entrance",
        "Free drinks",
        "Free entry",
        "Open daily",
        "Closed on weekends",
        "Guided tours available",
        "Family-friendly",
        "Pet-friendly",
        "Wheelchair accessible",
        "Reservations required",
    ];

    const user1 = await em.getRepository(User).findOne({username: 'dummyUser1'});
    const user2 = await em.getRepository(User).findOne({username: 'dummyUser2'});
    const user3 = await em.getRepository(User).findOne({username: 'dummyUser3'});
    const user9 = await em.getRepository(User).findOne({username: 'dummyUser9'});

    const highlights = [
        {
            name: "Saxion",
            description: "Description for Saxion",
            category: "Education",
            latitude: 52.25395899363234,
            longitude: 6.168077222882274,
            is_approved: true,
            businessDescription: null,
            user: user9
        },
        {
            name: "Train Station",
            description: "Description for Train Station",
            category: "Architecture",
            latitude: 52.257260692798816,
            longitude: 6.160759143013088,
            is_approved: false,
            businessDescription: null,
            user: user9
        },
        {
            name: "Gemeente Deventer",
            description: "Description for Gemeente",
            category: "Architecture",
            latitude: 52.251890934161125,
            longitude: 6.156158081679511,
            is_approved: true,
            businessDescription: null,
            user: user2
        },
        /*
		* 52., 6.
		* old :
		*   latitude: 52.256801,
			longitude: 6.161126,*/
        {
            name: "Deventer Schouwburg",
            description: "Description for Deventer Schouwburg",
            category: "Entertainment",
            latitude: 52.25578355247537,
            longitude: 6.161575568185643,
            is_approved: true,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user3
            /*
			* old:
			* latitude: 52.2555,
			longitude: 6.1635,
			*/
        },
        {
            name: "Bergkerk",
            description: "Description for Bergkerk",
            category: "Architecture",
            latitude: 52.252305375211606,
            longitude: 6.163154492373404,
            is_approved: true,
            businessDescription: null,
            user: user1
            /*
			* old:
			* latitude: 52.2542,
			longitude: 6.1628,
			*/
        },
        {
            name: "De Waag",
            description: "Description for De Waag",
            category: "Historical",
            latitude: 52.251619030495384,
            longitude: 6.159927081679525,
            is_approved: true,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
            /*
			 * old:
			 * latitude: 52.2550,
			 * longitude: 6.1630,
			 * */
        },
        {
            name: "Speelgoedmuseum Deventer",
            description: "Description for Speelgoedmuseum Deventer",
            category: "Museum",
            latitude: 52.25117910093484,
            longitude: 6.15975603139713,
            is_approved: true,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "Rijsterborgherpark",
            description: "Description for Rijsterborgherpark",
            category: "Nature",
            latitude: 52.25793634903742,
            longitude: 6.1528628565387935,
            is_approved: true,
            businessDescription: null,
            user: user1
        },
        {
            name: "Lebuinuskerk",
            description: "Description for Lebuinuskerk",
            category: "Architecture",
            latitude: 52.255905,
            longitude: 6.1614,
            is_approved: false,
            businessDescription: null,
            user: user1
        },
        {
            name: "Topicus Deventer",
            description: "Description for Topicus",
            category: "IT Company",
            latitude: 52.255888165742576,
            longitude: 6.1601082383985775,
            is_approved: true,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "The Irish Elk",
            description: "Irish pub",
            category: "Pub",
            latitude: 52.25210734031344,
            longitude: 6.160778624008953,
            is_approved: true,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "De Brink Square",
            description:
                "A historic market square surrounded by medieval buildings.",
            category: "Historical",
            latitude: 52.251,
            longitude: 6.16,
            is_approved: true,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "Jordenshof",
            description: "Description for Jordenshof.",
            category: "Historical",
            latitude: 52.25272798380772,
            longitude: 6.157872455371526,
            is_approved: true,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "Etty Hillesum Centrum",
            description:
                "A museum and cultural center dedicated to the life of Etty Hillesum.",
            category: "Museum",
            latitude: 52.25269438951543,
            longitude: 6.161689875286357,
            is_approved: true,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "De Proosdij",
            description:
                "The oldest stone house in the Netherlands, dating back to around 1130.",
            category: "Historical",
            latitude: 52.252901548019956,
            longitude: 6.155591554477714,
            is_approved: false,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "Stadsarchief en Athenaeumbibliotheek",
            description:
                "The oldest scientific library in the Netherlands, founded in 1560.",
            category: "Education",
            latitude: 52.25330150652446,
            longitude: 6.152684713653483,
            is_approved: false,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "ICT Netherlands",
            description: "A center for technological innovation.",
            category: "IT Company",
            latitude: 52.24285804325164,
            longitude: 6.171884222817136,
            is_approved: true,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "Nieuwe Plantsoen",
            description: "A green park area ideal for walks and relaxation.",
            category: "Nature",
            latitude: 52.26665930160365,
            longitude: 6.150674392136583,
            is_approved: true,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "Bergkwartier",
            description:
                "A historic district with medieval streets and architecture.",
            category: "Historical",
            latitude: 52.25236197758664,
            longitude: 6.16287716574532,
            is_approved: true,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "St. Nicholas Church",
            description:
                "A Gothic church with a rich history, now serving as a bookstore.",
            category: "Historical",
            latitude: 52.25206313126121,
            longitude: 6.163188301996035,
            is_approved: true,
            businessDescription: null,
            user: user1
        },
        {
            name: "De Adelaarshorst Stadium",
            description: "Home stadium of the Go Ahead Eagles football club.",
            category: "Entertainment",
            latitude: 52.26003156278169,
            longitude: 6.172683386061763,
            is_approved: false,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "Bierencafé de Heks",
            description: "A popular pub known for its wide selection of beers.",
            category: "Pub",
            latitude: 52.25102235610859,
            longitude: 6.159399697699012,
            is_approved: true,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "Worpplantsoen Park",
            description:
                "The oldest public park in the Netherlands, offering scenic views.",
            category: "Nature",
            latitude: 52.24960455814152,
            longitude: 6.148243883433722,
            is_approved: true,
            businessDescription: null,
            user: user1
        },
        {
            name: "Filmhuis De Keizer",
            description:
                "An independent cinema showcasing a range of international films.",
            category: "Entertainment",
            latitude: 52.25332528394313,
            longitude: 6.165616136880615,
            is_approved: true,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "Theater Aan De Lijn",
            description: "Description of Theater Aan De Lijn",
            category: "Architecture",
            latitude: 52.2600072939816,
            longitude: 6.165517653352023,
            is_approved: true,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "Botemarkt",
            description: "A 19th-century market hall where butter was once sold.",
            category: "Historic",
            latitude: 52.26455524216268,
            longitude: 6.155366832064887,
            is_approved: true,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "Escape Room Deventer",
            description: "Provides immersive escape room experiences for groups.",
            category: "Entertainment",
            latitude: 52.24592247195486,
            longitude: 6.166523849951872,
            is_approved: false,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "Deventer Buitensociëteit & Bowling",
            description: "Offers bowling alleys, arcade games, and a bar.",
            category: "Entertainment",
            latitude: 52.24735995371199,
            longitude: 6.148649633420082,
            is_approved: false,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "Blues Rock Cafe Midtown",
            description: "A quaint pub with great atmosphere and boardgames.",
            category: "Pub",
            latitude: 52.25295773475535,
            longitude: 6.16078103084258,
            is_approved: false,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "Broederenkerk",
            description:
                "A Gothic and neo-Gothic style church with a rich history.",
            category: "Architecture",
            latitude: 52.25457680948102,
            longitude: 6.156887805134106,
            is_approved: false,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "Taalhuis Deventer",
            description:
                "Specializes in language courses for international students.",
            category: "Education",
            latitude: 52.26828185381255,
            longitude: 6.163519142480258,
            is_approved: false,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "Museum EICAS",
            description: "A museum that highlights modern art.",
            category: "Museum",
            latitude: 52.252606800122294,
            longitude: 6.154415400152726,
            is_approved: false,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "Zandweteringpark",
            description: "Description for Zandweteringpark",
            category: "Nature",
            latitude: 52.276282884300976,
            longitude: 6.164766863959682,
            is_approved: true,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "Koningskerk",
            description: "Description for Koningskerk",
            category: "Architecture",
            latitude: 52.266934069595976,
            longitude: 6.150819376858662,
            is_approved: false,
            businessDescription: null,
            user: user1
        },
        {
            name: "Beer and Dans café Persee",
            description: "A popular pub known for its wide selection of beers.",
            category: "Pub",
            latitude: 52.251666816837556,
            longitude: 6.1606384071894045,
            is_approved: true,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "Mall Boreel",
            description:
                "A modern shopping mall with a variety of shops, including fashion," +
                " electronics, and dining options.",
            category: "Other",
            latitude: 52.25351962990873,
            longitude: 6.165593600330209,
            is_approved: true,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "The monastery garden Deventer",
            description:
                "A calm quaint garden where you can sit down and enjoy nature.",
            category: "Nature",
            latitude: 52.253411894892,
            longitude: 6.153508469475252,
            is_approved: false,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "Geert Groote Huis",
            description:
                "A museum that highlights the most important citizen of Deventer.",
            category: "Museum",
            latitude: 52.2537478780058,
            longitude: 6.156186738785399,
            is_approved: false,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "Kunstenlab",
            description: "A museum that highlights contemporary art.",
            category: "Museum",
            latitude: 52.247473890363366,
            longitude: 6.169444330854956,
            is_approved: false,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "Deventer Paintball",
            description: "Offers a fun time with friends.",
            category: "Entertainment",
            latitude: 52.238254718515826,
            longitude: 6.205063483587643,
            is_approved: true,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "Forsaken escape room",
            description: "Provides immersive escape room experiences for groups.",
            category: "Entertainment",
            latitude: 52.24410832132245,
            longitude: 6.167194430229893,
            is_approved: false,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "Bar Bistro Loev Deventer",
            description: "A popular pub.",
            category: "Pub",
            latitude: 52.251125780857066,
            longitude: 6.159791238644593,
            is_approved: true,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "The Flower Garden",
            description: "A popular pub.",
            category: "Pub",
            latitude: 52.252416415753906,
            longitude: 6.159185059382293,
            is_approved: true,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "Walhalla Deventer",
            description: "A popular pub with live music.",
            category: "Pub",
            latitude: 52.25081219923861,
            longitude: 6.161204813511941,
            is_approved: false,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "ZUS. Bar-Kitchen Deventer",
            description: "A popular pub with fresh made food.",
            category: "Pub",
            latitude: 52.25133255115281,
            longitude: 6.160402842348176,
            is_approved: false,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
        {
            name: "Bar & keuken De buren van Schimmelpenninck",
            description: "A popular pub with fresh made food.",
            category: "Pub",
            latitude: 52.25230134733096,
            longitude: 6.161089487866994,
            is_approved: true,
            businessDescription:
                descriptions[Math.floor(Math.random() * descriptions.length)],
            user: user1
        },
    ];


    for (const highlightData of highlights) {
        await createHighlightWithUser(em, highlightData, highlightData.user)
    }

    await em.flush();
    await orm.close();
})();