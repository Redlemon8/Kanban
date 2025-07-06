import tagService from "../services/tagService.js";

const tagController = {

  async findAll(req, res) {

      const tags = await tagService.getAllTags();
      res.status(200).json(tags);
  },

  async findOne(req, res) {

    const tagId = req.params.id;
    const result = await tagService.getTagById(tagId);
    res.status(200).json(result);
  },

  async create(req, res) {

    const result = await tagService.createTag(req.body);
    res.status(201).json(result);
  },

  async update(req, res) {

    const tagId = req.params.id;
    const result = await tagService.updateTag(tagId, req.body);
    res.status(200).json(result);
  },

  async delete(req, res) {

    const tagId = req.params.id;
    await tagService.deleteTag(tagId);
    res.sendStatus(204);
  },

  async linkTagToCard(req, res) {

    const result = await tagService.linkTagToCard(req.params.tag_id, req.params.card_id);
    res.status(200).json(result);
  },

  async deleteTagToCard(req, res) {

    const result = await tagService.unlinkTagFromCard(req.params.tag_id, req.params.card_id);
    res.status(200).json(result);
  },
}

export { tagController };