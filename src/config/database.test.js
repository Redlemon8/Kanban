import { Sequelize } from 'sequelize';

// Configuration pour la base de données de test (SQLite en mémoire)
const testConfig = {
  dialect: 'sqlite',
  storage: ':memory:', // Base de données en mémoire
  logging: false, // Désactiver les logs SQL pour les tests
  define: {
    timestamps: true,
    underscored: true,
  },
};

// Créer une instance Sequelize pour les tests
const testSequelize = new Sequelize(testConfig);

export { testSequelize }; 