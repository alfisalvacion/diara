
CREATE DATABASE diara;

\c diara

CREATE TABLE person
(
    id serial NOT NULL,
    username character varying(20) NOT NULL,
    email character varying(20) NOT NULL,
    password character varying(20) NOT NULL UNIQUE,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    CONSTRAINT user_pkey PRIMARY KEY (id)
);

CREATE TABLE project
(
    id serial NOT NULL,
    description text,
    create_date timestamp with time zone NOT NULL,
    deadline timestamp with time zone,
    user_id integer NOT NULL,
    CONSTRAINT project_pkey PRIMARY KEY (id),
    CONSTRAINT user_id FOREIGN KEY (user_id)
        REFERENCES person (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE team
(
    id serial NOT NULL UNIQUE,
    project_id serial NOT NULL,
    user_id serial NOT NULL,
    team_id serial NOT NULL,
    create_date timestamp with time zone NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    CONSTRAINT team_pkey PRIMARY KEY (id, project_id, user_id),
    CONSTRAINT project_id FOREIGN KEY (project_id)
        REFERENCES project (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT team_id FOREIGN KEY (team_id)
        REFERENCES team (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT user_id FOREIGN KEY (user_id)
        REFERENCES person (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE task
(
    id serial NOT NULL,
    project_id serial NOT NULL,
    task_id serial NOT NULL,
    user_id serial NOT NULL,
    title character varying(100) NOT NULL,
    create_date timestamp with time zone NOT NULL,
    deadline timestamp with time zone,
    complete_date timestamp with time zone,
    rating integer,
    CONSTRAINT task_pkey PRIMARY KEY (id),
    CONSTRAINT project_id FOREIGN KEY (project_id)
        REFERENCES project (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT task_id FOREIGN KEY (task_id)
        REFERENCES task (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT user_id FOREIGN KEY (user_id)
        REFERENCES person (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE assignment
(
    user_id serial NOT NULL,
    task_id serial NOT NULL,
    assign_date timestamp with time zone NOT NULL,
    CONSTRAINT assignment_pkey PRIMARY KEY (task_id, user_id),
    CONSTRAINT task_id FOREIGN KEY (task_id)
        REFERENCES task (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT user_id FOREIGN KEY (user_id)
        REFERENCES person (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE attachment
(
    task_id serial NOT NULL,
    filename character varying(30) NOT NULL,
    CONSTRAINT attachment_pkey PRIMARY KEY (filename, task_id),
    CONSTRAINT task_id FOREIGN KEY (task_id)
        REFERENCES task (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE comment
(
    timeid timestamp with time zone NOT NULL,
    task_id serial NOT NULL,
    user_id serial NOT NULL,
    comment text NOT NULL,
    attachment character varying(30),
    CONSTRAINT comment_pkey PRIMARY KEY (timeid, task_id, user_id),
    CONSTRAINT task_id FOREIGN KEY (task_id)
        REFERENCES task (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT user_id FOREIGN KEY (user_id)
        REFERENCES person (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE follow
(
    task_id serial NOT NULL,
    user_id serial NOT NULL,
    CONSTRAINT follow_pkey PRIMARY KEY (task_id, user_id),
    CONSTRAINT task_id FOREIGN KEY (task_id)
        REFERENCES task (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT user_id FOREIGN KEY (user_id)
        REFERENCES person (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL
);
