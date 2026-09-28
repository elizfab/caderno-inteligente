package entity

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Project representa um projeto pessoal ou profissional.
type Project struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name        string             `bson:"name" json:"name"`
	Type        string             `bson:"type" json:"type"` // "pessoal" | "profissional"
	Description string             `bson:"description" json:"description"`
	Tags        []string           `bson:"tags" json:"tags"`
	RepoURL     string             `bson:"repoUrl,omitempty" json:"repoUrl,omitempty"`
	DeployURL   string             `bson:"deployUrl,omitempty" json:"deployUrl,omitempty"`
	Slug        string             `bson:"slug" json:"slug"`
	BannerColor string             `bson:"bannerColor" json:"bannerColor"`
	ImageURL    string             `bson:"imageUrl,omitempty" json:"imageUrl,omitempty"`
	ImageAlt    string             `bson:"imageAlt,omitempty" json:"imageAlt,omitempty"`
	DetailRoute string             `bson:"detailRoute,omitempty" json:"detailRoute,omitempty"`
	Active      bool               `bson:"active" json:"active"`
	Order       int                `bson:"order" json:"order"`
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt   time.Time          `bson:"updatedAt" json:"updatedAt"`
}
