
export const COURSE_CATEGORY = [
    { value: "", name: "Choose a category" },
    { value: "001", name: "Development" },
    { value: "002", name: "Business" },
    { value: "003", name: "Finance & Accounting" },
    { value: "004", name: "IT & Software" },
    { value: "005", name: "Office Productivity" },
    { value: "006", name: "Personal Development" },
    { value: "007", name: "Design" },
    { value: "008", name: "Marketing" },
    { value: "009", name: "Lifestyle" },
    { value: "010", name: "Photography & Video" },
    { value: "011", name: "Health & Fitness" },
    { value: "012", name: "Music" },
    { value: "013", name: "Teaching & Academics" },
    { value: "-1", name: "I don't know yet" },
];
export const SORT_OPTIONS = [
    { label: "Newest", value: "Newest" },
    { label: "Oldest", value: "Oldest" },
    { label: "A-Z", value: "A-Z" },
    { label: "Z-A", value: "Z-A" },
    { label: "Published", value: "PublishedFirst" },
    { label: "Unpublished", value: "UnpublishedFirst" },
];
export const INSTRUCTOR_DRAWER_ITEMS = {
    COURSE: "courses",
    /*DASHBOARD: "dashboard",*/
    COMMUNICATION: "communication",
    PERFORMANCE: "performance",
    TOOLS: "tools",
    PROFILE: "profile",
    REVENUE_REPORT: "revenue_report",
    NOTIFICATION: "notifications",
    PAYOUT_TAX_SETTINGS: "payout_tax_settings"
};
export const COURSE_STATUS = {
    pending: "Pending",
    published: "Published",
    unpublished: "Draft",
};
export const COURSE_TYPE = {
    practiceTest: 'PracticeTest',
    course: "Course"
}
export const LEARNING_STATUS = {
    notStarted: "Not started",
    inProgress: "In progress",
    finished: "finished",
};
export const COURSE_APPROVED_STATUS = {
    inApprobation: "In Approbation",
    aproved: "Approved",
    refused: "Refused",
};
export const INSTRUCTOR_CONFIG_ITEMS = [
    /*{
      id: "001",
      name: "DashBoard",
      apiName: "dashboard",
      icon: "bi bi-command",
    },*/
    {
        id: "002",
        name: "My Courses",
        apiName: "courses",
        icon: "bi bi-basket-fill",
    },
    {
        id: "003",
        name: "Communication",
        apiName: "communication",
        icon: "bi bi-chat-right-text fs-2",
    },
    {
        id: "004",
        name: "Performance",
        apiName: "performance",
        icon: "bi bi-reception-4",
    },
    {
        id: "005",
        name: "Tools",
        apiName: "tools",
        icon: "bi bi-wrench-adjustable",
    },
];
export const AFFILIATION_CONFIG_ITEMS = [{
    name: "Dashboard",
    apiName: "dashboard",
    icon: "bi bi-activity",
},/*{
  name: "Messages",
  apiName: "messages",
  icon: "bi bi-chat-dots",
},*/{
    name: "Profile",
    apiName: "profile",
    icon: "bi bi-person",
}
    , {
    name: "Revenue report",
    apiName: "Revenue_report",
    icon: "bi bi-database",
}, {
    name: "Payout & tax settings",
    apiName: "payout_tax_settings",
    icon: "bi bi-cash-coin",
},
{
    name: "Setting",
    apiName: "settings",
    icon: "bi bi-gear",
}, {
    name: "Logout",
    apiName: "logout",
    icon: "bi bi-box-arrow-right",
},];
export const COURSES_MOCK = [
    {
        id: "0xnDwvmrT0TDe4wFWe09",
        logo: "https://cdn.sstatic.net/Img/teams/teams-illo-free-sidebar-promo.svg?v=47faa659a05e",
        title: "Salesforce developer",
        description:
            "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
        lastModified: 3,
        status: "live",
        numberOfStudent: 40,
        totalSale: 30000,
        period: "10 months",
        rating: 4.5,
    },
    {
        id: "0xnDwvmrT0TDe4wFWe09",
        logo: "https://cdn.sstatic.net/Img/teams/teams-illo-free-sidebar-promo.svg?v=47faa659a05e",
        title: "Admin",
        description:
            "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
        lastModified: 3,
        status: "live",
        numberOfStudent: 40,
        totalSale: 30000,
        period: "10 months",
        rating: 4.5,
    },
    {
        id: "0xnDwvmrT0TDe4wFWe09",
        logo: "https://cdn.sstatic.net/Img/teams/teams-illo-free-sidebar-promo.svg?v=47faa659a05e",
        title: "jforce",
        description:
            "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
        lastModified: 3,
        status: "live",
        numberOfStudent: 40,
        totalSale: 300,
        period: "10 months",
        rating: 4.5,
    },
    {
        id: "0xnDwvmrT0TDe4wFWe09",
        logo: "https://cdn.sstatic.net/Img/teams/teams-illo-free-sidebar-promo.svg?v=47faa659a05e",
        title: "Card title",
        description:
            "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
        lastModified: 3,
        status: "live",
        numberOfStudent: 40,
        totalSale: 30000,
        period: "10 months",
        rating: 4.5,
    },
    {
        id: "0xnDwvmrT0TDe4wFWe09",
        logo: "https://cdn.sstatic.net/Img/teams/teams-illo-free-sidebar-promo.svg?v=47faa659a05e",
        title: "Card title",
        description:
            "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
        lastModified: 3,
        status: "live",
        numberOfStudent: 40,
        totalSale: 30000,
        period: "10 months",
        rating: 4.5,
    },
    {
        id: "0xnDwvmrT0TDe4wFWe09",
        logo: "https://cdn.sstatic.net/Img/teams/teams-illo-free-sidebar-promo.svg?v=47faa659a05e",
        title: "Card title",
        description:
            "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
        lastModified: 3,
        status: "live",
        numberOfStudent: 40,
        totalSale: 30000,
        period: "10 months",
        rating: 4.5,
    },
    {
        id: "0xnDwvmrT0TDe4wFWe09",
        logo: "https://cdn.sstatic.net/Img/teams/teams-illo-free-sidebar-promo.svg?v=47faa659a05e",
        title: "Card title",
        description:
            "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
        lastModified: 3,
        status: "live",
        numberOfStudent: 40,
        totalSale: 30000,
        period: "10 months",
        rating: 4.5,
    },
    {
        id: "0xnDwvmrT0TDe4wFWe09",
        logo: "https://cdn.sstatic.net/Img/teams/teams-illo-free-sidebar-promo.svg?v=47faa659a05e",
        title: "Card title",
        description:
            "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
        lastModified: 3,
        status: "live",
        numberOfStudent: 40,
        totalSale: 30000,
        period: "10 months",
        rating: 4.5,
    },
    {
        id: "0xnDwvmrT0TDe4wFWe09",
        logo: "https://cdn.sstatic.net/Img/teams/teams-illo-free-sidebar-promo.svg?v=47faa659a05e",
        title: "Card title",
        description:
            "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
        lastModified: 3,
        status: "live",
        numberOfStudent: 40,
        totalSale: 30000,
        period: "10 months",
        rating: 4.5,
    },
    {
        id: "0xnDwvmrT0TDe4wFWe09",
        logo: "https://cdn.sstatic.net/Img/teams/teams-illo-free-sidebar-promo.svg?v=47faa659a05e",
        title: "Card title",
        description:
            "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
        lastModified: 3,
        status: "live",
        numberOfStudent: 40,
        totalSale: 30000,
        period: "10 months",
        rating: 4.5,
    },
    {
        id: "0xnDwvmrT0TDe4wFWe09",
        logo: "https://cdn.sstatic.net/Img/teams/teams-illo-free-sidebar-promo.svg?v=47faa659a05e",
        title: "Card title",
        description:
            "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
        lastModified: 3,
        status: "live",
        numberOfStudent: 40,
        totalSale: 30000,
        period: "10 months",
        rating: 4.5,
    },
    {
        id: "0xnDwvmrT0TDe4wFWe09",
        logo: "https://cdn.sstatic.net/Img/teams/teams-illo-free-sidebar-promo.svg?v=47faa659a05e",
        title: "Card title",
        description:
            "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
        lastModified: 3,
        status: "live",
        numberOfStudent: 40,
        totalSale: 30000,
        period: "10 months",
        rating: 4.5,
    },
    {
        id: "0xnDwvmrT0TDe4wFWe09",
        logo: "https://cdn.sstatic.net/Img/teams/teams-illo-free-sidebar-promo.svg?v=47faa659a05e",
        title: "Card title",
        description:
            "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
        lastModified: 3,
        status: "live",
        numberOfStudent: 40,
        totalSale: 30000,
        period: "10 months",
        rating: 4.5,
    },
];
export const EDIT_COURSE_ITEMS = {
    draft: [
        {
            name: "planYourCourse",
            value: "planYourCourse",
            items: [
                {
                    id: "001",
                    name: "IntendedLearners",
                    apiName: "IntendedLearners",
                },
                {
                    id: "002",
                    name: "CourseStructure",
                    apiName: "CourseStructure",
                },
                {
                    id: "003",
                    name: "SetupTestVideo",
                    apiName: "SetupTestVideo",
                },
            ],
        },
        {
            name: "CreateYourContent",
            value: "CreateYourContent",
            items: [
                {
                    id: "001",
                    name: "FilmEdit",
                    apiName: "FilmEdit",
                },
                {
                    id: "002",
                    name: "Curriculum",
                    apiName: "Curriculum",
                },
                /*  {
                  id: "003",
                  name: "Captions (optional)",
                  apiName: "Captions",
                },
                {
                  id: "004",
                  name: "Accessibility (optional)",
                  apiName: "Accessibility",
                },*/
            ],
        },
        {
            name: "PublishYourCourse",
            value: "PublishYourCourse",
            items: [
                {
                    id: "001",
                    name: "CourseLandingPage",
                    apiName: "CourseLandingPage",
                },
                {
                    id: "002",
                    name: "Pricing",
                    apiName: "Pricing",
                },
                {
                    id: "003",
                    name: "promotions",
                    apiName: "Promotions",
                },
                {
                    id: "004",
                    name: "CourseMessages",
                    apiName: "CourseMessages",
                },
            ],
        },
    ],
    live: [
        {
            name: "CourseEditing",
            value: "CourseEditing",
            items: [
                {
                    id: "001",
                    name: "IntendedLearners",
                    apiName: "IntendedLearners",
                },
                {
                    id: "002",
                    name: "Curriculum",
                    apiName: "Curriculum",
                },
                {
                    id: "003",
                    name: "CourseLandingPage",
                    apiName: "CourseLandingPage",
                },
                /*  {
                  id: "004",
                  name: "Captions",
                  apiName: "Captions",
                },
                {
                  id: "005",
                  name: "Accessibility",
                  apiName: "Accessibility",
                },*/
                {
                    id: "005",
                    name: "GriotFeedBack",
                    apiName: "GriotFeedBack",
                },
            ],
        },
        {
            name: "CourseManagement",
            value: "CourseManagement",
            items: [
                {
                    id: "001",
                    name: "Pricing",
                    apiName: "Pricing",
                },
                {
                    id: "002",
                    name: "Promotions",
                    apiName: "Promotions",
                },
                {
                    id: "003",
                    name: "CourseMessages",
                    apiName: "CourseMessages",
                },
                {
                    id: "004",
                    name: "Availability",
                    apiName: "Availability",
                },
                {
                    id: "003",
                    name: "students",
                    apiName: "Students",
                },
            ],
        },
    ],
    practiceTest: {
        draft: [
            {
                name: "CourseEditing",
                value: "CourseEditing",
                items: [
                    {
                        id: "001",
                        name: "IntendedLearners",
                        apiName: "IntendedLearners",
                    },
                    {
                        id: "002",
                        name: "PracticeTest",
                        apiName: "PracticeTest",
                    },
                    {
                        id: "003",
                        name: "CourseLandingPage",
                        apiName: "CourseLandingPage",
                    },
                    {
                        id: "004",
                        name: "Pricing",
                        apiName: "Pricing",
                    },
                    {
                        id: "005",
                        name: "CourseMessages",
                        apiName: "CourseMessages",
                    },
                ],
            },
        ],
        live: [
            {
                name: "CourseEditing",
                value: "CourseEditing",
                items: [
                    {
                        id: "001",
                        name: "IntendedLearners",
                        apiName: "IntendedLearners",
                    },
                    {
                        id: "002",
                        name: "PracticeTest",
                        apiName: "PracticeTest",
                    },
                    {
                        id: "003",
                        name: "CourseLandingPage",
                        apiName: "CourseLandingPage",
                    },
                    {
                        id: "004",
                        name: "Pricing",
                        apiName: "Pricing",
                    },
                    {
                        id: "005",
                        name: "promotions",
                        apiName: "Promotions",
                    },
                    {
                        id: "006",
                        name: "CourseMessages",
                        apiName: "CourseMessages",
                    },
                    {
                        id: "007",
                        name: "students",
                        apiName: "Students",
                    },
                ],
            },
        ],
    },
};
export const COLLECTION_NAME = {
    course: "Course",
    user: "User",
    section: "Section",
    lesson: "Lesson",
    products: "Product",
    myLearnings: "myLearnings",
    reviews: "Reviews",
    questions: "Questions",
    enroll: "Enrollments",
    promotion_code: "PromotionCodes",
    practice_test: "PracticeTests",
    notification: "Notifications",
    message: "Messages",
    categories: "Categories",
    topics: "Topics",
    candidates: "Candidates",
};
/**
 * Profile Item definition constants
 * */
