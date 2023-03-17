const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const pool = require("../modules/pool");
const router = express.Router();

//route to GET all tags
router.get("/tags", (req, res) => {
  const queryText =  `SELECT * FROM "tags";`;

  pool.query(queryText)
  .then((response) => {
    res.send(response.rows);
  })
  .catch((err) => {

    console.log("error grabbing all tags", err)
    res.sendStatus(500);
  })

});
//route to GET all locations
router.get("/locations", (req, res) => {
  const queryText =  `SELECT * FROM "locations";`;

  pool.query(queryText)
  .then((response) => {
    res.send(response.rows);
  })
  .catch((err) => {

    console.log("error grabbing all locations", err)
    res.sendStatus(500);
  })

});

// route to GET all tasks that have been completed by a user - history of completed tasks
router.get("/user_completed", rejectUnauthenticated, async (req, res) => {
  const userId = req.user.id;

  try {
    const queryText = `
      SELECT "tasks"."id" AS "task_id", "title", "notes", "has_budget", "budget", "location_id", "status", 
    created_by."id" AS "created_by_id", 
    created_by."first_name" AS "created_by_first_name", 
    created_by."last_name" AS "created_by_last_name", 
    created_by."username" AS "created_by_username", 
    created_by."phone_number" AS "created_by_phone_number", 
    assigned_to."id" AS "assigned_to_id", 
    assigned_to."first_name" AS "assigned_to_first_name", 
    assigned_to."last_name" AS "assigned_to_last_name", 
    assigned_to."username" AS "assigned_to_username", 
    assigned_to."phone_number" AS "assigned_to_phone_number", 
    "time_created", "time_assigned", "time_completed", "is_time_sensitive", "due_date", "location_name", 
    json_agg(
        json_build_object(
            'tag_id', "tags"."id",
            'tag_name', "tags"."tag_name"
        )
    ) AS "tags",
    json_agg(
        json_build_object(
            'comment_id', "comments"."id",
            'time_posted', "comments"."time_posted",
            'content', "comments"."content",
            'posted_by_first_name', posted_by."first_name",
            'posted_by_last_name', posted_by."last_name",
            'posted_by_username', posted_by."username",
            'posted_by_phone_number', posted_by."phone_number"
        )
    ) AS "comments"
FROM "tasks"
JOIN "locations" ON "location_id" = "locations"."id"
JOIN "user" created_by ON created_by."id" = "tasks"."created_by_id"
JOIN "user" assigned_to ON assigned_to."id" = "tasks"."assigned_to_id"
JOIN "tags_per_task" ON "task_id" = "tasks"."id"
JOIN "tags" ON "tag_id" = "tags"."id"
JOIN "comments" ON "tasks"."id" = "comments"."task_id"
JOIN "user" posted_by ON posted_by."id" = "comments"."posted_by_id"
WHERE "status" = 'completed'
AND "assigned_to_id" = $1 
GROUP BY "tasks"."id", "title", "notes", "has_budget", "budget", "location_id", "status", 
    created_by."id", created_by."first_name", created_by."last_name", created_by."username", created_by."phone_number", 
    assigned_to."id", assigned_to."first_name", assigned_to."last_name", assigned_to."username", assigned_to."phone_number", 
    "time_created", "time_assigned", "time_completed", "is_time_sensitive", "due_date", "location_name"; 
    `;
    const result = await pool.query(queryText, [userId]);
    res.send(result.rows);
  } catch (error) {
    console.log("error getting task", error);
    res.sendStatus(500);
  }
});

