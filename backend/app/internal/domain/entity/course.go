package entity

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// CourseSection representa uma área de estudo (ex: Backend, Cloud).
type CourseSection struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Slug        string             `bson:"slug" json:"slug"`
	Name        string             `bson:"name" json:"name"`
	Description string             `bson:"description" json:"description"`
	BannerColor string             `bson:"bannerColor" json:"bannerColor"`
	IconClass   string             `bson:"iconClass" json:"iconClass"`
	ImageURL    string             `bson:"imageUrl,omitempty" json:"imageUrl,omitempty"`
	Active      bool               `bson:"active" json:"active"`
	Order       int                `bson:"order" json:"order"`
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt   time.Time          `bson:"updatedAt" json:"updatedAt"`
}

// CourseTopic representa um tópico dentro de uma área de estudo.
type CourseTopic struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	SectionSlug string             `bson:"sectionSlug" json:"sectionSlug"`
	Slug        string             `bson:"slug" json:"slug"`
	Label       string             `bson:"label" json:"label"`
	Description string             `bson:"description" json:"description"`
	BannerColor string             `bson:"bannerColor" json:"bannerColor"`
	IconClass   string             `bson:"iconClass" json:"iconClass"`
	Skill       string             `bson:"skill" json:"skill"`
	ImageURL    string             `bson:"imageUrl,omitempty" json:"imageUrl,omitempty"`
	Active      bool               `bson:"active" json:"active"`
	Order       int                `bson:"order" json:"order"`
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt   time.Time          `bson:"updatedAt" json:"updatedAt"`
}
