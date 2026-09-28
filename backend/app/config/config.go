package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	MongoURI      string
	DBName        string
	ServerPort    string
	AppEnv        string
	JWTSecret     string
	AdminName     string
	AdminEmail    string
	AdminPassword string
}

func Load() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("arquivo .env não encontrado, usando variáveis de ambiente do sistema")
	}

	cfg := &Config{
		MongoURI:      getEnv("MONGO_URI", "mongodb://localhost:27017"),
		DBName:        getEnv("DB_NAME", "tech-book-backend"),
		ServerPort:    getEnv("SERVER_PORT", "8080"),
		AppEnv:        getEnv("APP_ENV", "development"),
		JWTSecret:     getEnv("JWT_SECRET", ""),
		AdminName:     getEnv("ADMIN_NAME", "Elizabete Fabri"),
		AdminEmail:    getEnv("ADMIN_EMAIL", "admin@techbook.dev"),
		AdminPassword: getEnv("ADMIN_PASSWORD", "admin123"),
	}

	if cfg.JWTSecret == "" {
		if cfg.AppEnv == "production" {
			log.Fatal("JWT_SECRET é obrigatório em produção")
		}
		cfg.JWTSecret = "dev-secret-trocar-em-producao"
		log.Println("JWT_SECRET não definido — usando secret de desenvolvimento")
	}

	return cfg
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