// route to GET all tasks that have been assigned to a user - user todo list
router.get("/user_assigned_tasks", rejectUnauthenticated, async (req, res) => {
  const userId = req.user.id;

  try {
    const queryText = `
      SELECT "tasks"."id" AS "task_id", "title", "notes", "has_budget", "budget", "location_id", "status", 
    created_by."id" AS "created_by_id", 
    created_by."first_name" AS "created_by_first_name", 
    created_by."last_name" AS "created_by_last_name", 
    created_by."username" AS "created_by_username", 
    created_by."phone_number" AS "created_by_phone_number", 
    assigned_to."id" AS "assigned_to_id", 
    assigned_to."first_name" AS "assigned_to_first_name", 
    assigned_to."last_name" AS "assigned_to_last_name", 
    assigned_to."username" AS "assigned_to_username", 
    assigned_to."phone_number" AS "assigned_to_phone_number", 
    "time_created", "time_assigned", "time_completed", "is_time_sensitive", "due_date", "location_name", 
    json_agg(
        json_build_object(
            'tag_id', "tags"."id",
            'tag_name', "tags"."tag_name"
        )
    ) AS "tags",
    json_agg(
        json_build_object(
            'comment_id', "comments"."id",
            'time_posted', "comments"."time_posted",
            'content', "comments"."content",
            'posted_by_first_name', posted_by."first_name",
            'posted_by_last_name', posted_by."last_name",
            'posted_by_username', posted_by."username",
            'posted_by_phone_number', posted_by."phone_number"
        )
    ) AS "comments"
FROM "tasks"
JOIN "locations" ON "location_id" = "locations"."id"
JOIN "user" created_by ON created_by."id" = "tasks"."created_by_id"
JOIN "user" assigned_to ON assigned_to."id" = "tasks"."assigned_to_id"
JOIN "tags_per_task" ON "task_id" = "tasks"."id"
JOIN "tags" ON "tag_id" = "tags"."id"
JOIN "comments" ON "tasks"."id" = "comments"."task_id"
JOIN "user" posted_by ON posted_by."id" = "comments"."posted_by_id"
WHERE "status" = 'ongoing'
AND "assigned_to_id" = $1 
GROUP BY "tasks"."id", "title", "notes", "has_budget", "budget", "location_id", "status", 
    created_by."id", created_by."first_name", created_by."last_name", created_by."username", created_by."phone_number", 
    assigned_to."id", assigned_to."first_name", assigned_to."last_name", assigned_to."username", assigned_to."phone_number", 
    "time_created", "time_assigned", "time_completed", "is_time_sensitive", "due_date", "location_name"; 
    `;
    const result = await pool.query(queryText, [userId]);
    res.send(result.rows);
  } catch (error) {
    console.log("error getting task", error);
    res.sendStatus(500);
  }
});
// route to GET all tasks that have been approved by admin and are available to be selected for work
router.get("/approved", rejectUnauthenticated, async (req, res) => {
  try {
    const queryText = `
    SELECT "tasks"."id" AS "task_id", "title", "notes", "has_budget", "budget", "location_id", "status", 
    created_by."id" AS "created_by_id", 
    created_by."first_name" AS "created_by_first_name", 
    created_by."last_name" AS "created_by_last_name", 
    created_by."username" AS "created_by_username", 
    created_by."phone_number" AS "created_by_phone_number", 
    assigned_to."id" AS "assigned_to_id", 
    assigned_to."first_name" AS "assigned_to_first_name", 
    assigned_to."last_name" AS "assigned_to_last_name", 
    assigned_to."username" AS "assigned_to_username", 
    assigned_to."phone_number" AS "assigned_to_phone_number", 
    "time_created", "time_assigned", "time_completed", "is_time_sensitive", "due_date", "location_name", 
    json_agg(
        json_build_object(
            'tag_id', "tags"."id",
            'tag_name', "tags"."tag_name"
        )
    ) AS "tags",
    json_agg(
        json_build_object(
            'comment_id', "comments"."id",
            'time_posted', "comments"."time_posted",
            'content', "comments"."content",
            'posted_by_first_name', posted_by."first_name",
            'posted_by_last_name', posted_by."last_name",
            'posted_by_username', posted_by."username",
            'posted_by_phone_number', posted_by."phone_number"
        )
    ) AS "comments"
FROM "tasks"
JOIN "locations" ON "location_id" = "locations"."id"
JOIN "user" created_by ON created_by."id" = "tasks"."created_by_id"
JOIN "user" assigned_to ON assigned_to."id" = "tasks"."assigned_to_id"
JOIN "tags_per_task" ON "task_id" = "tasks"."id"
JOIN "tags" ON "tag_id" = "tags"."id"
JOIN "comments" ON "tasks"."id" = "comments"."task_id"
JOIN "user" posted_by ON posted_by."id" = "comments"."posted_by_id"
WHERE "is_approved" = true
AND "status" = 'available'

GROUP BY "tasks"."id", "title", "notes", "has_budget", "budget", "location_id", "status", 
    created_by."id", created_by."first_name", created_by."last_name", created_by."username", created_by."phone_number", 
    assigned_to."id", assigned_to."first_name", assigned_to."last_name", assigned_to."username", assigned_to."phone_number", 
    "time_created", "time_assigned", "time_completed", "is_time_sensitive", "due_date", "location_name"; 
    `;
    const result = await pool.query(queryText);
    res.send(result.rows);
  } catch (error) {
    console.log("error getting task", error);
    res.sendStatus(500);
  }
});
// route to GET all tasks that have not been approved - for admin
router.get("/not_approved", rejectUnauthenticated, async (req, res) => {
  try {
    const queryText = `
    SELECT "tasks"."id" AS "task_id", "title", "notes", "has_budget", "budget", "location_id", "status", 
    created_by."id" AS "created_by_id", 
    created_by."first_name" AS "created_by_first_name", 
    created_by."last_name" AS "created_by_last_name", 
    created_by."username" AS "created_by_username", 
    created_by."phone_number" AS "created_by_phone_number", 
    assigned_to."id" AS "assigned_to_id", 
    assigned_to."first_name" AS "assigned_to_first_name", 
    assigned_to."last_name" AS "assigned_to_last_name", 
    assigned_to."username" AS "assigned_to_username", 
    assigned_to."phone_number" AS "assigned_to_phone_number", 
    "time_created", "time_assigned", "time_completed", "is_time_sensitive", "due_date", "location_name", 
    json_agg(
        json_build_object(
            'tag_id', "tags"."id",
            'tag_name', "tags"."tag_name"
        )
    ) AS "tags",
    json_agg(
        json_build_object(
            'comment_id', "comments"."id",
            'time_posted', "comments"."time_posted",
            'content', "comments"."content",
            'posted_by_first_name', posted_by."first_name",
            'posted_by_last_name', posted_by."last_name",
            'posted_by_username', posted_by."username",
            'posted_by_phone_number', posted_by."phone_number"
        )
    ) AS "comments"
FROM "tasks"
JOIN "locations" ON "location_id" = "locations"."id"
JOIN "user" created_by ON created_by."id" = "tasks"."created_by_id"
JOIN "user" assigned_to ON assigned_to."id" = "tasks"."assigned_to_id"
JOIN "tags_per_task" ON "task_id" = "tasks"."id"
JOIN "tags" ON "tag_id" = "tags"."id"
JOIN "comments" ON "tasks"."id" = "comments"."task_id"
JOIN "user" posted_by ON posted_by."id" = "comments"."posted_by_id"
WHERE "is_approved" = false

GROUP BY "tasks"."id", "title", "notes", "has_budget", "budget", "location_id", "status", 
    created_by."id", created_by."first_name", created_by."last_name", created_by."username", created_by."phone_number", 
    assigned_to."id", assigned_to."first_name", assigned_to."last_name", assigned_to."username", assigned_to."phone_number", 
    "time_created", "time_assigned", "time_completed", "is_time_sensitive", "due_date", "location_name"; 
    `;
    const result = await pool.query(queryText);
    res.send(result.rows);
  } catch (error) {
    console.log("error getting task", error);
    res.sendStatus(500);
  }
});
// route to GET all tasks that have been approved by admin - for admin to track all compelted and ongoing tasks - master list
router.get("/all_tasks", rejectUnauthenticated, async (req, res) => {
  const userId = req.user.id;

  try {
    const queryText = `
    SELECT "tasks"."id" AS "task_id", "title", "notes", "has_budget", "budget", "location_id", "status", 
    created_by."id" AS "created_by_id", 
    created_by."first_name" AS "created_by_first_name", 
    created_by."last_name" AS "created_by_last_name", 
    created_by."username" AS "created_by_username", 
    created_by."phone_number" AS "created_by_phone_number", 
    assigned_to."id" AS "assigned_to_id", 
    assigned_to."first_name" AS "assigned_to_first_name", 
    assigned_to."last_name" AS "assigned_to_last_name", 
    assigned_to."username" AS "assigned_to_username", 
    assigned_to."phone_number" AS "assigned_to_phone_number", 
    "time_created", "time_assigned", "time_completed", "is_time_sensitive", "due_date", "location_name", 
    json_agg(
        json_build_object(
            'tag_id', "tags"."id",
            'tag_name', "tags"."tag_name"
        )
    ) AS "tags",
    json_agg(
        json_build_object(
            'comment_id', "comments"."id",
            'time_posted', "comments"."time_posted",
            'content', "comments"."content",
            'posted_by_first_name', posted_by."first_name",
            'posted_by_last_name', posted_by."last_name",
            'posted_by_username', posted_by."username",
            'posted_by_phone_number', posted_by."phone_number"
        )
    ) AS "comments"
FROM "tasks"
JOIN "locations" ON "location_id" = "locations"."id"
JOIN "user" created_by ON created_by."id" = "tasks"."created_by_id"
JOIN "user" assigned_to ON assigned_to."id" = "tasks"."assigned_to_id"
JOIN "tags_per_task" ON "task_id" = "tasks"."id"
JOIN "tags" ON "tag_id" = "tags"."id"
JOIN "comments" ON "tasks"."id" = "comments"."task_id"
JOIN "user" posted_by ON posted_by."id" = "comments"."posted_by_id"
WHERE "is_approved" = true

GROUP BY "tasks"."id", "title", "notes", "has_budget", "budget", "location_id", "status", 
    created_by."id", created_by."first_name", created_by."last_name", created_by."username", created_by."phone_number", 
    assigned_to."id", assigned_to."first_name", assigned_to."last_name", assigned_to."username", assigned_to."phone_number", 
    "time_created", "time_assigned", "time_completed", "is_time_sensitive", "due_date", "location_name"; 
    `;
    const result = await pool.query(queryText);
    res.send(result.rows);
  } catch (error) {
    console.log("error getting task", error);
    res.sendStatus(500);
  }
});

