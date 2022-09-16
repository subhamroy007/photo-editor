import { previewUri1 } from "./demo";
import { AccountResponse, PostResponse } from "./types";

export const REPORT_REASONS = [
  "Its spam",
  "Nodity or sexual activity",
  "Hate speech or symbols",
  "I just dont like it",
  "Bullying or harashment",
  "False Informition",
  "Violence or dangourous organization",
  "Scam or fraud",
  "Intellectual property violation",
  "Sales of illegal or regulated goods",
  "Suicide or self-injury",
  "Eating disorders",
  "Something else",
];

export const ACCOUNTS: AccountResponse[] = [
  {
    hasNewStory: true,
    isFavourite: true,
    isFollowing: true,
    userid: "roybond007",
    username: "Subham Roy",
    profilePicture: {
      original: {
        width: 590,
        height: 840,
        uri: "http://192.168.43.235:5500/photo/photo7.jpg",
      },
      preview: {
        width: 590,
        height: 840,
        uri: "http://192.168.43.235:5500/photo/photo7.jpg",
      },
      encoded: previewUri1,
    },
  },
  {
    hasNewStory: true,
    isFavourite: true,
    isFollowing: true,
    userid: "jenpadilla21",
    username: "Jennifer Padilla",
    profilePicture: {
      original: {
        width: 770,
        height: 877,
        uri: "http://192.168.43.235:5500/photo/photo8.jpg",
      },
      preview: {
        width: 770,
        height: 877,
        uri: "http://192.168.43.235:5500/photo/photo8.jpg",
      },
      encoded: previewUri1,
    },
  },
  {
    hasNewStory: true,
    isFavourite: true,
    isFollowing: true,
    userid: "madeleine._.elyseee",
    username: "maddie akroyd 🤓",
    profilePicture: {
      original: {
        width: 1500,
        height: 1120,
        uri: "http://192.168.43.235:5500/photo/photo9.jpg",
      },
      preview: {
        width: 1500,
        height: 1120,
        uri: "http://192.168.43.235:5500/photo/photo9.jpg",
      },

      encoded: previewUri1,
    },
  },
  {
    hasNewStory: true,
    isFavourite: true,
    isFollowing: true,
    userid: "abigailjharp",
    username: "Abigail Jane Harp",
    profilePicture: {
      original: {
        width: 1067,
        height: 1700,
        uri: "http://192.168.43.235:5500/photo/photo10.jpg",
      },
      preview: {
        width: 1067,
        height: 1700,
        uri: "http://192.168.43.235:5500/photo/photo10.jpg",
      },
      encoded: previewUri1,
    },
  },
];

