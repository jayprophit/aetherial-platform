import { Request, Response } from 'express';
import { LatentTransformer } from '../core/latent_transformer';
import { BLTConfig } from '../types';

class BLTController {
  private transformer: LatentTransformer;
  private config: BLTConfig;
  private isInitialized: boolean = false;
  private initPromise: Promise<void> | null = null;

  constructor(config: Partial<BLTConfig> = {}) {
    this.config = config;
    this.transformer = new LatentTransformer(config);
    this.initialize();
  }

  private async initialize() {
    if (this.isInitialized) return;
    
    if (!this.initPromise) {
      this.initPromise = (async () => {
        try {
          await this.transformer.initialize();
          this.isInitialized = true;
          console.log('BLT Controller initialized successfully');
        } catch (error) {
          console.error('Failed to initialize BLT Controller:', error);
          throw error;
        }
      })();
    }

    return this.initPromise;
  }

  public async processText(req: Request, res: Response) {
    try {
      await this.initialize();
      const { text, config } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: 'No text provided' });
      }

      const result = await this.transformer.process(text);
      
      res.json({
        success: true,
        data: {
          output: result.output,
          metrics: result.metrics
        }
      });
    } catch (error) {
      console.error('BLT processing error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process text',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  public async getStatus(_req: Request, res: Response) {
    try {
      await this.initialize();
      res.json({
        status: 'ready',
        config: this.config,
        memoryUsage: process.memoryUsage()
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  public async updateConfig(req: Request, res: Response) {
    try {
      const newConfig = req.body;
      // Create a new transformer with updated config
      this.transformer = new LatentTransformer({
        ...this.config,
        ...newConfig
      });
      
      // Re-initialize with new config
      this.isInitialized = false;
      await this.initialize();
      
      res.json({
        success: true,
        message: 'Configuration updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: 'Invalid configuration',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  public getRouter() {
    const express = require('express');
    const router = express.Router();

    router.post('/process', this.processText.bind(this));
    router.get('/status', this.getStatus.bind(this));
    router.put('/config', this.updateConfig.bind(this));

    return router;
  }
}

export default BLTController;