//post route to add new task
router.post("/", rejectUnauthenticated, async (req, res) => {
  try {
    const {
      title,
      notes,
      has_budget,
      budget,
      location_id,
      status,
      time_created,
      is_time_sensitive,
      due_date,
      is_approved,
      assigned_to_id,
      photo_url,
    } = req.body;
    const tags = req.body.tags;
    const created_by_id = req.user.id;
    const queryText = `
      INSERT INTO "tasks" (
        "title",
        "notes",
        "has_budget",
        "budget",
        "location_id",
        "status",
        "created_by_id",
        "assigned_to_id",
        "time_created",
        "is_time_sensitive",
        "due_date",
        "is_approved"
        "photo_url"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,$13)
      RETURNING "id"
    `;

    const result = await pool.query(queryText, [
      title,
      notes,
      has_budget,
      budget,
      location_id,
      status,
      created_by_id,
      assigned_to_id,
      time_created,
      is_time_sensitive,
      due_date,
      is_approved,
      photo_url,
    ]);

    const tags_per_task = `
    INSERT INTO "tags_per_task" (
      "task_id",
      "tag_id"
    ) VALUES ($1, $2)
      RETURNING "id"
    `;

    for (let tag of tags) {
      await pool.query(tags_per_task, [result.rows[0].id, tag]);
    }
    res.send(result.rows[0]);
  } catch (error) {
    console.log("Error creating task", error);
    res.sendStatus(500);
  }
});