export const PROFILE_TABS_ITEMS = [
    { label: "Griot Profile", name: "Profile" },
    { label: "Profile Picture", name: "ProfilePicture" },
    { label: "Privacy Settings", name: "PrivacySetting" },
];
export const PROFILE_TABS_ITEM_API_NAMES = {
    profile: "Profile",
    picture: "ProfilePicture",
    privacySettings: "PrivacySetting",
    accountSecurity: "AccountSecurity",
    notificationSettings: "NotificationsSettings",
    closeAccount: "CloseAccount",
};
export const ACCOUNT_TABS_ITEMS = [
    { label: "AccountSecurity", name: "AccountSecurity" },
    { label: "NotificationsSettings", name: "NotificationsSettings" },
    { label: "CloseAccount", name: "CloseAccount" },
];
export const ACCOUNT_TABS_ITEM_API_NAMES = {
    accountSecurity: "AccountSecurity",
    notificationSettings: "NotificationsSettings",
    closeAccount: "CloseAccount",
};
export const LECON_ITEMS_TYPES = [
    {
        name: "Lecture",
        value: "Lecture",
    },
    {
        name: "Exercise",
        value: "Exercise",
    },
];
export const IN_LEARN_NUMBER = 4;
export const STANDARD_PRICING_OPTIONS = [
    { '€': 0, $: 0, fcfa: 0 },
    { '€': 4.99, $: 9.99, fcfa: 3000 },
    { '€': 9.99, $: 14.99, fcfa: 6000 },
    { '€': 14.99, $: 19.99, fcfa: 9000 },
    { '€': 19.99, $: 24.99, fcfa: 12000 },
    { '€': 24.99, $: 29.99, fcfa: 15000 },
    { '€': 29.99, $: 34.99, fcfa: 18000 },
    { '€': 34.99, $: 39.99, fcfa: 21000 },
    { '€': 39.99, $: 44.99, fcfa: 24000 },
    { '€': 44.99, $: 49.99, fcfa: 27000 },
    { '€': 49.99, $: 54.99, fcfa: 31000 },
    { '€': 54.99, $: 59.99, fcfa: 35000 },
    { '€': 59.99, $: 64.99, fcfa: 39000 },
    { '€': 64.99, $: 69.99, fcfa: 42000 },
    { '€': 69.99, $: 74.99, fcfa: 45000 },
    { '€': 74.99, $: 79.99, fcfa: 49000 },
    { '€': 79.99, $: 84.99, fcfa: 52000 },
    { '€': 84.99, $: 89.99, fcfa: 55000 },
    { '€': 89.99, $: 94.99, fcfa: 59000 },
    { '€': 94.99, $: 99.99, fcfa: 62000 },
    { '€': 99.99, $: 104.99, fcfa: 65000 },
    { '€': 109.99, $: 115.99, fcfa: 72000 },
    { '€': 119.99, $: 124.99, fcfa: 78000 },
    { '€': 124.99, $: 194.99, fcfa: 81000 },
    { '€': 129.99, $: 134.99, fcfa: 85000 },
    { '€': 139.99, $: 144.99, fcfa: 91000 },
    { '€': 149.99, $: 154.99, fcfa: 98000 },
    { '€': 159.99, $: 164.99, fcfa: 104000 },
    { '€': 169.99, $: 174.99, fcfa: 111000 },
    { '€': 174.99, $: 179.99, fcfa: 114000 },
    { '€': 179.99, $: 184.99, fcfa: 118000 },
    { '€': 189.99, $: 194.99, fcfa: 124000 },
    { '€': 199.99, $: 204.99, fcfa: 130000 },
];
export const CATEGORY_SECTION_ITEM = [
    {
        value: "OfficeProductivity",
        name: "Office Productivity",
        id: "cat-0004",
        url: "/courses/office-productivity/",
    },
    {
        value: "WebDesign",
        name: "Web Design",
        id: "cat-0006",
        url: "/courses/design/",
    },
    {
        value: "Development",
        name: "Development",
        id: "cat-0000",
        url: "/courses/development/",
    },
    {
        value: "Marketing",
        name: "Marketing",
        id: "cat-0007",
        url: "/courses/marketing/",
    },
    {
        value: "Finance",
        name: "Finance",
        id: "cat-0002",
        url: "/courses/finance-and-accounting/",
    },
    { value: "Music", name: "Music", id: "cat-0011", url: "/courses/music/" },
    {
        value: "PhotographyVideo",
        name: "Photography & Video",
        id: "cat-0009",
        url: "/courses/photography-and-video/",
    },
];
export const TOP_COURSE_SECTION = [
    {
        value: "Development",
        name: "top_courses_ob.Development",
        id: "cat-0000",
        url: "/courses/development/",
    },
    {
        value: "GraphicDesign",
        name: "top_courses_ob.GraphicDesign",
        id: "cat-0006",
        url: "/courses/design/",
    },
    {
        value: "IT",
        name: "top_courses_ob.IT",
        id: "cat-0003",
        url: "/courses/it-and-software/",
    },
    {
        value: "PersonalDevelopment",
        name: "top_courses_ob.PersonalDevelopment",
        id: "cat-0005",
        url: "/courses/personal-development/",
    },
    {
        value: "Business",
        name: "top_courses_ob.Business",
        id: "cat-0001",
        url: "/courses/business/",
    },
];
export const DESCRIPTION = [
    {
        name: "TestVideo",
        icon: "bi-camera-reels-fill",
        linkText: "test_video",
        description: "test_video_desc",
    },
    {
        name: "InstructorCommunity",
        icon: "bi-chat-square-text",
        linkText: "instructor_community",
        description:
            "instructor_community_desc",
    },
    {
        name: "TeachingCenter",
        icon: "bi-laptop-fill",
        linkText: "teaching_center",
        description: "teaching_center_desc",
    },
    {
        name: "Help",
        icon: "bi-question-circle",
        linkText: "help_and_support",
        description: "help_and_support_desc",
    },
];
export const DURATION_ARTICLE_DEFAULT = 5;

