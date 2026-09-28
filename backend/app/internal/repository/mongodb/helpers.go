package mongodb

import (
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
)

// toUpdateFields converte uma entidade em bson.M para uso no $set,
// removendo campos que nunca devem ser sobrescritos em updates.
func toUpdateFields(doc any) (bson.M, error) {
	data, err := bson.Marshal(doc)
	if err != nil {
		return nil, fmt.Errorf("falha ao serializar documento: %w", err)
	}
	var fields bson.M
	if err := bson.Unmarshal(data, &fields); err != nil {
		return nil, fmt.Errorf("falha ao converter documento: %w", err)
	}
	delete(fields, "_id")
	delete(fields, "createdAt")
	return fields, nil
}
