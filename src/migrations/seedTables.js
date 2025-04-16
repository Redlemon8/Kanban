import { Card, List, Tag } from "../models/association.js";

console.log("🚧 add testing list...");
const startingList = await List.create({ title: "Backlog", position: 1 });

console.log("🚧 Add testing card...");
const projectName = await Card.create({ content: "Wipflow Project", position: 1, list_id: startingList.id });

console.log("🚧 Add testing tag...");
const urgentTag = await Tag.create({ name: "Urgent", color: "#FF0000"});

console.log("🚧 Add tag on card...");
await projectName.addTag(urgentTag);