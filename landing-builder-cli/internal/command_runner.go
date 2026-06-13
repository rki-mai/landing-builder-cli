package internal

import (
	"fmt"
	"os"
	"os/exec"
)

type ProcessError struct {
	Reason error
}

func (e *ProcessError) Error() string {
	return fmt.Sprintf("Failed to run process: %s", e.Reason)
}

func (e *ProcessError) Unwrap() error {
	return e.Reason
}

func newProcessError(reason error) error {
	return &ProcessError{Reason: reason}
}

type Command struct {
	Dir  string
	Name string
	Args []string
	Env  map[string]string
}

func RunCommand(command Command) error {
	cmd := exec.Command(command.Name, command.Args...)
	cmd.Dir = command.Dir
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	env := os.Environ()
	for key, value := range command.Env {
		env = append(env, fmt.Sprintf("%s=%s", key, value))
	}
	cmd.Env = env

	if err := cmd.Run(); err != nil {
		return newProcessError(fmt.Errorf("command '%s' failed: %w", command.Name, err))
	}

	return nil
}
