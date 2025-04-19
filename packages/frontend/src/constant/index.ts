export const projectQuestionnaire = [
    {
        id: "projectName",
        label: "What is the name of your project or brand?",
        type: "text",
        required: true
    },
    {
        id: "theme",
        label: "What kind of template do you want?",
        type: "select",
        options: ["Portfolio", "Dashboard", "Landing Page", "Business", "Product", "Other"],
        required: true
    },
    {
        id: "primaryColor",
        label: "What’s your primary brand color?",
        type: "color",
        required: false
    },
    {
        id: "font",
        label: "What font do you prefer?",
        type: "select",
        options: [
            { id: "inter", label: "Inter" },
            { id: "roboto", label: "Roboto" },
            { id: "open-sans", label: "Open Sans" },
            { id: "poppins", label: "Poppins" },
            { id: "lato", label: "Lato" },
            { id: "montserrat", label: "Montserrat" },
            { id: "system-ui", label: "System UI" }
        ]
    },
    {
        id: "logo",
        label: "Do you have a logo to include?",
        type: "file",
        accept: "image/*",
        required: false
    },
    {
        id: "layout",
        label: "Layout preferences",
        type: "checkbox-group",
        options: [
            { id: "header", label: "Show header" },
            { id: "footer", label: "Show footer" },
            { id: "sidebar", label: "Include sidebar" }
        ]
    },
    {
        id: "sections",
        label: "What sections do you want on the page?",
        type: "checkbox-group",
        options: [
            { id: "hero", label: "Hero (intro with title + CTA)" },
            { id: "features", label: "Features" },
            { id: "testimonials", label: "Testimonials" },
            { id: "about", label: "About" },
            { id: "stats", label: "Stats" },
            { id: "contact", label: "Contact" },
            { id: "faq", label: "FAQ" },
            { id: "gallery", label: "Gallery" },
            { id: "custom", label: "Custom section" }
        ]
    },
    // {
    //     id: "hero",
    //     label: "Hero Section",
    //     type: "group",
    //     condition: "sections.includes('hero')",
    //     fields: [
    //         { id: "title", label: "Title", type: "text" },
    //         { id: "subtitle", label: "Subtitle", type: "text" },
    //         { id: "ctaText", label: "CTA Text", type: "text" },
    //         { id: "ctaLink", label: "CTA Link", type: "text" },
    //         { id: "backgroundImage", label: "Background Image", type: "file", accept: "image/*" }
    //     ]
    // },
    // {
    //     id: "features",
    //     label: "Features Section",
    //     type: "repeater",
    //     condition: "sections.includes('features')",
    //     max: 5,
    //     fields: [
    //         { id: "title", label: "Feature Title", type: "text" },
    //         { id: "description", label: "Feature Description", type: "text" },
    //         { id: "icon", label: "Feature Icon (emoji or name)", type: "text" }
    //     ]
    // },
    // {
    //     id: "contact",
    //     label: "Contact Information",
    //     type: "group",
    //     condition: "sections.includes('contact')",
    //     fields: [
    //         { id: "email", label: "Email", type: "text" },
    //         { id: "phone", label: "Phone", type: "text" },
    //         { id: "address", label: "Address", type: "text" }
    //     ]
    // },
    {
        id: "footerLinks",
        label: "Any footer links? (e.g. GitHub, Privacy)",
        type: "repeater",
        max: 5,
        fields: [
            { id: "label", label: "Label", type: "text" },
            { id: "url", label: "URL", type: "text" }
        ]
    }
];
