//src/controllers/cardController.js
import cardService from "../services/cardService.js";

const cardController = {

  async findAll(req, res) {

    const cards = await cardService.getAllCards();
    res.status(200).json(cards);
  },

  async findOne(req, res) {

    const cardId = req.params.id;
    const result = await cardService.getCardById(cardId);
    res.status(200).json(result);
  },

  async create(req, res) {

    const result = await cardService.createCard(req.body);
    res.status(201).json(result);
  },
  
  async update(req, res) {

    const cardId = req.params.id;
    const result = await cardService.updateCard(cardId, req.body);
    res.status(200).json(result);

  },

  async delete(req, res, next) {

    const cardId = req.params.id;
    await cardService.deleteCard(cardId);
    res.sendStatus(204);
  },

  async cardsByList(req, res, next) {
  
    const listId = req.params.id;
    const result = await cardService.getCardsByListId(listId);
    res.status(200).json(result);
  },

  async updatePosition(req, res, next) {  
    const cardId = req.params.id;
    const newPosition = req.body.position;
    const newListId = req.body.list_id;
    const result = await cardService.moveCard(cardId, newPosition, newListId);
    res.status(200).json(result);
  },
}

export { cardController };