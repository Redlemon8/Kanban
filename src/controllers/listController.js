import { List } from "../models/association.js";

const listController = {
    async index(req, res) {
      
        const lists = await List.findAll({
            include: { association: "cards", include: "tags" },
            order: [
                ["position", "ASC"]
            ]
        });

        res.status(200).json(lists);
    },
  }

  export { listController };