import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import { FormGroup, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import {t} from "i18next";

// Utility function to generate cropped image
const getCroppedImage = (
    image: HTMLImageElement,
    crop: PixelCrop
): Promise<Blob> => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        return Promise.reject(new Error("Canvas context not available"));
    }

    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error("Failed to create blob"));
                return;
            }
            resolve(blob);
        }, "image/jpeg");
    });
};

interface ImageSelectorProps {
    name: string;
    label: string;
    setFieldValue: (field: string, value: File | null) => void;
    initialImageUrl?: string;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
                                                         name,
                                                         label,
                                                         setFieldValue,
                                                         initialImageUrl,
                                                     }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(initialImageUrl || null);
    const [crop, setCrop] = useState<Crop>({ unit: "px", x: 0, y: 0, width: 100, height: 100 });
    const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
    const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(initialImageUrl || null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [imageKey, setImageKey] = useState(0);

    useEffect(() => {
        if(initialImageUrl) {
            console.log(initialImageUrl);
            setImageSrc("https://localhost:8000" +  initialImageUrl);
            setImageKey((prevKey) => prevKey + 1);
        } else {
            setImageSrc(null);
        }
    }, [initialImageUrl]);

    // Toggle modal
    const toggleModal = () => setIsModalOpen(!isModalOpen);

    // Handle file selection and open modal
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                if (typeof reader.result === "string") {
                    setImageSrc(reader.result);
                    toggleModal();
                }
            });
            reader.readAsDataURL(file);
        }
    };

    // Handle image load for cropping
    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        imgRef.current = e.currentTarget;
        setImageDimensions({ width, height });

        // Initialize crop area to a reasonable default (e.g., center 50% of the image)
        const cropWidth = Math.min(width * 0.5, height * 0.5); // Square crop area
        const cropHeight = cropWidth;
        const centerX = (width - cropWidth) / 2;
        const centerY = (height - cropHeight) / 2;

        setCrop({
            unit: "px",
            x: centerX,
            y: centerY,
            width: cropWidth,
            height: cropHeight,
        });
    };

    // Handle crop completion
    const handleCropComplete = useCallback((crop: PixelCrop) => {
        setCompletedCrop(crop);
    }, []);

    // Confirm crop and save the cropped image
    const handleConfirmCrop = async () => {
        if (!imgRef.current || !completedCrop) return;

        try {
            const croppedBlob = await getCroppedImage(imgRef.current, completedCrop);
            const croppedUrl = URL.createObjectURL(croppedBlob);
            setCroppedImageUrl(croppedUrl);

            const croppedFile = new File([croppedBlob], "cropped-image.jpg", {
                type: "image/jpeg",
            });
            setFieldValue(name, croppedFile);
            toggleModal();
        } catch (error) {
            console.error("Error cropping image:", error);
        }
    };

    // Reset the image
    const handleReset = () => {
        setImageSrc(null);
        setCroppedImageUrl(null);
        setCompletedCrop(null);
        setCrop({ unit: "px", x: 0, y: 0, width: 100, height: 100 });
        setImageDimensions(null);
        setFieldValue(name, null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <FormGroup>
            <Label for={name}>{label}</Label>
            <div className="d-flex align-items-center mb-2">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={inputRef}
                    className="form-control"
                    style={{ width: "auto", flexGrow: 1 }}
                />
                {croppedImageUrl && (
                    <Button
                        color="danger"
                        outline
                        onClick={handleReset}
                        className="ms-2"
                    >
                        {t("Remove Image")}
                    </Button>
                )}
            </div>

            {croppedImageUrl && (
                <div className="mt-2">
                    <h6>{t("Selected Image Preview")}</h6>
                    <img
                        src={croppedImageUrl}
                        alt="Cropped preview"
                        style={{ maxWidth: "150px", borderRadius: "5px" }}
                    />
                </div>
            )}
            <img src={imageSrc || "#"} alt={"j"} className={'w-25 h-25'}/>
            {/* Modal for cropping */}
            <Modal isOpen={isModalOpen} toggle={toggleModal} size="lg" centered>
                <ModalHeader toggle={toggleModal}>{t("Crop Your Image")}</ModalHeader>
                <ModalBody style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {imageSrc && (
                        <div
                            style={{
                                position: "relative",
                                maxWidth: "100%",
                                maxHeight: "60vh",
                                overflow: "auto",
                            }}
                        >
                            <ReactCrop
                                crop={crop}
                                onChange={(c) => setCrop(c)}
                                onComplete={handleCropComplete}
                                aspect={1} // Square aspect ratio; remove or adjust as needed
                                style={{
                                    position: "relative",
                                    display: "inline-block",
                                }}
                            >
                                <img
                                    src={imageSrc}
                                    alt="Crop preview"
                                    onLoad={onImageLoad}
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "60vh",
                                        display: "block", // Ensures the image doesn't have extra space below
                                    }}
                                />
                            </ReactCrop>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggleModal}>
                        {t("Cancel")}
                    </Button>
                    <Button color="primary" onClick={handleConfirmCrop} disabled={!completedCrop}>
                        {t("Confirm Crop")}
                    </Button>
                </ModalFooter>
            </Modal>
        </FormGroup>
    );
};

export default ImageSelector;