package cmd

import (
	"fmt"
	"landing-builder-cli/internal"
	"os"

	"github.com/spf13/cobra"
)

const ZIP_URL = "https://github.com/rki-mai/landing-builder-cli/releases/download/test/template-project.zip"
const INSTALL_DIR = ".template-project"
const LOCAL_ARCHIVE_PATH = ".template-project.zip"

var installCmd = &cobra.Command{
	Use:   "install",
	Short: "Prepares utility's environment",
	RunE: func(cmd *cobra.Command, args []string) error {
		fmt.Println("Download template project...")
		if err := internal.DownloadFile(ZIP_URL, LOCAL_ARCHIVE_PATH); err != nil {
			return fmt.Errorf("Failed to download template project: %w", err)
		}

		fmt.Println("Unpack template project...")
		if err := internal.Unpack(LOCAL_ARCHIVE_PATH, INSTALL_DIR); err != nil {
			return fmt.Errorf("ошибка распаковки: %w", err)
		}

		fmt.Println("Download template project dependencies...")
		if err := internal.RunCommand(internal.Command{
			Dir:  INSTALL_DIR,
			Name: "npm",
			Args: []string{"install"},
			Env:  map[string]string{},
		}); err != nil {
			return fmt.Errorf("Failed to download template project dependencies: %w", err)
		}

		err := os.Remove(LOCAL_ARCHIVE_PATH)
		if err != nil {
			return fmt.Errorf("Failed to remove compressed template project: %w", err)
		}

		return nil
	},
}
