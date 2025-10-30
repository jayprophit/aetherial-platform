#!/usr/bin/env python3
"""
Aetherial AI Model Training Script

This script handles training, evaluation, and prediction for Aetherial's AI models.
"""

import os
import json
import logging
import torch
import numpy as np
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Union
from dataclasses import dataclass, field
from transformers import (
    AutoConfig,
    AutoModelForCausalLM,
    AutoTokenizer,
    TrainingArguments,
    Trainer,
    EvalPrediction,
    set_seed,
)
from datasets import load_dataset, Dataset
import yaml
import wandb

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(name)s - %(message)s",
    datefmt="%m/%d/%Y %H:%M:%S",
)
logger = logging.getLogger(__name__)

@dataclass
class ModelArguments:
    """Arguments pertaining to which model/config/tokenizer we are going to fine-tune."""
    model_name_or_path: str = field(
        metadata={"help": "Path to pretrained model or model identifier from huggingface.co/models"}
    )
    config_name: Optional[str] = field(
        default=None, metadata={"help": "Pretrained config name or path if not the same as model_name"}
    )
    tokenizer_name: Optional[str] = field(
        default=None, metadata={"help": "Pretrained tokenizer name or path if not the same as model_name"}
    )
    cache_dir: Optional[str] = field(
        default=None, metadata={"help": "Where to store the pretrained models downloaded from huggingface.co"}
    )
    use_fast_tokenizer: bool = field(
        default=True,
        metadata={"help": "Whether to use one of the fast tokenizer (backed by the tokenizers library) or not."},
    )
    model_revision: str = field(
        default="main",
        metadata={"help": "The specific model version to use (can be a branch name, tag name or commit id)."},
    )
    use_auth_token: bool = field(
        default=False,
        metadata={
            "help": "Will use the token generated when running `transformers-cli login` (necessary to use this script with private models)."
        },
    )

@dataclass
class DataTrainingArguments:
    """Arguments pertaining to what data we are going to input our model for training and eval."""
    train_file: Optional[str] = field(
        default=None, metadata={"help": "The input training data file (a text file)."}
    )
    validation_file: Optional[str] = field(
        default=None,
        metadata={"help": "An optional input evaluation data file to evaluate the perplexity on (a text file)."},
    )
    test_file: Optional[str] = field(
        default=None,
        metadata={"help": "An optional input test data file to evaluate the perplexity on (a text file)."},
    )
    max_seq_length: int = field(
        default=512,
        metadata={
            "help": "The maximum total input sequence length after tokenization. Sequences longer than this will be truncated."
        },
    )
    preprocessing_num_workers: Optional[int] = field(
        default=None,
        metadata={"help": "The number of processes to use for the preprocessing."},
    )
    overwrite_cache: bool = field(
        default=False, metadata={"help": "Overwrite the cached training and evaluation sets"}
    )
    pad_to_max_length: bool = field(
        default=True,
        metadata={
            "help": "Whether to pad all samples to `max_seq_length`. If False, will pad the samples dynamically when batching to the maximum length in the batch."
        },
    )
    max_train_samples: Optional[int] = field(
        default=None,
        metadata={
            "help": "For debugging purposes or quicker training, truncate the number of training examples to this value if set."
        },
    )
    max_eval_samples: Optional[int] = field(
        default=None,
        metadata={
            "help": "For debugging purposes or quicker training, truncate the number of evaluation examples to this value if set."
        },
    )
    max_predict_samples: Optional[int] = field(
        default=None,
        metadata={
            "help": "For debugging purposes or quicker training, truncate the number of prediction examples to this value if set."
        },
    )

