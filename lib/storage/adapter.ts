/**
 * Storage Adapter - Unified interface for both Local and Convex storage
 * 
 * This adapter allows switching between local file storage and Convex
 * based on environment configuration.
 */

import * as localStorage from './local-storage';

// Check storage backend configuration
const STORAGE_BACKEND = process.env.STORAGE_BACKEND || 'local';
const IS_LOCAL = STORAGE_BACKEND === 'local';

// Re-export types
export type Workflow = localStorage.LocalWorkflow;
export type Execution = localStorage.LocalExecution;
export type MCPServer = localStorage.LocalMCPServer;
export type UserLLMKey = localStorage.LocalUserLLMKey;
export type APIKey = localStorage.LocalAPIKey;
export type Approval = localStorage.LocalApproval;

// ============================================================================
// Workflows
// ============================================================================

export async function listWorkflows(userId?: string): Promise<Workflow[]> {
  if (IS_LOCAL) {
    return localStorage.listWorkflows(userId);
  }
  
  // Convex implementation would go here
  throw new Error('Convex storage not yet implemented in adapter');
}

export async function getWorkflow(id: string): Promise<Workflow | null> {
  if (IS_LOCAL) {
    return localStorage.getWorkflow(id);
  }
  
  throw new Error('Convex storage not yet implemented in adapter');
}

export async function getWorkflowByCustomId(customId: string): Promise<Workflow | null> {
  if (IS_LOCAL) {
    return localStorage.getWorkflowByCustomId(customId);
  }
  
  throw new Error('Convex storage not yet implemented in adapter');
}

export async function saveWorkflow(workflow: Omit<Workflow, '_id' | 'createdAt' | 'updatedAt'> & { customId?: string }): Promise<string> {
  if (IS_LOCAL) {
    return localStorage.saveWorkflow(workflow);
  }
  
  throw new Error('Convex storage not yet implemented in adapter');
}

export async function deleteWorkflow(id: string): Promise<void> {
  if (IS_LOCAL) {
    return localStorage.deleteWorkflow(id);
  }
  
  throw new Error('Convex storage not yet implemented in adapter');
}

// ============================================================================
// Templates
// ============================================================================

export async function listTemplates(): Promise<Workflow[]> {
  if (IS_LOCAL) {
    return localStorage.listTemplates();
  }
  
  throw new Error('Convex storage not yet implemented in adapter');
}

export async function getTemplate(customId: string): Promise<Workflow | null> {
  if (IS_LOCAL) {
    return localStorage.getTemplate(customId);
  }
  
  throw new Error('Convex storage not yet implemented in adapter');
}

// ============================================================================
// Executions
// ============================================================================

export async function createExecution(execution: Omit<Execution, '_id'>): Promise<string> {
  if (IS_LOCAL) {
    return localStorage.createExecution(execution);
  }
  
  throw new Error('Convex storage not yet implemented in adapter');
}

export async function updateExecution(id: string, updates: Partial<Execution>): Promise<void> {
  if (IS_LOCAL) {
    return localStorage.updateExecution(id, updates);
  }
  
  throw new Error('Convex storage not yet implemented in adapter');
}

export async function getExecution(id: string): Promise<Execution | null> {
  if (IS_LOCAL) {
    return localStorage.getExecution(id);
  }
  
  throw new Error('Convex storage not yet implemented in adapter');
}

export async function listExecutions(workflowId: string): Promise<Execution[]> {
  if (IS_LOCAL) {
    return localStorage.listExecutions(workflowId);
  }
  
  throw new Error('Convex storage not yet implemented in adapter');
}

// ============================================================================
// MCP Servers
// ============================================================================

export async function listMCPServers(userId: string): Promise<MCPServer[]> {
  if (IS_LOCAL) {
    return localStorage.listMCPServers(userId);
  }
  
  throw new Error('Convex storage not yet implemented in adapter');
}

export async function saveMCPServer(server: Omit<MCPServer, '_id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  if (IS_LOCAL) {
    return localStorage.saveMCPServer(server);
  }
  
  throw new Error('Convex storage not yet implemented in adapter');
}

export async function deleteMCPServer(id: string): Promise<void> {
  if (IS_LOCAL) {
    return localStorage.deleteMCPServer(id);
  }
  
  throw new Error('Convex storage not yet implemented in adapter');
}

// ============================================================================
// User LLM Keys
// ============================================================================

export async function listUserLLMKeys(userId: string): Promise<UserLLMKey[]> {
  if (IS_LOCAL) {
    return localStorage.listUserLLMKeys(userId);
  }
  
  throw new Error('Convex storage not yet implemented in adapter');
}

export async function saveUserLLMKey(key: Omit<UserLLMKey, '_id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  if (IS_LOCAL) {
    return localStorage.saveUserLLMKey(key);
  }
  
  throw new Error('Convex storage not yet implemented in adapter');
}

export async function deleteUserLLMKey(id: string): Promise<void> {
  if (IS_LOCAL) {
    return localStorage.deleteUserLLMKey(id);
  }
  
  throw new Error('Convex storage not yet implemented in adapter');
}

// ============================================================================
// API Keys
// ============================================================================

export async function listAPIKeys(userId: string): Promise<APIKey[]> {
  if (IS_LOCAL) {
    return localStorage.listAPIKeys(userId);
  }
  
  throw new Error('Convex storage not yet implemented in adapter');
}

export async function saveAPIKey(key: Omit<APIKey, '_id'>): Promise<string> {
  if (IS_LOCAL) {
    return localStorage.saveAPIKey(key);
  }
  
  throw new Error('Convex storage not yet implemented in adapter');
}

export async function verifyAPIKey(key: string): Promise<{ valid: boolean; userId?: string; error?: string }> {
  if (IS_LOCAL) {
    return localStorage.verifyAPIKey(key);
  }
  
  throw new Error('Convex storage not yet implemented in adapter');
}

export async function revokeAPIKey(id: string): Promise<void> {
  if (IS_LOCAL) {
    return localStorage.revokeAPIKey(id);
  }
  
  throw new Error('Convex storage not yet implemented in adapter');
}

// ============================================================================
// Approvals
// ============================================================================

export async function createApproval(approval: Omit<Approval, '_id'>): Promise<string> {
  if (IS_LOCAL) {
    return localStorage.createApproval(approval);
  }
  
  throw new Error('Convex storage not yet implemented in adapter');
}

export async function updateApproval(approvalId: string, updates: Partial<Approval>): Promise<void> {
  if (IS_LOCAL) {
    return localStorage.updateApproval(approvalId, updates);
  }
  
  throw new Error('Convex storage not yet implemented in adapter');
}

export async function getApproval(approvalId: string): Promise<Approval | null> {
  if (IS_LOCAL) {
    return localStorage.getApproval(approvalId);
  }
  
  throw new Error('Convex storage not yet implemented in adapter');
}

export async function listPendingApprovals(userId?: string): Promise<Approval[]> {
  if (IS_LOCAL) {
    return localStorage.listPendingApprovals(userId);
  }
  
  throw new Error('Convex storage not yet implemented in adapter');
}

// ============================================================================
// Utility functions
// ============================================================================

export function isLocalStorage(): boolean {
  return IS_LOCAL;
}

export function getStorageBackend(): string {
  return STORAGE_BACKEND;
}
