"""
Quantization module for low-precision training.
Supports FP32, BF16, FP8, FP4, FP2, and binary quantization.
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Union, Tuple, Optional

class Quantizer(nn.Module):
    def __init__(self, 
                 num_bits: int = 8,
                 symmetric: bool = True,
                 dynamic: bool = True,
                 ema_decay: float = 0.999):
        super().__init__()
        self.num_bits = num_bits
        self.symmetric = symmetric
        self.dynamic = dynamic
        self.ema_decay = ema_decay
        
        if num_bits == 32:
            self.quantize_fn = self._quantize_fp32
        elif num_bits == 16:
            self.quantize_fn = self._quantize_bf16
        elif num_bits == 8:
            self.quantize_fn = self._quantize_fp8
        elif num_bits == 4:
            self.quantize_fn = self._quantize_fp4
        elif num_bits == 2:
            self.quantize_fn = self._quantize_fp2
        elif num_bits == 1:
            self.quantize_fn = self._quantize_binary
        else:
            raise ValueError(f"Unsupported number of bits: {num_bits}")
            
        # Register buffers for scale and zero point
        self.register_buffer('scale', torch.tensor(1.0))
        self.register_buffer('zero_point', torch.tensor(0, dtype=torch.int32))
        
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        if not self.training and not self.dynamic:
            return self.quantize_fn(x)
            
        # Calculate min/max for dynamic quantization
        if self.symmetric:
            max_val = x.abs().max()
            min_val = -max_val if self.symmetric else x.min()
        else:
            min_val, max_val = x.min(), x.max()
            
        # Update scale and zero point using EMA
        if self.training:
            scale = (max_val - min_val) / (2 ** self.num_bits - 1)
            zero_point = torch.round(-min_val / scale)
            
            # Update with EMA
            self.scale = self.ema_decay * self.scale + (1 - self.ema_decay) * scale
            self.zero_point = self.ema_decay * self.zero_point + (1 - self.ema_decay) * zero_point
        
        return self.quantize_fn(x)
    
    def _quantize_fp32(self, x: torch.Tensor) -> torch.Tensor:
        return x.to(torch.float32)
        
    def _quantize_bf16(self, x: torch.Tensor) -> torch.Tensor:
        return x.to(torch.bfloat16)
        
    def _quantize_fp8(self, x: torch.Tensor) -> torch.Tensor:
        # FP8 emulation (E4M3 format)
        scale = self.scale if hasattr(self, 'scale') else x.abs().max() / 15.0
        x_q = torch.clamp(torch.round(x / scale), -8, 7)
        return x_q * scale
        
    def _quantize_fp4(self, x: torch.Tensor) -> torch.Tensor:
        # FP4 emulation (E2M1 format)
        scale = self.scale if hasattr(self, 'scale') else x.abs().max() / 3.0
        x_q = torch.clamp(torch.round(x / scale), -4, 3)
        return x_q * scale
        
    def _quantize_fp2(self, x: torch.Tensor) -> torch.Tensor:
        # FP2 emulation (E1M0 format)
        scale = self.scale if hasattr(self, 'scale') else x.abs().max()
        x_q = torch.sign(x) * scale
        return x_q
        
    def _quantize_binary(self, x: torch.Tensor) -> torch.Tensor:
        # Binary quantization (1-bit)
        return torch.sign(x) * self.scale if hasattr(self, 'scale') else torch.sign(x)


class QuantizedLinear(nn.Module):
    def __init__(self, in_features: int, out_features: int, 
                 weight_bits: int = 8, bias_bits: int = 32,
                 symmetric: bool = True):
        super().__init__()
        self.in_features = in_features
        self.out_features = out_features
        
        # Full precision weights and bias
        self.weight = nn.Parameter(torch.Tensor(out_features, in_features))
        self.bias = nn.Parameter(torch.Tensor(out_features))
        
        # Quantizers
        self.weight_quantizer = Quantizer(num_bits=weight_bits, symmetric=symmetric)
        self.bias_quantizer = Quantizer(num_bits=bias_bits, symmetric=symmetric)
        
        # Initialize parameters
        self.reset_parameters()
        
    def reset_parameters(self):
        nn.init.kaiming_uniform_(self.weight, a=math.sqrt(5))
        if self.bias is not None:
            fan_in, _ = nn.init._calculate_fan_in_and_fan_out(self.weight)
            bound = 1 / math.sqrt(fan_in)
            nn.init.uniform_(self.bias, -bound, bound)
    
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # Quantize weights and bias
        weight_q = self.weight_quantizer(self.weight)
        bias_q = self.bias_quantizer(self.bias) if self.bias is not None else None
        
        # Linear transformation
        return F.linear(x, weight_q, bias_q)


class STEFunction(torch.autograd.Function):
    """
    Straight-Through Estimator (STE) for non-differentiable operations.
    In forward pass: quantize the input
    In backward pass: pass gradients through as if the operation was identity
    """
    @staticmethod
    def forward(ctx, x, quantize_fn):
        return quantize_fn(x)
    
    @staticmethod
    def backward(ctx, grad_output):
        return grad_output, None


def ste_quantize(x: torch.Tensor, quantize_fn) -> torch.Tensor:
    """Apply quantization with straight-through estimator for backpropagation."""
    return STEFunction.apply(x, quantize_fn)
