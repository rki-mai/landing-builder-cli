package internal

import (
	"archive/zip"
	"fmt"
	"io"
	"os"
	"path/filepath"
)

type UnpackError struct {
	Reason error
}

func (e *UnpackError) Error() string {
	return fmt.Sprintf("Failed to unpack: %s", e.Reason)
}

func (e *UnpackError) Unwrap() error {
	return e.Reason
}

func newUnpackError(reason error) error {
	return &UnpackError{Reason: reason}
}

func Unpack(src, dest string) error {
	r, err := zip.OpenReader(src)
	if err != nil {
		return newUnpackError(err)
	}
	defer r.Close()

	for _, f := range r.File {
		fpath := filepath.Join(dest, f.Name)

		if f.FileInfo().IsDir() {
			if err := os.MkdirAll(fpath, os.ModePerm); err != nil {
				return newUnpackError(err)
			}
			continue
		}

		if err := os.MkdirAll(filepath.Dir(fpath), os.ModePerm); err != nil {
			return newUnpackError(err)
		}

		if err := extractFile(f, fpath); err != nil {
			return newUnpackError(err)
		}
	}

	return nil
}

func extractFile(f *zip.File, dest string) error {
	rc, err := f.Open()
	if err != nil {
		return err
	}
	defer rc.Close()

	outFile, err := os.Create(dest)
	if err != nil {
		return err
	}
	defer outFile.Close()

	_, err = io.Copy(outFile, rc)
	return err
}