//post route to add comments to tasks
router.post(`/post_comment`, (req, res) => {


});

/*BASIC USER PUT ROUTES*/
//user assigns task to themselves
router.put(`/user_assign`, (req, res) => {
  let user_id = req.user.id;
  let time_assigned = req.body.time_assigned;
  let task_id = req.body.task_id;
  const queryText = `UPDATE "tasks"
  SET "assigned_to_id" = $1, "time_assigned"=$2
  WHERE "id" = $3;`;

  pool
    .query(queryText, [user_id, time_assigned, task_id])
    .then((result) => res.send(result.rows[0]))
    .catch((err) => {
      console.log("error assigning task to self", err);
      res.sendStatus(500);
    });
});
//user unassigns task from themselves
router.put(`/user_unassign`, (req, res) => {
  let task_id = req.body.task_id;
  const queryText = `UPDATE "tasks"
  SET "assigned_to_id" = null, "time_assigned"=null
  WHERE "id" = $1;`;

  pool
    .query(queryText, [task_id])
    .then((result) => res.send(result.rows[0]))
    .catch((err) => {
      console.log("error unassigning task to self", err);
      res.sendStatus(500);
    });
});
//user marks task their task complete
router.put(`/user_complete_task`, (req, res) => {
  let time_completed = req.body.time_completed;
  let task_id = req.body.task_id;
  const queryText = `UPDATE "tasks"
  SET "status" = 'completed', "time_completed"=$1
  WHERE "id" = $2;`;

  pool
    .query(queryText, [time_completed, task_id])
    .then((result) => res.send(result.rows[0]))
    .catch((err) => {
      console.log("error marking task as complete", err);
      res.sendStatus(500);
    });
});

