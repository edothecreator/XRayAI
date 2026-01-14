from fastapi import FastAPI, File, UploadFile
from PIL import Image
import torchvision.transforms as transforms
import torch
import torchxrayvision as xrv

# Reduce CPU / RAM pressure (important for hosting)
torch.set_num_threads(1)

app = FastAPI()

# Global model
model = None

# Load model once at startup
@app.on_event("startup")
def load_model():
    global model
    model = xrv.models.DenseNet(weights="all")
    model.eval()


@app.post("/predict")
async def predict_xray(file: UploadFile = File(...)):
    # Load and preprocess image
    img = Image.open(file.file)
    img = img.convert("L")  # grayscale

    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor()
    ])

    img_tensor = transform(img)
    img_tensor = img_tensor * 2 - 1      # normalize to [-1, 1]
    img_tensor = img_tensor * 1024       # scale for X-ray domain
    img_tensor = img_tensor.unsqueeze(0) # add batch dimension

    # Inference
    with torch.no_grad():
        outputs = model(img_tensor)

    # Convert to NumPy safely
    outputs = outputs.squeeze().detach().cpu().numpy()
    labels = xrv.datasets.default_pathologies

    # Return probabilities
    predictions = {
        label: round(float(prob), 4)
        for label, prob in zip(labels, outputs)
    }

    return predictions


# Health check (recommended for hosting)
@app.get("/health")
def health():
    return {"status": "ok"}