export const IMAGE_POSTS: PostResponse[] = [
  {
    id: "100",
    caption: `Vibing to the latest love song in town, #MelodyRoja ft. @yoyohoneysingh!
#YoYoHoneySingh #yoyo #trendingreel #makeyourownreel #foryou #trending #angelrai #wings #danceonreels #fun #style #indian #viralvideos`,
    isLiked: true,
    isSaved: false,
    location: "pasedina california",
    noOfLikes: 45783,
    noOfOpinions: 3498,
    timestamp: Date.now(),
    type: "photo",
    accounts: [],
    author: ACCOUNTS[0],
    photos: {
      media: [
        {
          width: 667,
          height: 1000,
          uri: "http://192.168.43.235:5500/photo/photo1.jpg",
        },
        {
          width: 667,
          height: 1000,
          uri: "http://192.168.43.235:5500/photo/photo2.jpg",
        },
        {
          width: 375,
          height: 500,
          uri: "http://192.168.43.235:5500/photo/photo3.jpg",
        },
        {
          width: 957,
          height: 1300,
          uri: "http://192.168.43.235:5500/photo/photo4.jpg",
        },
      ],
    },
    moment: null,
    video: null,
    thumbnail: {
      original: {
        width: 626,
        height: 418,
        uri: "http://192.168.43.235:5500/photo/photo7.jpg",
      },
      thumbnailEncoded: previewUri1,
    },
  },
  {
    id: "200",
    caption: `Midnights, the stories of 13 sleepless nights scattered throughout my life, will be out October 21. Meet me at midnight.`,
    isLiked: false,
    isSaved: false,
    location: "kandi harisagarpar",
    noOfLikes: 2341755,
    noOfOpinions: 97567,
    timestamp: Date.now(),
    type: "photo",
    accounts: [ACCOUNTS[0]],
    author: ACCOUNTS[1],
    photos: {
      media: [
        {
          width: 563,
          height: 843,
          uri: "http://192.168.43.235:5500/photo/photo12.jpg",
        },
        {
          width: 726,
          height: 486,
          uri: "http://192.168.43.235:5500/photo/photo13.jpg",
        },
      ],
    },
    moment: null,
    video: null,
    thumbnail: {
      original: {
        width: 626,
        height: 418,
        uri: "http://192.168.43.235:5500/photo/photo7.jpg",
      },
      thumbnailEncoded: previewUri1,
    },
  },
  {
    id: "300",
    caption: `Bachpan se hi na… sab trendsetters ko hair makeovers karne ka bohot craze hai, by god!💇‍♀️

Make your new look the trending mood with Lakmé Salon #GoodHairDay–Trendy Look, Trending Mood.

20% off on all hair services.💁🏻‍♀️

#LakméSalon #HairStyle #HairMakeover #Bollywood #SalonExperts #HairColor #HairTransformation #HairColorInspiration #FlauntYourStyle #HairCare #Schwarzkopf #HairSpa #HealthyHair #TIGI #GaramMasala #MoroccanOil`,
    isLiked: true,
    isSaved: true,
    location: "",
    noOfLikes: 689466,
    noOfOpinions: 38579,
    timestamp: Date.now(),
    type: "photo",
    accounts: [],
    author: ACCOUNTS[2],
    photos: {
      media: [
        {
          width: 667,
          height: 1000,
          uri: "http://192.168.43.235:5500/photo/photo14.jpg",
        },
      ],
    },
    moment: null,
    video: null,
    thumbnail: {
      original: {
        width: 626,
        height: 418,
        uri: "http://192.168.43.235:5500/photo/photo7.jpg",
      },
      thumbnailEncoded: previewUri1,
    },
  },
  {
    id: "400",
    caption: `About last night @90sbeachofficial
@bogdi_busteanu
@lil_catalin_valentin`,
    isLiked: false,
    isSaved: false,
    location: "newalipur kolkata",
    noOfLikes: 67843,
    noOfOpinions: 78,
    timestamp: Date.now(),
    type: "photo",
    accounts: [],
    author: ACCOUNTS[3],
    photos: {
      media: [
        {
          width: 564,
          height: 1222,
          uri: "http://192.168.43.235:5500/photo/photo16.jpg",
        },
      ],
    },
    moment: null,
    video: null,
    thumbnail: {
      original: {
        width: 626,
        height: 418,
        uri: "http://192.168.43.235:5500/photo/photo7.jpg",
      },
      thumbnailEncoded: previewUri1,
    },
  },
];

