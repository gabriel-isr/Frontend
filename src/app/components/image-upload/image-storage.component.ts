import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImagesStorageService } from '../../services/images-storage.service';
import { FormsModule } from '@angular/forms';
import { SlickCarouselComponent, SlickCarouselModule } from 'ngx-slick-carousel';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule,FormsModule,SlickCarouselModule],
  templateUrl: './image-storage.component.html',
  styleUrl: './image-storage.component.css',
})

export class ImageUploadComponent implements OnInit {
  currentFile?: File;
  message = '';
  preview = '';
  selectedDuration: string = '1';
  selectedImageURL: string = '';
  slickConfig: any;
  imageInfos?: Observable<any>;
  @ViewChild('slickModal') slickModal!: SlickCarouselComponent;
  @ViewChild('fileInput') fileInput: any;

  constructor(private uploadService: ImagesStorageService) {}

  ngOnInit(): void {
    this.imageInfos = this.uploadService.getFiles();

    this.slickConfig = {
      slidesToShow: 3,
      slidesToScroll: 1,
      dots: false,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 1500,
      arrows: true,        
    };
  }

  selectFile(event: any): void {
    this.message = '';
    this.preview = '';
    this.selectedDuration = '1';
    const selectedFiles = event.target.files;

    if (selectedFiles) {
      const file: File | null = selectedFiles.item(0);

      if (file) {
        this.preview = '';
        this.currentFile = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.preview = e.target.result;
        };

        reader.readAsDataURL(this.currentFile);
      }
    }
  }

  upload(): void {
    if (this.currentFile) {
      const fileSizeInMB = this.currentFile.size / (1024 * 1024);
      if (fileSizeInMB > 2) {
        this.currentFile = undefined;
        this.message = 'Image size exceeds 2MB. Please select Image less than 2MB.';
        return;
      }
      this.uploadService.uploadImage(this.currentFile,this.selectedDuration).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            this.message = event.body.message;
            this.slickModal.unslick();   
            this.imageInfos = this.uploadService.getFiles();
            this.slickModal.slickGoTo(0);                       
          }
        },
        error: (err: any) => {
          console.log(err);

          if (err.error && err.error.message) {
            this.message = err.error.message;
          } else {
            this.message = 'Could not upload the image!';
          }
        },
        complete: () => {
          this.currentFile = undefined;
          this.returnDefault();
        }
      });
    }
  }

  addImageUrl(): void {      
      this.uploadService.addImageUrl(this.selectedImageURL,this.selectedDuration).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            this.message = event.body.message;
            this.slickModal.unslick();   
            this.imageInfos = this.uploadService.getFiles();
            this.slickModal.slickGoTo(0);                       
          }
        },
        error: (err: any) => {
          console.log(err);

          if (err.error && err.error.message) {
            this.message = err.error.message;
          } else {
            this.message = 'Could not add image Url!';
          }
        },
        complete: () => {
          this.returnDefault();
        }       
      });
  }

  deleteImage(imageId: string): void {
    this.uploadService.deleteImage(imageId).subscribe({
      next: (event: any) => {
        this.message = 'Image deleted successfully';            
        this.slickModal.unslick();   
        this.imageInfos = this.uploadService.getFiles();
        this.slickModal.slickGoTo(0);
      },
      error: (err: any) => {
        console.log(err);
        
        if (err.error && err.error.message) {
          this.message = err.error.message;
        } else {
          this.message = 'Could not delete the image!';
        }
      },
        complete: () => {
          this.returnDefault();
        }
    });
  }

  returnDefault(): void {
    this.preview = '';               
    this.fileInput.nativeElement.value = '';
    this.selectedDuration = '1';
    this.selectedImageURL  = '';
  }

}