/*ADMIN USER PUT ROUTES*/
//admin assigns task
router.put(`/admin_assign`, (req, res) => {
  let user_id = req.body.user_id;
  let time_assigned = req.body.time_assigned;
  let task_id = req.body.task_id;
  const queryText = `UPDATE "tasks"
  SET "assigned_to_id" = $1, "time_assigned"=$2
  WHERE "id" = $3;`;

  pool
    .query(queryText, [user_id, time_assigned, task_id])
    .then((result) => res.send(result.rows[0]))
    .catch((err) => {
      console.log("error assigning task to user", err);
      res.sendStatus(500);
    });
});
//admin unassigns task
router.put(`/admin_unassign`, (req, res) => {
  let task_id = req.body.task_id;
  const queryText = `UPDATE "tasks"
  SET "assigned_to_id" = null, "time_assigned"= null
  WHERE "id" = $1;`;

  pool
    .query(queryText, [task_id])
    .then((result) => res.send(result.rows[0]))
    .catch((err) => {
      console.log("error unassigning task from user", err);
      res.sendStatus(500);
    });
});
// approve or deny new task - for admin
router.put(`/admin_approve`, (req, res) => {
  let user_id = req.body.user_id;
  let task_id = req.body.task_id;
  let is_approved = req.body.is_approved;

  const queryText = `UPDATE "tasks"
    SET "assigned_to_id" = $1, "is_approved" = $3
    WHERE "id" = $2;`;

  pool
    .query(queryText, [user_id, task_id, is_approved])
    .then((result) => res.send(result.rows[0]))
    .catch((err) => {
      console.log("error assigning task to user", err);
      res.sendStatus(500);
    });
});

//admin completes any task
router.put(`/admin_complete_task`, (req, res) => {
  let time_completed = req.body.time_completed;
  let task_id = req.body.task_id;
  const queryText = `UPDATE "tasks"
  SET "status" = 'completed', "time_completed"=$1
  WHERE "id" = $2;`;

  pool
    .query(queryText, [time_completed, task_id])
    .then((result) => res.send(result.rows[0]))
    .catch((err) => {
      console.log("error marking task as complete", err);
      res.sendStatus(500);
    });
});
//admin marks task as incomplete
router.put(`/admin_incomplete_task`, (req, res) => {
  let task_id = req.body.task_id;
  const queryText = `UPDATE "tasks"
  SET "status" = 'available', "time_completed"= null
  WHERE "id" = $1;`;

  pool
    .query(queryText, [task_id])
    .then((result) => res.send(result.rows[0]))
    .catch((err) => {
      console.log("error marking task as incomplete", err);
      res.sendStatus(500);
    });
});

//admin edits original settings for task
router.put(`/admin_edit_task`, async (req, res) => {
  let title = req.body.title;
  let tags = req.body.tags;
  let notes = req.body.notes;
  let has_budget = req.body.has_budget;
  let budget = req.body.budget;
  let location_id = req.body.location_id;
  let is_time_sensitive = req.body.is_time_sensitive;
  let due_date = req.body.due_date;
  let task_id = req.body.task_id;

  try {
    const queryText = `UPDATE "tasks"
  SET "title" =$1, "notes" =$2, "has_budget" =$3, "budget" =$4, "location_id" =$5, "is_time_sensitive" =$6, "due_date" =$7
  WHERE "id" = $8;`;

    await pool.query(queryText, [
      title,
      notes,
      has_budget,
      budget,
      location_id,
      is_time_sensitive,
      due_date,
      task_id,
    ]);

    const queryDelete = `DELETE FROM "tags_per_task" WHERE "task_id" = $1`;
    await pool.query(queryDelete, [task_id]);

    const queryText2 = `INSERT INTO "tags_per_task" ("task_id", "tag_id")
  VALUES ($1, $2)`;
    for (let tag of tags) {
      await pool.query(queryText2, [task_id, tag]);
    }
    res.sendStatus(200);
  } catch (err) {
    console.log("error editing task", err);
    res.sendStatus(500);
  }
});

router.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const task = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
    if (task.rows.length === 0) {
      console.log("no task is found");
    }
    await pool.query(`DELETE FROM "tasks" WHERE id = $1`, [id]);
    console.log("task is deleted successfully");
    return res.sendStatus(204);
  } catch (error) {
    console.error("Error trying to delete a task", error);
    res.status(500);
  }
});

module.exports = router;
