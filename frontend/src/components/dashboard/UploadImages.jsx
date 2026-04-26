import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import imageCompression from 'browser-image-compression';
import { 
  useGetProductDetailsQuery, 
  useUploadProductImagesMutation,
  useDeleteProductImageMutation // HIGHLIGHT: Added this for the trash icon logic
} from "../../redux/api/productApi";
import MetaData from "../layout/Metadata";
import AdminLayout from "../layout/adminLayout";
import toast from "react-hot-toast";

const UploadImages = () => {
  const params = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  // Fetch existing product images
  const { data } = useGetProductDetailsQuery(params?.id);
  const [uploadProductImages, { isLoading, error, isSuccess }] = useUploadProductImagesMutation();
  
  // Optional: Hook for deleting existing images
  const [deleteProductImage, { isLoading: isDeleteLoading, error: deleteError }] = useDeleteProductImageMutation();

  useEffect(() => {
    if (data?.product) {
      setUploadedImages(data?.product?.images);
    }

    if (error) {
      toast.error(error?.data?.message);
    }

    if (deleteError) {
        toast.error(deleteError?.data?.message);
    }

    if (isSuccess) {
      toast.success("Images Uploaded Successfully");
      setImages([]); // Clear selection after success
      setImagesPreview([]);
    }
  }, [data, error, isSuccess, deleteError]);

  const onChange = async (e) => {
  const files = Array.from(e.target.files);

  files.forEach(async (file) => {
    // Compression settings
    const options = {
      maxSizeMB: 1,          // Max size 1MB
      maxWidthOrHeight: 1920, // Max resolution
      useWebWorker: true
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.log(error);
    }
  });
};
  const handleImagePreviewDelete = (image) => {
    const filteredImagesPreview = imagesPreview.filter((img) => img !== image);
    const filteredImages = images.filter((img) => img !== image);
    setImagesPreview(filteredImagesPreview);
    setImages(filteredImages);
  };

  // --- HIGHLIGHT: Handle Deletion of Already Uploaded Images ---
  const handleUploadedImageDelete = (imgId) => {
    deleteProductImage({ id: params?.id, body: { imgId } });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    // Your backend expects { images: [...] }
    uploadProductImages({ id: params?.id, body: { images } });
  };

  return (
    <>
      <MetaData title={"Upload Product Images"} />
      <AdminLayout>
        <div className="row wrapper">
          <div className="col-10 col-lg-8 mt-5 mt-lg-0">
            <form className="shadow rounded bg-body" onSubmit={submitHandler}>
              <h2 className="mb-4">Upload Product Images</h2>

              <div className="mb-3">
                <label htmlFor="customFile" className="form-label">Choose Images</label>

                <div className="custom-file">
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="product_images"
                    className="form-control"
                    id="customFile"
                    multiple
                    onChange={onChange}
                    onClick={(e) => (e.target.value = null)} // Allow re-selecting same file
                  />
                </div>

                {/* --- NEW IMAGES PREVIEW (Selected but not yet uploaded) --- */}
                {imagesPreview?.length > 0 && (
                  <div className="new-images my-4">
                    <p className="text-warning">New Images (To be added):</p>
                    <div className="row mt-4">
                      {imagesPreview.map((img, index) => (
                        <div className="col-md-3 mt-2" key={index}>
                          <div className="card">
                            <img
                              src={img}
                              alt="Preview"
                              className="card-img-top p-2"
                              style={{ width: "100%", height: "80px", objectFit: "contain" }}
                            />
                            <button
                              type="button"
                              className="btn btn-block btn-danger cross-button mt-1 py-0"
                              onClick={() => handleImagePreviewDelete(img)}
                            >
                              <i className="fa fa-times"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* --- EXISTING UPLOADED IMAGES --- */}
                {uploadedImages?.length > 0 && (
                  <div className="uploaded-images my-4">
                    <p className="text-success">Current Product Images:</p>
                    <div className="row mt-1">
                      {uploadedImages.map((img, index) => (
                        <div className="col-md-3 mt-2" key={index}>
                          <div className="card">
                            <img
                              src={img?.url}
                              alt="Uploaded"
                              className="card-img-top p-2"
                              style={{ width: "100%", height: "80px", objectFit: "contain" }}
                            />
                            <button
                              className="btn btn-block btn-danger cross-button mt-1 py-0"
                              type="button"
                              disabled={isLoading || isDeleteLoading}
                              onClick={() => handleUploadedImageDelete(img?.public_id)}
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button 
                id="register_button" 
                type="submit" 
                className="btn w-100 py-2"
                disabled={isLoading || images.length === 0}
              >
                {isLoading ? (
                  <span>
                    <i className="fa fa-refresh fa-spin"></i> Processing Images...
                  </span>
                ) : (
                  "Upload"
                )}
              </button>
            </form>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default UploadImages;