/* Student Information section */
export const STUDENT_DRAWER_ITEMS = {
    MY_LEARNING: "MyLearning",
    PAYMENT_METHOD: "PaymentMethod",
    //SUBSCRIPTIONS: "Subscriptions",
    //GRIOT_PROFILE: "GriotCredit",
    PURCHASE_HISTORY: "PurchaseHistory",
    NOTIFICATION: "Notifications",
    MESSAGES: "Messages",
    ACCOUNT_SETTING: "AccountSetting",
};
export const STUDENT_CONFIG_ITEMS = [
    {
        id: "001",
        name: "My Learning",
        apiName: "MyLearning",
        icon: "bi bi-grid",
    },
    {
        id: "003",
        name: "Payment Method",
        apiName: "PaymentMethod",
        icon: "bi bi-credit-card",
    },
    /* {
       id: "004",
       name: "Subscriptions",
       apiName: "Subscriptions",
       icon: "bi bi-cash",
     },
     {
       id: "005",
       name: "Griot Credit",
       apiName: "GriotCredit",
       icon: "bi bi-hand-thumbs-up",
     },*/
    {
        id: "006",
        name: "Purchase History",
        apiName: "PurchaseHistory",
        icon: "bi bi-receipt",
    },
    {
        id: "007",
        name: "Messages",
        apiName: "Messages",
        icon: "bi bi-chat-left",
    },
    {
        id: "007",
        name: "Notifications",
        apiName: "Notifications",
        icon: "bi bi-bell",
    },
    {
        id: "008",
        name: "Account Setting",
        apiName: "AccountSetting",
        icon: "bi bi-gear",
    },
];

/* Student Information section */
export const ADMIN_DRAWER_ITEMS = {
    COURSE: "Course",
    STUDENT: "Students",
    INSTRUCTOR: "Instructors",
    DASHBOARD: "Dashboard",
    AFFILIATION: 'Affiliations',
    USERS: 'Users',
    ROLES: 'Roles',
    LAYOUT: 'Layout',
    SETTING: 'Setting'

};
export const ADMIN_CONFIG_ITEMS = [
    {
        id: "001",
        name: "Dashboard",
        apiName: "Dashboard",
        icon: "bi bi-house",
    },
    {
        id: "002",
        name: "Course",
        apiName: "Course",
        icon: "bi bi-book",
    },
    {
        id: "003",
        name: "Students",
        apiName: "Students",
        icon: "bi bi-person",
    },
    {
        id: "004",
        name: "Instructors",
        apiName: "Instructors",
        icon: "bi bi-person-check",
    },
    {
        id: "005",
        name: "Earnings",
        apiName: "Earnings",
        icon: "bi bi-graph-up",
    },
    {
        id: "006",
        name: "Reviews",
        apiName: "Reviews",
        icon: "bi bi-chat",
    },
    {
        id: "006",
        name: "Affiliations",
        apiName: "Affiliations",
        icon: "bi bi-coin",
    },
    {
        id: "007",
        name: "Users",
        apiName: "Users",
        icon: "bi bi-person-plus",
    },
    {
        id: "008",
        name: "Roles",
        apiName: "Roles",
        icon: "bi bi-person-workspace",
    },
    {
        id: "009",
        name: "Layout view",
        apiName: "Layout",
        icon: "bi bi-grid-3x3-gap",
    },

    {
        id: "010",
        name: "Setting",
        apiName: "Setting",
        icon: "bi bi-person-gear",
    },
];

export const ALLOW_FILE = {
    image: ".jpg, .jpeg, .gif, .png",
    video: ".MP4",
    documents: "jpg, .jpeg, .gif, .png, .pdf",
};
export const IMAGE_RESOLUTION = {
    width: 750,
    height: 422,
};

export const GLOBAL_LANGUAGE = {
    sw: "Swahili",
    en: "English",
    fr: "French",
    es: "Spanish",
    de: "German",
    it: "Italian",
    zh: "Chinese",
    ja: "Japanese",
    ar: "Arabic",
    ru: "Russian",
    pt: "Portuguese",
    hi: "Hindi",
    ko: "Korean",
    tr: "Turkish",
    th: "Thai",
    nl: "Dutch",
    sv: "Swedish",
    fi: "Finnish",
    no: "Norwegian",
    da: "Danish",
    pl: "Polish",
    cs: "Czech",
    sk: "Slovak",
    uk: "Ukrainian",
    hu: "Hungarian",
    vi: "Vietnamese",
    ro: "Romanian",
    id: "Indonesian",
    ms: "Malay",
    tl: "Tagalog",
};


