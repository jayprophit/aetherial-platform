# AETHERIAL Platform Quest System

## 1. Objective

To guide users through the AETHERIAL platform's features, encourage exploration, and provide a structured path for engagement. The quest system will offer a series of tasks for users to complete, with rewards for each completed quest.

## 2. Core Components

### a. Quests

- **Concept:** Quests are a collection of objectives that users can complete to earn rewards.
- **Types:**
    - **Onboarding Quests:** A series of quests designed to introduce new users to the platform's core features (e.g., "Complete Your Profile," "Add 5 Friends").
    - **Daily/Weekly Quests:** Time-limited quests that encourage regular engagement (e.g., "Post 3 times today," "Comment on 10 posts this week").
    - **Achievement Quests:** Long-term quests that reward significant milestones (e.g., "Reach 1,000 followers").

### b. Objectives

- **Concept:** Individual tasks that make up a quest.
- **Examples:**
    - `complete_profile`
    - `add_x_friends`
    - `post_x_times`
    - `comment_x_times`

### c. Rewards

- **Concept:** Users receive rewards for completing quests.
- **Types:**
    - **Aether Points (AP):** The primary reward for completing quests.
    - **Badges:** Special badges awarded for completing significant or difficult quests.
    - **Items:** (Future) Virtual items or cosmetics.

## 3. Database Schema

```sql
-- Quests
CREATE TABLE quests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  reward_points INT,
  reward_badge_id INT,
  FOREIGN KEY (reward_badge_id) REFERENCES badges(id)
);

-- Quest Objectives
CREATE TABLE quest_objectives (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quest_id INT NOT NULL,
  objective_type VARCHAR(255) NOT NULL, -- e.g., 'post_x_times'
  target_count INT NOT NULL,
  FOREIGN KEY (quest_id) REFERENCES quests(id)
);

-- User Quests
CREATE TABLE user_quests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  quest_id INT NOT NULL,
  status VARCHAR(50) NOT NULL, -- e.g., 'in_progress', 'completed'
  progress INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (quest_id) REFERENCES quests(id)
);
```

## 4. Implementation Plan

1.  **Database Schema:** Update the database schema to include the `quests`, `quest_objectives`, and `user_quests` tables.
2.  **Quest Service:** Create a service to manage quest logic, including starting quests, tracking progress, and distributing rewards.
3.  **API Endpoints:** Create API endpoints to allow users to view available quests, their progress, and claim rewards.
4.  **Frontend Integration:** Integrate the quest system into the user interface, including a dedicated quest log and notifications for quest progress and completion.

