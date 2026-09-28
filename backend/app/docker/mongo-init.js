// Script de inicialização do MongoDB.
// Executado automaticamente na primeira subida do container
// (docker-entrypoint-initdb.d), só roda quando o volume mongo-data
// ainda não existe.
//
// Ajuste o nome do banco abaixo se você mudou DB_NAME no .env.
db = db.getSiblingDB("tech-book-backend");

// ── Usuários ────────────────────────────────────────────────────────────────
db.createCollection("users");
db.users.createIndex({ email: 1 }, { unique: true });

// ── Estudos ─────────────────────────────────────────────────────────────────
db.createCollection("course_sections");
db.course_sections.createIndex({ slug: 1 }, { unique: true });
db.course_sections.createIndex({ order: 1 });

db.createCollection("course_topics");
db.course_topics.createIndex({ sectionSlug: 1, slug: 1 }, { unique: true });
db.course_topics.createIndex({ order: 1 });

db.createCollection("study_items");
db.study_items.createIndex({ section: 1, topic: 1 });
db.study_items.createIndex({ createdAt: -1 });

db.createCollection("study_notes");
db.study_notes.createIndex({ studyItemId: 1 });

db.createCollection("study_resources");
db.study_resources.createIndex({ studyItemId: 1 });

db.createCollection("study_sessions");
db.study_sessions.createIndex({ studyItemId: 1 });

// ── Projetos ────────────────────────────────────────────────────────────────
db.createCollection("projects");
db.projects.createIndex({ type: 1, order: 1 });

// ── Culinária ───────────────────────────────────────────────────────────────
db.createCollection("culinary_categories");
db.culinary_categories.createIndex({ slug: 1 }, { unique: true });

db.createCollection("culinary_recipes");
db.culinary_recipes.createIndex({ categorySlug: 1 });
db.culinary_recipes.createIndex({ slug: 1 });

// ── Quiz ────────────────────────────────────────────────────────────────────
db.createCollection("quiz_questions");
db.quiz_questions.createIndex({ section: 1, topic: 1 });

print("MongoDB inicializado com sucesso.");
