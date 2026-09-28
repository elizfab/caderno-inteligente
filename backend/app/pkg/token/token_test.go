package token

import (
	"testing"
	"time"
)

func TestGenerateAndValidate(t *testing.T) {
	secret := "test-secret"
	tok, err := Generate(secret, "user-1", "user@test.dev", "User", time.Hour)
	if err != nil {
		t.Fatalf("Generate retornou erro: %v", err)
	}

	claims, err := Validate(secret, tok)
	if err != nil {
		t.Fatalf("Validate retornou erro: %v", err)
	}
	if claims.Sub != "user-1" || claims.Email != "user@test.dev" || claims.Name != "User" {
		t.Errorf("claims incorretas: %+v", claims)
	}
}

func TestValidateWrongSecret(t *testing.T) {
	tok, _ := Generate("secret-a", "user-1", "user@test.dev", "User", time.Hour)
	if _, err := Validate("secret-b", tok); err != ErrInvalidToken {
		t.Errorf("esperava ErrInvalidToken, obteve: %v", err)
	}
}

func TestValidateExpired(t *testing.T) {
	tok, _ := Generate("secret", "user-1", "user@test.dev", "User", -time.Minute)
	if _, err := Validate("secret", tok); err != ErrExpiredToken {
		t.Errorf("esperava ErrExpiredToken, obteve: %v", err)
	}
}

func TestValidateMalformed(t *testing.T) {
	if _, err := Validate("secret", "abc.def"); err != ErrInvalidToken {
		t.Errorf("esperava ErrInvalidToken, obteve: %v", err)
	}
}
