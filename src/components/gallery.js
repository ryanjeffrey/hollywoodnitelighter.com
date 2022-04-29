import React from 'react'
import ImageGallery from 'react-image-gallery'

const images = [
  {
    original:
      "https://rscbucket.s3.us-east-2.amazonaws.com/hollywood/gallery/1.png",
  },
  {
    original:
      "https://rscbucket.s3.us-east-2.amazonaws.com/hollywood/gallery/2.png",
  },
  {
    original:
      "https://rscbucket.s3.us-east-2.amazonaws.com/hollywood/gallery/3.png",
  },
  {
    original:
      "https://rscbucket.s3.us-east-2.amazonaws.com/hollywood/gallery/4.png",
  },
  {
    original:
      "https://rscbucket.s3.us-east-2.amazonaws.com/hollywood/gallery/5.png",
  },
];

const gallery = () => {
  return (
    <ImageGallery items={images} />
  )
}

export default gallery
