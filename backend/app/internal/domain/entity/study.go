package entity

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// StudyItem representa um curso/conteúdo de estudo dentro de um tópico.
type StudyItem struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Section     string             `bson:"section" json:"section"`
	Topic       string             `bson:"topic" json:"topic"`
	CourseName  string             `bson:"courseName" json:"courseName"`
	Status      string             `bson:"status" json:"status"`
	Date        string             `bson:"date" json:"date"`
	URL         string             `bson:"url" json:"url"`
	ImageURL    string             `bson:"imageUrl,omitempty" json:"imageUrl,omitempty"`
	DetailRoute string             `bson:"-" json:"detailRoute"`
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt   time.Time          `bson:"updatedAt" json:"updatedAt"`
}

// StudyNote representa uma anotação de um item de estudo.
type StudyNote struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	StudyItemID primitive.ObjectID `bson:"studyItemId" json:"studyItemId"`
	Date        string             `bson:"date" json:"date"`
	Title       string             `bson:"title" json:"title"`
	Description string             `bson:"description" json:"description"`
	Progress    int                `bson:"progress" json:"progress"`
	Status      string             `bson:"status" json:"status"`
	Type        string             `bson:"type,omitempty" json:"type,omitempty"`
	Link        string             `bson:"link,omitempty" json:"link,omitempty"`
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt   time.Time          `bson:"updatedAt" json:"updatedAt"`
}

// StudyResource representa um recurso (link, vídeo, artigo) de um item de estudo.
type StudyResource struct {
	ID             primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	StudyItemID    primitive.ObjectID `bson:"studyItemId" json:"studyItemId"`
	Title          string             `bson:"title" json:"title"`
	URL            string             `bson:"url" json:"url"`
	Type           string             `bson:"type" json:"type"`
	Description    string             `bson:"description,omitempty" json:"description,omitempty"`
	Source         string             `bson:"source,omitempty" json:"source,omitempty"`
	Priority       string             `bson:"priority,omitempty" json:"priority,omitempty"`
	ResourceStatus string             `bson:"resourceStatus,omitempty" json:"resourceStatus,omitempty"`
	CreatedAt      time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt      time.Time          `bson:"updatedAt" json:"updatedAt"`
}

// StudySession representa uma sessão de estudo registrada.
type StudySession struct {
	ID                  primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	StudyItemID         primitive.ObjectID `bson:"studyItemId" json:"studyItemId"`
	StartedAt           string             `bson:"startedAt" json:"startedAt"`
	EndedAt             string             `bson:"endedAt" json:"endedAt"`
	DurationSeconds     int                `bson:"durationSeconds" json:"durationSeconds"`
	Topic               string             `bson:"topic" json:"topic"`
	Notes               string             `bson:"notes,omitempty" json:"notes,omitempty"`
	Rating              int                `bson:"rating" json:"rating"`
	MilestonesCompleted int                `bson:"milestonesCompleted" json:"milestonesCompleted"`
	Focus               string             `bson:"focus,omitempty" json:"focus,omitempty"`
	CreatedAt           time.Time          `bson:"createdAt" json:"createdAt"`
}
