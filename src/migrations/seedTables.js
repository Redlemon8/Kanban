import { Card, List, Tag, Project, User } from "../models/association.js";

const user = await User.create({ name: "John Doe", email: "john.doe@example.com", password: "password" });
const project = await Project.create({ name: "Wipflow Project", user_id: user.id });


console.log("🚧 add testing list...");
const startingList = await List.create({ title: "Backlog", position: 1, project_id: project.id });

console.log("🚧 Add testing card...");
const projectName = await Card.create({ content: "Wipflow Project", position: 1, list_id: startingList.id, project_id: project.id });

console.log("🚧 Add testing tag...");
const urgentTag = await Tag.create({ name: "Urgent", color: "#FF0000"});
const importantTag = await Tag.create({ name: "Important", color: "#00FF00"});
const inProgressTag = await Tag.create({ name: "En cours", color: "#FFFF00"});
const doneTag = await Tag.create({ name: "Terminé", color: "#00FF00"});
const toDoTag = await Tag.create({ name: "À faire", color: "#118ab2"});
const toValidateTag = await Tag.create({ name: "À valider", color: "#00d9ff"});
const toRefineTag = await Tag.create({ name: "À améliorer", color: "#646cff"});


console.log("🚧 Add tag on card...");
await projectName.addTag(urgentTag);