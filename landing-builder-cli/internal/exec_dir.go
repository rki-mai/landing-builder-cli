package internal

import (
	"fmt"
	"os"
	"path/filepath"
)

func GetExecDir() (string, error) {
	execPath, err := os.Executable()
	if err != nil {
		return "", fmt.Errorf("Failed to get executable path: %w", err)
	}

	execDir := filepath.Dir(execPath)
	return execDir, nil
}
