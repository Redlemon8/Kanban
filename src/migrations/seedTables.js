import { Card, List, Tag } from "../models/association.js";

console.log("🚧 add testing list...");
const birthdaysList = await List.create({ title: "Liste des anniversaires", position: 1 });

console.log("🚧 Add testing card...");
const grandMaBirthday = await Card.create({ content: "Mamie le 01/01/1940", position: 1, list_id: birthdaysList.id });

console.log("🚧 Add testing tag...");
const urgentTag = await Tag.create({ name: "Urgent", color: "#FF0000"});

console.log("🚧 Add tag on card...");
await grandMaBirthday.addTag(urgentTag);