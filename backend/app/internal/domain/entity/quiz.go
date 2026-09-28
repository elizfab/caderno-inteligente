package entity

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// QuizQuestion representa uma pergunta de quiz vinculada a seção/tópico.
type QuizQuestion struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Section     string             `bson:"section" json:"section"`
	Topic       string             `bson:"topic" json:"topic"`
	Question    string             `bson:"question" json:"question"`
	Answer      string             `bson:"answer" json:"answer"`
	Explanation string             `bson:"explanation" json:"explanation"`
	Difficulty  string             `bson:"difficulty" json:"difficulty"`
	Tags        []string           `bson:"tags" json:"tags"`
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`
}
