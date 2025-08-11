import { sequelize } from "../models/association.js";

try {

    await sequelize.drop({
        force: true,
        alter: true,
    });

    await sequelize.sync();

    process.exit(0);
} catch (error) {
    console.error(error);
    process.exit(1);
}