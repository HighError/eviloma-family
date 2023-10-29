import { relations } from 'drizzle-orm';
import { integer, pgEnum, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const roles = pgEnum('roles', ['default', 'admin', 'superadmin']);
export const subscriptionCategories = pgEnum('subscription_categories', [
  'Other',
  'Youtube',
  'Spotify',
]);
export const transactionCategories = pgEnum('subscription_categories', [
  'Other',
  'Youtube',
  'Spotify',
  'Deposit',
]);

export const usersSchema = pgTable('users', {
  id: text('id').primaryKey().unique().notNull(),
  role: roles('role').notNull().default('default'),
  balance: integer('balance').default(0).notNull(),
  paymentLink: text('payment_link'),
  telegramID: text('telegram_id').unique(),
});

export const subscriptionsSchema = pgTable('subscriptions', {
  id: text('id').primaryKey().unique().notNull(),
  title: text('title').notNull().unique(),
  category: subscriptionCategories('category').notNull().default('Other'),
  cost: integer('cost').notNull(),
  date: timestamp('date').notNull(),
});

export const transactionsSchema = pgTable('transactions', {
  id: uuid('id').primaryKey().unique().notNull().defaultRandom(),
  user: text('user')
    .notNull()
    .references(() => usersSchema.id),
  title: text('title').notNull(),
  category: transactionCategories('category').notNull().default('Other'),
  suma: integer('suma').notNull(),
  date: timestamp('date').notNull(),
});

export const tempTokensSchema = pgTable('temp_tokens', {
  id: uuid('id').primaryKey().unique().notNull().defaultRandom(),
  user: text('user')
    .notNull()
    .references(() => usersSchema.id),
  token: text('token').unique().notNull(),
  validUntil: timestamp('valid_until').notNull(),
});

export const userOnSubscriptions = pgTable(
  'user_subscriptions',
  {
    userId: text('user_id').references(() => usersSchema.id),
    subscriptionId: text('subscription_id').references(() => subscriptionsSchema.id),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.subscriptionId),
  })
);

export const PostOnSubscriptionsRelations = relations(userOnSubscriptions, ({ one }) => ({
  user: one(usersSchema, {
    fields: [userOnSubscriptions.userId],
    references: [usersSchema.id],
  }),
  subscription: one(subscriptionsSchema, {
    fields: [userOnSubscriptions.subscriptionId],
    references: [subscriptionsSchema.id],
  }),
}));

export const userRelations = relations(usersSchema, ({ many }) => ({
  subscriptions: many(userOnSubscriptions),
  transactions: many(transactionsSchema),
}));

export const subscriptionRelations = relations(subscriptionsSchema, ({ many }) => ({
  users: many(userOnSubscriptions),
}));

export const transactionRelations = relations(transactionsSchema, ({ one }) => ({
  user: one(usersSchema, {
    fields: [transactionsSchema.user],
    references: [usersSchema.id],
  }),
}));

export const tempTokenRelations = relations(tempTokensSchema, ({ one }) => ({
  user: one(usersSchema, {
    fields: [tempTokensSchema.user],
    references: [usersSchema.id],
  }),
}));
