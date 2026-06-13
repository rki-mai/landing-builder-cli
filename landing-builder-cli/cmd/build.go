package cmd

import (
	"fmt"
	"landing-builder-cli/internal"
	"os"
	"path/filepath"

	"github.com/spf13/cobra"
)

var (
	draftPath  string
	outputPath string
)

const TEMPLATE_PROJECT_DIR = ".template-project"

var buildCmd = &cobra.Command{
	Use:   "build",
	Short: "Builds landing from specified Draft file",
	RunE: func(cmd *cobra.Command, args []string) error {
		execDir, err := internal.GetExecDir()
		if err != nil {
			return fmt.Errorf("Failed to resolve exec dir: %w", err)
		}

		fmt.Println("Build project...")
		fmt.Printf("- Draft file path: %s\n", draftPath)
		fmt.Printf("- Output directory:  %s\n", outputPath)

		draftFullPath, err := filepath.Abs(draftPath)
		if err != nil {
			return fmt.Errorf("Failed to resolve draft path: %w", err)
		}

		if _, err := os.Stat(draftFullPath); os.IsNotExist(err) {
			return fmt.Errorf("Draft file not found: %s", draftFullPath)
		}

		outputFullPath, err := filepath.Abs(outputPath)
		if err != nil {
			return fmt.Errorf("Failed to resolve output directory path: %w", err)
		}

		if err := internal.RunCommand(internal.Command{
			Dir:  filepath.Join(execDir, TEMPLATE_PROJECT_DIR),
			Name: "npm",
			Args: []string{"run", "build", "--", "--outDir", outputFullPath},
			Env:  map[string]string{"CONFIG_PATH": draftFullPath},
		}); err != nil {
			return fmt.Errorf("Build error: %w", err)
		}

		return nil
	},
}

func init() {
	buildCmd.Flags().StringVar(&draftPath, "draft", "", "Path to Draft file (required)")
	buildCmd.Flags().StringVar(&outputPath, "output", "", "Path to output directory (required)")
	buildCmd.MarkFlagRequired("draft")
	buildCmd.MarkFlagRequired("output")
}
