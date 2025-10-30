<script lang="ts">
  import { onMount } from 'svelte';
  
  let inputText = '';
  let outputText = '';
  let isLoading = false;
  let error = '';
  let metrics = {
    processingTimeMs: 0,
    memoryUsageMb: 0,
    patchCount: 0,
    avgPatchSize: 0
  };
  
  const processText = async () => {
    if (!inputText.trim()) {
      error = 'Please enter some text to process';
      return;
    }
    
    isLoading = true;
    error = '';
    
    try {
      const response = await fetch('/api/blt/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText })
      });
      
      if (!response.ok) {
        throw new Error('Failed to process text');
      }
      
      const result = await response.json();
      
      if (result.success) {
        outputText = result.data.output;
        metrics = result.data.metrics;
      } else {
        throw new Error(result.error || 'Unknown error occurred');
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Processing error:', err);
    } finally {
      isLoading = false;
    }
  };
  
  const formatNumber = (num: number, decimals = 2) => {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    });
  };
</script>

<div class="blt-processor">
  <h2>Byte Latent Transformer Demo</h2>
  
  {#if error}
    <div class="error-message">
      {error}
    </div>
  {/if}
  
  <div class="input-section">
    <label for="input-text">Input Text:</label>
    <textarea
      id="input-text"
      bind:value={inputText}
      placeholder="Enter text to process..."
      rows="6"
      disabled={isLoading}
    ></textarea>
  </div>
  
  <div class="controls">
    <button 
      on:click={processText}
      disabled={isLoading || !inputText.trim()}
      class:loading={isLoading}
    >
      {isLoading ? 'Processing...' : 'Process Text'}
    </button>
  </div>
  
  <div class="output-section">
    <label>Output:</label>
    <div class="output-box">
      {#if isLoading}
        <div class="loading-indicator">
          <div class="spinner"></div>
          <span>Processing your text...</span>
        </div>
      {:else if outputText}
        <pre>{outputText}</pre>
      {:else}
        <div class="placeholder">
          Processed output will appear here
        </div>
      {/if}
    </div>
  </div>
  
  {#if metrics.processingTimeMs > 0}
    <div class="metrics">
      <h3>Performance Metrics</h3>
      <div class="metrics-grid">
        <div class="metric">
          <span class="metric-label">Processing Time:</span>
          <span class="metric-value">{formatNumber(metrics.processingTimeMs)} ms</span>
        </div>
        <div class="metric">
          <span class="metric-label">Memory Usage:</span>
          <span class="metric-value">{formatNumber(metrics.memoryUsageMb, 2)} MB</span>
        </div>
        <div class="metric">
          <span class="metric-label">Patches:</span>
          <span class="metric-value">{formatNumber(metrics.patchCount)}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Avg Patch Size:</span>
          <span class="metric-value">{formatNumber(metrics.avgPatchSize, 1)} bytes</span>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .blt-processor {
    max-width: 800px;
    margin: 0 auto;
    padding: 1.5rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }
  
  h2 {
    color: #2c3e50;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .error-message {
    background-color: #ffebee;
    color: #c62828;
    padding: 0.75rem 1rem;
    border-radius: 4px;
    margin-bottom: 1.5rem;
    border-left: 4px solid #ef5350;
  }
  
  .input-section, .output-section {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #2c3e50;
  }
  
  textarea, .output-box {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    line-height: 1.5;
    resize: vertical;
    min-height: 120px;
    background-color: white;
  }
  
  .output-box {
    background-color: #f8f9fa;
    min-height: 120px;
    overflow-y: auto;
  }
  
  .output-box pre {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
  }
  
  .placeholder {
    color: #999;
    font-style: italic;
    text-align: center;
    padding: 2rem 0;
  }
  
  .controls {
    display: flex;
    justify-content: flex-end;
    margin: 1rem 0;
  }
  
  button {
    background-color: #3f51b5;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  button:hover:not(:disabled) {
    background-color: #303f9f;
  }
  
  button:disabled {
    background-color: #b0bec5;
    cursor: not-allowed;
  }
  
  button.loading {
    position: relative;
    color: transparent;
  }
  
  button.loading::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    top: 50%;
    left: 50%;
    margin: -8px 0 0 -8px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
  }
  
  .loading-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #666;
  }
  
  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top-color: #3f51b5;
    margin-right: 0.5rem;
    animation: spin 1s ease-in-out infinite;
  }
  
  .metrics {
    margin-top: 2rem;
    padding: 1.5rem;
    background-color: #f8f9fa;
    border-radius: 4px;
  }
  
  .metrics h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #2c3e50;
  }
  
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .metric {
    background: white;
    padding: 1rem;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .metric-label {
    display: block;
    font-size: 0.875rem;
    color: #666;
    margin-bottom: 0.25rem;
  }
  
  .metric-value {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2c3e50;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  @media (max-width: 600px) {
    .metrics-grid {
      grid-template-columns: 1fr;
    }
    
    .blt-processor {
      padding: 1rem;
    }
  }
</style>
