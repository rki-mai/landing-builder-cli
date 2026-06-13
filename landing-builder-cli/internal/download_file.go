package internal

import (
	"fmt"
	"io"
	"net/http"
	"os"
)

type DownloadFileError struct {
	Reason error
}

func (e *DownloadFileError) Error() string {
	return fmt.Sprintf("Failed to download file: %s", e.Reason)
}

func (e *DownloadFileError) Unwrap() error {
	return e.Reason
}

func newDownloadError(reason error) error {
	return &DownloadFileError{Reason: reason}
}

func DownloadFile(url, dest string) error {
	resp, err := http.Get(url)
	if err != nil {
		return newDownloadError(fmt.Errorf("Failed to send request '%s': %w", url, err))
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return newDownloadError(fmt.Errorf("server returned status %s", resp.Status))
	}

	file, err := os.Create(dest)
	if err != nil {
		return newDownloadError(err)
	}
	defer file.Close()

	if _, err = io.Copy(file, resp.Body); err != nil {
		return newDownloadError(err)
	}

	return nil
}
