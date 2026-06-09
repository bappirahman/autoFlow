import { relations } from 'drizzle-orm';
import { user } from './user.schema';
import { session } from './session.schema';
import { account } from './account.schema';
import { workflow } from './workflow.schema';
import { credential } from './credential.schema';
import { subscription } from './subscription.schema';
import { node } from './node.schema';
import { connection } from './connection.schema';
import { execution } from './execution.schema';

// ─── User ────────────────────────────────────────────────────────────────────
// One user owns many sessions, accounts, workflows, credentials, and subscriptions.
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  workflows: many(workflow),
  credentials: many(credential),
  subscriptions: many(subscription),
}));

// ─── Session ─────────────────────────────────────────────────────────────────
// Each session belongs to one user.
export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

// ─── Account ─────────────────────────────────────────────────────────────────
// Each OAuth/password account belongs to one user.
export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

// ─── Subscription ────────────────────────────────────────────────────────────
// Each Polar subscription belongs to one user.
export const subscriptionRelations = relations(subscription, ({ one }) => ({
  user: one(user, {
    fields: [subscription.userId],
    references: [user.id],
  }),
}));

// ─── Workflow ────────────────────────────────────────────────────────────────
// A workflow belongs to one user and owns many nodes, connections, and executions.
export const workflowRelations = relations(workflow, ({ one, many }) => ({
  user: one(user, {
    fields: [workflow.userId],
    references: [user.id],
  }),
  nodes: many(node),
  connections: many(connection),
  executions: many(execution),
}));

// ─── Credential ──────────────────────────────────────────────────────────────
// A credential belongs to one user and can be referenced by many nodes.
export const credentialRelations = relations(credential, ({ one, many }) => ({
  user: one(user, {
    fields: [credential.userId],
    references: [user.id],
  }),
  nodes: many(node),
}));

// ─── Node ────────────────────────────────────────────────────────────────────
// A node belongs to one workflow and optionally one credential.
// It can be the source of many outgoing connections and the target of many incoming ones.
export const nodeRelations = relations(node, ({ one, many }) => ({
  workflow: one(workflow, {
    fields: [node.workflowId],
    references: [workflow.id],
  }),
  credential: one(credential, {
    fields: [node.credentialId],
    references: [credential.id],
  }),
  // Connections where this node is the source
  outputConnections: many(connection, { relationName: 'fromNode' }),
  // Connections where this node is the target
  inputConnections: many(connection, { relationName: 'toNode' }),
}));

// ─── Connection ──────────────────────────────────────────────────────────────
// A connection belongs to one workflow and links exactly two nodes (fromNode → toNode).
// Named relations disambiguate the two FK references to the same node table.
export const connectionRelations = relations(connection, ({ one }) => ({
  workflow: one(workflow, {
    fields: [connection.workflowId],
    references: [workflow.id],
  }),
  fromNode: one(node, {
    fields: [connection.fromNodeId],
    references: [node.id],
    relationName: 'fromNode',
  }),
  toNode: one(node, {
    fields: [connection.toNodeId],
    references: [node.id],
    relationName: 'toNode',
  }),
}));

// ─── Execution ───────────────────────────────────────────────────────────────
// Each execution run belongs to one workflow.
export const executionRelations = relations(execution, ({ one }) => ({
  workflow: one(workflow, {
    fields: [execution.workflowId],
    references: [workflow.id],
  }),
}));
