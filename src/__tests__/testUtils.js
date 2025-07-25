import { testSequelize } from '../config/database.test.js';
import { Card, List, Tag } from '../config/association.test.js';

// Initialiser les modèles avec la base de test
export const initializeTestDatabase = async () => {
  // Synchroniser tous les modèles avec la base de test
  await testSequelize.sync({ force: true });
};

// Nettoyer la base de données de test
export const clearTestDatabase = async () => {
  // Supprimer toutes les données
  await Card.destroy({ where: {}, force: true });
  await List.destroy({ where: {}, force: true });
  await Tag.destroy({ where: {}, force: true });
};

// Fermer la connexion de test
export const closeTestDatabase = async () => {
  await testSequelize.close();
};

// Créer des données de test
export const createTestData = async () => {
  // Créer des listes de test
  const list1 = await List.create({
    title: 'Liste Test 1',
    position: 1
  });

  const list2 = await List.create({
    title: 'Liste Test 2',
    position: 2
  });

  // Créer des tags de test
  const tag1 = await Tag.create({
    name: 'Tag Test 1',
    color: '#ff0000'
  });

  const tag2 = await Tag.create({
    name: 'Tag Test 2',
    color: '#00ff00'
  });

  // Créer des cartes de test
  const card1 = await Card.create({
    content: 'Carte Test 1',
    position: 1,
    color: '#ffffff',
    list_id: list1.id
  });

  const card2 = await Card.create({
    content: 'Carte Test 2',
    position: 2,
    color: '#ffffff',
    list_id: list1.id
  });

  // Associer les tags aux cartes
  await card1.addTag(tag1);
  await card2.addTag(tag2);

  return {
    lists: [list1, list2],
    tags: [tag1, tag2],
    cards: [card1, card2]
  };
}; 