export const MOMENTS_POSTS: PostResponse[] = [
  {
    id: "500",
    caption: `Follow @osj1988 💕 @osj1988 💞
@osj1988 💕 @osj1988 💕 @osj1988 💞
@osj1988 💕 @osj1988 💞
.

#likeit #comment #share`,
    isLiked: true,
    isSaved: false,
    location: "",
    noOfLikes: 9867,
    noOfOpinions: 34,
    timestamp: Date.now(),
    type: "moment",
    accounts: [ACCOUNTS[1]],
    author: ACCOUNTS[0],
    photos: null,
    moment: {
      audio: { id: "100", name: "kabhi jo badal barshae" },
      filter: { id: "100", name: "BB Red Hair" },
      noOfAudience: 5685947,
      media: {
        width: 420,
        height: 746,
        uri: "http://192.168.43.235:5500/videos/short1.mp4",
      },
    },
    video: null,
    thumbnail: {
      original: {
        width: 483,
        height: 800,
        uri: "http://192.168.43.235:5500/photo/photo24.jpg",
      },
      thumbnailEncoded: previewUri1,
    },
  },
  {
    id: "600",
    caption: `How I show up after telling my friends I’m dressing casually ✨
.
.
Outfit @saraabyng
Jewellery @the_jewel_factor @blingthingstore
#ootd #screening #outfit #tassel #tasseldress #whitedress #staystylish #style #fashion #bling`,
    isLiked: false,
    isSaved: false,
    location: "Las Vegas",
    noOfLikes: 684785,
    noOfOpinions: 4737,
    timestamp: Date.now(),
    type: "moment",
    accounts: [],
    author: ACCOUNTS[1],
    photos: null,
    moment: {
      audio: { id: "200", name: "khariyat pucho" },
      filter: { id: "200", name: "No-Filter" },
      noOfAudience: 2198579,
      media: {
        width: 420,
        height: 746,
        uri: "http://192.168.43.235:5500/videos/short2.mp4",
      },
    },
    video: null,
    thumbnail: {
      original: {
        width: 483,
        height: 800,
        uri: "http://192.168.43.235:5500/photo/photo24.jpg",
      },
      thumbnailEncoded: previewUri1,
    },
  },
  {
    id: "700",
    caption: `A part of our #Goodbye baby is now yours.. 🤍🤍
This one is special for so many reasons but for now I hope you and your family like this.. 🌸🌸😚

@amitabhbachchan @neena_gupta @pavailgulati @elliavrram @ashishvidyarthi1 @whosunilgrover @sahilmehta4 @abhishekhkhan_ #VikasBahl @balajimotionpictures #GoodCo #SaraswatiEntertainment @ektarkapoor @shobha9168 @virajsawant @bhavinisheth @itsamittrivedi @zeestudiosofficial @zeemusiccompany @penmarudhar @f.a.a.r.a @ruchikaakapoor`,
    isLiked: true,
    isSaved: false,
    location: "mumbai palace",
    noOfLikes: 80946,
    noOfOpinions: 289,
    timestamp: Date.now(),
    type: "moment",
    accounts: [ACCOUNTS[0], ACCOUNTS[1]],
    author: ACCOUNTS[2],
    photos: null,
    moment: {
      audio: null,
      filter: null,
      noOfAudience: 785748,
      media: {
        width: 540,
        height: 960,
        uri: "http://192.168.43.235:5500/videos/short3.mp4",
      },
    },
    video: null,
    thumbnail: {
      original: {
        width: 483,
        height: 800,
        uri: "http://192.168.43.235:5500/photo/photo24.jpg",
      },
      thumbnailEncoded: previewUri1,
    },
  },
  {
    id: "800",
    caption: `The craziness begins, presenting the Full Video of Shaandaar's first song Gulaabo ft. Alia Bhatt & Shahid Kapoor.

Music - Amit Trivedi
Vocals - Vishal Dadlani and Anusha Mani
Lyrics - Anvita Dutt

Producer - Karan Johar & The Phantoms
Director - Vikas Bahl
Banner - Fox Star Studios, Dharma Productions & Phantom Production

Music is available on hungama.com`,
    isLiked: false,
    isSaved: false,
    location: "",
    noOfLikes: 9574,
    noOfOpinions: 573,
    timestamp: Date.now(),
    type: "moment",
    accounts: [],
    author: ACCOUNTS[3],
    photos: null,
    moment: {
      audio: { id: "500", name: "K.G.F bgm dj remix" },
      filter: null,
      noOfAudience: 465844,
      media: {
        width: 540,
        height: 960,
        uri: "http://192.168.43.235:5500/videos/short4.mp4",
      },
    },
    video: null,
    thumbnail: {
      original: {
        width: 483,
        height: 800,
        uri: "http://192.168.43.235:5500/photo/photo24.jpg",
      },
      thumbnailEncoded: previewUri1,
    },
  },
];

export const VIDEO_POSTS: PostResponse[] = [
  {
    id: "900",
    caption: `90% Happy 10% burnt 😑🌞💁🏻‍♀️
#summertime

@shazzalamphotography @shru_birla @in.urbansuburban @thepopulor`,
    isLiked: false,
    isSaved: false,
    location: "",
    noOfLikes: 28384,
    noOfOpinions: 3749,
    timestamp: Date.now(),
    type: "video",
    accounts: [],
    author: ACCOUNTS[0],
    photos: null,
    moment: null,
    video: {
      media: {
        width: 720,
        height: 480,
        uri: "http://192.168.43.235:5500/videos/video3.mp4",
      },
      noOfAudience: 5894794,
      title:
        "Beast Mode - Official Lyric Video | Beast | Thalapathy Vijay | Sun Pictures | Nelson | Anirudh",
    },
    thumbnail: {
      original: {
        width: 483,
        height: 800,
        uri: "http://192.168.43.235:5500/photo/photo24.jpg",
      },
      thumbnailEncoded: previewUri1,
    },
  },
];
