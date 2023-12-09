package main

import (
	"crypto/md5"
	"fmt"
	"image"
	_ "image/png"
	"io"
	"log"
	"os"
	"path"
	"strings"
)

func GetFileMD5(pathName string) string {
	var md5str string = ""

	f, err := os.Open(pathName)
	if err != nil {
		fmt.Println("Open", err)
		return md5str
	}
	defer f.Close()

	md5hash := md5.New()
	if _, err := io.Copy(md5hash, f); err != nil {
		fmt.Println("Copy", err)
		return md5str
	}

	has := md5hash.Sum(nil)
	md5str = fmt.Sprintf("%x", has)
	return md5str
}

func renameMd5(fullpath string) {
	files, err := os.ReadDir(fullpath)
	if err != nil {
		log.Fatalln("read dir filuare:", fullpath)
		return
	}

	for _, file := range files {
		if !file.IsDir() {
			filename := file.Name()
			filesuffix := path.Ext(filename)
			md5str := strings.ToUpper(GetFileMD5(fullpath + "\\" + filename))
			os.Rename(fullpath+"\\"+filename, fullpath+"\\"+md5str+filesuffix)
		}
	}

	fmt.Println("reanme file count:", len(files))
}

func printSize(fullpath string) {
	files, err := os.ReadDir(fullpath)
	if err != nil {
		log.Fatalln("read dir filuare:", fullpath)
		return
	}

	for _, file := range files {
		if !file.IsDir() {
			filename := file.Name()
			handle, err := os.Open(fullpath + "\\" + filename)
			if err != nil {
				fmt.Println("open file failure:", filename, err)
				continue
			}
			defer handle.Close()

			img, _, err := image.DecodeConfig(handle)
			if err != nil {
				fmt.Println("deconde file failure:", filename, err)
				continue
			}

			fmt.Printf("[%s]: %5d %5d\n", filename, img.Width, img.Height)
		}
	}
}

func main() {
	const PIC_PATH string = `png`
	renameMd5(PIC_PATH)
	printSize(PIC_PATH)
}
