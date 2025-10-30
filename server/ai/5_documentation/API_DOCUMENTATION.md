# AI Services API Documentation

## LLM Service

### Endpoints

#### `POST /generate`
Generate text using the LLM model.

**Request Body:**
```json
{
  "prompt": "Your input text here",
  "max_length": 100,
  "temperature": 0.7,
  "top_p": 0.9,
  "num_return_sequences": 1
}
```

**Response:**
```json
{
  "generated_text": "Generated text response...",
  "model": "aetherial/llm-base",
  "tokens_generated": 42
}
```

#### `GET /health`
Check service health.

**Response:**
```json
{
  "status": "healthy",
  "model": "aetherial/llm-base",
  "device": "cuda"
}
```

## Model Training Service

### Endpoints

#### `POST /train`
Start a new training job.

**Request Body:**
```json
{
  "dataset_path": "/data/training.jsonl",
  "model_name": "aetherial/llm-base",
  "epochs": 3,
  "batch_size": 8,
  "learning_rate": 2e-5
}
```

**Response:**
```json
{
  "job_id": "train_12345",
  "status": "started",
  "message": "Training job started"
}
```

#### `GET /jobs/{job_id}/status`
Get training job status.

**Response:**
```json
{
  "job_id": "train_12345",
  "status": "running",
  "progress": 0.65,
  "metrics": {
    "loss": 0.123,
    "accuracy": 0.95
  }
}
```