export const COUNTRIES = [
    {
        country: "Algeria",
        phone: "+213",
        regex: "^\\+213[\\d]{9}$",
    },
    {
        country: "Angola",
        phone: "+244",
        regex: "^\\+244[\\d]{9}$",
    },
    {
        country: "Benin",
        phone: "+229",
        regex: "^\\+229[\\d]{8}$",
    },
    {
        country: "Botswana",
        phone: "+267",
        regex: "^\\+267[\\d]{7}$",
    },
    {
        country: "Burkina Faso",
        phone: "+226",
        regex: "^\\+226[\\d]{8}$",
    },
    {
        country: "Burundi",
        phone: "+257",
        regex: "^\\+257[\\d]{8}$",
    },
    {
        country: "Cameroon",
        phone: "+237",
        regex: "^\\+237[\\d]{8}$",
        default: true,
        code: 'CM'
    },
    {
        country: "Cape Verde",
        phone: "+238",
        regex: "^\\+238[\\d]{7}$",
    },
    {
        country: "Central African Republic",
        phone: "+236",
        regex: "^\\+236[\\d]{8}$",
    },
    {
        country: "Chad",
        phone: "+235",
        regex: "^\\+235[\\d]{8}$",
    },
    {
        country: "Comoros",
        phone: "+269",
        regex: "^\\+269[\\d]{7}$",
    },
    {
        country: "Congo",
        phone: "+242",
        regex: "^\\+242[\\d]{8}$",
    },
    {
        country: "Djibouti",
        phone: "+253",
        regex: "^\\+253[\\d]{7}$",
    },
    {
        country: "Egypt",
        phone: "+20",
        regex: "^\\+20[\\d]{9}$",
    },
    {
        country: "Equatorial Guinea",
        phone: "+240",
        regex: "^\\+240[\\d]{7}$",
    },
    {
        country: "Eritrea",
        phone: "+291",
        regex: "^\\+291[\\d]{7}$",
    },
    {
        country: "Eswatini",
        phone: "+268",
        regex: "^\\+268[\\d]{7}$",
    },
    {
        country: "Ethiopia",
        phone: "+251",
        regex: "^\\+251[\\d]{9}$",
    },
    {
        country: "Gabon",
        phone: "+241",
        regex: "^\\+241[\\d]{7}$",
    },
    {
        country: "Gambia",
        phone: "+220",
        regex: "^\\+220[\\d]{7}$",
    },
    {
        country: "Ghana",
        phone: "+233",
        regex: "^\\+233[\\d]{9}$",
    },
    {
        country: "Guinea",
        phone: "+224",
        regex: "^\\+224[\\d]{8}$",
    },
    {
        country: "Guinea-Bissau",
        phone: "+245",
        regex: "^\\+245[\\d]{7}$",
    },
    {
        country: "Ivory Coast",
        phone: "+225",
        regex: "^\\+225[\\d]{8}$",
    },
    {
        country: "Kenya",
        phone: "+254",
        regex: "^\\+254[\\d]{9}$",
    },
    {
        country: "Lesotho",
        phone: "+266",
        regex: "^\\+266[\\d]{7}$",
    },
    {
        country: "Liberia",
        phone: "+231",
        regex: "^\\+231[\\d]{7}$",
    },
    {
        country: "Libya",
        phone: "+218",
        regex: "^\\+218[\\d]{9}$",
    },
    {
        country: "Madagascar",
        phone: "+261",
        regex: "^\\+261[\\d]{9}$",
    },
    {
        country: "Malawi",
        phone: "+265",
        regex: "^\\+265[\\d]{8}$",
    },
    {
        country: "Mali",
        phone: "+223",
        regex: "^\\+223[\\d]{8}$",
    },
    {
        country: "Mauritania",
        phone: "+222",
        regex: "^\\+222[\\d]{8}$",
    },
    {
        country: "Mauritius",
        phone: "+230",
        regex: "^\\+230[\\d]{7}$",
    },
    {
        country: "Morocco",
        phone: "+212",
        regex: "^\\+212[\\d]{9}$",
    },
    {
        country: "Mozambique",
        phone: "+258",
        regex: "^\\+258[\\d]{9}$",
    },
    {
        country: "Namibia",
        phone: "+264",
        regex: "^\\+264[\\d]{9}$",
    },
    {
        country: "Niger",
        phone: "+227",
        regex: "^\\+227[\\d]{8}$",
    },
    {
        country: "Nigeria",
        phone: "+234",
        regex: "^\\+234[\\d]{10}$",
    },
    {
        country: "Rwanda",
        phone: "+250",
        regex: "^\\+250[\\d]{9}$",
    },
    {
        country: "Sao Tome and Principe",
        phone: "+239",
        regex: "^\\+239[\\d]{7}$",
    },
    {
        country: "Senegal",
        phone: "+221",
        regex: "^\\+221[\\d]{8}$",
    },
    {
        country: "Seychelles",
        phone: "+248",
        regex: "^\\+248[\\d]{7}$",
    },
    {
        country: "Sierra Leone",
        phone: "+232",
        regex: "^\\+232[\\d]{8}$",
    },
    {
        country: "Somalia",
        phone: "+252",
        regex: "^\\+252[\\d]{7}$",
    },
    {
        country: "South Africa",
        phone: "+27",
        regex: "^\\+27[\\d]{9}$",
    },
    {
        country: "South Sudan",
        phone: "+211",
        regex: "^\\+211[\\d]{9}$",
    },
    {
        country: "Sudan",
        phone: "+249",
        regex: "^\\+249[\\d]{9}$",
    },
    {
        country: "Tanzania",
        phone: "+255",
        regex: "^\\+255[\\d]{9}$",
    },
    {
        country: "Togo",
        phone: "+228",
        regex: "^\\+228[\\d]{8}$",
    },
    {
        country: "Tunisia",
        phone: "+216",
        regex: "^\\+216[\\d]{7}$",
    },
    {
        country: "Uganda",
        phone: "+256",
        regex: "^\\+256[\\d]{9}$",
    },
    {
        country: "Zambia",
        phone: "+260",
        regex: "^\\+260[\\d]{9}$",
    },
    {
        country: "Zimbabwe",
        phone: "+263",
        regex: "^\\+263[\\d]{9}$",
    },
    {
        country: "Albania",
        phone: "+355",
        regex: "^\\+355[\\d]{8}$",
    },
    {
        country: "Andorra",
        phone: "+376",
        regex: "^\\+376[\\d]{6}$",
    },
    {
        country: "Armenia",
        phone: "+374",
        regex: "^\\+374[\\d]{8}$",
    },
    {
        country: "Austria",
        phone: "+43",
        regex: "^\\+43[\\d]{10}$",
    },
    {
        country: "Azerbaijan",
        phone: "+994",
        regex: "^\\+994[\\d]{9}$",
    },
    {
        country: "Belarus",
        phone: "+375",
        regex: "^\\+375[\\d]{9}$",
    },
    {
        country: "Belgium",
        phone: "+32",
        regex: "^\\+32[\\d]{9}$",
    },
    {
        country: "Bosnia and Herzegovina",
        phone: "+387",
        regex: "^\\+387[\\d]{8}$",
    },
    {
        country: "Bulgaria",
        phone: "+359",
        regex: "^\\+359[\\d]{8}$",
    },
    {
        country: "Croatia",
        phone: "+385",
        regex: "^\\+385[\\d]{9}$",
    },
    {
        country: "Cyprus",
        phone: "+357",
        regex: "^\\+357[\\d]{8}$",
    },
    {
        country: "Czech Republic",
        phone: "+420",
        regex: "^\\+420[\\d]{9}$",
    },
    {
        country: "Denmark",
        phone: "+45",
        regex: "^\\+45[\\d]{8}$",
    },
    {
        country: "Estonia",
        phone: "+372",
        regex: "^\\+372[\\d]{7}$",
    },
    {
        country: "Finland",
        phone: "+358",
        regex: "^\\+358[\\d]{9}$",
    },
    {
        country: "France",
        phone: "+33",
        regex: "^\\+33[\\d]{9}$",
    },
    {
        country: "Georgia",
        phone: "+995",
        regex: "^\\+995[\\d]{9}$",
    },
    {
        country: "Germany",
        phone: "+49",
        regex: "^\\+49[\\d]{10}$",
    },
    {
        country: "Greece",
        phone: "+30",
        regex: "^\\+30[\\d]{10}$",
    },
    {
        country: "Hungary",
        phone: "+36",
        regex: "^\\+36[\\d]{9}$",
    },
    {
        country: "Iceland",
        phone: "+354",
        regex: "^\\+354[\\d]{7}$",
    },
    {
        country: "Ireland",
        phone: "+353",
        regex: "^\\+353[\\d]{9}$",
    },
    {
        country: "Italy",
        phone: "+39",
        regex: "^\\+39[\\d]{10}$",
    },
    {
        country: "Kazakhstan",
        phone: "+7",
        regex: "^\\+7[\\d]{10}$",
    },
    {
        country: "Kosovo",
        phone: "+383",
        regex: "^\\+383[\\d]{8}$",
    },
    {
        country: "Latvia",
        phone: "+371",
        regex: "^\\+371[\\d]{8}$",
    },
    {
        country: "Liechtenstein",
        phone: "+423",
        regex: "^\\+423[\\d]{7}$",
    },
    {
        country: "Lithuania",
        phone: "+370",
        regex: "^\\+370[\\d]{8}$",
    },
    {
        country: "Luxembourg",
        phone: "+352",
        regex: "^\\+352[\\d]{8}$",
    },
    {
        country: "Malta",
        phone: "+356",
        regex: "^\\+356[\\d]{8}$",
    },
    {
        country: "Moldova",
        phone: "+373",
        regex: "^\\+373[\\d]{8}$",
    },
    {
        country: "Monaco",
        phone: "+377",
        regex: "^\\+377[\\d]{8}$",
    },
    {
        country: "Montenegro",
        phone: "+382",
        regex: "^\\+382[\\d]{8}$",
    },
    {
        country: "Netherlands",
        phone: "+31",
        regex: "^\\+31[\\d]{9}$",
    },
    {
        country: "North Macedonia",
        phone: "+389",
        regex: "^\\+389[\\d]{7}$",
    },
    {
        country: "Norway",
        phone: "+47",
        regex: "^\\+47[\\d]{8}$",
    },
    {
        country: "Poland",
        phone: "+48",
        regex: "^\\+48[\\d]{9}$",
    },
    {
        country: "Portugal",
        phone: "+351",
        regex: "^\\+351[\\d]{9}$",
    },
    {
        country: "Romania",
        phone: "+40",
        regex: "^\\+40[\\d]{9}$",
    },
    {
        country: "Russia",
        phone: "+7",
        regex: "^\\+7[\\d]{10}$",
    },
    {
        country: "San Marino",
        phone: "+378",
        regex: "^\\+378[\\d]{6}$",
    },
    {
        country: "Serbia",
        phone: "+381",
        regex: "^\\+381[\\d]{8}$",
    },
    {
        country: "Slovakia",
        phone: "+421",
        regex: "^\\+421[\\d]{9}$",
    },
    {
        country: "Slovenia",
        phone: "+386",
        regex: "^\\+386[\\d]{8}$",
    },
    {
        country: "Spain",
        phone: "+34",
        regex: "^\\+34[\\d]{9}$",
    },
    {
        country: "Sweden",
        phone: "+46",
        regex: "^\\+46[\\d]{9}$",
    },
    {
        country: "Switzerland",
        phone: "+41",
        regex: "^\\+41[\\d]{9}$",
    },
    {
        country: "Ukraine",
        phone: "+380",
        regex: "^\\+380[\\d]{9}$",
    },
    {
        country: "United Kingdom",
        phone: "+44",
        regex: "^\\+44[\\d]{10}$",
    },
    {
        country: "Vatican City",
        phone: "+379",
        regex: "^\\+379[\\d]{6}$",
    },
    {
        country: "Antigua and Barbuda",
        phone: "+1",
        regex: "^(\\+1)[\\d]{10}$",
    },
    {
        country: "Argentina",
        phone: "+54",
        regex: "^(\\+54)[\\d]{10}$",
    },
    {
        country: "Bahamas",
        phone: "+1",
        regex: "^(\\+1)[\\d]{10}$",
    },
    {
        country: "Barbados",
        phone: "+1",
        regex: "^(\\+1)[\\d]{10}$",
    },
    {
        country: "Belize",
        phone: "+501",
        regex: "^(\\+501)[\\d]{7}$",
    },
    {
        country: "Bolivia",
        phone: "+591",
        regex: "^(\\+591)[\\d]{8}$",
    },
    {
        country: "Brazil",
        phone: "+55",
        regex: "^(\\+55)[\\d]{10,11}$",
    },
    {
        country: "Canada",
        phone: "+1",
        regex: "^(\\+1)[\\d]{10}$",
    },
    {
        country: "Chile",
        phone: "+56",
        regex: "^(\\+56)[\\d]{9}$",
    },
    {
        country: "Colombia",
        phone: "+57",
        regex: "^(\\+57)[\\d]{10}$",
    },
    {
        country: "Costa Rica",
        phone: "+506",
        regex: "^(\\+506)[\\d]{8}$",
    },
    {
        country: "Cuba",
        phone: "+53",
        regex: "^(\\+53)[\\d]{8}$",
    },
    {
        country: "Dominica",
        phone: "+1",
        regex: "^(\\+1)[\\d]{10}$",
    },
    {
        country: "Dominican Republic",
        phone: "+1",
        regex: "^(\\+1)[\\d]{10}$",
    },
    {
        country: "Ecuador",
        phone: "+593",
        regex: "^(\\+593)[\\d]{9}$",
    },
    {
        country: "El Salvador",
        phone: "+503",
        regex: "^(\\+503)[\\d]{8}$",
    },
    {
        country: "Grenada",
        phone: "+1",
        regex: "^(\\+1)[\\d]{10}$",
    },
    {
        country: "Guatemala",
        phone: "+502",
        regex: "^(\\+502)[\\d]{8}$",
    },
    {
        country: "Guyana",
        phone: "+592",
        regex: "^(\\+592)[\\d]{7}$",
    },
    {
        country: "Haiti",
        phone: "+509",
        regex: "^(\\+509)[\\d]{8}$",
    },
    {
        country: "Honduras",
        phone: "+504",
        regex: "^(\\+504)[\\d]{8}$",
    },
    {
        country: "Jamaica",
        phone: "+1",
        regex: "^(\\+1)[\\d]{10}$",
    },
    {
        country: "Mexico",
        phone: "+52",
        regex: "^(\\+52)[\\d]{10}$",
    },
    {
        country: "Nicaragua",
        phone: "+505",
        regex: "^(\\+505)[\\d]{8}$",
    },
    {
        country: "Panama",
        phone: "+507",
        regex: "^(\\+507)[\\d]{7}$",
    },
    {
        country: "Paraguay",
        phone: "+595",
        regex: "^(\\+595)[\\d]{9}$",
    },
    {
        country: "Peru",
        phone: "+51",
        regex: "^(\\+51)[\\d]{9}$",
    },
    {
        country: "Saint Kitts and Nevis",
        phone: "+1",
        regex: "^(\\+1)[\\d]{10}$",
    },
    {
        country: "Saint Lucia",
        phone: "+1",
        regex: "^(\\+1)[\\d]{10}$",
    },
    {
        country: "Saint Vincent and the Grenadines",
        phone: "+1",
        regex: "^(\\+1)[\\d]{10}$",
    },
    {
        country: "Suriname",
        phone: "+597",
        regex: "^(\\+597)[\\d]{7}$",
    },
    {
        country: "Trinidad and Tobago",
        phone: "+1",
        regex: "^(\\+1)[\\d]{10}$",
    },
    {
        country: "United States",
        phone: "+1",
        regex: "^(\\+1)[\\d]{10}$",
    },
    {
        country: "Uruguay",
        phone: "+598",
        regex: "^(\\+598)[\\d]{7}$",
    },
    {
        country: "Venezuela",
        phone: "+58",
        regex: "^(\\+58)[\\d]{10}$",
    },
    {
        country: "Afghanistan",
        phone: "+93",
        regex: "^(\\+93)[\\d]{9}$",
    },
    {
        country: "Armenia",
        phone: "+374",
        regex: "^(\\+374)[\\d]{8}$",
    },
    {
        country: "Azerbaijan",
        phone: "+994",
        regex: "^(\\+994)[\\d]{9}$",
    },
    {
        country: "Bahrain",
        phone: "+973",
        regex: "^(\\+973)[\\d]{8}$",
    },
    {
        country: "Bangladesh",
        phone: "+880",
        regex: "^(\\+880)[\\d]{10}$",
    },
    {
        country: "Bhutan",
        phone: "+975",
        regex: "^(\\+975)[\\d]{8}$",
    },
    {
        country: "Brunei",
        phone: "+673",
        regex: "^(\\+673)[\\d]{7}$",
    },
    {
        country: "Cambodia",
        phone: "+855",
        regex: "^(\\+855)[\\d]{8}$",
    },
    {
        country: "China",
        phone: "+86",
        regex: "^(\\+86)[\\d]{11}$",
    },
    {
        country: "Cyprus",
        phone: "+357",
        regex: "^(\\+357)[\\d]{8}$",
    },
    {
        country: "Georgia",
        phone: "+995",
        regex: "^(\\+995)[\\d]{9}$",
    },
    {
        country: "India",
        phone: "+91",
        regex: "^(\\+91)[\\d]{10}$",
    },
    {
        country: "Indonesia",
        phone: "+62",
        regex: "^(\\+62)[\\d]{9,12}$",
    },
    {
        country: "Iran",
        phone: "+98",
        regex: "^(\\+98)[\\d]{10}$",
    },
    {
        country: "Iraq",
        phone: "+964",
        regex: "^(\\+964)[\\d]{10}$",
    },
    {
        country: "Israel",
        phone: "+972",
        regex: "^(\\+972)[\\d]{9}$",
    },
    {
        country: "Japan",
        phone: "+81",
        regex: "^(\\+81)[\\d]{10}$",
    },
    {
        country: "Jordan",
        phone: "+962",
        regex: "^(\\+962)[\\d]{9}$",
    },
    {
        country: "Kazakhstan",
        phone: "+7",
        regex: "^(\\+7)[\\d]{10}$",
    },
    {
        country: "Kuwait",
        phone: "+965",
        regex: "^(\\+965)[\\d]{8}$",
    },
    {
        country: "Kyrgyzstan",
        phone: "+996",
        regex: "^(\\+996)[\\d]{9}$",
    },
    {
        country: "Laos",
        phone: "+856",
        regex: "^(\\+856)[\\d]{8,9}$",
    },
    {
        country: "Lebanon",
        phone: "+961",
        regex: "^(\\+961)[\\d]{7}$",
    },
    {
        country: "Malaysia",
        phone: "+60",
        regex: "^(\\+60)[\\d]{9,10}$",
    },
    {
        country: "Maldives",
        phone: "+960",
        regex: "^(\\+960)[\\d]{7}$",
    },
    {
        country: "Mongolia",
        phone: "+976",
        regex: "^(\\+976)[\\d]{8}$",
    },
    {
        country: "Myanmar",
        phone: "+95",
        regex: "^(\\+95)[\\d]{7,10}$",
    },
    {
        country: "Nepal",
        phone: "+977",
        regex: "^(\\+977)[\\d]{9}$",
    },
    {
        country: "North Korea",
        phone: "+850",
        regex: "^(\\+850)[\\d]{8}$",
    },
    {
        country: "Oman",
        phone: "+968",
        regex: "^(\\+968)[\\d]{8}$",
    },
    {
        country: "Pakistan",
        phone: "+92",
        regex: "^(\\+92)[\\d]{10}$",
    },
    {
        country: "Palestine",
        phone: "+970",
        regex: "^(\\+970)[\\d]{9}$",
    },
    {
        country: "Philippines",
        phone: "+63",
        regex: "^(\\+63)[\\d]{10}$",
    },
    {
        country: "Qatar",
        phone: "+974",
        regex: "^(\\+974)[\\d]{7}$",
    },
    {
        country: "Saudi Arabia",
        phone: "+966",
        regex: "^(\\+966)[\\d]{9}$",
    },
    {
        country: "Singapore",
        phone: "+65",
        regex: "^(\\+65)[\\d]{8}$",
    },
    {
        country: "South Korea",
        phone: "+82",
        regex: "^(\\+82)[\\d]{9,11}$",
    },
    {
        country: "Sri Lanka",
        phone: "+94",
        regex: "^(\\+94)[\\d]{9}$",
    },
    {
        country: "Syria",
        phone: "+963",
        regex: "^(\\+963)[\\d]{9}$",
    },
    {
        country: "Taiwan",
        phone: "+886",
        regex: "^(\\+886)[\\d]{9}$",
    },
    {
        country: "Tajikistan",
        phone: "+992",
        regex: "^(\\+992)[\\d]{9}$",
    },
    {
        country: "Thailand",
        phone: "+66",
        regex: "^(\\+66)[\\d]{9}$",
    },
    {
        country: "Timor-Leste",
        phone: "+670",
        regex: "^(\\+670)[\\d]{7}$",
    },
    {
        country: "Turkey",
        phone: "+90",
        regex: "^(\\+90)[\\d]{10}$",
    },
    {
        country: "Turkmenistan",
        phone: "+993",
        regex: "^(\\+993)[\\d]{8}$",
    },
    {
        country: "United Arab Emirates",
        phone: "+971",
        regex: "^(\\+971)[\\d]{9}$",
    },
    {
        country: "Uzbekistan",
        phone: "+998",
        regex: "^(\\+998)[\\d]{9}$",
    },
    {
        country: "Vietnam",
        phone: "+84",
        regex: "^(\\+84)[\\d]{9,10}$",
    },
    {
        country: "Yemen",
        phone: "+967",
        regex: "^(\\+967)[\\d]{9}$",
    },
    {
        country: "Australia",
        phone: "+61",
        regex: "^(\\+61)[\\d]{9}$",
    },
    {
        country: "Fiji",
        phone: "+679",
        regex: "^(\\+679)[\\d]{7}$",
    },
    {
        country: "New Zealand",
        phone: "+64",
        regex: "^(\\+64)[\\d]{8,9}$",
    },
    {
        country: "Papua New Guinea",
        phone: "+675",
        regex: "^(\\+675)[\\d]{6,8}$",
    },
    {
        country: "Samoa",
        phone: "+685",
        regex: "^(\\+685)[\\d]{7}$",
    },
];
export const ANSWER_LIMIT = 10;
export const FILTER_ITEM = [
    {
        title: "Ratings",
        type: "radio",
        isRating: true,
        elements: [
            {
                label: "4.5 & up",
                value: "01",
                rating: 4.5,
                number: 0,
            },
            {
                label: "4.0 & up",
                rating: 4,
                value: "02",
                number: 0,
            },
            {
                label: "3.5 & up",
                value: "03",
                rating: 3.5,
                number: 0,
            },
            {
                label: "3.0 & up",
                value: "04",
                rating: 3,
                number: 0,
            },
        ],
        active: true,
        value: null,
    },
    {
        title: "Language",
        type: "checkbox",
        elements: [
            {
                label: "French",
                value: "French",
                number: 0,
            },
        ],
        active: false,
        value: [],
    },
    {
        title: "Video Duration",
        type: "checkbox",
        elements: [
            {
                label: "0-1 Hour",
                value: "0-1 Hour",
                number: 0,
            },
            {
                label: "1-3 Hours",
                value: "1-3 Hours",
                number: 0,
            },
            {
                label: "3-6 Hours",
                value: "3-6 Hours",
                number: 0,
            },
            {
                label: "6-20 Hours",
                value: "6-20 Hours",
                number: 0,
            },
            {
                label: "20+ Hours",
                value: "20+ Hours",
                number: 0,
            },
        ],
        active: false,
        value: [],
    },
    {
        title: "Features",
        type: "checkbox",
        elements: [
            {
                label: "Subtitles",
                value: "Subtitles",
                number: 0,
            },
            {
                label: "Quiz",
                value: "Quizzes",
                number: 0,
            },
            {
                label: "Coding Exercise",
                value: "CodingExercises",
                number: 0,
            },
            {
                label: "Practice Test",
                value: "Practice Tests",
                number: 0,
            },
        ],
        active: false,
        value: [],
    },
    {
        title: "Topic",
        type: "checkbox",
        elements: [
            {
                label: "Python",
                value: "Python",
                number: 0,
            },
            {
                label: "C++",
                value: "C++",
                number: 0,
            },
        ],
        active: false,
        value: [],
    },
    {
        title: "Level",
        type: "checkbox",
        elements: [
            {
                label: "All Levels",
                value: "AllLevels",
                number: 0,
            },
            {
                label: "Beginner",
                value: "Beginner",
                number: 0,
            },
            {
                label: "Intermediate",
                value: "Intermediate",
                number: 0,
            },
            {
                label: "Expert",
                value: "Expert",
                number: 0,
            },
        ],
        active: false,
        value: [],
    },
    {
        title: "Price",
        type: "checkbox",
        elements: [
            {
                label: "Paid",
                value: "Paid",
                number: 0,
            },
            {
                label: "Free",
                value: "Free",
                number: 0,
            },
        ],
        active: false,
        value: [],
    },
];
export const STUDENT_ID = 2;
export const GRIOT_USER_ID = 4
export const LECTURE_TYPE = {
    'CodingExercise': 'Coding Exercise',
    'Quiz': "Quiz",
    'Lecture': 'Lecture'
}