class AetherialTrainer:
    """Main training class for Aetherial AI models."""
    
    def __init__(self, config_path: str = None):
        """Initialize the trainer with configuration."""
        self.config = self._load_config(config_path)
        self.setup_environment()
        
        # Initialize model, tokenizer, and data
        self.tokenizer = None
        self.model = None
        self.train_dataset = None
        self.eval_dataset = None
        self.test_dataset = None
        
    def _load_config(self, config_path: str = None) -> dict:
        """Load configuration from YAML file."""
        if config_path is None:
            config_path = os.path.join(os.path.dirname(__file__), 'training-config.yaml')
            
        with open(config_path, 'r') as f:
            config = yaml.safe_load(f)
        
        # Set environment variables from config
        if 'wandb' in config.get('tracking', {}):
            os.environ['WANDB_PROJECT'] = config['tracking']['wandb_project']
            os.environ['WANDB_RUN_NAME'] = config['tracking'].get('wandb_run_name', 'aetherial-training')
            
        return config
        
    def setup_environment(self):
        """Setup training environment (logging, seed, etc.)."""
        # Set seed for reproducibility
        set_seed(self.config.get('random_seed', 42))
        
        # Initialize wandb if enabled
        if self.config.get('tracking', {}).get('wandb_project'):
            wandb.init(
                project=self.config['tracking']['wandb_project'],
                name=self.config['tracking'].get('wandb_run_name'),
                config=self.config
            )
    
    def load_model_and_tokenizer(self):
        """Load pretrained model and tokenizer."""
        logger.info(f"Loading model from {self.config['model_name']}")
        
        # Load tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(
            self.config.get('tokenizer_name', self.config['model_name']),
            use_fast=True,
            cache_dir=self.config.get('cache_dir')
        )
        
        # Load model
        self.model = AutoModelForCausalLM.from_pretrained(
            self.config['model_name'],
            cache_dir=self.config.get('cache_dir')
        )
        
        # Resize token embeddings if needed
        if len(self.tokenizer) != self.model.get_input_embeddings().weight.shape[0]:
            self.model.resize_token_embeddings(len(self.tokenizer))
    
    def load_datasets(self):
        """Load and preprocess datasets."""
        data_files = {}
        dataset_args = {}
        
        if self.config['dataset'].get('train_file') is not None:
            data_files["train"] = self.config['dataset']['train_file']
        if self.config['dataset'].get('validation_file') is not None:
            data_files["validation"] = self.config['dataset']['validation_file']
        if self.config['dataset'].get('test_file') is not None:
            data_files["test"] = self.config['dataset']['test_file']
            
        extension = self.config['dataset'].get('train_file', '').split(".")[-1]
        
        if extension == "txt":
            extension = "text"
            dataset_args["keep_linebreaks"] = self.config['dataset'].get("keep_linebreaks", True)
        
        # Load datasets
        raw_datasets = load_dataset(extension, data_files=data_files, **dataset_args)
        
        # Preprocess datasets
        column_names = raw_datasets["train"].column_names
        text_column_name = "text" if "text" in column_names else column_names[0]
        
        def tokenize_function(examples):
            return self.tokenizer(
                examples[text_column_name],
                padding="max_length" if self.config.get('pad_to_max_length', True) else False,
                max_length=self.config.get('max_seq_length', 512),
                truncation=True,
                return_special_tokens_mask=True,
            )
            
        tokenized_datasets = raw_datasets.map(
            tokenize_function,
            batched=True,
            num_proc=self.config['dataset'].get('preprocessing_num_workers', None),
            remove_columns=column_names,
            load_from_cache_file=not self.config['dataset'].get('overwrite_cache', False),
            desc="Running tokenizer on dataset",
        )
        
        if self.config.get('training', {}).get('group_by_length', False):
            # Group texts together for more efficient training
            def group_texts(examples):
                # Concatenate all texts
                concatenated_examples = {k: sum(examples[k], []) for k in examples.keys()}
                total_length = len(concatenated_examples[list(examples.keys())[0]])
                
                # Drop the small remainder
                if total_length >= self.config['max_seq_length']:
                    total_length = (total_length // self.config['max_seq_length']) * self.config['max_seq_length']
                
                # Split by chunks of max_len
                result = {
                    k: [t[i : i + self.config['max_seq_length']] for i in range(0, total_length, self.config['max_seq_length'])]
                    for k, t in concatenated_examples.items()
                }
                return result
                
            tokenized_datasets = tokenized_datasets.map(
                group_texts,
                batched=True,
                num_proc=self.config['dataset'].get('preprocessing_num_workers', None),
                load_from_cache_file=not self.config['dataset'].get('overwrite_cache', False),
                desc=f"Grouping texts in chunks of {self.config['max_seq_length']}",
            )
        
        # Set datasets
        if "train" in tokenized_datasets:
            self.train_dataset = tokenized_datasets["train"]
        if "validation" in tokenized_datasets:
            self.eval_dataset = tokenized_datasets["validation"]
        if "test" in tokenized_datasets:
            self.test_dataset = tokenized_datasets["test"]
    
    def train(self):
        """Train the model."""
        if self.train_dataset is None:
            raise ValueError("Training dataset not loaded. Call load_datasets() first.")
            
        # Initialize training arguments
        training_args = TrainingArguments(
            output_dir=self.config['output']['output_dir'],
            overwrite_output_dir=self.config['output'].get('overwrite_output_dir', True),
            do_train=self.config['output'].get('do_train', True),
            do_eval=self.config['output'].get('do_eval', True),
            evaluation_strategy="steps",
            per_device_train_batch_size=self.config.get('per_device_train_batch_size', 8),
            per_device_eval_batch_size=self.config.get('per_device_eval_batch_size', 8),
            gradient_accumulation_steps=self.config.get('gradient_accumulation_steps', 1),
            learning_rate=float(self.config.get('learning_rate', 2e-5)),
            weight_decay=float(self.config.get('weight_decay', 0.01)),
            adam_epsilon=float(self.config.get('adam_epsilon', 1e-8)),
            max_grad_norm=self.config.get('max_grad_norm', 1.0),
            num_train_epochs=float(self.config.get('num_train_epochs', 3)),
            max_steps=-1,
            warmup_steps=self.config.get('warmup_steps', 0),
            logging_dir=self.config['logging'].get('logging_dir', './logs'),
            logging_first_step=self.config['logging'].get('logging_first_step', False),
            logging_steps=self.config['logging'].get('logging_steps', 500),
            save_steps=self.config['checkpoint'].get('save_steps', 500),
            save_total_limit=self.config['checkpoint'].get('save_total_limit', 3),
            load_best_model_at_end=self.config['checkpoint'].get('load_best_model_at_end', True),
            metric_for_best_model=self.config['checkpoint'].get('metric_for_best_model', 'loss'),
            greater_is_better=self.config['checkpoint'].get('greater_is_better', False),
            seed=self.config.get('random_seed', 42),
            fp16=self.config.get('fp16', False),
            fp16_opt_level=self.config.get('fp16_opt_level', 'O1'),
            local_rank=self.config.get('distributed', {}).get('local_rank', -1),
            dataloader_num_workers=self.config.get('dataloader_num_workers', 0),
            group_by_length=self.config.get('group_by_length', False),
            report_to=["wandb"] if self.config.get('tracking', {}).get('wandb_project') else [],
        )
        
        # Initialize Trainer
        trainer = Trainer(
            model=self.model,
            args=training_args,
            train_dataset=self.train_dataset,
            eval_dataset=self.eval_dataset,
            tokenizer=self.tokenizer,
        )
        
        # Train the model
        train_result = trainer.train()
        trainer.save_model()
        
        # Save tokenizer
        if trainer.is_world_process_zero():
            self.tokenizer.save_pretrained(self.config['output']['output_dir'])
            
        # Evaluate the model
        metrics = trainer.evaluate()
        
        # Log metrics
        trainer.log_metrics("eval", metrics)
        trainer.save_metrics("eval", metrics)
        
        return metrics

def main():
    """Main function for training."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Aetherial AI Model Training")
    parser.add_argument("--config", type=str, default=None, help="Path to config file")
    args = parser.parse_args()
    
    # Initialize and run trainer
    trainer = AetherialTrainer(config_path=args.config)
    trainer.load_model_and_tokenizer()
    trainer.load_datasets()
    metrics = trainer.train()
    
    logger.info(f"Training complete. Final metrics: {metrics}")

if __name__ == "__main__":
    main()
