import { sequelize } from "../models/association.js";

try {

    await sequelize.drop();

    await sequelize.sync();

    process.exit(0);
} catch (error) {
    console.error(error);
    process.exit(1);
}