function convertMonthNumberToName(monthNumber: number) {
    const monthNames: { [key: string]: string } = {
        "1": "Jan",
        "2": "Feb",
        "3": "Mar",
        "4": "Apr",
        "5": "May",
        "6": "Jun",
        "7": "Jul",
        "8": "Aug",
        "9": "Sep",
        "10": "Oct",
        "11": "Nov",
        "12": "Dec"
    };

    if (monthNumber < 1 || monthNumber > 12) {
        throw new Error(`Invalid month number: ${monthNumber}`);
    }

    return monthNames[monthNumber.toString()];
}

export function convertDateStringToMonthYearFormat(dateString :string) {
    try {
        const [monthNumber, year] = dateString.split("_");
        const monthName = convertMonthNumberToName(parseInt(monthNumber));
        return `${monthName}, ${year}`;
    } catch {
        throw new Error(`Invalid date string format: ${dateString}`);
    }
}

export const COUNTRY_CODE = [
    { "name": "Afghanistan", "code": "AF", "phone": "+93" },
    { "name": "Albania", "code": "AL", "phone": "+355" },
    { "name": "Algeria", "code": "DZ", "phone": "+213" },
    { "name": "Andorra", "code": "AD", "phone": "+376" },
    { "name": "Angola", "code": "AO", "phone": "+244" },
    { "name": "Antigua and Barbuda", "code": "AG", "phone": "+1-268" },
    { "name": "Argentina", "code": "AR", "phone": "+54" },
    { "name": "Armenia", "code": "AM", "phone": "+374" },
    { "name": "Australia", "code": "AU", "phone": "+61" },
    { "name": "Austria", "code": "AT", "phone": "+43" },
    { "name": "Azerbaijan", "code": "AZ", "phone": "+994" },
    { "name": "Bahamas", "code": "BS", "phone": "+1-242" },
    { "name": "Bahrain", "code": "BH", "phone": "+973" },
    { "name": "Bangladesh", "code": "BD", "phone": "+880" },
    { "name": "Barbados", "code": "BB", "phone": "+1-246" },
    { "name": "Belarus", "code": "BY", "phone": "+375" },
    { "name": "Belgium", "code": "BE", "phone": "+32" },
    { "name": "Belize", "code": "BZ", "phone": "+501" },
    { "name": "Benin", "code": "BJ", "phone": "+229" },
    { "name": "Bhutan", "code": "BT", "phone": "+975" },
    { "name": "Bolivia", "code": "BO", "phone": "+591" },
    { "name": "Bosnia and Herzegovina", "code": "BA", "phone": "+387" },
    { "name": "Botswana", "code": "BW", "phone": "+267" },
    { "name": "Brazil", "code": "BR", "phone": "+55" },
    { "name": "Brunei", "code": "BN", "phone": "+673" },
    { "name": "Bulgaria", "code": "BG", "phone": "+359" },
    { "name": "Burkina Faso", "code": "BF", "phone": "+226" },
    { "name": "Burundi", "code": "BI", "phone": "+257" },
    { "name": "Cabo Verde", "code": "CV", "phone": "+238" },
    { "name": "Cambodia", "code": "KH", "phone": "+855" },
    { "name": "Cameroon", "code": "CM", "phone": "+237" },
    { "name": "Canada", "code": "CA", "phone": "+1" },
    { "name": "Central African Republic", "code": "CF", "phone": "+236" },
    { "name": "Chad", "code": "TD", "phone": "+235" },
    { "name": "Chile", "code": "CL", "phone": "+56" },
    { "name": "China", "code": "CN", "phone": "+86" },
    { "name": "Colombia", "code": "CO", "phone": "+57" },
    { "name": "Comoros", "code": "KM", "phone": "+269" },
    { "name": "Congo", "code": "CG", "phone": "+242" },
    { "name": "Costa Rica", "code": "CR", "phone": "+506" },
    { "name": "Côte d'Ivoire", "code": "CI", "phone": "+225" },
    { "name": "Croatia", "code": "HR", "phone": "+385" },
    { "name": "Cuba", "code": "CU", "phone": "+53" },
    { "name": "Cyprus", "code": "CY", "phone": "+357" },
    { "name": "Czech Republic", "code": "CZ", "phone": "+420" },
    { "name": "Denmark", "code": "DK", "phone": "+45" },
    { "name": "Djibouti", "code": "DJ", "phone": "+253" },
    { "name": "Dominica", "code": "DM", "phone": "+1-767" },
    { "name": "Dominican Republic", "code": "DO", "phone": "+1-809, +1-829, +1-849" },
    { "name": "Ecuador", "code": "EC", "phone": "+593" },
    { "name": "Egypt", "code": "EG", "phone": "+20" },
    { "name": "El Salvador", "code": "SV", "phone": "+503" },
    { "name": "Equatorial Guinea", "code": "GQ", "phone": "+240" },
    { "name": "Eritrea", "code": "ER", "phone": "+291" },
    { "name": "Estonia", "code": "EE", "phone": "+372" },
    { "name": "Eswatini", "code": "SZ", "phone": "+268" },
    { "name": "Ethiopia", "code": "ET", "phone": "+251" },
    { "name": "Fiji", "code": "FJ", "phone": "+679" },
    { "name": "Finland", "code": "FI", "phone": "+358" },
    { "name": "France", "code": "FR", "phone": "+33" },
    { "name": "Gabon", "code": "GA", "phone": "+241" },
    { "name": "Gambia", "code": "GM", "phone": "+220" },
    { "name": "Georgia", "code": "GE", "phone": "+995" },
    { "name": "Germany", "code": "DE", "phone": "+49" },
    { "name": "Ghana", "code": "GH", "phone": "+233" },
    { "name": "Greece", "code": "GR", "phone": "+30" },
    { "name": "Grenada", "code": "GD", "phone": "+1-473" },
    { "name": "Guatemala", "code": "GT", "phone": "+502" },
    { "name": "Guinea", "code": "GN", "phone": "+224" },
    { "name": "Guinea-Bissau", "code": "GW", "phone": "+245" },
    { "name": "Guyana", "code": "GY", "phone": "+592" },
    { "name": "Haiti", "code": "HT", "phone": "+509" },
    { "name": "Honduras", "code": "HN", "phone": "+504" },
    { "name": "Hungary", "code": "HU", "phone": "+36" },
    { "name": "Iceland", "code": "IS", "phone": "+354" },
    { "name": "India", "code": "IN", "phone": "+91" },
    { "name": "Indonesia", "code": "ID", "phone": "+62" },
    { "name": "Iran", "code": "IR", "phone": "+98" },
    { "name": "Iraq", "code": "IQ", "phone": "+964" },
    { "name": "Ireland", "code": "IE", "phone": "+353" },
    { "name": "Israel", "code": "IL", "phone": "+972" },
    { "name": "Italy", "code": "IT", "phone": "+39" },
    { "name": "Jamaica", "code": "JM", "phone": "+1-876" },
    { "name": "Japan", "code": "JP", "phone": "+81" },
    { "name": "Jordan", "code": "JO", "phone": "+962" },
    { "name": "Kazakhstan", "code": "KZ", "phone": "+7" },
    { "name": "Kenya", "code": "KE", "phone": "+254" },
    { "name": "Kiribati", "code": "KI", "phone": "+686" },
    { "name": "Korea, North", "code": "KP", "phone": "+850" },
    { "name": "Korea, South", "code": "KR", "phone": "+82" },
    { "name": "Kuwait", "code": "KW", "phone": "+965" },
    { "name": "Kyrgyzstan", "code": "KG", "phone": "+996" },
    { "name": "Laos", "code": "LA", "phone": "+856" },
    { "name": "Latvia", "code": "LV", "phone": "+371" },
    { "name": "Lebanon", "code": "LB", "phone": "+961" },
    { "name": "Lesotho", "code": "LS", "phone": "+266" },
    { "name": "Liberia", "code": "LR", "phone": "+231" },
    { "name": "Libya", "code": "LY", "phone": "+218" },
    { "name": "Liechtenstein", "code": "LI", "phone": "+423" },
    { "name": "Lithuania", "code": "LT", "phone": "+370" },
    { "name": "Luxembourg", "code": "LU", "phone": "+352" },
    { "name": "Madagascar", "code": "MG", "phone": "+261" },
    { "name": "Malawi", "code": "MW", "phone": "+265" },
    { "name": "Malaysia", "code": "MY", "phone": "+60" },
    { "name": "Maldives", "code": "MV", "phone": "+960" },
    { "name": "Mali", "code": "ML", "phone": "+223" },
    { "name": "Malta", "code": "MT", "phone": "+356" },
    { "name": "Marshall Islands", "code": "MH", "phone": "+692" },
    { "name": "Mauritania", "code": "MR", "phone": "+222" },
    { "name": "Mauritius", "code": "MU", "phone": "+230" },
    { "name": "Mexico", "code": "MX", "phone": "+52" },
    { "name": "Micronesia", "code": "FM", "phone": "+691" },
    { "name": "Moldova", "code": "MD", "phone": "+373" },
    { "name": "Monaco", "code": "MC", "phone": "+377" },
    { "name": "Mongolia", "code": "MN", "phone": "+976" },
    { "name": "Montenegro", "code": "ME", "phone": "+382" },
    { "name": "Morocco", "code": "MA", "phone": "+212" },
    { "name": "Mozambique", "code": "MZ", "phone": "+258" },
    { "name": "Myanmar", "code": "MM", "phone": "+95" },
    { "name": "Namibia", "code": "NA", "phone": "+264" },
    { "name": "Nauru", "code": "NR", "phone": "+674" },
    { "name": "Nepal", "code": "NP", "phone": "+977" },
    { "name": "Netherlands", "code": "NL", "phone": "+31" },
    { "name": "New Zealand", "code": "NZ", "phone": "+64" },
    { "name": "Nicaragua", "code": "NI", "phone": "+505" },
    { "name": "Niger", "code": "NE", "phone": "+227" },
    { "name": "Nigeria", "code": "NG", "phone": "+234" },
    { "name": "North Macedonia", "code": "MK", "phone": "+389" },
    { "name": "Norway", "code": "NO", "phone": "+47" },
    { "name": "Oman", "code": "OM", "phone": "+968" },
    { "name": "Pakistan", "code": "PK", "phone": "+92" },
    { "name": "Palau", "code": "PW", "phone": "+680" },
    { "name": "Panama", "code": "PA", "phone": "+507" },
    { "name": "Papua New Guinea", "code": "PG", "phone": "+675" },
    { "name": "Paraguay", "code": "PY", "phone": "+595" },
    { "name": "Peru", "code": "PE", "phone": "+51" },
    { "name": "Philippines", "code": "PH", "phone": "+63" },
    { "name": "Poland", "code": "PL", "phone": "+48" },
    { "name": "Portugal", "code": "PT", "phone": "+351" },
    { "name": "Qatar", "code": "QA", "phone": "+974" },
    { "name": "Romania", "code": "RO", "phone": "+40" },
    { "name": "Russia", "code": "RU", "phone": "+7" },
    { "name": "Rwanda", "code": "RW", "phone": "+250" },
    { "name": "Saint Kitts and Nevis", "code": "KN", "phone": "+1-869" },
    { "name": "Saint Lucia", "code": "LC", "phone": "+1-758" },
    { "name": "Saint Vincent and the Grenadines", "code": "VC", "phone": "+1-784" },
    { "name": "Samoa", "code": "WS", "phone": "+685" },
    { "name": "San Marino", "code": "SM", "phone": "+378" },
    { "name": "Sao Tome and Principe", "code": "ST", "phone": "+239" },
    { "name": "Saudi Arabia", "code": "SA", "phone": "+966" },
    { "name": "Senegal", "code": "SN", "phone": "+221" },
    { "name": "Serbia", "code": "RS", "phone": "+381" },
    { "name": "Seychelles", "code": "SC", "phone": "+248" },
    { "name": "Sierra Leone", "code": "SL", "phone": "+232" },
    { "name": "Singapore", "code": "SG", "phone": "+65" },
    { "name": "Slovakia", "code": "SK", "phone": "+421" },
    { "name": "Slovenia", "code": "SI", "phone": "+386" },
    { "name": "Solomon Islands", "code": "SB", "phone": "+677" },
    { "name": "Somalia", "code": "SO", "phone": "+252" },
    { "name": "South Africa", "code": "ZA", "phone": "+27" },
    { "name": "South Sudan", "code": "SS", "phone": "+211" },
    { "name": "Spain", "code": "ES", "phone": "+34" },
    { "name": "Sri Lanka", "code": "LK", "phone": "+94" },
    { "name": "Sudan", "code": "SD", "phone": "+249" },
    { "name": "Suriname", "code": "SR", "phone": "+597" },
    { "name": "Sweden", "code": "SE", "phone": "+46" },
    { "name": "Switzerland", "code": "CH", "phone": "+41" },
    { "name": "Syria", "code": "SY", "phone": "+963" },
    { "name": "Taiwan", "code": "TW", "phone": "+886" },
    { "name": "Tajikistan", "code": "TJ", "phone": "+992" },
    { "name": "Tanzania", "code": "TZ", "phone": "+255" },
    { "name": "Thailand", "code": "TH", "phone": "+66" },
    { "name": "Timor-Leste", "code": "TL", "phone": "+670" },
    { "name": "Togo", "code": "TG", "phone": "+228" },
    { "name": "Tonga", "code": "TO", "phone": "+676" },
    { "name": "Trinidad and Tobago", "code": "TT", "phone": "+1-868" },
    { "name": "Tunisia", "code": "TN", "phone": "+216" },
    { "name": "Turkey", "code": "TR", "phone": "+90" },
    { "name": "Turkmenistan", "code": "TM", "phone": "+993" },
    { "name": "Tuvalu", "code": "TV", "phone": "+688" },
    { "name": "Uganda", "code": "UG", "phone": "+256" },
    { "name": "Ukraine", "code": "UA", "phone": "+380" },
    { "name": "United Arab Emirates", "code": "AE", "phone": "+971" },
    { "name": "United Kingdom", "code": "GB", "phone": "+44" },
    { "name": "United States", "code": "US", "phone": "+1" },
    { "name": "Uruguay", "code": "UY", "phone": "+598" },
    { "name": "Uzbekistan", "code": "UZ", "phone": "+998" },
    { "name": "Vanuatu", "code": "VU", "phone": "+678" },
    { "name": "Vatican City", "code": "VA", "phone": "+379" },
    { "name": "Venezuela", "code": "VE", "phone": "+58" },
    { "name": "Vietnam", "code": "VN", "phone": "+84" },
    { "name": "Yemen", "code": "YE", "phone": "+967" },
    { "name": "Zambia", "code": "ZM", "phone": "+260" },
    { "name": "Zimbabwe", "code": "ZW", "phone": "+263" }
]


export const ROLE_STUDENT = 2
export const ROLE_INSTRUCTOR = 3