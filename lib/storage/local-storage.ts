/**
 * Local File-Based Storage Implementation
 * 
 * This is a self-hosted alternative to Convex that stores data in JSON files.
 * Perfect for single-user deployments without external dependencies.
 */

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// Storage directory
const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create data directory:', error);
  }
}

// Generic file operations
async function readJSONFile<T>(filename: string): Promise<T[]> {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

async function writeJSONFile<T>(filename: string, data: T[]): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Generate unique IDs
function generateId(): string {
  return crypto.randomBytes(16).toString('hex');
}

// ============================================================================
// Workflows Storage
// ============================================================================

export interface LocalWorkflow {
  _id: string;
  userId?: string;
  customId?: string;
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
  difficulty?: string;
  estimatedTime?: string;
  nodes: any[];
  edges: any[];
  createdAt: string;
  updatedAt: string;
  version?: string;
  isTemplate?: boolean;
  isPublic?: boolean;
}

export async function listWorkflows(userId?: string): Promise<LocalWorkflow[]> {
  const workflows = await readJSONFile<LocalWorkflow>('workflows.json');
  
  // Filter by userId if provided and not in template mode
  if (userId) {
    return workflows.filter(w => w.userId === userId && !w.isTemplate);
  }
  
  return workflows.filter(w => !w.isTemplate);
}

export async function getWorkflow(id: string): Promise<LocalWorkflow | null> {
  const workflows = await readJSONFile<LocalWorkflow>('workflows.json');
  return workflows.find(w => w._id === id) || null;
}

export async function getWorkflowByCustomId(customId: string): Promise<LocalWorkflow | null> {
  const workflows = await readJSONFile<LocalWorkflow>('workflows.json');
  return workflows.find(w => w.customId === customId) || null;
}

export async function saveWorkflow(workflow: Omit<LocalWorkflow, '_id' | 'createdAt' | 'updatedAt'> & { customId?: string }): Promise<string> {
  const workflows = await readJSONFile<LocalWorkflow>('workflows.json');
  
  // Check if workflow with customId exists
  if (workflow.customId) {
    const existingIndex = workflows.findIndex(w => w.customId === workflow.customId);
    if (existingIndex !== -1) {
      // Update existing
      workflows[existingIndex] = {
        ...workflows[existingIndex],
        ...workflow,
        updatedAt: new Date().toISOString(),
      };
      await writeJSONFile('workflows.json', workflows);
      return workflows[existingIndex]._id;
    }
  }
  
  // Create new
  const newWorkflow: LocalWorkflow = {
    ...workflow,
    _id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  workflows.push(newWorkflow);
  await writeJSONFile('workflows.json', workflows);
  return newWorkflow._id;
}

export async function deleteWorkflow(id: string): Promise<void> {
  const workflows = await readJSONFile<LocalWorkflow>('workflows.json');
  const filtered = workflows.filter(w => w._id !== id);
  await writeJSONFile('workflows.json', filtered);
}

// ============================================================================
// Templates Storage
// ============================================================================

export async function listTemplates(): Promise<LocalWorkflow[]> {
  const workflows = await readJSONFile<LocalWorkflow>('workflows.json');
  return workflows.filter(w => w.isTemplate === true);
}

export async function getTemplate(customId: string): Promise<LocalWorkflow | null> {
  const workflows = await readJSONFile<LocalWorkflow>('workflows.json');
  return workflows.find(w => w.customId === customId && w.isTemplate === true) || null;
}

// ============================================================================
// Executions Storage
// ============================================================================

export interface LocalExecution {
  _id: string;
  workflowId: string;
  status: string;
  currentNodeId?: string;
  nodeResults: any;
  variables: any;
  input?: any;
  output?: any;
  error?: string;
  startedAt: string;
  completedAt?: string;
  threadId?: string;
}

export async function createExecution(execution: Omit<LocalExecution, '_id'>): Promise<string> {
  const executions = await readJSONFile<LocalExecution>('executions.json');
  const newExecution: LocalExecution = {
    ...execution,
    _id: generateId(),
  };
  executions.push(newExecution);
  await writeJSONFile('executions.json', executions);
  return newExecution._id;
}

export async function updateExecution(id: string, updates: Partial<LocalExecution>): Promise<void> {
  const executions = await readJSONFile<LocalExecution>('executions.json');
  const index = executions.findIndex(e => e._id === id);
  if (index !== -1) {
    executions[index] = { ...executions[index], ...updates };
    await writeJSONFile('executions.json', executions);
  }
}

export async function getExecution(id: string): Promise<LocalExecution | null> {
  const executions = await readJSONFile<LocalExecution>('executions.json');
  return executions.find(e => e._id === id) || null;
}

export async function listExecutions(workflowId: string): Promise<LocalExecution[]> {
  const executions = await readJSONFile<LocalExecution>('executions.json');
  return executions.filter(e => e.workflowId === workflowId);
}

// ============================================================================
// MCP Servers Storage
// ============================================================================

export interface LocalMCPServer {
  _id: string;
  userId: string;
  name: string;
  url: string;
  description?: string;
  category: string;
  authType: string;
  accessToken?: string;
  tools?: string[];
  connectionStatus: string;
  lastTested?: string;
  lastError?: string;
  enabled: boolean;
  isOfficial: boolean;
  headers?: any;
  createdAt: string;
  updatedAt: string;
}

export async function listMCPServers(userId: string): Promise<LocalMCPServer[]> {
  const servers = await readJSONFile<LocalMCPServer>('mcp-servers.json');
  return servers.filter(s => s.userId === userId);
}

export async function saveMCPServer(server: Omit<LocalMCPServer, '_id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const servers = await readJSONFile<LocalMCPServer>('mcp-servers.json');
  
  // Check if server with same name exists for this user
  const existingIndex = servers.findIndex(s => s.name === server.name && s.userId === server.userId);
  
  if (existingIndex !== -1) {
    // Update existing
    servers[existingIndex] = {
      ...servers[existingIndex],
      ...server,
      updatedAt: new Date().toISOString(),
    };
    await writeJSONFile('mcp-servers.json', servers);
    return servers[existingIndex]._id;
  }
  
  // Create new
  const newServer: LocalMCPServer = {
    ...server,
    _id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  servers.push(newServer);
  await writeJSONFile('mcp-servers.json', servers);
  return newServer._id;
}

export async function deleteMCPServer(id: string): Promise<void> {
  const servers = await readJSONFile<LocalMCPServer>('mcp-servers.json');
  const filtered = servers.filter(s => s._id !== id);
  await writeJSONFile('mcp-servers.json', filtered);
}

// ============================================================================
// User LLM Keys Storage
// ============================================================================

export interface LocalUserLLMKey {
  _id: string;
  userId: string;
  provider: string;
  encryptedKey: string;
  keyPrefix: string;
  label?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastUsedAt?: string;
  usageCount?: number;
}

export async function listUserLLMKeys(userId: string): Promise<LocalUserLLMKey[]> {
  const keys = await readJSONFile<LocalUserLLMKey>('user-llm-keys.json');
  return keys.filter(k => k.userId === userId);
}

export async function saveUserLLMKey(key: Omit<LocalUserLLMKey, '_id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const keys = await readJSONFile<LocalUserLLMKey>('user-llm-keys.json');
  
  // Check if key for this provider exists for this user
  const existingIndex = keys.findIndex(k => k.provider === key.provider && k.userId === key.userId);
  
  if (existingIndex !== -1) {
    // Update existing
    keys[existingIndex] = {
      ...keys[existingIndex],
      ...key,
      updatedAt: new Date().toISOString(),
    };
    await writeJSONFile('user-llm-keys.json', keys);
    return keys[existingIndex]._id;
  }
  
  // Create new
  const newKey: LocalUserLLMKey = {
    ...key,
    _id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  keys.push(newKey);
  await writeJSONFile('user-llm-keys.json', keys);
  return newKey._id;
}

export async function deleteUserLLMKey(id: string): Promise<void> {
  const keys = await readJSONFile<LocalUserLLMKey>('user-llm-keys.json');
  const filtered = keys.filter(k => k._id !== id);
  await writeJSONFile('user-llm-keys.json', filtered);
}

// ============================================================================
// API Keys Storage (for API access)
// ============================================================================

export interface LocalAPIKey {
  _id: string;
  key: string;
  keyPrefix: string;
  userId: string;
  name: string;
  usageCount: number;
  lastUsedAt?: string;
  createdAt: string;
  expiresAt?: string;
  revokedAt?: string;
}

export async function listAPIKeys(userId: string): Promise<LocalAPIKey[]> {
  const keys = await readJSONFile<LocalAPIKey>('api-keys.json');
  return keys.filter(k => k.userId === userId && !k.revokedAt);
}

export async function saveAPIKey(key: Omit<LocalAPIKey, '_id'>): Promise<string> {
  const keys = await readJSONFile<LocalAPIKey>('api-keys.json');
  
  const newKey: LocalAPIKey = {
    ...key,
    _id: generateId(),
  };
  
  keys.push(newKey);
  await writeJSONFile('api-keys.json', keys);
  return newKey._id;
}

export async function verifyAPIKey(key: string): Promise<{ valid: boolean; userId?: string; error?: string }> {
  const keys = await readJSONFile<LocalAPIKey>('api-keys.json');
  
  // Hash the provided key to compare
  const hashedKey = crypto.createHash('sha256').update(key).digest('hex');
  
  const apiKey = keys.find(k => k.key === hashedKey && !k.revokedAt);
  
  if (!apiKey) {
    return { valid: false, error: 'Invalid API key' };
  }
  
  // Check expiration
  if (apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date()) {
    return { valid: false, error: 'API key expired' };
  }
  
  // Update usage
  apiKey.usageCount++;
  apiKey.lastUsedAt = new Date().toISOString();
  await writeJSONFile('api-keys.json', keys);
  
  return { valid: true, userId: apiKey.userId };
}

export async function revokeAPIKey(id: string): Promise<void> {
  const keys = await readJSONFile<LocalAPIKey>('api-keys.json');
  const index = keys.findIndex(k => k._id === id);
  if (index !== -1) {
    keys[index].revokedAt = new Date().toISOString();
    await writeJSONFile('api-keys.json', keys);
  }
}

// ============================================================================
// Approvals Storage
// ============================================================================

export interface LocalApproval {
  _id: string;
  approvalId: string;
  workflowId: string;
  executionId?: string;
  nodeId?: string;
  message: string;
  status: string;
  userId?: string;
  createdBy?: string;
  createdAt: string;
  respondedAt?: string;
  respondedBy?: string;
}

export async function createApproval(approval: Omit<LocalApproval, '_id'>): Promise<string> {
  const approvals = await readJSONFile<LocalApproval>('approvals.json');
  const newApproval: LocalApproval = {
    ...approval,
    _id: generateId(),
  };
  approvals.push(newApproval);
  await writeJSONFile('approvals.json', approvals);
  return newApproval._id;
}

export async function updateApproval(approvalId: string, updates: Partial<LocalApproval>): Promise<void> {
  const approvals = await readJSONFile<LocalApproval>('approvals.json');
  const index = approvals.findIndex(a => a.approvalId === approvalId);
  if (index !== -1) {
    approvals[index] = { ...approvals[index], ...updates };
    await writeJSONFile('approvals.json', approvals);
  }
}

export async function getApproval(approvalId: string): Promise<LocalApproval | null> {
  const approvals = await readJSONFile<LocalApproval>('approvals.json');
  return approvals.find(a => a.approvalId === approvalId) || null;
}

export async function listPendingApprovals(userId?: string): Promise<LocalApproval[]> {
  const approvals = await readJSONFile<LocalApproval>('approvals.json');
  const pending = approvals.filter(a => a.status === 'pending');
  
  if (userId) {
    return pending.filter(a => a.userId === userId);
  }
  
  return pending;
}
