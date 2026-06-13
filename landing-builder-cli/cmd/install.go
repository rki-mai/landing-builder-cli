package cmd

import (
	"fmt"
	"landing-builder-cli/internal"
	"os"
	"path/filepath"

	"github.com/spf13/cobra"
)

const ZIP_URL = "https://github.com/rki-mai/landing-builder-cli/releases/download/v2.0/template-project.zip"
const INSTALL_DIR = ".template-project"
const LOCAL_ARCHIVE_PATH = ".template-project.zip"

var installCmd = &cobra.Command{
	Use:   "install",
	Short: "Prepares utility's environment",
	RunE: func(cmd *cobra.Command, args []string) error {
		execDir, err := internal.GetExecDir()
		if err != nil {
			return fmt.Errorf("Failed to resolve exec dir: %w", err)
		}

		installDir := filepath.Join(execDir, INSTALL_DIR)
		localArchivePath := filepath.Join(execDir, LOCAL_ARCHIVE_PATH)

		fmt.Println("Download template project...")
		if err := internal.DownloadFile(ZIP_URL, localArchivePath); err != nil {
			return fmt.Errorf("Failed to download template project: %w", err)
		}

		fmt.Println("Unpack template project...")
		if err := internal.Unpack(localArchivePath, installDir); err != nil {
			return fmt.Errorf("ошибка распаковки: %w", err)
		}

		fmt.Println("Download template project dependencies...")
		if err := internal.RunCommand(internal.Command{
			Dir:  installDir,
			Name: "npm",
			Args: []string{"install"},
			Env:  map[string]string{},
		}); err != nil {
			return fmt.Errorf("Failed to download template project dependencies: %w", err)
		}

		if err := os.Remove(localArchivePath); err != nil {
			return fmt.Errorf("Failed to remove compressed template project: %w", err)
		}

		return nil
	},
}
