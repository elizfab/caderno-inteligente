package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"tech-book-backend/config"
	"tech-book-backend/internal/handler"
	"tech-book-backend/internal/middleware"
	"tech-book-backend/internal/repository/mongodb"
	"tech-book-backend/internal/usecase"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	cfg := config.Load()

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(cfg.MongoURI))
	if err != nil {
		log.Fatalf("falha ao conectar no MongoDB: %v", err)
	}
	defer func() {
		if err := client.Disconnect(context.Background()); err != nil {
			log.Printf("erro ao desconectar MongoDB: %v", err)
		}
	}()

	if err := client.Ping(ctx, nil); err != nil {
		log.Fatalf("MongoDB não responde: %v", err)
	}
	log.Printf("conectado ao MongoDB: %s (db: %s)", cfg.MongoURI, cfg.DBName)

	db := client.Database(cfg.DBName)

	// ── Repositórios ─────────────────────────────────────────────────────────
	userRepo := mongodb.NewUserRepository(db)
	sectionRepo := mongodb.NewCourseSectionRepository(db)
	topicRepo := mongodb.NewCourseTopicRepository(db)
	itemRepo := mongodb.NewStudyItemRepository(db)
	noteRepo := mongodb.NewStudyNoteRepository(db)
	resourceRepo := mongodb.NewStudyResourceRepository(db)
	sessionRepo := mongodb.NewStudySessionRepository(db)
	projectRepo := mongodb.NewProjectRepository(db)
	culCategoryRepo := mongodb.NewCulinaryCategoryRepository(db)
	culRecipeRepo := mongodb.NewCulinaryRecipeRepository(db)
	quizRepo := mongodb.NewQuizQuestionRepository(db)

	// ── Use cases ────────────────────────────────────────────────────────────
	authUC := usecase.NewAuthUseCase(userRepo, cfg.JWTSecret)
	sectionUC := usecase.NewCourseSectionUseCase(sectionRepo)
	topicUC := usecase.NewCourseTopicUseCase(topicRepo)
	itemUC := usecase.NewStudyItemUseCase(itemRepo)
	subsUC := usecase.NewStudySubResourcesUseCase(noteRepo, resourceRepo, sessionRepo)
	projectUC := usecase.NewProjectUseCase(projectRepo)
	culinaryUC := usecase.NewCulinaryUseCase(culCategoryRepo, culRecipeRepo)
	quizUC := usecase.NewQuizQuestionUseCase(quizRepo)

	// Usuário administrador inicial (apenas quando a base está vazia).
	if err := authUC.SeedDefaultUser(ctx, cfg.AdminName, cfg.AdminEmail, cfg.AdminPassword); err != nil {
		log.Printf("aviso: falha ao criar usuário padrão: %v", err)
	}

	// ── Rotas ────────────────────────────────────────────────────────────────
	mux := http.NewServeMux()

	handler.NewAuthHandler(authUC).RegisterRoutes(mux)
	handler.NewCourseSectionHandler(sectionUC).RegisterRoutes(mux)
	handler.NewCourseTopicHandler(topicUC).RegisterRoutes(mux)
	handler.NewStudyItemHandler(itemUC, subsUC).RegisterRoutes(mux)
	handler.NewProjectHandler(projectUC).RegisterRoutes(mux)
	handler.NewCulinaryHandler(culinaryUC).RegisterRoutes(mux)
	handler.NewQuizQuestionHandler(quizUC).RegisterRoutes(mux)

	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok","service":"` + cfg.DBName + `"}`))
	})

	// ── Middlewares (CORS → Auth → mux) ─────────────────────────────────────
	var apiHandler http.Handler = mux
	apiHandler = middleware.Auth(cfg.JWTSecret)(apiHandler)
	apiHandler = middleware.CORS(apiHandler)

	server := &http.Server{
		Addr:         ":" + cfg.ServerPort,
		Handler:      apiHandler,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	log.Printf("servidor iniciado na porta %s (env: %s)", cfg.ServerPort, cfg.AppEnv)
	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("erro ao iniciar servidor: %v", err)
	}
}
