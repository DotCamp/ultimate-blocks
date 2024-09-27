/**
 * WordPress Dependencies
 */
import { __ } from "@wordpress/i18n";
const fontAwesomeCategories = [
  {
    name: "accessibility",
    title: __("Accessibility", "ultimate-blocks-pro"),
  },
  {
    name: "alert",
    title: __("Alert", "ultimate-blocks-pro"),
  },
  {
    name: "animals",
    title: __("Animals", "ultimate-blocks-pro"),
  },
  {
    name: "arrows",
    title: __("Arrows", "ultimate-blocks-pro"),
  },
  {
    name: "audio-video",
    title: __("Audio & Video", "ultimate-blocks-pro"),
  },
  {
    name: "automotive",
    title: __("Automotive", "ultimate-blocks-pro"),
  },
  {
    name: "autumn",
    title: __("Autumn", "ultimate-blocks-pro"),
  },
  {
    name: "beverage",
    title: __("Beverage", "ultimate-blocks-pro"),
  },
  {
    name: "buildings",
    title: __("Buildings", "ultimate-blocks-pro"),
  },
  {
    name: "business",
    title: __("Business", "ultimate-blocks-pro"),
  },
  {
    name: "camping",
    title: __("Camping", "ultimate-blocks-pro"),
  },
  {
    name: "charity",
    title: __("Charity", "ultimate-blocks-pro"),
  },
  {
    name: "chat",
    title: __("Chat", "ultimate-blocks-pro"),
  },
  {
    name: "chess",
    title: __("Chess", "ultimate-blocks-pro"),
  },
  {
    name: "childhood",
    title: __("Childhood", "ultimate-blocks-pro"),
  },
  {
    name: "clothing",
    title: __("Clothing", "ultimate-blocks-pro"),
  },
  {
    name: "code",
    title: __("Code", "ultimate-blocks-pro"),
  },
  {
    name: "communication",
    title: __("Communication", "ultimate-blocks-pro"),
  },
  {
    name: "computers",
    title: __("Computers", "ultimate-blocks-pro"),
  },
  {
    name: "construction",
    title: __("Construction", "ultimate-blocks-pro"),
  },
  {
    name: "currency",
    title: __("Currency", "ultimate-blocks-pro"),
  },
  {
    name: "date-time",
    title: __("Date & Time", "ultimate-blocks-pro"),
  },
  {
    name: "design",
    title: __("Design", "ultimate-blocks-pro"),
  },
  {
    name: "editors",
    title: __("Editors", "ultimate-blocks-pro"),
  },
  {
    name: "education",
    title: __("Education", "ultimate-blocks-pro"),
  },
  {
    name: "emoji",
    title: __("Emoji", "ultimate-blocks-pro"),
  },
  {
    name: "energy",
    title: __("Energy", "ultimate-blocks-pro"),
  },
  {
    name: "files",
    title: __("Files", "ultimate-blocks-pro"),
  },
  {
    name: "finance",
    title: __("Finance", "ultimate-blocks-pro"),
  },
  {
    name: "fitness",
    title: __("Fitness", "ultimate-blocks-pro"),
  },
  {
    name: "food",
    title: __("Food", "ultimate-blocks-pro"),
  },
  {
    name: "fruit-vegetable",
    title: __("Fruits & Vegetables", "ultimate-blocks-pro"),
  },
  {
    name: "games",
    title: __("Games", "ultimate-blocks-pro"),
  },
  {
    name: "gaming-tabletop",
    title: __("Tabletop Gaming", "ultimate-blocks-pro"),
  },
  {
    name: "gender",
    title: __("Genders", "ultimate-blocks-pro"),
  },
  {
    name: "halloween",
    title: __("Halloween", "ultimate-blocks-pro"),
  },
  {
    name: "hands",
    title: __("Hands", "ultimate-blocks-pro"),
  },
  {
    name: "health",
    title: __("Health", "ultimate-blocks-pro"),
  },
  {
    name: "holiday",
    title: __("Holiday", "ultimate-blocks-pro"),
  },
  {
    name: "hotel",
    title: __("Hotel", "ultimate-blocks-pro"),
  },
  {
    name: "household",
    title: __("Household", "ultimate-blocks-pro"),
  },
  {
    name: "images",
    title: __("Images", "ultimate-blocks-pro"),
  },
  {
    name: "interfaces",
    title: __("Interfaces", "ultimate-blocks-pro"),
  },
  {
    name: "logistics",
    title: __("Logistics", "ultimate-blocks-pro"),
  },
  {
    name: "maps",
    title: __("Maps", "ultimate-blocks-pro"),
  },
  {
    name: "maritime",
    title: __("Maritime", "ultimate-blocks-pro"),
  },
  {
    name: "marketing",
    title: __("Marketing", "ultimate-blocks-pro"),
  },
  {
    name: "mathematics",
    title: __("Mathematics", "ultimate-blocks-pro"),
  },
  {
    name: "medical",
    title: __("Medical", "ultimate-blocks-pro"),
  },
  {
    name: "moving",
    title: __("Moving", "ultimate-blocks-pro"),
  },
  {
    name: "music",
    title: __("Music", "ultimate-blocks-pro"),
  },
  {
    name: "objects",
    title: __("Objects", "ultimate-blocks-pro"),
  },
  {
    name: "payments-shopping",
    title: __("Payments & Shopping", "ultimate-blocks-pro"),
  },
  {
    name: "pharmacy",
    title: __("Pharmacy", "ultimate-blocks-pro"),
  },
  {
    name: "political",
    title: __("Political", "ultimate-blocks-pro"),
  },
  {
    name: "religion",
    title: __("Religion", "ultimate-blocks-pro"),
  },
  {
    name: "science",
    title: __("Science", "ultimate-blocks-pro"),
  },
  {
    name: "science-fiction",
    title: __("Science Fiction", "ultimate-blocks-pro"),
  },
  {
    name: "security",
    title: __("Security", "ultimate-blocks-pro"),
  },
  {
    name: "shapes",
    title: __("Shapes", "ultimate-blocks-pro"),
  },
  {
    name: "shopping",
    title: __("Shopping", "ultimate-blocks-pro"),
  },
  {
    name: "social",
    title: __("Social", "ultimate-blocks-pro"),
  },
  {
    name: "spinners",
    title: __("Spinners", "ultimate-blocks-pro"),
  },
  {
    name: "sports",
    title: __("Sports", "ultimate-blocks-pro"),
  },
  {
    name: "spring",
    title: __("Spring", "ultimate-blocks-pro"),
  },
  {
    name: "status",
    title: __("Status", "ultimate-blocks-pro"),
  },
  {
    name: "summer",
    title: __("Summer", "ultimate-blocks-pro"),
  },
  {
    name: "toggle",
    title: __("Toggle", "ultimate-blocks-pro"),
  },
  {
    name: "travel",
    title: __("Travel", "ultimate-blocks-pro"),
  },
  {
    name: "users-people",
    title: __("Users & People", "ultimate-blocks-pro"),
  },
  {
    name: "vehicles",
    title: __("Vehicles", "ultimate-blocks-pro"),
  },
  {
    name: "weather",
    title: __("Weather", "ultimate-blocks-pro"),
  },
  {
    name: "winter",
    title: __("Winter", "ultimate-blocks-pro"),
  },
  {
    name: "writing",
    title: __("Writing", "ultimate-blocks-pro"),
  },
];
export default fontAwesomeCategories;
