package entity

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// CulinaryCategory representa uma categoria de receitas.
type CulinaryCategory struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Slug        string             `bson:"slug" json:"slug"`
	Name        string             `bson:"name" json:"name"`
	Description string             `bson:"description" json:"description"`
	Tag         string             `bson:"tag" json:"tag"`
	Color       string             `bson:"color" json:"color"`
	Icon        string             `bson:"icon" json:"icon"`
	ImageURL    string             `bson:"imageUrl,omitempty" json:"imageUrl,omitempty"`
	Order       int                `bson:"order" json:"order"`
	Active      bool               `bson:"active" json:"active"`
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt   time.Time          `bson:"updatedAt" json:"updatedAt"`
}

// CulinaryRecipe representa uma receita culinária.
type CulinaryRecipe struct {
	ID                  primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	CategoryID          string             `bson:"categoryId" json:"categoryId"`
	CategorySlug        string             `bson:"categorySlug" json:"categorySlug"`
	Name                string             `bson:"name" json:"name"`
	Slug                string             `bson:"slug" json:"slug"`
	Description         string             `bson:"description" json:"description"`
	PrepTimeMinutes     int                `bson:"prepTimeMinutes" json:"prepTimeMinutes"`
	CookTimeMinutes     int                `bson:"cookTimeMinutes" json:"cookTimeMinutes"`
	ServingsStr         string             `bson:"servingsStr" json:"servingsStr"`
	Difficulty          string             `bson:"difficulty" json:"difficulty"`
	Status              string             `bson:"status" json:"status"`
	Tags                []string           `bson:"tags" json:"tags"`
	ImageURL            string             `bson:"imageUrl,omitempty" json:"imageUrl,omitempty"`
	YoutubeURL          string             `bson:"youtubeUrl,omitempty" json:"youtubeUrl,omitempty"`
	SourceURL           string             `bson:"sourceUrl,omitempty" json:"sourceUrl,omitempty"`
	Ingredients         []string           `bson:"ingredients" json:"ingredients"`
	PreparationSteps    []string           `bson:"preparationSteps" json:"preparationSteps"`
	Utensils            string             `bson:"utensils,omitempty" json:"utensils,omitempty"`
	Tips                string             `bson:"tips,omitempty" json:"tips,omitempty"`
	Substitutions       string             `bson:"substitutions,omitempty" json:"substitutions,omitempty"`
	StorageInstructions string             `bson:"storageInstructions,omitempty" json:"storageInstructions,omitempty"`
	EstimatedCost       float64            `bson:"estimatedCost" json:"estimatedCost"`
	PersonalRating      int                `bson:"personalRating" json:"personalRating"`
	Tested              bool               `bson:"tested" json:"tested"`
	TestedAt            string             `bson:"testedAt,omitempty" json:"testedAt,omitempty"`
	Notes               string             `bson:"notes,omitempty" json:"notes,omitempty"`
	Active              bool               `bson:"active" json:"active"`
	CreatedAt           time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt           time.Time          `bson:"updatedAt" json:"updatedAt"`
}
