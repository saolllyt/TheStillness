--
-- PostgreSQL database dump
--

\restrict pvXI5epkacF2zaulbA1xwBOclcja9e1dc3hzkiTU6M0itg6xwE15TWWgeWKJXuP

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.tracks DROP CONSTRAINT IF EXISTS tracks_playlist_id_fkey;
ALTER TABLE IF EXISTS ONLY public.smer_diary DROP CONSTRAINT IF EXISTS smer_diary_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.reports DROP CONSTRAINT IF EXISTS reports_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.psychologists DROP CONSTRAINT IF EXISTS psychologists_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.psychologist_reports DROP CONSTRAINT IF EXISTS psychologist_reports_psychologist_id_fkey;
ALTER TABLE IF EXISTS ONLY public.psychologist_reports DROP CONSTRAINT IF EXISTS psychologist_reports_patient_id_fkey;
ALTER TABLE IF EXISTS ONLY public.psychologist_patients DROP CONSTRAINT IF EXISTS psychologist_patients_psychologist_id_fkey;
ALTER TABLE IF EXISTS ONLY public.psychologist_patients DROP CONSTRAINT IF EXISTS psychologist_patients_patient_id_fkey;
ALTER TABLE IF EXISTS ONLY public.playlist_favorites DROP CONSTRAINT IF EXISTS playlist_favorites_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.playlist_favorites DROP CONSTRAINT IF EXISTS playlist_favorites_playlist_id_fkey;
ALTER TABLE IF EXISTS ONLY public.password_reset_codes DROP CONSTRAINT IF EXISTS password_reset_codes_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
ALTER TABLE IF EXISTS ONLY public.messages DROP CONSTRAINT IF EXISTS messages_report_id_fkey;
ALTER TABLE IF EXISTS ONLY public.messages DROP CONSTRAINT IF EXISTS messages_receiver_id_fkey;
ALTER TABLE IF EXISTS ONLY public.favorite_tracks DROP CONSTRAINT IF EXISTS favorite_tracks_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.favorite_tracks DROP CONSTRAINT IF EXISTS favorite_tracks_track_id_fkey;
ALTER TABLE IF EXISTS ONLY public.favorite_playlists DROP CONSTRAINT IF EXISTS favorite_playlists_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.favorite_playlists DROP CONSTRAINT IF EXISTS favorite_playlists_playlist_id_fkey;
ALTER TABLE IF EXISTS ONLY public.favorite_comics DROP CONSTRAINT IF EXISTS favorite_comics_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.favorite_comics DROP CONSTRAINT IF EXISTS favorite_comics_comic_id_fkey;
ALTER TABLE IF EXISTS ONLY public.emotion_tracker DROP CONSTRAINT IF EXISTS emotion_tracker_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.emotion_tracker DROP CONSTRAINT IF EXISTS emotion_tracker_emotion_type_id_fkey;
ALTER TABLE IF EXISTS ONLY public.downloaded_tracks DROP CONSTRAINT IF EXISTS downloaded_tracks_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.downloaded_tracks DROP CONSTRAINT IF EXISTS downloaded_tracks_track_id_fkey;
ALTER TABLE IF EXISTS ONLY public.comic_pages DROP CONSTRAINT IF EXISTS comic_pages_comic_id_fkey;
DROP INDEX IF EXISTS public.idx_tracks_playlist;
DROP INDEX IF EXISTS public.idx_smer_diary_user_date;
DROP INDEX IF EXISTS public.idx_smer_diary_emotions;
DROP INDEX IF EXISTS public.idx_reports_user_date;
DROP INDEX IF EXISTS public.idx_reports_email;
DROP INDEX IF EXISTS public.idx_psychologist_patients_psych;
DROP INDEX IF EXISTS public.idx_psychologist_patients_patient;
DROP INDEX IF EXISTS public.idx_psych_reports_psych;
DROP INDEX IF EXISTS public.idx_psych_reports_patient;
DROP INDEX IF EXISTS public.idx_messages_sender;
DROP INDEX IF EXISTS public.idx_messages_receiver;
DROP INDEX IF EXISTS public.idx_favorite_tracks_user_track;
DROP INDEX IF EXISTS public.idx_favorite_tracks_user;
DROP INDEX IF EXISTS public.idx_favorite_playlists_user_playlist;
DROP INDEX IF EXISTS public.idx_favorite_playlists_user;
DROP INDEX IF EXISTS public.idx_favorite_comics_user_comic;
DROP INDEX IF EXISTS public.idx_favorite_comics_user;
DROP INDEX IF EXISTS public.idx_emotion_tracker_user_date;
DROP INDEX IF EXISTS public.idx_emotion_tracker_date;
DROP INDEX IF EXISTS public.idx_downloaded_tracks_user;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE IF EXISTS ONLY public.tracks DROP CONSTRAINT IF EXISTS tracks_pkey;
ALTER TABLE IF EXISTS ONLY public.smer_diary DROP CONSTRAINT IF EXISTS smer_diary_pkey;
ALTER TABLE IF EXISTS ONLY public.reports DROP CONSTRAINT IF EXISTS reports_pkey;
ALTER TABLE IF EXISTS ONLY public.psychologists DROP CONSTRAINT IF EXISTS psychologists_user_id_key;
ALTER TABLE IF EXISTS ONLY public.psychologists DROP CONSTRAINT IF EXISTS psychologists_pkey;
ALTER TABLE IF EXISTS ONLY public.psychologist_reports DROP CONSTRAINT IF EXISTS psychologist_reports_pkey;
ALTER TABLE IF EXISTS ONLY public.psychologist_patients DROP CONSTRAINT IF EXISTS psychologist_patients_psychologist_id_patient_id_key;
ALTER TABLE IF EXISTS ONLY public.psychologist_patients DROP CONSTRAINT IF EXISTS psychologist_patients_pkey;
ALTER TABLE IF EXISTS ONLY public.playlists DROP CONSTRAINT IF EXISTS playlists_pkey;
ALTER TABLE IF EXISTS ONLY public.playlist_favorites DROP CONSTRAINT IF EXISTS playlist_favorites_user_id_playlist_id_key;
ALTER TABLE IF EXISTS ONLY public.playlist_favorites DROP CONSTRAINT IF EXISTS playlist_favorites_pkey;
ALTER TABLE IF EXISTS ONLY public.password_reset_codes DROP CONSTRAINT IF EXISTS password_reset_codes_pkey;
ALTER TABLE IF EXISTS ONLY public.messages DROP CONSTRAINT IF EXISTS messages_pkey;
ALTER TABLE IF EXISTS ONLY public.favorite_tracks DROP CONSTRAINT IF EXISTS favorite_tracks_user_id_track_id_key;
ALTER TABLE IF EXISTS ONLY public.favorite_tracks DROP CONSTRAINT IF EXISTS favorite_tracks_pkey;
ALTER TABLE IF EXISTS ONLY public.favorite_playlists DROP CONSTRAINT IF EXISTS favorite_playlists_user_id_playlist_id_key;
ALTER TABLE IF EXISTS ONLY public.favorite_playlists DROP CONSTRAINT IF EXISTS favorite_playlists_pkey;
ALTER TABLE IF EXISTS ONLY public.favorite_comics DROP CONSTRAINT IF EXISTS favorite_comics_user_id_comic_id_key;
ALTER TABLE IF EXISTS ONLY public.favorite_comics DROP CONSTRAINT IF EXISTS favorite_comics_pkey;
ALTER TABLE IF EXISTS ONLY public.emotion_types DROP CONSTRAINT IF EXISTS emotion_types_pkey;
ALTER TABLE IF EXISTS ONLY public.emotion_types DROP CONSTRAINT IF EXISTS emotion_types_name_key;
ALTER TABLE IF EXISTS ONLY public.emotion_tracker DROP CONSTRAINT IF EXISTS emotion_tracker_user_id_emotion_type_id_created_date_key;
ALTER TABLE IF EXISTS ONLY public.emotion_tracker DROP CONSTRAINT IF EXISTS emotion_tracker_pkey;
ALTER TABLE IF EXISTS ONLY public.downloaded_tracks DROP CONSTRAINT IF EXISTS downloaded_tracks_user_id_track_id_key;
ALTER TABLE IF EXISTS ONLY public.downloaded_tracks DROP CONSTRAINT IF EXISTS downloaded_tracks_pkey;
ALTER TABLE IF EXISTS ONLY public.comics DROP CONSTRAINT IF EXISTS comics_pkey;
ALTER TABLE IF EXISTS ONLY public.comic_pages DROP CONSTRAINT IF EXISTS comic_pages_pkey;
ALTER TABLE IF EXISTS ONLY public.comic_pages DROP CONSTRAINT IF EXISTS comic_pages_comic_id_page_number_key;
ALTER TABLE IF EXISTS public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tracks ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.smer_diary ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.reports ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.psychologists ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.psychologist_reports ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.psychologist_patients ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.playlists ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.playlist_favorites ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.password_reset_codes ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.messages ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.favorite_tracks ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.favorite_playlists ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.favorite_comics ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.emotion_types ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.emotion_tracker ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.downloaded_tracks ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.comics ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.comic_pages ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.tracks_id_seq;
DROP TABLE IF EXISTS public.tracks;
DROP SEQUENCE IF EXISTS public.smer_diary_id_seq;
DROP TABLE IF EXISTS public.smer_diary;
DROP SEQUENCE IF EXISTS public.reports_id_seq;
DROP TABLE IF EXISTS public.reports;
DROP SEQUENCE IF EXISTS public.psychologists_id_seq;
DROP TABLE IF EXISTS public.psychologists;
DROP SEQUENCE IF EXISTS public.psychologist_reports_id_seq;
DROP TABLE IF EXISTS public.psychologist_reports;
DROP SEQUENCE IF EXISTS public.psychologist_patients_id_seq;
DROP TABLE IF EXISTS public.psychologist_patients;
DROP SEQUENCE IF EXISTS public.playlists_id_seq;
DROP TABLE IF EXISTS public.playlists;
DROP SEQUENCE IF EXISTS public.playlist_favorites_id_seq;
DROP TABLE IF EXISTS public.playlist_favorites;
DROP SEQUENCE IF EXISTS public.password_reset_codes_id_seq;
DROP TABLE IF EXISTS public.password_reset_codes;
DROP SEQUENCE IF EXISTS public.messages_id_seq;
DROP TABLE IF EXISTS public.messages;
DROP SEQUENCE IF EXISTS public.favorite_tracks_id_seq;
DROP TABLE IF EXISTS public.favorite_tracks;
DROP SEQUENCE IF EXISTS public.favorite_playlists_id_seq;
DROP TABLE IF EXISTS public.favorite_playlists;
DROP SEQUENCE IF EXISTS public.favorite_comics_id_seq;
DROP TABLE IF EXISTS public.favorite_comics;
DROP SEQUENCE IF EXISTS public.emotion_types_id_seq;
DROP TABLE IF EXISTS public.emotion_types;
DROP SEQUENCE IF EXISTS public.emotion_tracker_id_seq;
DROP TABLE IF EXISTS public.emotion_tracker;
DROP SEQUENCE IF EXISTS public.downloaded_tracks_id_seq;
DROP TABLE IF EXISTS public.downloaded_tracks;
DROP SEQUENCE IF EXISTS public.comics_id_seq;
DROP TABLE IF EXISTS public.comics;
DROP SEQUENCE IF EXISTS public.comic_pages_id_seq;
DROP TABLE IF EXISTS public.comic_pages;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: comic_pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comic_pages (
    id integer NOT NULL,
    comic_id integer NOT NULL,
    page_number integer NOT NULL,
    image_url text NOT NULL,
    text_content text
);


--
-- Name: comic_pages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comic_pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comic_pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comic_pages_id_seq OWNED BY public.comic_pages.id;


--
-- Name: comics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comics (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    cover_image_url text,
    author character varying(255),
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    pdf_url text
);


--
-- Name: comics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comics_id_seq OWNED BY public.comics.id;


--
-- Name: downloaded_tracks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.downloaded_tracks (
    id integer NOT NULL,
    user_id integer NOT NULL,
    track_id integer NOT NULL,
    downloaded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    local_path text NOT NULL
);


--
-- Name: downloaded_tracks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.downloaded_tracks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: downloaded_tracks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.downloaded_tracks_id_seq OWNED BY public.downloaded_tracks.id;


--
-- Name: emotion_tracker; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.emotion_tracker (
    id integer NOT NULL,
    user_id integer NOT NULL,
    emotion_type_id integer NOT NULL,
    intensity integer NOT NULL,
    created_date date DEFAULT CURRENT_DATE NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT emotion_tracker_intensity_check CHECK (((intensity >= 1) AND (intensity <= 10)))
);


--
-- Name: emotion_tracker_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.emotion_tracker_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: emotion_tracker_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.emotion_tracker_id_seq OWNED BY public.emotion_tracker.id;


--
-- Name: emotion_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.emotion_types (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    color character varying(7),
    emoji character varying(5)
);


--
-- Name: emotion_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.emotion_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: emotion_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.emotion_types_id_seq OWNED BY public.emotion_types.id;


--
-- Name: favorite_comics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.favorite_comics (
    id integer NOT NULL,
    user_id integer NOT NULL,
    comic_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: favorite_comics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.favorite_comics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: favorite_comics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.favorite_comics_id_seq OWNED BY public.favorite_comics.id;


--
-- Name: favorite_playlists; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.favorite_playlists (
    id integer NOT NULL,
    user_id integer NOT NULL,
    playlist_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: favorite_playlists_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.favorite_playlists_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: favorite_playlists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.favorite_playlists_id_seq OWNED BY public.favorite_playlists.id;


--
-- Name: favorite_tracks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.favorite_tracks (
    id integer NOT NULL,
    user_id integer NOT NULL,
    track_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: favorite_tracks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.favorite_tracks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: favorite_tracks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.favorite_tracks_id_seq OWNED BY public.favorite_tracks.id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    sender_id integer NOT NULL,
    receiver_id integer NOT NULL,
    content text,
    report_id integer,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: password_reset_codes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.password_reset_codes (
    id integer NOT NULL,
    user_id integer NOT NULL,
    code character varying(6) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: password_reset_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.password_reset_codes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: password_reset_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.password_reset_codes_id_seq OWNED BY public.password_reset_codes.id;


--
-- Name: playlist_favorites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.playlist_favorites (
    id integer NOT NULL,
    user_id integer,
    playlist_id integer,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: playlist_favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.playlist_favorites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: playlist_favorites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.playlist_favorites_id_seq OWNED BY public.playlist_favorites.id;


--
-- Name: playlists; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.playlists (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    cover_image_url text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: playlists_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.playlists_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: playlists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.playlists_id_seq OWNED BY public.playlists.id;


--
-- Name: psychologist_patients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.psychologist_patients (
    id integer NOT NULL,
    psychologist_id integer NOT NULL,
    patient_id integer NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT psychologist_patients_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'active'::character varying, 'rejected'::character varying])::text[])))
);


--
-- Name: psychologist_patients_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.psychologist_patients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: psychologist_patients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.psychologist_patients_id_seq OWNED BY public.psychologist_patients.id;


--
-- Name: psychologist_reports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.psychologist_reports (
    id integer NOT NULL,
    psychologist_id integer NOT NULL,
    patient_id integer NOT NULL,
    report_date date DEFAULT CURRENT_DATE NOT NULL,
    complaints text,
    anamnesis text,
    examinations text,
    recommendations text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: psychologist_reports_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.psychologist_reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: psychologist_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.psychologist_reports_id_seq OWNED BY public.psychologist_reports.id;


--
-- Name: psychologists; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.psychologists (
    id integer NOT NULL,
    user_id integer NOT NULL,
    specialization text,
    license_number character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_verified boolean DEFAULT false,
    status character varying(20) DEFAULT 'pending'::character varying,
    CONSTRAINT psychologists_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'active'::character varying, 'rejected'::character varying])::text[])))
);


--
-- Name: psychologists_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.psychologists_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: psychologists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.psychologists_id_seq OWNED BY public.psychologists.id;


--
-- Name: reports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reports (
    id integer NOT NULL,
    user_id integer NOT NULL,
    report_type character varying(50) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    report_content jsonb NOT NULL,
    psychologist_email character varying(255),
    sent_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: reports_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reports_id_seq OWNED BY public.reports.id;


--
-- Name: smer_diary; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.smer_diary (
    id integer NOT NULL,
    user_id integer NOT NULL,
    entry_date date DEFAULT CURRENT_DATE NOT NULL,
    situation_place text,
    situation_description text NOT NULL,
    thoughts text NOT NULL,
    reaction_description text NOT NULL,
    selected_emotions jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: smer_diary_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.smer_diary_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: smer_diary_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.smer_diary_id_seq OWNED BY public.smer_diary.id;


--
-- Name: tracks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tracks (
    id integer NOT NULL,
    playlist_id integer NOT NULL,
    title character varying(255) NOT NULL,
    artist character varying(255),
    duration_seconds integer,
    audio_url text NOT NULL,
    download_url text,
    source character varying(50) NOT NULL,
    external_id character varying(100) NOT NULL
);


--
-- Name: tracks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tracks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tracks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tracks_id_seq OWNED BY public.tracks.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    role character varying(20) DEFAULT 'user'::character varying,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['user'::character varying, 'psychologist'::character varying, 'admin'::character varying])::text[])))
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: comic_pages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comic_pages ALTER COLUMN id SET DEFAULT nextval('public.comic_pages_id_seq'::regclass);


--
-- Name: comics id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comics ALTER COLUMN id SET DEFAULT nextval('public.comics_id_seq'::regclass);


--
-- Name: downloaded_tracks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.downloaded_tracks ALTER COLUMN id SET DEFAULT nextval('public.downloaded_tracks_id_seq'::regclass);


--
-- Name: emotion_tracker id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.emotion_tracker ALTER COLUMN id SET DEFAULT nextval('public.emotion_tracker_id_seq'::regclass);


--
-- Name: emotion_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.emotion_types ALTER COLUMN id SET DEFAULT nextval('public.emotion_types_id_seq'::regclass);


--
-- Name: favorite_comics id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorite_comics ALTER COLUMN id SET DEFAULT nextval('public.favorite_comics_id_seq'::regclass);


--
-- Name: favorite_playlists id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorite_playlists ALTER COLUMN id SET DEFAULT nextval('public.favorite_playlists_id_seq'::regclass);


--
-- Name: favorite_tracks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorite_tracks ALTER COLUMN id SET DEFAULT nextval('public.favorite_tracks_id_seq'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: password_reset_codes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_codes ALTER COLUMN id SET DEFAULT nextval('public.password_reset_codes_id_seq'::regclass);


--
-- Name: playlist_favorites id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.playlist_favorites ALTER COLUMN id SET DEFAULT nextval('public.playlist_favorites_id_seq'::regclass);


--
-- Name: playlists id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.playlists ALTER COLUMN id SET DEFAULT nextval('public.playlists_id_seq'::regclass);


--
-- Name: psychologist_patients id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.psychologist_patients ALTER COLUMN id SET DEFAULT nextval('public.psychologist_patients_id_seq'::regclass);


--
-- Name: psychologist_reports id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.psychologist_reports ALTER COLUMN id SET DEFAULT nextval('public.psychologist_reports_id_seq'::regclass);


--
-- Name: psychologists id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.psychologists ALTER COLUMN id SET DEFAULT nextval('public.psychologists_id_seq'::regclass);


--
-- Name: reports id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports ALTER COLUMN id SET DEFAULT nextval('public.reports_id_seq'::regclass);


--
-- Name: smer_diary id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.smer_diary ALTER COLUMN id SET DEFAULT nextval('public.smer_diary_id_seq'::regclass);


--
-- Name: tracks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tracks ALTER COLUMN id SET DEFAULT nextval('public.tracks_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: comic_pages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.comic_pages (id, comic_id, page_number, image_url, text_content) FROM stdin;
\.


--
-- Data for Name: comics; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.comics (id, title, description, cover_image_url, author, is_active, created_at, pdf_url) FROM stdin;
7	Эмоции и состояния	Эмоции – это вкус к жизни, выходящий за пределы сенсорных систем	https://i.pinimg.com/736x/0b/0f/be/0b0fbeca5a26c9a05573df16c275d6b3.jpg	Максимова Дарья Романовна	t	2026-02-23 22:33:49.287793	Comics2
8	Мысли	Нас запомнят за поступки, а не за то, что было в наших головах, когда мы их совершали	https://i.pinimg.com/736x/06/05/c5/0605c52eb7a62f300fb2c7b5d930ec48.jpg	Максимова Дарья Романовна	t	2026-02-23 22:33:49.287793	Comics3
9	Тепло CFT (Терапии сфокусированной на сострадании)	Самый быстрый способ почувствовать себя лучше, сделать так, чтобы лучше себя почувствовал кто-то другой	https://i.pinimg.com/736x/3d/17/05/3d17058a62a317b4cc3e4810ed4c8830.jpg	Максимова Дарья Романовна	t	2026-02-23 22:33:49.287793	Comics4
30	Арт-терапия: исцеление творчеством	Как рисование и творчество помогают справиться со стрессом	https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80	Кейт Карр	f	2026-05-27 20:42:18.669789	Comics18
31	Дыши глубже	Дыхательные практики для здоровья и спокойствия	https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&q=80	Бел Педриан	f	2026-05-27 20:42:18.670063	Comics19
28	Жить в мире. Искусство общения и взаимодействия	В ней Тит Нат Хан рассказывает об осознанном потреблении и внимательном общении. На страницах книги приведены практики сострадательного общения, которые помогут эффективно строить здоровые отношения с людьми.	https://cdn.litres.ru/pub/c/cover_415/61519918.webp	Тит Нат Хан	t	2026-05-27 20:42:18.669188	Comics14
29	Аутентичность: Как быть собой	Она из тех книг, что не просто позволяет понять, что такое аутентичность, но и почувствовать это внутри себя	https://cdn.litres.ru/pub/c/cover_415/26110843.webp	Стивен Джозеф	t	2026-05-27 20:42:18.66951	Comics16
27	С широко открытыми глазами. 131 Способ увидеть мир по-другому и найти радость в повседневности	Научит ясно мыслить, лучше слушать, продуктивнее работать	https://cdn.litres.ru/pub/c/cover_415/63622701.webp	Роб Уокер	t	2026-05-27 20:42:18.668822	Comics13
26	Прокрастинация	Эта книга, написанная двумя современными нидерландскими психологами, отвечает на многие вопросы: отчего нам так хочется прокрастинировать и почему это свойственно всем людям; почему прокрастинация – это не лень	https://cdn.litres.ru/pub/c/cover_415/43680420.webp	Хенри Шувенбург, Таня ван Эссен	t	2026-05-27 20:42:18.666275	Comics12
10	Быть на своей стороне. Упражнениядля саморефлексии	Что значит быть на своей стороне?	https://i.pinimg.com/736x/02/d4/a2/02d4a2c0fd252fcdeeb89c85f1e4eb09.jpg	Максимова Дарья Романовна	t	2026-02-23 22:33:49.287793	Comics5
15	Жить не спеша	Автор очень убедительно расписывает плюсы более простой, неспешной жизни и делится практическими советами из собственного опыта	https://cdn.litres.ru/pub/c/cover_415/55700148.webp	Брук Макэлри	f	2026-05-11 00:42:11.635527	Comics15
39	Социальная психология	Исследования социальных явлений	https://i.pinimg.com/736x/be/3d/b5/be3db5023e831c874cc11477ba93ffcd.jpg	Д. Майерс	t	2026-05-27 20:42:18.674024	Comics28
38	Подросток в музее. Как кураторы и тьюторы помогают людям найти себя	Сборник рассуждений на тему взросления	https://i.pinimg.com/736x/9e/61/0b/9e610b30d68023613b9e36a7139f1b66.jpg	Логинова А.И., Труфанов Н.А.	t	2026-05-27 20:42:18.673718	Comics26
35	Гармония внутри	Исцели своё тело и разум с помощью позитивных аффирмаций	https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=400&q=80	Луиза Хей	f	2026-05-27 20:42:18.672775	Comics23
44	Хочу и буду	Атмосфера книги заряжена энергией и провокацией	https://i.pinimg.com/736x/bb/e1/40/bbe140119b89356d24c1c1d571041809.jpg	Михаил Лабковский	t	2026-05-27 20:42:18.675655	Comics33
43	Полюбить себя. Секреты и заботы о душе и теле	Посвещена теме самолюбия, заботы о себе и гармонии души и тела	https://i.pinimg.com/736x/43/99/21/43992158d315921eb3a3e6d2ca3112aa.jpg	Надя и Катя Нараин	t	2026-05-27 20:42:18.675388	Comics32
46	Путь к спокойствию	Книга о принятии себя и внутреннем мире	https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80	Тхить Нят Хань	f	2026-06-01 13:31:46.060438	Comics2
48	Эмоциональный интеллект	Почему он важнее, чем IQ	https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80	Дэниел Гоулман	f	2026-06-01 13:31:46.061679	Comics4
50	Исцеление через осознанность	Снижение стресса на основе практики осознанности	https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80	Джон Кабат-Зинн	f	2026-06-01 13:31:46.062854	Comics12
47	Сила настоящего момента	Руководство к духовному просветлению	https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80	Экхарт Толле	f	2026-06-01 13:31:46.061113	Comics3
17	Hygge. Секрет датского счастья	Жизненная философия, которая укладывается в несколько немудреных правил, позволяющих создать атмосферу покоя, тепла и дружелюбия, – хюгге	https://cdn.litres.ru/pub/c/cover_415/22219658.webp	Майк Викинг	f	2026-05-11 00:49:52.947551	Comics17
42	Люби себя, милая!	Как избавиться от навязанных стандартов и исцелить внутренние раны	https://i.pinimg.com/736x/f4/43/60/f443606ceedb567733ebfcf8559eed24.jpg	Тата Кальницкая	t	2026-05-27 20:42:18.674901	Comics31
40	Социальная психология	Учебник по основам социальной психологии	https://i.pinimg.com/736x/ba/42/15/ba4215bc898873b624c10c5ebe306a0d.jpg	А.Л. Свенцицкий	t	2026-05-27 20:42:18.674337	Comics29
32	Позитивное мышление	Сила позитивного мышления как инструмент изменения жизни	https://images.unsplash.com/photo-1468476396571-4d6f2a427ee7?w=400&q=80	Норман Пил	f	2026-05-27 20:42:18.670332	Comics20
34	Стресс-менеджмент	Эффективные стратегии управления стрессом в современной жизни	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80	Ариэль Шварц	f	2026-05-27 20:42:18.672476	Comics22
41	Сила привычек	Почему мы делаем то, что делаем, и как это изменить	https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400&q=80	Чарльз Дахигг	f	2026-05-27 20:42:18.674634	Comics30
36	Исцеляющие практики	Как тело освобождается от травмы и восстанавливает здоровье	https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80	Питер Левин	f	2026-05-27 20:42:18.673061	Comics24
37	Путь к себе	Самопознание как основа психологического здоровья	https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&q=80	Карл Юнг	f	2026-05-27 20:42:18.673353	Comics25
55	Эмоциональная свобода	Освобождение от негативных эмоций и обретение внутренней свободы	https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&q=80	Джудит Орлофф	f	2026-06-01 13:31:46.074373	Comics28
54	Осознанное питание	Как еда, разум и осознанность связаны между собой	https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400&q=80	Тич Нат Хан	f	2026-06-01 13:31:46.073539	Comics26
56	Психология отношений	Научный подход к построению здоровых и счастливых отношений	https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80	Джон Готтман	f	2026-06-01 13:31:46.075362	Comics29
49	Антистресс	Как победить стресс, тревогу и депрессию	https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80	Ромен Жийа	f	2026-06-01 13:31:46.062291	Comics5
57	Ментальное здоровье	Честная книга о борьбе с депрессией и тревогой	https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&q=80	Мэтт Хэйг	f	2026-06-01 13:31:46.077247	Comics31
51	Тревога: путь к свободе	Практическое руководство по преодолению тревожности	https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400&q=80	Клэр Уикс	f	2026-06-01 13:31:46.063513	Comics13
52	Самосострадание	Перестаньте себя критиковать и начните жить	https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&q=80	Кристин Нефф	f	2026-06-01 13:31:46.06422	Comics14
53	Психология счастья	Как достичь подлинного счастья и процветания	https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=400&q=80	Мартин Селигман	f	2026-06-01 13:31:46.064844	Comics16
33	Медитация для начинающих	Пошаговое руководство по медитации для новичков	https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80	Джек Корнфилд	f	2026-05-27 20:42:18.672149	Comics21
59	Внутренний компас	В поисках смысла жизни как основы психического здоровья	https://images.unsplash.com/photo-1465188162913-8fb5709d6d57?w=400&q=80	Виктор Франкл	f	2026-06-01 13:31:46.08044	Comics33
67	Типа ваще	Рассказы о странных снах в формате комикса	https://cdn.litres.ru/pub/c/cover_415/70923580	Seless	f	2026-06-01 15:06:12.49462	books/1780315571598_Seless._Tipa_vasche_20_1_.pdf
45	Осознанность каждый день	Практики медитации и осознанного присутствия	https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80	Тич Нат Хан	f	2026-06-01 13:31:46.05239	Comics1
58	Энергия жизни	Как уязвимость делает нас сильнее и счастливее	https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=400&q=80	Брене Браун	f	2026-06-01 13:31:46.078165	Comics32
\.


--
-- Data for Name: downloaded_tracks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.downloaded_tracks (id, user_id, track_id, downloaded_at, local_path) FROM stdin;
1	1	1	2024-03-01 20:15:00	/storage/emulated/0/Music/relax/track1.mp3
2	1	3	2024-03-02 09:30:00	/storage/emulated/0/Music/nature/birds.mp3
3	2	2	2024-03-01 22:00:00	/storage/emulated/0/Download/meditation.mp3
4	3	4	2024-03-03 15:45:00	/storage/emulated/0/Music/ocean.mp3
5	4	5	2024-03-04 21:20:00	/storage/emulated/0/Music/sleep/lullaby.mp3
\.


--
-- Data for Name: emotion_tracker; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.emotion_tracker (id, user_id, emotion_type_id, intensity, created_date, created_at) FROM stdin;
1	1	2	7	2024-03-01	2024-03-01 09:30:00
2	1	1	4	2024-03-01	2024-03-01 21:00:00
3	1	3	8	2024-03-02	2024-03-02 19:15:00
4	1	2	6	2024-03-03	2024-03-03 14:20:00
5	1	9	5	2024-03-03	2024-03-03 18:45:00
6	2	2	9	2024-03-01	2024-03-01 08:00:00
7	2	1	3	2024-03-01	2024-03-01 17:30:00
8	2	6	7	2024-03-02	2024-03-02 07:00:00
9	2	3	6	2024-03-03	2024-03-03 16:00:00
10	2	10	4	2024-03-04	2024-03-04 12:00:00
26	15	1	7	2026-02-17	2026-02-23 20:24:22.845967
27	15	2	5	2026-02-18	2026-02-23 20:24:22.845967
28	15	3	8	2026-02-19	2026-02-23 20:24:22.845967
29	15	1	6	2026-02-20	2026-02-23 20:24:22.845967
30	15	4	4	2026-02-21	2026-02-23 20:24:22.845967
31	15	2	9	2026-02-22	2026-02-23 20:24:22.845967
12	15	2	10	2026-02-23	2026-02-23 20:13:07.205141
15	15	3	10	2026-02-23	2026-02-23 20:13:31.056147
11	15	1	5	2026-02-23	2026-02-23 20:13:07.159657
35	15	10	6	2026-02-23	2026-02-23 21:54:16.446249
36	19	1	10	2026-02-23	2026-02-23 23:42:00.216891
37	19	2	5	2026-02-23	2026-02-23 23:42:00.286884
38	19	3	2	2026-02-23	2026-02-23 23:42:00.312085
39	21	1	10	2026-02-26	2026-02-26 21:06:19.625316
40	21	3	1	2026-02-26	2026-02-26 21:06:19.711781
41	22	1	10	2026-02-26	2026-02-26 21:21:16.551082
42	22	2	8	2026-02-26	2026-02-26 21:21:16.576922
43	22	4	1	2026-02-26	2026-02-26 21:21:16.598792
45	23	1	5	2026-05-10	2026-05-10 23:30:59.26656
46	23	7	5	2026-05-10	2026-05-10 23:30:59.289107
47	23	1	5	2026-05-11	2026-05-11 12:20:22.268511
48	23	2	5	2026-05-11	2026-05-11 12:20:22.291869
49	23	6	5	2026-05-11	2026-05-11 12:20:22.305772
53	24	7	5	2026-05-11	2026-05-11 12:32:26.076189
55	24	8	5	2026-05-11	2026-05-11 12:32:40.001984
58	24	9	5	2026-05-11	2026-05-11 12:34:53.061252
59	27	8	10	2026-05-11	2026-05-11 16:49:41.828835
63	27	1	5	2026-05-25	2026-05-25 17:10:07.119454
64	33	2	5	2026-05-26	2026-05-26 15:51:51.384346
137	27	1	1	2026-05-27	2026-05-27 15:43:46.954488
138	27	2	1	2026-05-27	2026-05-27 15:43:46.993825
139	27	3	1	2026-05-27	2026-05-27 15:43:47.005039
140	27	4	5	2026-05-27	2026-05-27 15:43:47.014088
85	27	7	10	2026-05-26	2026-05-26 23:00:32.628445
72	27	1	10	2026-05-26	2026-05-26 22:58:12.144358
67	27	2	10	2026-05-26	2026-05-26 22:34:23.941978
76	27	3	10	2026-05-26	2026-05-26 23:00:16.164176
69	27	4	10	2026-05-26	2026-05-26 22:34:36.229878
87	27	5	10	2026-05-26	2026-05-26 23:00:32.657025
86	27	6	10	2026-05-26	2026-05-26 23:00:32.645884
84	27	8	10	2026-05-26	2026-05-26 23:00:32.612762
83	27	9	10	2026-05-26	2026-05-26 23:00:32.595441
77	27	10	10	2026-05-26	2026-05-26 23:00:16.177206
152	47	1	7	2026-06-01	2026-06-01 20:29:38.653462
157	27	2	10	2026-06-02	2026-06-02 17:34:01.56447
\.


--
-- Data for Name: emotion_types; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.emotion_types (id, name, color, emoji) FROM stdin;
1	Спокойствие	#5D9B9B	😌
2	Тревога	#744ebb	😰
3	Радость	#FFF5BA	😊
4	Грусть	#8faeda	😔
5	Злость	#de185a	😠
6	Страх	#5f3ebf	😨
7	Удивление	#fba27f	😲
8	Отвращение	#939597	🤢
9	Надежда	#f4cccc	🤞
10	Благодарность	#8fceb3	🙏
\.


--
-- Data for Name: favorite_comics; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.favorite_comics (id, user_id, comic_id, created_at) FROM stdin;
\.


--
-- Data for Name: favorite_playlists; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.favorite_playlists (id, user_id, playlist_id, created_at) FROM stdin;
1	1	1	2024-03-01 08:30:00
2	1	3	2024-03-02 22:00:00
3	2	2	2024-03-01 17:45:00
4	3	1	2024-03-03 07:15:00
5	4	4	2024-03-04 12:30:00
\.


--
-- Data for Name: favorite_tracks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.favorite_tracks (id, user_id, track_id, created_at) FROM stdin;
1	1	1	2024-03-01 09:00:00
2	1	3	2024-03-02 10:30:00
3	2	2	2024-03-01 18:20:00
4	3	4	2024-03-03 14:15:00
5	4	5	2024-03-04 20:45:00
7	23	3	2026-05-11 11:46:50.653728
9	23	1	2026-05-11 12:03:27.85629
10	23	5	2026-05-11 12:03:35.089687
17	27	7	2026-05-26 22:00:43.136261
18	27	8	2026-05-26 22:03:57.175973
19	27	9	2026-05-26 22:27:56.522774
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.messages (id, sender_id, receiver_id, content, report_id, is_read, created_at) FROM stdin;
1	26	27	hello	\N	t	2026-05-11 17:42:59.309558
2	27	26	hello	\N	t	2026-05-11 21:32:24.371293
3	27	26	BORDER_RADIUS.md	\N	t	2026-05-11 22:05:10.649851
4	27	26	📊 Отправлен отчёт	36	t	2026-05-11 23:15:00.536311
5	26	27	sad	\N	t	2026-05-11 23:26:28.767652
6	27	26	📊 Отправлен отчёт	42	t	2026-05-12 11:43:14.262544
7	26	27	Результат мониторинга от 12.05.2026	\N	t	2026-05-12 12:08:19.572387
8	26	27	{"type":"psychologist_report","id":1,"report_date":"2026-05-11T21:00:00.000Z","complaints":"Panic attac","anamnesis":"Big stress","examinations":"KPT","recommendations":"SMER diary","psych_name":"Milena Vantsan"}	\N	t	2026-05-12 12:08:19.575812
9	26	27	Результат мониторинга от 12.05.2026	\N	t	2026-05-12 22:43:25.76903
10	26	27	{"type":"psychologist_report","id":2,"report_date":"2026-05-11T21:00:00.000Z","complaints":"dfh","anamnesis":"dfgdfg","examinations":"fdgdg","recommendations":"dfgdg","psych_name":"Milena Vantsan"}	\N	t	2026-05-12 22:43:25.77372
11	27	26	📊 Отправлен отчёт	46	t	2026-05-25 22:15:07.385663
12	27	26	📊 Отправлен отчёт	46	t	2026-05-25 22:15:07.413781
13	26	27	Результат мониторинга от 12.05.2026	\N	t	2026-05-25 22:31:40.624077
14	26	27	{"type":"psychologist_report","id":2,"report_date":"2026-05-11T21:00:00.000Z","complaints":"dfh","anamnesis":"dfgdfg","examinations":"fdgdg","recommendations":"dfgdg","psych_name":"Milena Vantsan"}	\N	t	2026-05-25 22:31:40.631329
15	27	26	📊 Отправлен отчёт	47	t	2026-05-26 15:49:52.637873
16	27	26	📊 Отправлен отчёт	52	t	2026-05-26 23:03:27.441671
17	27	26	Страшно сдавать диплом 😨😨😨😨	\N	t	2026-05-26 23:04:02.328059
18	27	26	📊 Отправлен отчёт	53	t	2026-05-27 10:34:28.678829
19	26	27	Плохо	\N	t	2026-06-01 16:27:47.556684
20	27	26	Хорошо	\N	f	2026-06-01 17:06:52.435833
21	27	26	Отправлен отчёт	62	f	2026-06-02 17:37:25.535698
22	27	26	Отправлен отчёт	61	f	2026-06-02 17:37:37.86179
\.


--
-- Data for Name: password_reset_codes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.password_reset_codes (id, user_id, code, expires_at, created_at) FROM stdin;
10	33	628638	2026-05-26 21:04:35.69	2026-05-26 20:49:35.700214
17	15	536257	2026-05-27 17:08:59.108	2026-05-27 16:53:59.116318
18	47	986246	2026-06-01 20:55:33.991	2026-06-01 20:40:33.997356
19	45	891445	2026-06-01 23:57:20.873	2026-06-01 23:42:20.877469
\.


--
-- Data for Name: playlist_favorites; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.playlist_favorites (id, user_id, playlist_id, created_at) FROM stdin;
\.


--
-- Data for Name: playlists; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.playlists (id, title, description, cover_image_url, is_active, created_at) FROM stdin;
5	Фокус и концентрация	Музыка для работы и учебы	https://example.com/covers/focus.jpg	f	2024-01-22 16:45:00
1	Утренняя медитация	Начните день с гармонии и внутреннего спокойствия	https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80	t	2024-01-05 10:00:00
2	Звуки природы	Музыка, вдохновлённая живой природой	https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80	t	2024-01-08 14:20:00
3	Для глубокого сна	Мелодии для крепкого и восстанавливающего сна	https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80	t	2024-01-12 11:30:00
4	Снятие тревоги	Мягкая музыка для снятия стресса и тревоги	https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400&q=80	t	2024-01-18 09:15:00
6	Фортепиано и душа	Нежные фортепианные мелодии для вашей души	https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&q=80	t	2026-05-26 22:17:39.812646
7	Йога и растяжка	Фоновая музыка для практики йоги и растяжки	https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&q=80	t	2026-05-26 22:17:39.816237
8	Концентрация и фокус	Помогает сосредоточиться на работе и учёбе	https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80	t	2026-05-26 22:17:39.817603
9	Дождь и гроза	Атмосферная музыка под шум дождя и грозы	https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=400&q=80	t	2026-05-26 22:17:39.818866
10	Классика для отдыха	Классические произведения для полного расслабления	https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&q=80	t	2026-05-26 22:17:39.819928
11	Бинауральные ритмы	Специальные частоты для медитации и расслабления	https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80	t	2026-05-26 22:17:39.821038
\.


--
-- Data for Name: psychologist_patients; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.psychologist_patients (id, psychologist_id, patient_id, status, created_at, updated_at) FROM stdin;
1	3	24	pending	2026-05-11 16:27:57.66096	2026-05-11 16:27:57.66096
2	4	27	active	2026-05-11 17:01:34.431774	2026-05-11 17:02:11.094702
3	4	31	pending	2026-05-12 23:03:46.038962	2026-05-12 23:03:46.038962
\.


--
-- Data for Name: psychologist_reports; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.psychologist_reports (id, psychologist_id, patient_id, report_date, complaints, anamnesis, examinations, recommendations, created_at, updated_at) FROM stdin;
1	26	27	2026-05-12	Panic attac	Big stress	KPT	SMER diary	2026-05-12 11:59:56.0123	2026-05-12 11:59:56.0123
2	26	27	2026-05-12	dfh	dfgdfg	fdgdg	dfgdg	2026-05-12 12:07:05.632355	2026-05-12 12:07:05.632355
\.


--
-- Data for Name: psychologists; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.psychologists (id, user_id, specialization, license_number, created_at, is_verified, status) FROM stdin;
1	1	Когнитивно-поведенческая терапия, тревожные расстройства	ПСИ-12345-2020	2024-01-16 10:00:00	t	active
2	2	Гештальт-терапия, управление стрессом	ПСИ-67890-2021	2024-01-21 15:00:00	t	active
3	25	Когнитивно-поведенческая терапия	LIC-12345	2026-05-11 13:17:58.446358	t	active
4	26	KPT	LIC-67829	2026-05-11 16:39:07.587892	t	active
5	32	KPT	LIC-894739	2026-05-12 23:27:34.894963	f	rejected
6	34	Когнитивно-поведенческая терапия	LIC-KPT6769	2026-05-26 22:46:54.511588	f	rejected
7	35	КПТ	LIC-KPT15537	2026-05-27 10:36:47.469537	t	active
10	39	Художественная терапия	LIC-HT6767	2026-05-27 15:48:45.802241	f	pending
9	38	Регрессионная терапия	LIC-REG5267	2026-05-27 12:26:10.671556	t	active
\.


--
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reports (id, user_id, report_type, start_date, end_date, report_content, psychologist_email, sent_at, created_at) FROM stdin;
1	1	weekly	2024-02-26	2024-03-03	{"diary_entries": 2, "emotions_summary": {"joy": 2, "calm": 3, "anxiety": 5}, "most_frequent_emotion": "Тревога"}	dr.smith@psychology.com	2024-03-04 10:00:00	2024-03-04 09:30:00
2	2	custom	2024-02-20	2024-03-01	{"panic_attacks": 3, "sleep_disturbances": 5, "coping_techniques_used": ["дыхание", "прогулка"]}	therapist.john@clinic.org	\N	2024-03-02 14:15:00
3	1	monthly	2024-02-01	2024-02-29	{"trend": "уменьшение тревоги", "tools_used": ["комиксы", "музыка"], "progress_score": 7}	\N	\N	2024-03-01 11:20:00
4	3	weekly	2024-02-26	2024-03-03	{"exam_stress": "high", "study_hours": 25, "self_care_hours": 5}	student.support@university.edu	2024-03-04 16:45:00	2024-03-04 16:00:00
5	4	custom	2024-03-01	2024-03-05	{"sleep_quality": "improving", "meditation_sessions": 7, "work_related_stress": 8}	\N	\N	2024-03-05 09:00:00
6	15	all	2026-02-16	2026-02-23	{"diary": {"data": [], "summary": {"total": 0}}, "emotions": {"data": [], "summary": {"total": 0, "averageIntensity": 0}}}	\N	\N	2026-02-23 16:23:28.623769
7	15	all	2026-02-16	2026-02-23	{"diary": {"data": [], "summary": {"total": 0}}, "emotions": {"data": [], "summary": {"total": 0, "averageIntensity": 0}}}	\N	2026-02-23 16:24:04.013295	2026-02-23 16:23:47.103907
8	15	all	2026-02-23	2026-02-23	{"diary": {"data": [{"id": 7, "user_id": 15, "thoughts": "Обосралась", "created_at": "2026-02-23T13:58:04.878Z", "entry_date": "2026-02-22T21:00:00.000Z", "updated_at": "2026-02-23T13:58:04.878Z", "situation_place": "Дома", "selected_emotions": [{"emotionId": 3, "intensity": 5, "emotionName": "Тревога"}], "reaction_description": "Делаю диплом", "situation_description": "Диплом страшно"}], "summary": {"total": 1}}, "emotions": {"data": [], "summary": {"total": 0, "averageIntensity": 0}}}	\N	\N	2026-02-23 16:58:53.685916
9	15	all	2026-02-16	2026-02-23	{"diary": {"data": [], "summary": {"total": 0}}, "emotions": {"data": [{"id": 15, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:31.056Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 12, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:07.205Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 11, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 5, "created_at": "2026-02-23T17:13:07.159Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 31, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 9, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-21T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 30, "note": null, "color": "#2196F3", "emoji": "😔", "user_id": 15, "intensity": 4, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-20T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}, {"id": 29, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 6, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-19T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 28, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 8, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-18T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 27, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 5, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-17T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 26, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 7, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-16T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}], "summary": {"total": 9, "averageIntensity": 7.111111111111111}}}	\N	\N	2026-02-23 20:35:01.783143
10	15	all	2026-02-16	2026-02-23	{"diary": {"data": [], "summary": {"total": 0}}, "emotions": {"data": [{"id": 15, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:31.056Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 12, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:07.205Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 11, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 5, "created_at": "2026-02-23T17:13:07.159Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 31, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 9, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-21T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 30, "note": null, "color": "#2196F3", "emoji": "😔", "user_id": 15, "intensity": 4, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-20T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}, {"id": 29, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 6, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-19T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 28, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 8, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-18T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 27, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 5, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-17T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 26, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 7, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-16T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}], "summary": {"total": 9, "averageIntensity": 7.111111111111111}}}	\N	\N	2026-02-23 20:36:47.408293
11	15	all	2026-02-16	2026-02-23	{"diary": {"data": [], "summary": {"total": 0}}, "emotions": {"data": [{"id": 15, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:31.056Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 12, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:07.205Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 11, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 5, "created_at": "2026-02-23T17:13:07.159Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 31, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 9, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-21T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 30, "note": null, "color": "#2196F3", "emoji": "😔", "user_id": 15, "intensity": 4, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-20T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}, {"id": 29, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 6, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-19T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 28, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 8, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-18T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 27, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 5, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-17T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 26, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 7, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-16T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}], "summary": {"total": 9, "averageIntensity": 7.111111111111111}}}	\N	2026-02-23 20:41:52.64821	2026-02-23 20:41:44.204187
12	15	all	2026-02-16	2026-02-23	{"user": {"name": "Milena Vantsan"}, "diary": [], "endDate": "2026-02-23", "summary": {"totalDiary": 0, "badEmotions": 3, "goodEmotions": 6, "totalEmotions": 9, "averageIntensity": 7.111111111111111}, "emotions": [{"id": 15, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:31.056Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 12, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:07.205Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 11, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 5, "created_at": "2026-02-23T17:13:07.159Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 31, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 9, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-21T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 30, "note": null, "color": "#2196F3", "emoji": "😔", "user_id": 15, "intensity": 4, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-20T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}, {"id": 29, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 6, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-19T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 28, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 8, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-18T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 27, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 5, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-17T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 26, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 7, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-16T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}], "startDate": "2026-02-16"}	\N	\N	2026-02-23 20:59:45.611123
13	15	all	2026-02-16	2026-02-23	{"user": {"name": "Milena Vantsan"}, "diary": [], "endDate": "2026-02-23", "summary": {"totalDiary": 0, "badEmotions": 3, "goodEmotions": 6, "totalEmotions": 9, "averageIntensity": 7.111111111111111}, "emotions": [{"id": 15, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:31.056Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 12, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:07.205Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 11, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 5, "created_at": "2026-02-23T17:13:07.159Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 31, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 9, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-21T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 30, "note": null, "color": "#2196F3", "emoji": "😔", "user_id": 15, "intensity": 4, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-20T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}, {"id": 29, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 6, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-19T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 28, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 8, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-18T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 27, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 5, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-17T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 26, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 7, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-16T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}], "startDate": "2026-02-16"}	\N	2026-02-23 21:01:44.586995	2026-02-23 21:00:06.606027
14	15	all	2026-02-16	2026-02-23	{"user": {"name": "Milena Vantsan"}, "diary": [], "endDate": "2026-02-23", "summary": {"totalDiary": 0, "badEmotions": 3, "goodEmotions": 6, "totalEmotions": 9, "averageIntensity": 7.111111111111111}, "emotions": [{"id": 15, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:31.056Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 12, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:07.205Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 11, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 5, "created_at": "2026-02-23T17:13:07.159Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 31, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 9, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-21T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 30, "note": null, "color": "#2196F3", "emoji": "😔", "user_id": 15, "intensity": 4, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-20T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}, {"id": 29, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 6, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-19T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 28, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 8, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-18T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 27, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 5, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-17T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 26, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 7, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-16T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}], "startDate": "2026-02-16"}	\N	2026-02-23 21:02:03.189372	2026-02-23 21:01:56.259215
15	15	all	2026-02-16	2026-02-23	{"user": {"name": "Milena Vantsan"}, "diary": [], "endDate": "2026-02-23", "summary": {"totalDiary": 0, "badEmotions": 3, "goodEmotions": 6, "totalEmotions": 9, "averageIntensity": 7.111111111111111}, "emotions": [{"id": 15, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:31.056Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 12, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:07.205Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 11, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 5, "created_at": "2026-02-23T17:13:07.159Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 31, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 9, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-21T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 30, "note": null, "color": "#2196F3", "emoji": "😔", "user_id": 15, "intensity": 4, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-20T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}, {"id": 29, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 6, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-19T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 28, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 8, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-18T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 27, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 5, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-17T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 26, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 7, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-16T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}], "startDate": "2026-02-16"}	\N	\N	2026-02-23 21:02:18.276444
16	15	all	2026-02-16	2026-02-23	{"user": {"name": "Milena Vantsan"}, "diary": [], "endDate": "2026-02-23", "summary": {"totalDiary": 0, "badEmotions": 3, "goodEmotions": 6, "totalEmotions": 9, "averageIntensity": 7.111111111111111}, "emotions": [{"id": 15, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:31.056Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 12, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:07.205Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 11, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 5, "created_at": "2026-02-23T17:13:07.159Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 31, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 9, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-21T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 30, "note": null, "color": "#2196F3", "emoji": "😔", "user_id": 15, "intensity": 4, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-20T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}, {"id": 29, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 6, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-19T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 28, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 8, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-18T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 27, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 5, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-17T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 26, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 7, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-16T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}], "startDate": "2026-02-16"}	\N	\N	2026-02-23 21:02:44.19012
17	15	all	2026-02-16	2026-02-23	{"user": {"name": "Milena Vantsan"}, "diary": [{"id": 10, "user_id": 15, "thoughts": "Пдадшра", "created_at": "2026-02-23T14:39:46.219Z", "entry_date": "2026-02-22T21:00:00.000Z", "updated_at": "2026-02-23T18:04:01.925Z", "situation_place": "Ололо", "selected_emotions": [{"emotionId": 1, "intensity": 4, "emotionName": "Спокойствие"}, {"emotionId": 3, "intensity": 5, "emotionName": "Радость"}, {"emotionId": 4, "intensity": 4, "emotionName": "Грусть"}], "reaction_description": "Пжвжжсс", "situation_description": "Плалал"}], "endDate": "2026-02-23", "summary": {"totalDiary": 1, "badEmotions": 3, "goodEmotions": 6, "totalEmotions": 9, "averageIntensity": 7.111111111111111}, "emotions": [{"id": 15, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:31.056Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 12, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:07.205Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 11, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 5, "created_at": "2026-02-23T17:13:07.159Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 31, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 9, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-21T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 30, "note": null, "color": "#2196F3", "emoji": "😔", "user_id": 15, "intensity": 4, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-20T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}, {"id": 29, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 6, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-19T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 28, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 8, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-18T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 27, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 5, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-17T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 26, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 7, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-16T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}], "startDate": "2026-02-16"}	\N	\N	2026-02-23 21:04:05.393048
18	15	all	2026-02-16	2026-02-23	{"user": {"name": "Milena Vantsan"}, "diary": [{"id": 10, "user_id": 15, "thoughts": "Пдадшра", "created_at": "2026-02-23T14:39:46.219Z", "entry_date": "2026-02-22T21:00:00.000Z", "updated_at": "2026-02-23T18:04:01.925Z", "situation_place": "Ололо", "selected_emotions": [{"emotionId": 1, "intensity": 4, "emotionName": "Спокойствие"}, {"emotionId": 3, "intensity": 5, "emotionName": "Радость"}, {"emotionId": 4, "intensity": 4, "emotionName": "Грусть"}], "reaction_description": "Пжвжжсс", "situation_description": "Плалал"}], "endDate": "2026-02-23", "summary": {"totalDiary": 1, "badEmotions": 3, "goodEmotions": 6, "totalEmotions": 9, "averageIntensity": 7.111111111111111}, "emotions": [{"id": 15, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:31.056Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 12, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:07.205Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 11, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 5, "created_at": "2026-02-23T17:13:07.159Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 31, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 9, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-21T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 30, "note": null, "color": "#2196F3", "emoji": "😔", "user_id": 15, "intensity": 4, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-20T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}, {"id": 29, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 6, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-19T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 28, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 8, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-18T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 27, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 5, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-17T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 26, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 7, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-16T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}], "startDate": "2026-02-16"}	\N	\N	2026-02-23 21:04:31.857343
19	15	all	2026-02-16	2026-02-23	{"user": {"name": "Milena Vantsan"}, "diary": [{"id": 10, "user_id": 15, "thoughts": "Пдадшра", "created_at": "2026-02-23T14:39:46.219Z", "entry_date": "2026-02-22T21:00:00.000Z", "updated_at": "2026-02-23T18:04:01.925Z", "situation_place": "Ололо", "selected_emotions": [{"emotionId": 1, "intensity": 4, "emotionName": "Спокойствие"}, {"emotionId": 3, "intensity": 5, "emotionName": "Радость"}, {"emotionId": 4, "intensity": 4, "emotionName": "Грусть"}], "reaction_description": "Пжвжжсс", "situation_description": "Плалал"}], "endDate": "2026-02-23", "summary": {"totalDiary": 1, "badEmotions": 4, "goodEmotions": 5, "totalEmotions": 9, "averageIntensity": 7.111111111111111}, "emotions": [{"id": 15, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:31.056Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 12, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:07.205Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 11, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 5, "created_at": "2026-02-23T17:13:07.159Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 31, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 9, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-21T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 30, "note": null, "color": "#2196F3", "emoji": "😔", "user_id": 15, "intensity": 4, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-20T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}, {"id": 29, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 6, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-19T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 28, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 8, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-18T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 27, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 5, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-17T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 26, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 7, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-16T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}], "startDate": "2026-02-16"}	\N	\N	2026-02-23 21:42:51.589305
20	15	all	2026-02-16	2026-02-23	{"user": {"name": "Milena Vantsan"}, "diary": [{"id": 10, "user_id": 15, "thoughts": "Пдадшра", "created_at": "2026-02-23T14:39:46.219Z", "entry_date": "2026-02-22T21:00:00.000Z", "updated_at": "2026-02-23T18:04:01.925Z", "situation_place": "Ололо", "selected_emotions": [{"emotionId": 1, "intensity": 4, "emotionName": "Спокойствие"}, {"emotionId": 3, "intensity": 5, "emotionName": "Радость"}, {"emotionId": 4, "intensity": 4, "emotionName": "Грусть"}], "reaction_description": "Пжвжжсс", "situation_description": "Плалал"}], "endDate": "2026-02-23", "summary": {"totalDiary": 1, "badEmotions": 4, "goodEmotions": 5, "totalEmotions": 9, "averageIntensity": 7.111111111111111}, "emotions": [{"id": 15, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:31.056Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 12, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:07.205Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 11, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 5, "created_at": "2026-02-23T17:13:07.159Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 31, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 9, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-21T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 30, "note": null, "color": "#2196F3", "emoji": "😔", "user_id": 15, "intensity": 4, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-20T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}, {"id": 29, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 6, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-19T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 28, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 8, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-18T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 27, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 5, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-17T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 26, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 7, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-16T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}], "startDate": "2026-02-16"}	\N	\N	2026-02-23 21:51:42.938862
35	27	all	2026-05-01	2026-05-11	{"user": {"name": "Leisan Hoho"}, "diary": [], "endDate": "2026-05-11", "summary": {"totalDiary": 0, "badEmotions": 0, "goodEmotions": 1, "totalEmotions": 1, "averageIntensity": 10}, "emotions": [{"id": 59, "color": "#939597", "emoji": "🤢", "user_id": 27, "intensity": 10, "created_at": "2026-05-11T13:49:41.828Z", "created_date": "2026-05-10T21:00:00.000Z", "emotion_name": "Отвращение", "emotion_type_id": 8}], "startDate": "2026-05-01"}	\N	\N	2026-05-11 23:09:51.534356
21	15	all	2026-02-16	2026-02-23	{"user": {"name": "Milena Vantsan"}, "diary": [{"id": 10, "user_id": 15, "thoughts": "Пдадшра", "created_at": "2026-02-23T14:39:46.219Z", "entry_date": "2026-02-22T21:00:00.000Z", "updated_at": "2026-02-23T18:04:01.925Z", "situation_place": "Ололо", "selected_emotions": [{"emotionId": 1, "intensity": 4, "emotionName": "Спокойствие"}, {"emotionId": 3, "intensity": 5, "emotionName": "Радость"}, {"emotionId": 4, "intensity": 4, "emotionName": "Грусть"}], "reaction_description": "Пжвжжсс", "situation_description": "Плалал"}], "endDate": "2026-02-23", "summary": {"totalDiary": 1, "badEmotions": 4, "goodEmotions": 5, "totalEmotions": 9, "averageIntensity": 7.111111111111111}, "emotions": [{"id": 15, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:31.056Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 12, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:07.205Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 11, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 5, "created_at": "2026-02-23T17:13:07.159Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 31, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 9, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-21T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 30, "note": null, "color": "#2196F3", "emoji": "😔", "user_id": 15, "intensity": 4, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-20T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}, {"id": 29, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 6, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-19T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 28, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 8, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-18T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 27, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 5, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-17T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 26, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 7, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-16T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}], "startDate": "2026-02-16"}	\N	\N	2026-02-23 21:51:55.412204
22	15	all	2026-01-31	2026-02-23	{"user": {"name": "Milena Vantsan"}, "diary": [{"id": 10, "user_id": 15, "thoughts": "Пдадшра", "created_at": "2026-02-23T14:39:46.219Z", "entry_date": "2026-02-22T21:00:00.000Z", "updated_at": "2026-02-23T18:04:01.925Z", "situation_place": "Ололо", "selected_emotions": [{"emotionId": 1, "intensity": 4, "emotionName": "Спокойствие"}, {"emotionId": 3, "intensity": 5, "emotionName": "Радость"}, {"emotionId": 4, "intensity": 4, "emotionName": "Грусть"}], "reaction_description": "Пжвжжсс", "situation_description": "Плалал"}], "endDate": "2026-02-23", "summary": {"totalDiary": 1, "badEmotions": 4, "goodEmotions": 5, "totalEmotions": 9, "averageIntensity": 7.111111111111111}, "emotions": [{"id": 15, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:31.056Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 12, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:07.205Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 11, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 5, "created_at": "2026-02-23T17:13:07.159Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 31, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 9, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-21T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 30, "note": null, "color": "#2196F3", "emoji": "😔", "user_id": 15, "intensity": 4, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-20T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}, {"id": 29, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 6, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-19T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 28, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 8, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-18T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 27, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 5, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-17T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 26, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 7, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-16T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}], "startDate": "2026-01-31"}	\N	\N	2026-02-23 21:53:02.904064
23	19	all	2026-02-16	2026-02-23	{"user": {"name": "Мирон Ванцан"}, "diary": [{"id": 11, "user_id": 19, "thoughts": "Лол", "created_at": "2026-02-23T20:42:22.202Z", "entry_date": "2026-02-22T21:00:00.000Z", "updated_at": "2026-02-23T20:42:31.006Z", "situation_place": "Лол", "selected_emotions": [{"emotionId": 1, "intensity": 4, "emotionName": "Спокойствие"}, {"emotionId": 2, "intensity": 5, "emotionName": "Тревога"}], "reaction_description": "Лол", "situation_description": "Лол"}], "endDate": "2026-02-23", "summary": {"totalDiary": 1, "badEmotions": 1, "goodEmotions": 2, "totalEmotions": 3, "averageIntensity": 5.666666666666667}, "emotions": [{"id": 36, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 19, "intensity": 10, "created_at": "2026-02-23T20:42:00.216Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 37, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 19, "intensity": 5, "created_at": "2026-02-23T20:42:00.286Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 38, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 19, "intensity": 2, "created_at": "2026-02-23T20:42:00.312Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}], "startDate": "2026-02-16"}	\N	\N	2026-02-23 23:42:37.239014
24	21	all	2026-02-19	2026-02-26	{"user": {"name": "Miron Vantsan"}, "diary": [{"id": 14, "user_id": 21, "thoughts": "Fhdjjdkd", "created_at": "2026-02-26T18:07:42.525Z", "entry_date": "2026-02-19T21:00:00.000Z", "updated_at": "2026-02-26T18:07:42.525Z", "situation_place": "Hsghdhd", "selected_emotions": [{"emotionId": 2, "intensity": 3, "emotionName": "Тревога"}], "reaction_description": "Fhdjjff", "situation_description": "Fhsjdjf"}], "endDate": "2026-02-26", "summary": {"totalDiary": 1, "badEmotions": 0, "goodEmotions": 2, "totalEmotions": 2, "averageIntensity": 5.5}, "emotions": [{"id": 39, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 21, "intensity": 10, "created_at": "2026-02-26T18:06:19.625Z", "created_date": "2026-02-25T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 40, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 21, "intensity": 1, "created_at": "2026-02-26T18:06:19.711Z", "created_date": "2026-02-25T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}], "startDate": "2026-02-19"}	\N	\N	2026-02-26 21:07:51.139703
25	22	all	2026-02-26	2026-02-26	{"user": {"name": "Adelina Fursova"}, "diary": [], "endDate": "2026-02-26", "summary": {"totalDiary": 0, "badEmotions": 2, "goodEmotions": 1, "totalEmotions": 3, "averageIntensity": 6.333333333333333}, "emotions": [{"id": 41, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 22, "intensity": 10, "created_at": "2026-02-26T18:21:16.551Z", "created_date": "2026-02-25T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 42, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 22, "intensity": 8, "created_at": "2026-02-26T18:21:16.576Z", "created_date": "2026-02-25T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 43, "note": null, "color": "#2196F3", "emoji": "😔", "user_id": 22, "intensity": 1, "created_at": "2026-02-26T18:21:16.598Z", "created_date": "2026-02-25T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}], "startDate": "2026-02-26"}	\N	\N	2026-02-26 21:23:44.727945
26	22	all	2026-02-19	2026-02-26	{"user": {"name": "Adelina Fursova"}, "diary": [], "endDate": "2026-02-26", "summary": {"totalDiary": 0, "badEmotions": 2, "goodEmotions": 1, "totalEmotions": 3, "averageIntensity": 6.333333333333333}, "emotions": [{"id": 41, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 22, "intensity": 10, "created_at": "2026-02-26T18:21:16.551Z", "created_date": "2026-02-25T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 42, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 22, "intensity": 8, "created_at": "2026-02-26T18:21:16.576Z", "created_date": "2026-02-25T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 43, "note": null, "color": "#2196F3", "emoji": "😔", "user_id": 22, "intensity": 1, "created_at": "2026-02-26T18:21:16.598Z", "created_date": "2026-02-25T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}], "startDate": "2026-02-19"}	\N	\N	2026-02-26 21:23:48.507155
27	22	all	2026-01-31	2026-02-26	{"user": {"name": "Adelina Fursova"}, "diary": [{"id": 16, "user_id": 22, "thoughts": "Jfosofd", "created_at": "2026-02-26T18:22:14.722Z", "entry_date": "2026-02-11T21:00:00.000Z", "updated_at": "2026-02-26T18:22:46.897Z", "situation_place": "Fhjskd", "selected_emotions": [{"emotionId": 2, "intensity": 3, "emotionName": "Тревога"}], "reaction_description": "Fjieiff", "situation_description": "Gjoeoe"}], "endDate": "2026-02-26", "summary": {"totalDiary": 1, "badEmotions": 2, "goodEmotions": 1, "totalEmotions": 3, "averageIntensity": 6.333333333333333}, "emotions": [{"id": 41, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 22, "intensity": 10, "created_at": "2026-02-26T18:21:16.551Z", "created_date": "2026-02-25T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 42, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 22, "intensity": 8, "created_at": "2026-02-26T18:21:16.576Z", "created_date": "2026-02-25T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 43, "note": null, "color": "#2196F3", "emoji": "😔", "user_id": 22, "intensity": 1, "created_at": "2026-02-26T18:21:16.598Z", "created_date": "2026-02-25T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}], "startDate": "2026-01-31"}	\N	\N	2026-02-26 21:25:00.884903
28	15	all	2026-02-19	2026-02-26	{"user": {"name": "Milena Vantsan"}, "diary": [{"id": 10, "user_id": 15, "thoughts": "Пдадшра", "created_at": "2026-02-23T14:39:46.219Z", "entry_date": "2026-02-22T21:00:00.000Z", "updated_at": "2026-02-23T18:54:06.284Z", "situation_place": "Ололо", "selected_emotions": [{"emotionId": 1, "intensity": 4, "emotionName": "Спокойствие"}, {"emotionId": 3, "intensity": 5, "emotionName": "Радость"}], "reaction_description": "Пжвжжсс", "situation_description": "Плалал"}], "endDate": "2026-02-26", "summary": {"totalDiary": 1, "badEmotions": 3, "goodEmotions": 5, "totalEmotions": 8, "averageIntensity": 7.25}, "emotions": [{"id": 15, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:31.056Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 12, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:07.205Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 35, "note": null, "color": "#8BC34A", "emoji": "🙏", "user_id": 15, "intensity": 6, "created_at": "2026-02-23T18:54:16.446Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Благодарность", "emotion_type_id": 10}, {"id": 11, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 5, "created_at": "2026-02-23T17:13:07.159Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 31, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 9, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-21T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 30, "note": null, "color": "#2196F3", "emoji": "😔", "user_id": 15, "intensity": 4, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-20T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}, {"id": 29, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 6, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-19T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 28, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 8, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-18T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}], "startDate": "2026-02-19"}	\N	\N	2026-02-27 00:00:26.970228
29	15	all	2026-01-31	2026-02-26	{"user": {"name": "Milena Vantsan"}, "diary": [{"id": 10, "user_id": 15, "thoughts": "Пдадшра", "created_at": "2026-02-23T14:39:46.219Z", "entry_date": "2026-02-22T21:00:00.000Z", "updated_at": "2026-02-23T18:54:06.284Z", "situation_place": "Ололо", "selected_emotions": [{"emotionId": 1, "intensity": 4, "emotionName": "Спокойствие"}, {"emotionId": 3, "intensity": 5, "emotionName": "Радость"}], "reaction_description": "Пжвжжсс", "situation_description": "Плалал"}], "endDate": "2026-02-26", "summary": {"totalDiary": 1, "badEmotions": 4, "goodEmotions": 6, "totalEmotions": 10, "averageIntensity": 7}, "emotions": [{"id": 15, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:31.056Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 12, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 10, "created_at": "2026-02-23T17:13:07.205Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 35, "note": null, "color": "#8BC34A", "emoji": "🙏", "user_id": 15, "intensity": 6, "created_at": "2026-02-23T18:54:16.446Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Благодарность", "emotion_type_id": 10}, {"id": 11, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 5, "created_at": "2026-02-23T17:13:07.159Z", "created_date": "2026-02-22T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 31, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 9, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-21T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 30, "note": null, "color": "#2196F3", "emoji": "😔", "user_id": 15, "intensity": 4, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-20T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}, {"id": 29, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 6, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-19T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 28, "note": null, "color": "#FFEB3B", "emoji": "😊", "user_id": 15, "intensity": 8, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-18T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 27, "note": null, "color": "#FF9800", "emoji": "😰", "user_id": 15, "intensity": 5, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-17T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 26, "note": null, "color": "#4CAF50", "emoji": "😌", "user_id": 15, "intensity": 7, "created_at": "2026-02-23T17:24:22.845Z", "created_date": "2026-02-16T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}], "startDate": "2026-01-31"}	\N	\N	2026-02-27 00:00:32.030438
30	24	all	2026-05-11	2026-05-11	{"user": {"name": "Helen Goji"}, "diary": [], "endDate": "2026-05-11", "summary": {"totalDiary": 0, "badEmotions": 1, "goodEmotions": 2, "totalEmotions": 3, "averageIntensity": 5}, "emotions": [{"id": 58, "color": "#00BCD4", "emoji": "🤞", "user_id": 24, "intensity": 5, "created_at": "2026-05-11T09:34:53.061Z", "created_date": "2026-05-10T21:00:00.000Z", "emotion_name": "Надежда", "emotion_type_id": 9}, {"id": 55, "color": "#795548", "emoji": "🤢", "user_id": 24, "intensity": 5, "created_at": "2026-05-11T09:32:40.001Z", "created_date": "2026-05-10T21:00:00.000Z", "emotion_name": "Отвращение", "emotion_type_id": 8}, {"id": 53, "color": "#FF5722", "emoji": "😲", "user_id": 24, "intensity": 5, "created_at": "2026-05-11T09:32:26.076Z", "created_date": "2026-05-10T21:00:00.000Z", "emotion_name": "Удивление", "emotion_type_id": 7}], "startDate": "2026-05-11"}	\N	\N	2026-05-11 12:47:13.853585
31	24	all	2026-05-11	2026-05-11	{"user": {"name": "Helen Goji"}, "diary": [], "endDate": "2026-05-11", "summary": {"totalDiary": 0, "badEmotions": 1, "goodEmotions": 2, "totalEmotions": 3, "averageIntensity": 5}, "emotions": [{"id": 58, "color": "#00BCD4", "emoji": "🤞", "user_id": 24, "intensity": 5, "created_at": "2026-05-11T09:34:53.061Z", "created_date": "2026-05-10T21:00:00.000Z", "emotion_name": "Надежда", "emotion_type_id": 9}, {"id": 55, "color": "#795548", "emoji": "🤢", "user_id": 24, "intensity": 5, "created_at": "2026-05-11T09:32:40.001Z", "created_date": "2026-05-10T21:00:00.000Z", "emotion_name": "Отвращение", "emotion_type_id": 8}, {"id": 53, "color": "#FF5722", "emoji": "😲", "user_id": 24, "intensity": 5, "created_at": "2026-05-11T09:32:26.076Z", "created_date": "2026-05-10T21:00:00.000Z", "emotion_name": "Удивление", "emotion_type_id": 7}], "startDate": "2026-05-11"}	\N	\N	2026-05-11 12:47:34.563544
32	27	all	2026-05-01	2026-05-11	{"user": {"name": "Leisan Hoho"}, "diary": [], "endDate": "2026-05-11", "summary": {"totalDiary": 0, "badEmotions": 0, "goodEmotions": 1, "totalEmotions": 1, "averageIntensity": 10}, "emotions": [{"id": 59, "color": "#939597", "emoji": "🤢", "user_id": 27, "intensity": 10, "created_at": "2026-05-11T13:49:41.828Z", "created_date": "2026-05-10T21:00:00.000Z", "emotion_name": "Отвращение", "emotion_type_id": 8}], "startDate": "2026-05-01"}	\N	\N	2026-05-11 22:05:36.68433
33	27	all	2026-05-01	2026-05-11	{"user": {"name": "Leisan Hoho"}, "diary": [], "endDate": "2026-05-11", "summary": {"totalDiary": 0, "badEmotions": 0, "goodEmotions": 1, "totalEmotions": 1, "averageIntensity": 10}, "emotions": [{"id": 59, "color": "#939597", "emoji": "🤢", "user_id": 27, "intensity": 10, "created_at": "2026-05-11T13:49:41.828Z", "created_date": "2026-05-10T21:00:00.000Z", "emotion_name": "Отвращение", "emotion_type_id": 8}], "startDate": "2026-05-01"}	\N	\N	2026-05-11 23:07:22.31242
34	27	all	2026-05-01	2026-05-11	{"user": {"name": "Leisan Hoho"}, "diary": [], "endDate": "2026-05-11", "summary": {"totalDiary": 0, "badEmotions": 0, "goodEmotions": 1, "totalEmotions": 1, "averageIntensity": 10}, "emotions": [{"id": 59, "color": "#939597", "emoji": "🤢", "user_id": 27, "intensity": 10, "created_at": "2026-05-11T13:49:41.828Z", "created_date": "2026-05-10T21:00:00.000Z", "emotion_name": "Отвращение", "emotion_type_id": 8}], "startDate": "2026-05-01"}	\N	\N	2026-05-11 23:09:42.579619
36	27	all	2026-05-11	2026-05-11	{"user": {"name": "Leisan Hoho"}, "diary": [{"id": 23, "user_id": 27, "thoughts": "sdfsdf", "created_at": "2026-05-11T20:11:15.612Z", "entry_date": "2026-05-10T21:00:00.000Z", "updated_at": "2026-05-11T20:11:15.612Z", "situation_place": "fsf", "selected_emotions": [{"name": "Спокойствие", "emotionId": 1, "intensity": 3, "emotionName": "Спокойствие"}], "reaction_description": "sdfsd", "situation_description": "fsdfsdf"}], "endDate": "2026-05-11", "summary": {"totalDiary": 1, "badEmotions": 0, "goodEmotions": 1, "totalEmotions": 1, "averageIntensity": 10}, "emotions": [{"id": 59, "color": "#939597", "emoji": "🤢", "user_id": 27, "intensity": 10, "created_at": "2026-05-11T13:49:41.828Z", "created_date": "2026-05-10T21:00:00.000Z", "emotion_name": "Отвращение", "emotion_type_id": 8}], "startDate": "2026-05-11"}	\N	2026-05-11 23:15:00.542614	2026-05-11 23:11:22.064422
37	27	all	2026-05-01	2026-05-12	{"user": {"name": "Leisan Hoho"}, "diary": [{"id": 24, "user_id": 27, "thoughts": "gfdg;sjlg", "created_at": "2026-05-12T08:30:30.725Z", "entry_date": "2026-05-10T21:00:00.000Z", "updated_at": "2026-05-12T08:34:18.330Z", "situation_place": "gf", "selected_emotions": [{"name": "Спокойствие", "emotionId": 1, "intensity": 3, "emotionName": "Спокойствие"}, {"name": "Тревога", "emotionId": 2, "intensity": 3, "emotionName": "Тревога"}], "reaction_description": "sgsdg", "situation_description": "ggg"}], "endDate": "2026-05-12", "summary": {"totalDiary": 1, "badEmotions": 0, "goodEmotions": 1, "totalEmotions": 1, "averageIntensity": 10}, "emotions": [{"id": 59, "color": "#939597", "emoji": "🤢", "user_id": 27, "intensity": 10, "created_at": "2026-05-11T13:49:41.828Z", "created_date": "2026-05-10T21:00:00.000Z", "emotion_name": "Отвращение", "emotion_type_id": 8}], "startDate": "2026-05-01"}	\N	\N	2026-05-12 11:34:37.409992
38	27	all	2026-05-01	2026-05-12	{"user": {"name": "Leisan Hoho"}, "diary": [{"id": 24, "user_id": 27, "thoughts": "gfdg;sjlg", "created_at": "2026-05-12T08:30:30.725Z", "entry_date": "2026-05-10T21:00:00.000Z", "updated_at": "2026-05-12T08:34:18.330Z", "situation_place": "gf", "selected_emotions": [{"name": "Спокойствие", "emotionId": 1, "intensity": 3, "emotionName": "Спокойствие"}, {"name": "Тревога", "emotionId": 2, "intensity": 3, "emotionName": "Тревога"}], "reaction_description": "sgsdg", "situation_description": "ggg"}], "endDate": "2026-05-12", "summary": {"totalDiary": 1, "badEmotions": 0, "goodEmotions": 1, "totalEmotions": 1, "averageIntensity": 10}, "emotions": [{"id": 59, "color": "#939597", "emoji": "🤢", "user_id": 27, "intensity": 10, "created_at": "2026-05-11T13:49:41.828Z", "created_date": "2026-05-10T21:00:00.000Z", "emotion_name": "Отвращение", "emotion_type_id": 8}], "startDate": "2026-05-01"}	\N	\N	2026-05-12 11:34:44.203991
39	27	all	2026-05-01	2026-05-12	{"user": {"name": "Leisan Hoho"}, "diary": [{"id": 24, "user_id": 27, "thoughts": "gfdg;sjlg", "created_at": "2026-05-12T08:30:30.725Z", "entry_date": "2026-05-10T21:00:00.000Z", "updated_at": "2026-05-12T08:34:18.330Z", "situation_place": "gf", "selected_emotions": [{"name": "Спокойствие", "emotionId": 1, "intensity": 3, "emotionName": "Спокойствие"}, {"name": "Тревога", "emotionId": 2, "intensity": 3, "emotionName": "Тревога"}], "reaction_description": "sgsdg", "situation_description": "ggg"}], "endDate": "2026-05-12", "summary": {"totalDiary": 1, "badEmotions": 0, "goodEmotions": 1, "totalEmotions": 1, "averageIntensity": 10}, "emotions": [{"id": 59, "color": "#939597", "emoji": "🤢", "user_id": 27, "intensity": 10, "created_at": "2026-05-11T13:49:41.828Z", "created_date": "2026-05-10T21:00:00.000Z", "emotion_name": "Отвращение", "emotion_type_id": 8}], "startDate": "2026-05-01"}	\N	\N	2026-05-12 11:35:18.622281
40	27	all	2026-05-01	2026-05-12	{"user": {"name": "Leisan Hoho"}, "diary": [{"id": 24, "user_id": 27, "thoughts": "gfdg;sjlg", "created_at": "2026-05-12T08:30:30.725Z", "entry_date": "2026-05-10T21:00:00.000Z", "updated_at": "2026-05-12T08:34:18.330Z", "situation_place": "gf", "selected_emotions": [{"name": "Спокойствие", "emotionId": 1, "intensity": 3, "emotionName": "Спокойствие"}, {"name": "Тревога", "emotionId": 2, "intensity": 3, "emotionName": "Тревога"}], "reaction_description": "sgsdg", "situation_description": "ggg"}], "endDate": "2026-05-12", "summary": {"totalDiary": 1, "badEmotions": 0, "goodEmotions": 1, "totalEmotions": 1, "averageIntensity": 10}, "emotions": [{"id": 59, "color": "#939597", "emoji": "🤢", "user_id": 27, "intensity": 10, "created_at": "2026-05-11T13:49:41.828Z", "created_date": "2026-05-10T21:00:00.000Z", "emotion_name": "Отвращение", "emotion_type_id": 8}], "startDate": "2026-05-01"}	\N	\N	2026-05-12 11:39:56.435236
41	27	all	2026-05-01	2026-05-12	{"user": {"name": "Leisan Hoho"}, "diary": [{"id": 24, "user_id": 27, "behavior": "sgsdg", "thoughts": "gfdg;sjlg", "situation": "ggg", "created_at": "2026-05-12T08:30:30.725Z", "entry_date": "2026-05-10T21:00:00.000Z", "updated_at": "2026-05-12T08:34:18.330Z", "emotion_name": "Спокойствие", "situation_place": "gf", "selected_emotions": [{"name": "Спокойствие", "emotionId": 1, "intensity": 3, "emotionName": "Спокойствие"}, {"name": "Тревога", "emotionId": 2, "intensity": 3, "emotionName": "Тревога"}], "reaction_description": "sgsdg", "situation_description": "ggg"}], "endDate": "2026-05-12", "summary": {"totalDiary": 1, "badEmotions": 0, "goodEmotions": 1, "totalEmotions": 1, "averageIntensity": 10}, "emotions": [{"id": 59, "color": "#939597", "emoji": "🤢", "user_id": 27, "intensity": 10, "created_at": "2026-05-11T13:49:41.828Z", "created_date": "2026-05-10T21:00:00.000Z", "emotion_name": "Отвращение", "emotion_type_id": 8}], "startDate": "2026-05-01"}	\N	\N	2026-05-12 11:42:15.131288
42	27	all	2026-05-01	2026-05-12	{"user": {"name": "Leisan Hoho"}, "diary": [{"id": 24, "user_id": 27, "behavior": "sgsdg", "thoughts": "gfdg;sjlg", "situation": "ggg", "created_at": "2026-05-12T08:30:30.725Z", "entry_date": "2026-05-10T21:00:00.000Z", "updated_at": "2026-05-12T08:34:18.330Z", "emotion_name": "Спокойствие", "situation_place": "gf", "selected_emotions": [{"name": "Спокойствие", "emotionId": 1, "intensity": 3, "emotionName": "Спокойствие"}, {"name": "Тревога", "emotionId": 2, "intensity": 3, "emotionName": "Тревога"}], "reaction_description": "sgsdg", "situation_description": "ggg"}], "endDate": "2026-05-12", "summary": {"totalDiary": 1, "badEmotions": 1, "goodEmotions": 3, "totalEmotions": 4, "averageIntensity": 6.25}, "emotions": [{"id": 62, "color": "#fba27f", "emoji": "😲", "user_id": 27, "intensity": 5, "created_at": "2026-05-12T08:42:40.761Z", "created_date": "2026-05-11T21:00:00.000Z", "emotion_name": "Удивление", "emotion_type_id": 7}, {"id": 61, "color": "#f4cccc", "emoji": "🤞", "user_id": 27, "intensity": 5, "created_at": "2026-05-12T08:42:40.745Z", "created_date": "2026-05-11T21:00:00.000Z", "emotion_name": "Надежда", "emotion_type_id": 9}, {"id": 60, "color": "#5D9B9B", "emoji": "😌", "user_id": 27, "intensity": 5, "created_at": "2026-05-12T08:42:40.722Z", "created_date": "2026-05-11T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 59, "color": "#939597", "emoji": "🤢", "user_id": 27, "intensity": 10, "created_at": "2026-05-11T13:49:41.828Z", "created_date": "2026-05-10T21:00:00.000Z", "emotion_name": "Отвращение", "emotion_type_id": 8}], "startDate": "2026-05-01"}	\N	2026-05-12 11:43:14.268702	2026-05-12 11:42:45.953651
43	27	all	2026-05-01	2026-05-12	{"user": {"name": "Leisan Hoho"}, "diary": [{"id": 24, "user_id": 27, "behavior": "sgsdg", "thoughts": "gfdg;sjlg", "situation": "ggg", "created_at": "2026-05-12T08:30:30.725Z", "entry_date": "2026-05-10T21:00:00.000Z", "updated_at": "2026-05-12T08:34:18.330Z", "emotion_name": "Спокойствие, Тревога", "situation_place": "gf", "selected_emotions": [{"name": "Спокойствие", "emotionId": 1, "intensity": 3, "emotionName": "Спокойствие"}, {"name": "Тревога", "emotionId": 2, "intensity": 3, "emotionName": "Тревога"}], "reaction_description": "sgsdg", "situation_description": "ggg"}], "endDate": "2026-05-12", "summary": {"totalDiary": 1, "badEmotions": 1, "goodEmotions": 3, "totalEmotions": 4, "averageIntensity": 6.25}, "emotions": [{"id": 62, "color": "#fba27f", "emoji": "😲", "user_id": 27, "intensity": 5, "created_at": "2026-05-12T08:42:40.761Z", "created_date": "2026-05-11T21:00:00.000Z", "emotion_name": "Удивление", "emotion_type_id": 7}, {"id": 61, "color": "#f4cccc", "emoji": "🤞", "user_id": 27, "intensity": 5, "created_at": "2026-05-12T08:42:40.745Z", "created_date": "2026-05-11T21:00:00.000Z", "emotion_name": "Надежда", "emotion_type_id": 9}, {"id": 60, "color": "#5D9B9B", "emoji": "😌", "user_id": 27, "intensity": 5, "created_at": "2026-05-12T08:42:40.722Z", "created_date": "2026-05-11T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 59, "color": "#939597", "emoji": "🤢", "user_id": 27, "intensity": 10, "created_at": "2026-05-11T13:49:41.828Z", "created_date": "2026-05-10T21:00:00.000Z", "emotion_name": "Отвращение", "emotion_type_id": 8}], "startDate": "2026-05-01"}	\N	\N	2026-05-12 11:45:19.6593
44	27	all	2026-05-01	2026-05-12	{"user": {"name": "Leisan Hoho"}, "diary": [{"id": 24, "user_id": 27, "behavior": "sgsdg", "thoughts": "gfdg;sjlg", "situation": "ggg", "created_at": "2026-05-12T08:30:30.725Z", "entry_date": "2026-05-10T21:00:00.000Z", "updated_at": "2026-05-12T08:34:18.330Z", "emotion_name": "Спокойствие, Тревога", "situation_place": "gf", "selected_emotions": [{"name": "Спокойствие", "emotionId": 1, "intensity": 3, "emotionName": "Спокойствие"}, {"name": "Тревога", "emotionId": 2, "intensity": 3, "emotionName": "Тревога"}], "reaction_description": "sgsdg", "situation_description": "ggg"}], "endDate": "2026-05-12", "summary": {"totalDiary": 1, "badEmotions": 1, "goodEmotions": 3, "totalEmotions": 4, "averageIntensity": 6.25}, "emotions": [{"id": 62, "color": "#fba27f", "emoji": "😲", "user_id": 27, "intensity": 5, "created_at": "2026-05-12T08:42:40.761Z", "created_date": "2026-05-11T21:00:00.000Z", "emotion_name": "Удивление", "emotion_type_id": 7}, {"id": 61, "color": "#f4cccc", "emoji": "🤞", "user_id": 27, "intensity": 5, "created_at": "2026-05-12T08:42:40.745Z", "created_date": "2026-05-11T21:00:00.000Z", "emotion_name": "Надежда", "emotion_type_id": 9}, {"id": 60, "color": "#5D9B9B", "emoji": "😌", "user_id": 27, "intensity": 5, "created_at": "2026-05-12T08:42:40.722Z", "created_date": "2026-05-11T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 59, "color": "#939597", "emoji": "🤢", "user_id": 27, "intensity": 10, "created_at": "2026-05-11T13:49:41.828Z", "created_date": "2026-05-10T21:00:00.000Z", "emotion_name": "Отвращение", "emotion_type_id": 8}], "startDate": "2026-05-01"}	\N	\N	2026-05-12 11:48:05.626131
45	27	all	2026-05-01	2026-05-12	{"user": {"name": "Leisan Hoho"}, "diary": [{"id": 24, "user_id": 27, "behavior": "sgsdg", "thoughts": "gfdg;sjlg", "situation": "ggg", "created_at": "2026-05-12T08:30:30.725Z", "entry_date": "2026-05-10T21:00:00.000Z", "updated_at": "2026-05-12T08:34:18.330Z", "emotion_name": "Спокойствие, Тревога", "situation_place": "gf", "selected_emotions": [{"name": "Спокойствие", "emotionId": 1, "intensity": 3, "emotionName": "Спокойствие"}, {"name": "Тревога", "emotionId": 2, "intensity": 3, "emotionName": "Тревога"}], "reaction_description": "sgsdg", "situation_description": "ggg"}], "endDate": "2026-05-12", "summary": {"totalDiary": 1, "badEmotions": 0, "goodEmotions": 1, "totalEmotions": 1, "averageIntensity": 10}, "emotions": [{"id": 59, "color": "#939597", "emoji": "🤢", "user_id": 27, "intensity": 10, "created_at": "2026-05-11T13:49:41.828Z", "created_date": "2026-05-10T21:00:00.000Z", "emotion_name": "Отвращение", "emotion_type_id": 8}], "startDate": "2026-05-01"}	\N	\N	2026-05-12 19:56:03.269014
46	27	all	2026-05-01	2026-05-12	{"user": {"name": "Leisan Hoho"}, "diary": [{"id": 24, "user_id": 27, "behavior": "sgsdg", "thoughts": "gfdg;sjlg", "situation": "ggg", "created_at": "2026-05-12T08:30:30.725Z", "entry_date": "2026-05-10T21:00:00.000Z", "updated_at": "2026-05-12T08:34:18.330Z", "emotion_name": "Спокойствие, Тревога", "situation_place": "gf", "selected_emotions": [{"name": "Спокойствие", "emotionId": 1, "intensity": 3, "emotionName": "Спокойствие"}, {"name": "Тревога", "emotionId": 2, "intensity": 3, "emotionName": "Тревога"}], "reaction_description": "sgsdg", "situation_description": "ggg"}], "endDate": "2026-05-12", "summary": {"totalDiary": 1, "badEmotions": 0, "goodEmotions": 1, "totalEmotions": 1, "averageIntensity": 10}, "emotions": [{"id": 59, "color": "#939597", "emoji": "🤢", "user_id": 27, "intensity": 10, "created_at": "2026-05-11T13:49:41.828Z", "created_date": "2026-05-10T21:00:00.000Z", "emotion_name": "Отвращение", "emotion_type_id": 8}], "startDate": "2026-05-01"}	\N	2026-05-25 22:15:07.414642	2026-05-12 19:56:11.437436
47	27	all	2026-04-30	2026-05-26	{"user": {"name": "Leisan Hoho"}, "diary": [{"id": 24, "user_id": 27, "behavior": "sgsdg", "thoughts": "gfdg;sjlg", "situation": "ggg", "created_at": "2026-05-12T08:30:30.725Z", "entry_date": "2026-05-10T21:00:00.000Z", "updated_at": "2026-05-12T08:34:18.330Z", "emotion_name": "Спокойствие, Тревога", "situation_place": "gf", "selected_emotions": [{"name": "Спокойствие", "emotionId": 1, "intensity": 3, "emotionName": "Спокойствие"}, {"name": "Тревога", "emotionId": 2, "intensity": 3, "emotionName": "Тревога"}], "reaction_description": "sgsdg", "situation_description": "ggg"}], "endDate": "2026-05-26", "summary": {"totalDiary": 1, "badEmotions": 0, "goodEmotions": 2, "totalEmotions": 2, "averageIntensity": 7.5}, "emotions": [{"id": 63, "color": "#5D9B9B", "emoji": "😌", "user_id": 27, "intensity": 5, "created_at": "2026-05-25T14:10:07.119Z", "created_date": "2026-05-24T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 59, "color": "#939597", "emoji": "🤢", "user_id": 27, "intensity": 10, "created_at": "2026-05-11T13:49:41.828Z", "created_date": "2026-05-10T21:00:00.000Z", "emotion_name": "Отвращение", "emotion_type_id": 8}], "startDate": "2026-04-30"}	\N	2026-05-26 15:49:52.667954	2026-05-26 15:49:36.973171
48	27	all	2026-05-26	2026-05-26	{"user": {"name": "Leisan Hoho"}, "diary": [], "endDate": "2026-05-26", "summary": {"totalDiary": 0, "badEmotions": 1, "goodEmotions": 1, "totalEmotions": 2, "averageIntensity": 5.5}, "emotions": [{"id": 67, "color": "#744ebb", "emoji": "😰", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T19:34:23.941Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 69, "color": "#8faeda", "emoji": "😔", "user_id": 27, "intensity": 1, "created_at": "2026-05-26T19:34:36.229Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}], "startDate": "2026-05-26"}	\N	\N	2026-05-26 22:36:13.617618
49	27	all	2026-05-19	2026-05-26	{"user": {"name": "Leisa Hoho"}, "diary": [], "endDate": "2026-05-26", "summary": {"totalDiary": 0, "badEmotions": 5, "goodEmotions": 6, "totalEmotions": 11, "averageIntensity": 9.545454545454545}, "emotions": [{"id": 87, "color": "#de185a", "emoji": "😠", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.657Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Злость", "emotion_type_id": 5}, {"id": 86, "color": "#5f3ebf", "emoji": "😨", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.645Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Страх", "emotion_type_id": 6}, {"id": 85, "color": "#fba27f", "emoji": "😲", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.628Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Удивление", "emotion_type_id": 7}, {"id": 84, "color": "#939597", "emoji": "🤢", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.612Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Отвращение", "emotion_type_id": 8}, {"id": 83, "color": "#f4cccc", "emoji": "🤞", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.595Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Надежда", "emotion_type_id": 9}, {"id": 77, "color": "#8fceb3", "emoji": "🙏", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:16.177Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Благодарность", "emotion_type_id": 10}, {"id": 76, "color": "#FFF5BA", "emoji": "😊", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:16.164Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 72, "color": "#5D9B9B", "emoji": "😌", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T19:58:12.144Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 69, "color": "#8faeda", "emoji": "😔", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T19:34:36.229Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}, {"id": 67, "color": "#744ebb", "emoji": "😰", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T19:34:23.941Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 63, "color": "#5D9B9B", "emoji": "😌", "user_id": 27, "intensity": 5, "created_at": "2026-05-25T14:10:07.119Z", "created_date": "2026-05-24T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}], "startDate": "2026-05-19"}	\N	\N	2026-05-26 23:01:23.234588
50	27	all	2026-05-19	2026-05-26	{"user": {"name": "Leisa Hoho"}, "diary": [{"id": 24, "user_id": 27, "behavior": "Делаю диплом...", "thoughts": "Очень страшно, боюсь не сдать", "situation": "Сдача диплома", "created_at": "2026-05-12T08:30:30.725Z", "entry_date": "2026-05-25T21:00:00.000Z", "updated_at": "2026-05-26T20:02:45.921Z", "emotion_name": "Тревога, Страх", "situation_place": "Колледж", "selected_emotions": [{"name": "Тревога", "emotionId": 2, "intensity": 5, "emotionName": "Тревога"}, {"name": "Страх", "emotionId": 6, "intensity": 5, "emotionName": "Страх"}], "reaction_description": "Делаю диплом...", "situation_description": "Сдача диплома"}], "endDate": "2026-05-26", "summary": {"totalDiary": 1, "badEmotions": 5, "goodEmotions": 6, "totalEmotions": 11, "averageIntensity": 9.545454545454545}, "emotions": [{"id": 77, "color": "#8fceb3", "emoji": "🙏", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:16.177Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Благодарность", "emotion_type_id": 10}, {"id": 72, "color": "#5D9B9B", "emoji": "😌", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T19:58:12.144Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 67, "color": "#744ebb", "emoji": "😰", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T19:34:23.941Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 76, "color": "#FFF5BA", "emoji": "😊", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:16.164Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 69, "color": "#8faeda", "emoji": "😔", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T19:34:36.229Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}, {"id": 87, "color": "#de185a", "emoji": "😠", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.657Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Злость", "emotion_type_id": 5}, {"id": 86, "color": "#5f3ebf", "emoji": "😨", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.645Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Страх", "emotion_type_id": 6}, {"id": 85, "color": "#fba27f", "emoji": "😲", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.628Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Удивление", "emotion_type_id": 7}, {"id": 84, "color": "#939597", "emoji": "🤢", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.612Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Отвращение", "emotion_type_id": 8}, {"id": 83, "color": "#f4cccc", "emoji": "🤞", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.595Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Надежда", "emotion_type_id": 9}, {"id": 63, "color": "#5D9B9B", "emoji": "😌", "user_id": 27, "intensity": 5, "created_at": "2026-05-25T14:10:07.119Z", "created_date": "2026-05-24T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}], "startDate": "2026-05-19"}	\N	\N	2026-05-26 23:02:49.517225
51	27	all	2026-05-19	2026-05-26	{"user": {"name": "Leisa Hoho"}, "diary": [{"id": 24, "user_id": 27, "behavior": "Делаю диплом...", "thoughts": "Очень страшно, боюсь не сдать", "situation": "Сдача диплома", "created_at": "2026-05-12T08:30:30.725Z", "entry_date": "2026-05-25T21:00:00.000Z", "updated_at": "2026-05-26T20:02:45.921Z", "emotion_name": "Тревога, Страх", "situation_place": "Колледж", "selected_emotions": [{"name": "Тревога", "emotionId": 2, "intensity": 5, "emotionName": "Тревога"}, {"name": "Страх", "emotionId": 6, "intensity": 5, "emotionName": "Страх"}], "reaction_description": "Делаю диплом...", "situation_description": "Сдача диплома"}], "endDate": "2026-05-26", "summary": {"totalDiary": 1, "badEmotions": 5, "goodEmotions": 6, "totalEmotions": 11, "averageIntensity": 9.545454545454545}, "emotions": [{"id": 77, "color": "#8fceb3", "emoji": "🙏", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:16.177Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Благодарность", "emotion_type_id": 10}, {"id": 72, "color": "#5D9B9B", "emoji": "😌", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T19:58:12.144Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 67, "color": "#744ebb", "emoji": "😰", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T19:34:23.941Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 76, "color": "#FFF5BA", "emoji": "😊", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:16.164Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 69, "color": "#8faeda", "emoji": "😔", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T19:34:36.229Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}, {"id": 87, "color": "#de185a", "emoji": "😠", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.657Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Злость", "emotion_type_id": 5}, {"id": 86, "color": "#5f3ebf", "emoji": "😨", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.645Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Страх", "emotion_type_id": 6}, {"id": 85, "color": "#fba27f", "emoji": "😲", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.628Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Удивление", "emotion_type_id": 7}, {"id": 84, "color": "#939597", "emoji": "🤢", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.612Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Отвращение", "emotion_type_id": 8}, {"id": 83, "color": "#f4cccc", "emoji": "🤞", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.595Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Надежда", "emotion_type_id": 9}, {"id": 63, "color": "#5D9B9B", "emoji": "😌", "user_id": 27, "intensity": 5, "created_at": "2026-05-25T14:10:07.119Z", "created_date": "2026-05-24T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}], "startDate": "2026-05-19"}	\N	\N	2026-05-26 23:03:11.928327
52	27	all	2026-05-19	2026-05-26	{"user": {"name": "Leisa Hoho"}, "diary": [{"id": 24, "user_id": 27, "behavior": "Делаю диплом...", "thoughts": "Очень страшно, боюсь не сдать", "situation": "Сдача диплома", "created_at": "2026-05-12T08:30:30.725Z", "entry_date": "2026-05-25T21:00:00.000Z", "updated_at": "2026-05-26T20:02:45.921Z", "emotion_name": "Тревога, Страх", "situation_place": "Колледж", "selected_emotions": [{"name": "Тревога", "emotionId": 2, "intensity": 5, "emotionName": "Тревога"}, {"name": "Страх", "emotionId": 6, "intensity": 5, "emotionName": "Страх"}], "reaction_description": "Делаю диплом...", "situation_description": "Сдача диплома"}], "endDate": "2026-05-26", "summary": {"totalDiary": 1, "badEmotions": 5, "goodEmotions": 6, "totalEmotions": 11, "averageIntensity": 9.545454545454545}, "emotions": [{"id": 77, "color": "#8fceb3", "emoji": "🙏", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:16.177Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Благодарность", "emotion_type_id": 10}, {"id": 72, "color": "#5D9B9B", "emoji": "😌", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T19:58:12.144Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 67, "color": "#744ebb", "emoji": "😰", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T19:34:23.941Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 76, "color": "#FFF5BA", "emoji": "😊", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:16.164Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 69, "color": "#8faeda", "emoji": "😔", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T19:34:36.229Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}, {"id": 87, "color": "#de185a", "emoji": "😠", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.657Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Злость", "emotion_type_id": 5}, {"id": 86, "color": "#5f3ebf", "emoji": "😨", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.645Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Страх", "emotion_type_id": 6}, {"id": 85, "color": "#fba27f", "emoji": "😲", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.628Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Удивление", "emotion_type_id": 7}, {"id": 84, "color": "#939597", "emoji": "🤢", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.612Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Отвращение", "emotion_type_id": 8}, {"id": 83, "color": "#f4cccc", "emoji": "🤞", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.595Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Надежда", "emotion_type_id": 9}, {"id": 63, "color": "#5D9B9B", "emoji": "😌", "user_id": 27, "intensity": 5, "created_at": "2026-05-25T14:10:07.119Z", "created_date": "2026-05-24T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}], "startDate": "2026-05-19"}	\N	2026-05-26 23:03:27.445514	2026-05-26 23:03:13.371853
53	27	all	2026-05-20	2026-05-27	{"user": {"name": "Leisa Hoho"}, "diary": [{"id": 24, "user_id": 27, "behavior": "Делаю диплом...", "thoughts": "Очень страшно, боюсь не сдать", "situation": "Сдача диплома", "created_at": "2026-05-12T08:30:30.725Z", "entry_date": "2026-05-25T21:00:00.000Z", "updated_at": "2026-05-26T20:02:45.921Z", "emotion_name": "Тревога, Страх", "situation_place": "Колледж", "selected_emotions": [{"name": "Тревога", "emotionId": 2, "intensity": 5, "emotionName": "Тревога"}, {"name": "Страх", "emotionId": 6, "intensity": 5, "emotionName": "Страх"}], "reaction_description": "Делаю диплом...", "situation_description": "Сдача диплома"}], "endDate": "2026-05-27", "summary": {"totalDiary": 1, "badEmotions": 5, "goodEmotions": 7, "totalEmotions": 12, "averageIntensity": 9.166666666666666}, "emotions": [{"id": 109, "color": "#939597", "emoji": "🤢", "user_id": 27, "intensity": 5, "created_at": "2026-05-27T07:32:57.061Z", "created_date": "2026-05-26T21:00:00.000Z", "emotion_name": "Отвращение", "emotion_type_id": 8}, {"id": 67, "color": "#744ebb", "emoji": "😰", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T19:34:23.941Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 76, "color": "#FFF5BA", "emoji": "😊", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:16.164Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 69, "color": "#8faeda", "emoji": "😔", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T19:34:36.229Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}, {"id": 87, "color": "#de185a", "emoji": "😠", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.657Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Злость", "emotion_type_id": 5}, {"id": 86, "color": "#5f3ebf", "emoji": "😨", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.645Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Страх", "emotion_type_id": 6}, {"id": 85, "color": "#fba27f", "emoji": "😲", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.628Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Удивление", "emotion_type_id": 7}, {"id": 77, "color": "#8fceb3", "emoji": "🙏", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:16.177Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Благодарность", "emotion_type_id": 10}, {"id": 72, "color": "#5D9B9B", "emoji": "😌", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T19:58:12.144Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 84, "color": "#939597", "emoji": "🤢", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.612Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Отвращение", "emotion_type_id": 8}, {"id": 83, "color": "#f4cccc", "emoji": "🤞", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.595Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Надежда", "emotion_type_id": 9}, {"id": 63, "color": "#5D9B9B", "emoji": "😌", "user_id": 27, "intensity": 5, "created_at": "2026-05-25T14:10:07.119Z", "created_date": "2026-05-24T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}], "startDate": "2026-05-20"}	\N	2026-05-27 10:34:28.70346	2026-05-27 10:33:37.857397
54	27	all	2026-05-27	2026-05-27	{"user": {"name": "Leisan Hoho"}, "diary": [{"id": 26, "user_id": 27, "behavior": "Fjjeisd", "thoughts": "Fjisodof", "situation": "Jfjdosod", "created_at": "2026-05-27T08:09:11.194Z", "entry_date": "2026-05-26T21:00:00.000Z", "updated_at": "2026-05-27T08:09:11.194Z", "emotion_name": "Спокойствие", "situation_place": "Fjdjdj", "selected_emotions": [{"name": "Спокойствие", "emotionId": 1, "intensity": 5, "emotionName": "Спокойствие"}], "reaction_description": "Fjjeisd", "situation_description": "Jfjdosod"}], "endDate": "2026-05-27", "summary": {"totalDiary": 1, "badEmotions": 0, "goodEmotions": 1, "totalEmotions": 1, "averageIntensity": 6}, "emotions": [{"id": 120, "color": "#744ebb", "emoji": "😰", "user_id": 27, "intensity": 6, "created_at": "2026-05-27T08:03:34.293Z", "created_date": "2026-05-26T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}], "startDate": "2026-05-27"}	\N	\N	2026-05-27 11:09:57.735234
55	27	all	2026-05-27	2026-05-27	{"user": {"name": "Leisan Hoho"}, "diary": [{"id": 26, "user_id": 27, "behavior": "Fjjeisd", "thoughts": "Fjisodof", "situation": "Jfjdosod", "created_at": "2026-05-27T08:09:11.194Z", "entry_date": "2026-05-26T21:00:00.000Z", "updated_at": "2026-05-27T08:09:11.194Z", "emotion_name": "Спокойствие", "situation_place": "Fjdjdj", "selected_emotions": [{"name": "Спокойствие", "emotionId": 1, "intensity": 5, "emotionName": "Спокойствие"}], "reaction_description": "Fjjeisd", "situation_description": "Jfjdosod"}], "endDate": "2026-05-27", "summary": {"totalDiary": 1, "badEmotions": 0, "goodEmotions": 1, "totalEmotions": 1, "averageIntensity": 6}, "emotions": [{"id": 120, "color": "#744ebb", "emoji": "😰", "user_id": 27, "intensity": 6, "created_at": "2026-05-27T08:03:34.293Z", "created_date": "2026-05-26T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}], "startDate": "2026-05-27"}	\N	\N	2026-05-27 11:10:02.063522
56	27	all	2026-05-27	2026-05-27	{"user": {"name": "Leisan Hoho"}, "diary": [{"id": 26, "user_id": 27, "behavior": "Fjjeisd", "thoughts": "Fjisodof", "situation": "Jfjdosod", "created_at": "2026-05-27T08:09:11.194Z", "entry_date": "2026-05-26T21:00:00.000Z", "updated_at": "2026-05-27T08:09:11.194Z", "emotion_name": "Спокойствие", "situation_place": "Fjdjdj", "selected_emotions": [{"name": "Спокойствие", "emotionId": 1, "intensity": 5, "emotionName": "Спокойствие"}], "reaction_description": "Fjjeisd", "situation_description": "Jfjdosod"}], "endDate": "2026-05-27", "summary": {"totalDiary": 1, "badEmotions": 0, "goodEmotions": 1, "totalEmotions": 1, "averageIntensity": 6}, "emotions": [{"id": 120, "color": "#744ebb", "emoji": "😰", "user_id": 27, "intensity": 6, "created_at": "2026-05-27T08:03:34.293Z", "created_date": "2026-05-26T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}], "startDate": "2026-05-27"}	\N	\N	2026-05-27 11:10:15.921691
57	27	all	2026-05-20	2026-05-27	{"user": {"name": "Leisan Hoho"}, "diary": [{"id": 26, "user_id": 27, "behavior": "Fjjeisd", "thoughts": "Fjisodof", "situation": "Jfjdosod", "created_at": "2026-05-27T08:09:11.194Z", "entry_date": "2026-05-26T21:00:00.000Z", "updated_at": "2026-05-27T08:09:11.194Z", "emotion_name": "Спокойствие", "situation_place": "Fjdjdj", "selected_emotions": [{"name": "Спокойствие", "emotionId": 1, "intensity": 5, "emotionName": "Спокойствие"}], "reaction_description": "Fjjeisd", "situation_description": "Jfjdosod"}, {"id": 24, "user_id": 27, "behavior": "Делаю диплом...", "thoughts": "Очень страшно, боюсь не сдать", "situation": "Сдача диплома", "created_at": "2026-05-12T08:30:30.725Z", "entry_date": "2026-05-25T21:00:00.000Z", "updated_at": "2026-05-27T08:38:34.720Z", "emotion_name": "Тревога, Страх", "situation_place": "Колледж", "selected_emotions": [{"name": "Тревога", "emotionId": 2, "intensity": 5, "emotionName": "Тревога"}, {"name": "Страх", "emotionId": 6, "intensity": 5, "emotionName": "Страх"}], "reaction_description": "Делаю диплом...", "situation_description": "Сдача диплома"}], "endDate": "2026-05-27", "summary": {"totalDiary": 2, "badEmotions": 8, "goodEmotions": 7, "totalEmotions": 15, "averageIntensity": 7.533333333333333}, "emotions": [{"id": 140, "color": "#8faeda", "emoji": "😔", "user_id": 27, "intensity": 5, "created_at": "2026-05-27T12:43:47.014Z", "created_date": "2026-05-26T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}, {"id": 138, "color": "#744ebb", "emoji": "😰", "user_id": 27, "intensity": 1, "created_at": "2026-05-27T12:43:46.993Z", "created_date": "2026-05-26T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 139, "color": "#FFF5BA", "emoji": "😊", "user_id": 27, "intensity": 1, "created_at": "2026-05-27T12:43:47.005Z", "created_date": "2026-05-26T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 137, "color": "#5D9B9B", "emoji": "😌", "user_id": 27, "intensity": 1, "created_at": "2026-05-27T12:43:46.954Z", "created_date": "2026-05-26T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 77, "color": "#8fceb3", "emoji": "🙏", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:16.177Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Благодарность", "emotion_type_id": 10}, {"id": 67, "color": "#744ebb", "emoji": "😰", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T19:34:23.941Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 76, "color": "#FFF5BA", "emoji": "😊", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:16.164Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 69, "color": "#8faeda", "emoji": "😔", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T19:34:36.229Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}, {"id": 72, "color": "#5D9B9B", "emoji": "😌", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T19:58:12.144Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 87, "color": "#de185a", "emoji": "😠", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.657Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Злость", "emotion_type_id": 5}, {"id": 86, "color": "#5f3ebf", "emoji": "😨", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.645Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Страх", "emotion_type_id": 6}, {"id": 85, "color": "#fba27f", "emoji": "😲", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.628Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Удивление", "emotion_type_id": 7}, {"id": 84, "color": "#939597", "emoji": "🤢", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.612Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Отвращение", "emotion_type_id": 8}, {"id": 83, "color": "#f4cccc", "emoji": "🤞", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.595Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Надежда", "emotion_type_id": 9}, {"id": 63, "color": "#5D9B9B", "emoji": "😌", "user_id": 27, "intensity": 5, "created_at": "2026-05-25T14:10:07.119Z", "created_date": "2026-05-24T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}], "startDate": "2026-05-20"}	\N	\N	2026-05-27 15:43:51.22722
58	27	all	2026-05-31	2026-06-01	{"user": {"name": "Leisan Hoho"}, "diary": [], "endDate": "2026-06-01", "summary": {"totalDiary": 0, "badEmotions": 1, "goodEmotions": 1, "totalEmotions": 2, "averageIntensity": 3}, "emotions": [{"id": 144, "color": "#5D9B9B", "emoji": "😌", "user_id": 27, "intensity": 5, "created_at": "2026-06-01T12:57:56.587Z", "created_date": "2026-05-31T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 145, "color": "#744ebb", "emoji": "😰", "user_id": 27, "intensity": 1, "created_at": "2026-06-01T12:57:56.612Z", "created_date": "2026-05-31T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}], "startDate": "2026-05-31"}	\N	\N	2026-06-01 16:00:32.650741
59	27	all	2026-05-25	2026-06-01	{"user": {"name": "Leisan Hoho"}, "diary": [{"id": 28, "user_id": 27, "behavior": "Fjjdksdn", "thoughts": "Fjsjks", "situation": "Fjjdkd", "created_at": "2026-05-27T14:11:11.821Z", "entry_date": "2026-05-26T21:00:00.000Z", "updated_at": "2026-05-27T14:11:11.821Z", "emotion_name": "Тревога", "situation_place": "Fhbsjs", "selected_emotions": [{"name": "Тревога", "emotionId": 2, "intensity": 3, "emotionName": "Тревога"}], "reaction_description": "Fjjdksdn", "situation_description": "Fjjdkd"}, {"id": 27, "user_id": 27, "behavior": "Bfjskx", "thoughts": "Fjkskx", "situation": "Hfidosod", "created_at": "2026-05-27T14:11:00.352Z", "entry_date": "2026-05-26T21:00:00.000Z", "updated_at": "2026-05-27T14:11:00.352Z", "emotion_name": "Спокойствие", "situation_place": "Jfjdjd", "selected_emotions": [{"name": "Спокойствие", "emotionId": 1, "intensity": 3, "emotionName": "Спокойствие"}], "reaction_description": "Bfjskx", "situation_description": "Hfidosod"}, {"id": 26, "user_id": 27, "behavior": "Fjjeisd", "thoughts": "Fjisodof", "situation": "Jfjdosod", "created_at": "2026-05-27T08:09:11.194Z", "entry_date": "2026-05-26T21:00:00.000Z", "updated_at": "2026-05-27T08:09:11.194Z", "emotion_name": "Спокойствие", "situation_place": "Fjdjdj", "selected_emotions": [{"name": "Спокойствие", "emotionId": 1, "intensity": 5, "emotionName": "Спокойствие"}], "reaction_description": "Fjjeisd", "situation_description": "Jfjdosod"}, {"id": 24, "user_id": 27, "behavior": "Делаю диплом...", "thoughts": "Очень страшно, боюсь не сдать", "situation": "Сдача диплома", "created_at": "2026-05-12T08:30:30.725Z", "entry_date": "2026-05-25T21:00:00.000Z", "updated_at": "2026-05-27T08:38:34.720Z", "emotion_name": "Тревога, Страх", "situation_place": "Колледж", "selected_emotions": [{"name": "Тревога", "emotionId": 2, "intensity": 5, "emotionName": "Тревога"}, {"name": "Страх", "emotionId": 6, "intensity": 5, "emotionName": "Страх"}], "reaction_description": "Делаю диплом...", "situation_description": "Сдача диплома"}], "endDate": "2026-06-01", "summary": {"totalDiary": 4, "badEmotions": 8, "goodEmotions": 7, "totalEmotions": 15, "averageIntensity": 7.533333333333333}, "emotions": [{"id": 140, "color": "#8faeda", "emoji": "😔", "user_id": 27, "intensity": 5, "created_at": "2026-05-27T12:43:47.014Z", "created_date": "2026-05-26T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}, {"id": 138, "color": "#744ebb", "emoji": "😰", "user_id": 27, "intensity": 1, "created_at": "2026-05-27T12:43:46.993Z", "created_date": "2026-05-26T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 139, "color": "#FFF5BA", "emoji": "😊", "user_id": 27, "intensity": 1, "created_at": "2026-05-27T12:43:47.005Z", "created_date": "2026-05-26T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 137, "color": "#5D9B9B", "emoji": "😌", "user_id": 27, "intensity": 1, "created_at": "2026-05-27T12:43:46.954Z", "created_date": "2026-05-26T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 77, "color": "#8fceb3", "emoji": "🙏", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:16.177Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Благодарность", "emotion_type_id": 10}, {"id": 67, "color": "#744ebb", "emoji": "😰", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T19:34:23.941Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 76, "color": "#FFF5BA", "emoji": "😊", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:16.164Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 69, "color": "#8faeda", "emoji": "😔", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T19:34:36.229Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}, {"id": 72, "color": "#5D9B9B", "emoji": "😌", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T19:58:12.144Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 87, "color": "#de185a", "emoji": "😠", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.657Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Злость", "emotion_type_id": 5}, {"id": 86, "color": "#5f3ebf", "emoji": "😨", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.645Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Страх", "emotion_type_id": 6}, {"id": 85, "color": "#fba27f", "emoji": "😲", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.628Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Удивление", "emotion_type_id": 7}, {"id": 84, "color": "#939597", "emoji": "🤢", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.612Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Отвращение", "emotion_type_id": 8}, {"id": 83, "color": "#f4cccc", "emoji": "🤞", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.595Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Надежда", "emotion_type_id": 9}, {"id": 63, "color": "#5D9B9B", "emoji": "😌", "user_id": 27, "intensity": 5, "created_at": "2026-05-25T14:10:07.119Z", "created_date": "2026-05-24T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}], "startDate": "2026-05-25"}	\N	\N	2026-06-01 17:07:12.277764
60	27	all	2026-05-25	2026-06-01	{"user": {"name": "Leisan Hoho"}, "diary": [{"id": 28, "user_id": 27, "behavior": "Fjjdksdn", "thoughts": "Fjsjks", "situation": "Fjjdkd", "created_at": "2026-05-27T14:11:11.821Z", "entry_date": "2026-05-26T21:00:00.000Z", "updated_at": "2026-05-27T14:11:11.821Z", "emotion_name": "Тревога", "situation_place": "Fhbsjs", "selected_emotions": [{"name": "Тревога", "emotionId": 2, "intensity": 3, "emotionName": "Тревога"}], "reaction_description": "Fjjdksdn", "situation_description": "Fjjdkd"}, {"id": 27, "user_id": 27, "behavior": "Bfjskx", "thoughts": "Fjkskx", "situation": "Hfidosod", "created_at": "2026-05-27T14:11:00.352Z", "entry_date": "2026-05-26T21:00:00.000Z", "updated_at": "2026-05-27T14:11:00.352Z", "emotion_name": "Спокойствие", "situation_place": "Jfjdjd", "selected_emotions": [{"name": "Спокойствие", "emotionId": 1, "intensity": 3, "emotionName": "Спокойствие"}], "reaction_description": "Bfjskx", "situation_description": "Hfidosod"}, {"id": 26, "user_id": 27, "behavior": "Fjjeisd", "thoughts": "Fjisodof", "situation": "Jfjdosod", "created_at": "2026-05-27T08:09:11.194Z", "entry_date": "2026-05-26T21:00:00.000Z", "updated_at": "2026-05-27T08:09:11.194Z", "emotion_name": "Спокойствие", "situation_place": "Fjdjdj", "selected_emotions": [{"name": "Спокойствие", "emotionId": 1, "intensity": 5, "emotionName": "Спокойствие"}], "reaction_description": "Fjjeisd", "situation_description": "Jfjdosod"}, {"id": 24, "user_id": 27, "behavior": "Делаю диплом...", "thoughts": "Очень страшно, боюсь не сдать", "situation": "Сдача диплома", "created_at": "2026-05-12T08:30:30.725Z", "entry_date": "2026-05-25T21:00:00.000Z", "updated_at": "2026-05-27T08:38:34.720Z", "emotion_name": "Тревога, Страх", "situation_place": "Колледж", "selected_emotions": [{"name": "Тревога", "emotionId": 2, "intensity": 5, "emotionName": "Тревога"}, {"name": "Страх", "emotionId": 6, "intensity": 5, "emotionName": "Страх"}], "reaction_description": "Делаю диплом...", "situation_description": "Сдача диплома"}], "endDate": "2026-06-01", "summary": {"totalDiary": 4, "badEmotions": 8, "goodEmotions": 7, "totalEmotions": 15, "averageIntensity": 7.533333333333333}, "emotions": [{"id": 140, "color": "#8faeda", "emoji": "😔", "user_id": 27, "intensity": 5, "created_at": "2026-05-27T12:43:47.014Z", "created_date": "2026-05-26T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}, {"id": 138, "color": "#744ebb", "emoji": "😰", "user_id": 27, "intensity": 1, "created_at": "2026-05-27T12:43:46.993Z", "created_date": "2026-05-26T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 139, "color": "#FFF5BA", "emoji": "😊", "user_id": 27, "intensity": 1, "created_at": "2026-05-27T12:43:47.005Z", "created_date": "2026-05-26T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 137, "color": "#5D9B9B", "emoji": "😌", "user_id": 27, "intensity": 1, "created_at": "2026-05-27T12:43:46.954Z", "created_date": "2026-05-26T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 77, "color": "#8fceb3", "emoji": "🙏", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:16.177Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Благодарность", "emotion_type_id": 10}, {"id": 67, "color": "#744ebb", "emoji": "😰", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T19:34:23.941Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 76, "color": "#FFF5BA", "emoji": "😊", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:16.164Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 69, "color": "#8faeda", "emoji": "😔", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T19:34:36.229Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}, {"id": 72, "color": "#5D9B9B", "emoji": "😌", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T19:58:12.144Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 87, "color": "#de185a", "emoji": "😠", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.657Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Злость", "emotion_type_id": 5}, {"id": 86, "color": "#5f3ebf", "emoji": "😨", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.645Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Страх", "emotion_type_id": 6}, {"id": 85, "color": "#fba27f", "emoji": "😲", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.628Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Удивление", "emotion_type_id": 7}, {"id": 84, "color": "#939597", "emoji": "🤢", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.612Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Отвращение", "emotion_type_id": 8}, {"id": 83, "color": "#f4cccc", "emoji": "🤞", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.595Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Надежда", "emotion_type_id": 9}, {"id": 63, "color": "#5D9B9B", "emoji": "😌", "user_id": 27, "intensity": 5, "created_at": "2026-05-25T14:10:07.119Z", "created_date": "2026-05-24T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}], "startDate": "2026-05-25"}	\N	\N	2026-06-01 17:07:20.721495
62	27	all	2026-05-31	2026-06-02	{"user": {"name": "Leisan Hoho"}, "diary": [], "endDate": "2026-06-02", "summary": {"totalDiary": 0, "badEmotions": 1, "goodEmotions": 0, "totalEmotions": 1, "averageIntensity": 10}, "emotions": [{"id": 157, "color": "#744ebb", "emoji": "😰", "user_id": 27, "intensity": 10, "created_at": "2026-06-02T14:34:01.564Z", "created_date": "2026-06-01T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}], "startDate": "2026-05-31"}	\N	2026-06-02 17:37:25.573548	2026-06-02 17:34:43.615233
61	27	all	2026-05-26	2026-06-02	{"user": {"name": "Leisan Hoho"}, "diary": [{"id": 28, "user_id": 27, "behavior": "Fjjdksdn", "thoughts": "Fjsjks", "situation": "Fjjdkd", "created_at": "2026-05-27T14:11:11.821Z", "entry_date": "2026-05-26T21:00:00.000Z", "updated_at": "2026-05-27T14:11:11.821Z", "emotion_name": "Тревога", "situation_place": "Fhbsjs", "selected_emotions": [{"name": "Тревога", "emotionId": 2, "intensity": 3, "emotionName": "Тревога"}], "reaction_description": "Fjjdksdn", "situation_description": "Fjjdkd"}, {"id": 27, "user_id": 27, "behavior": "Bfjskx", "thoughts": "Fjkskx", "situation": "Hfidosod", "created_at": "2026-05-27T14:11:00.352Z", "entry_date": "2026-05-26T21:00:00.000Z", "updated_at": "2026-05-27T14:11:00.352Z", "emotion_name": "Спокойствие", "situation_place": "Jfjdjd", "selected_emotions": [{"name": "Спокойствие", "emotionId": 1, "intensity": 3, "emotionName": "Спокойствие"}], "reaction_description": "Bfjskx", "situation_description": "Hfidosod"}, {"id": 26, "user_id": 27, "behavior": "Fjjeisd", "thoughts": "Fjisodof", "situation": "Jfjdosod", "created_at": "2026-05-27T08:09:11.194Z", "entry_date": "2026-05-26T21:00:00.000Z", "updated_at": "2026-05-27T08:09:11.194Z", "emotion_name": "Спокойствие", "situation_place": "Fjdjdj", "selected_emotions": [{"name": "Спокойствие", "emotionId": 1, "intensity": 5, "emotionName": "Спокойствие"}], "reaction_description": "Fjjeisd", "situation_description": "Jfjdosod"}, {"id": 24, "user_id": 27, "behavior": "Делаю диплом...", "thoughts": "Очень страшно, боюсь не сдать", "situation": "Сдача диплома", "created_at": "2026-05-12T08:30:30.725Z", "entry_date": "2026-05-25T21:00:00.000Z", "updated_at": "2026-05-27T08:38:34.720Z", "emotion_name": "Тревога, Страх", "situation_place": "Колледж", "selected_emotions": [{"name": "Тревога", "emotionId": 2, "intensity": 5, "emotionName": "Тревога"}, {"name": "Страх", "emotionId": 6, "intensity": 5, "emotionName": "Страх"}], "reaction_description": "Делаю диплом...", "situation_description": "Сдача диплома"}], "endDate": "2026-06-02", "summary": {"totalDiary": 4, "badEmotions": 9, "goodEmotions": 6, "totalEmotions": 15, "averageIntensity": 7.866666666666666}, "emotions": [{"id": 157, "color": "#744ebb", "emoji": "😰", "user_id": 27, "intensity": 10, "created_at": "2026-06-02T14:34:01.564Z", "created_date": "2026-06-01T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 140, "color": "#8faeda", "emoji": "😔", "user_id": 27, "intensity": 5, "created_at": "2026-05-27T12:43:47.014Z", "created_date": "2026-05-26T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}, {"id": 139, "color": "#FFF5BA", "emoji": "😊", "user_id": 27, "intensity": 1, "created_at": "2026-05-27T12:43:47.005Z", "created_date": "2026-05-26T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 137, "color": "#5D9B9B", "emoji": "😌", "user_id": 27, "intensity": 1, "created_at": "2026-05-27T12:43:46.954Z", "created_date": "2026-05-26T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 138, "color": "#744ebb", "emoji": "😰", "user_id": 27, "intensity": 1, "created_at": "2026-05-27T12:43:46.993Z", "created_date": "2026-05-26T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 86, "color": "#5f3ebf", "emoji": "😨", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.645Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Страх", "emotion_type_id": 6}, {"id": 85, "color": "#fba27f", "emoji": "😲", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.628Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Удивление", "emotion_type_id": 7}, {"id": 84, "color": "#939597", "emoji": "🤢", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.612Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Отвращение", "emotion_type_id": 8}, {"id": 83, "color": "#f4cccc", "emoji": "🤞", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.595Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Надежда", "emotion_type_id": 9}, {"id": 72, "color": "#5D9B9B", "emoji": "😌", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T19:58:12.144Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Спокойствие", "emotion_type_id": 1}, {"id": 77, "color": "#8fceb3", "emoji": "🙏", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:16.177Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Благодарность", "emotion_type_id": 10}, {"id": 67, "color": "#744ebb", "emoji": "😰", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T19:34:23.941Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Тревога", "emotion_type_id": 2}, {"id": 76, "color": "#FFF5BA", "emoji": "😊", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:16.164Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Радость", "emotion_type_id": 3}, {"id": 69, "color": "#8faeda", "emoji": "😔", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T19:34:36.229Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Грусть", "emotion_type_id": 4}, {"id": 87, "color": "#de185a", "emoji": "😠", "user_id": 27, "intensity": 10, "created_at": "2026-05-26T20:00:32.657Z", "created_date": "2026-05-25T21:00:00.000Z", "emotion_name": "Злость", "emotion_type_id": 5}], "startDate": "2026-05-26"}	\N	2026-06-02 17:37:37.865733	2026-06-02 17:34:14.954842
\.


--
-- Data for Name: smer_diary; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.smer_diary (id, user_id, entry_date, situation_place, situation_description, thoughts, reaction_description, selected_emotions, created_at, updated_at) FROM stdin;
1	1	2024-03-01	Офис	Важное совещание с начальством	Я не справлюсь, все увидят мою неуверенность	Дрожали руки, говорила тихо, избегала зрительного контакта	[{"name": "Тревога", "intensity": 8, "emotion_id": 2}, {"name": "Страх", "intensity": 7, "emotion_id": 6}]	2024-03-01 19:30:00	2024-03-01 19:30:00
2	1	2024-03-02	Кафе	Встреча с подругой после долгой разлуки	Как здорово снова видеться, столько новостей!	Смеялась, делилась историями, чувствовала себя легко	[{"name": "Радость", "intensity": 9, "emotion_id": 3}, {"name": "Благодарность", "intensity": 6, "emotion_id": 10}]	2024-03-02 22:00:00	2024-03-02 22:00:00
3	2	2024-03-01	Дома	Проснулся среди ночи от кошмара	Это снова происходит, я не могу это контролировать	Быстрое сердцебиение, паника, включил свет	[{"name": "Страх", "intensity": 9, "emotion_id": 6}, {"name": "Тревога", "intensity": 8, "emotion_id": 2}]	2024-03-01 03:15:00	2024-03-01 03:15:00
4	2	2024-03-03	Парк	Прогулка в солнечный день	Как прекрасен этот мир вокруг	Шел медленно, наслаждался природой, дышал глубоко	[{"name": "Спокойствие", "intensity": 7, "emotion_id": 1}, {"name": "Радость", "intensity": 6, "emotion_id": 3}]	2024-03-03 16:45:00	2024-03-03 16:45:00
5	3	2024-03-04	Университет	Экзамен по сложному предмету	Я ничего не помню, провалюсь наверняка	Забыла все ответы, руки дрожали, вышла раньше времени	[{"name": "Тревога", "intensity": 9, "emotion_id": 2}, {"name": "Страх", "intensity": 8, "emotion_id": 6}, {"name": "Грусть", "intensity": 6, "emotion_id": 4}]	2024-03-04 14:30:00	2024-03-04 14:30:00
11	19	2026-02-23	Лол	Лол	Лол	Лол	[{"emotionId": 1, "intensity": 4, "emotionName": "Спокойствие"}, {"emotionId": 2, "intensity": 5, "emotionName": "Тревога"}]	2026-02-23 23:42:22.202227	2026-02-23 23:42:31.006733
25	33	2026-05-23	Дома	Началась паническая атака	Я не сдам диплом	Паниковала	[{"name": "Тревога", "emotionId": 2, "intensity": 5, "emotionName": "Тревога"}, {"name": "Страх", "emotionId": 6, "intensity": 5, "emotionName": "Страх"}]	2026-05-26 15:53:12.666681	2026-05-26 15:53:12.666681
16	22	2026-02-12	Fhjskd	Gjoeoe	Jfosofd	Fjieiff	[{"emotionId": 2, "intensity": 3, "emotionName": "Тревога"}]	2026-02-26 21:22:14.722586	2026-02-26 21:22:46.897547
18	15	2026-02-05	Test	Test	Test	Test	[{"emotionId": 3, "intensity": 4, "emotionName": "Радость"}]	2026-02-27 00:12:05.890783	2026-02-27 00:12:05.890783
19	15	2026-02-27	Test	Test	Test	Test	[{"emotionId": 10, "intensity": 3, "emotionName": "Благодарность"}]	2026-02-27 00:12:28.293001	2026-02-27 00:12:28.293001
20	23	2026-05-10	Ggg	Ggg	Ggg	Ggg	[{"emotionId": 1, "intensity": 3, "emotionName": "Спокойствие"}, {"emotionId": 2, "intensity": 3, "emotionName": "Тревога"}]	2026-05-10 23:30:10.626624	2026-05-10 23:30:10.626624
26	27	2026-05-27	Fjdjdj	Jfjdosod	Fjisodof	Fjjeisd	[{"name": "Спокойствие", "emotionId": 1, "intensity": 5, "emotionName": "Спокойствие"}]	2026-05-27 11:09:11.194331	2026-05-27 11:09:11.194331
24	27	2026-05-26	Колледж	Сдача диплома	Очень страшно, боюсь не сдать	Делаю диплом...	[{"name": "Тревога", "emotionId": 2, "intensity": 5, "emotionName": "Тревога"}, {"name": "Страх", "emotionId": 6, "intensity": 5, "emotionName": "Страх"}]	2026-05-12 11:30:30.725611	2026-05-27 11:38:34.720455
27	27	2026-05-27	Jfjdjd	Hfidosod	Fjkskx	Bfjskx	[{"name": "Спокойствие", "emotionId": 1, "intensity": 3, "emotionName": "Спокойствие"}]	2026-05-27 17:11:00.352252	2026-05-27 17:11:00.352252
28	27	2026-05-27	Fhbsjs	Fjjdkd	Fjsjks	Fjjdksdn	[{"name": "Тревога", "emotionId": 2, "intensity": 3, "emotionName": "Тревога"}]	2026-05-27 17:11:11.821823	2026-05-27 17:11:11.821823
29	47	2026-06-01	Офис	Конфликт на работе	Меня не ценят	Замкнулся в себе	[{"id": 3, "name": "Тревога", "intensity": 4}]	2026-06-01 20:33:12.145305	2026-06-01 20:33:12.145305
30	47	2026-06-01	Офис	Конфликт на работе	Меня не ценят	Замкнулся в себе	[{"id": 3, "name": "Тревога", "intensity": 4}]	2026-06-01 23:31:40.303942	2026-06-01 23:31:40.303942
\.


--
-- Data for Name: tracks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tracks (id, playlist_id, title, artist, duration_seconds, audio_url, download_url, source, external_id) FROM stdin;
1	1	Рассветная медитация	Sound Therapy	300	https://api.jamendo.com/track/12345/stream	https://api.jamendo.com/track/12345/download	jamendo	jamendo_12345
2	1	Тихий утро	Meditation Studio	420	https://api.jamendo.com/track/12346/stream	https://api.jamendo.com/track/12346/download	jamendo	jamendo_12346
3	2	Пение птиц в лесу	Nature Sounds	600	https://api.freemusicarchive.org/track/78901	\N	fma	fma_78901
4	2	Морской прибой	Ocean Waves	480	https://api.freemusicarchive.org/track/78902	https://api.freemusicarchive.org/track/78902/download	fma	fma_78902
5	3	Лунная колыбельная	Sleep Master	540	https://api.jamendo.com/track/12347/stream	https://api.jamendo.com/track/12347/download	jamendo	jamendo_12347
6	1	Music Soothe - Meditation Music	StimiBeats	216	https://prod-1.storage.jamendo.com/?trackid=2034080&format=mp32&from=zi%2FOCm8GIN3MiRLR%2BDjGPg%3D%3D%7Cxo8tjynpOzfpi1SNqwws6A%3D%3D	https://prod-1.storage.jamendo.com/?trackid=2034080&format=mp32&from=zi%2FOCm8GIN3MiRLR%2BDjGPg%3D%3D%7Cxo8tjynpOzfpi1SNqwws6A%3D%3D	jamendo	jamendo_2034080
7	1	Stories from Emona I	Maya Filipič	210	https://prod-1.storage.jamendo.com/?trackid=196219&format=mp32&from=Nw0y3wQj3oOnebXD8ti8BQ%3D%3D%7CefZTm2WbwpA7wQ56y3%2Bl5A%3D%3D	https://prod-1.storage.jamendo.com/?trackid=196219&format=mp32&from=Nw0y3wQj3oOnebXD8ti8BQ%3D%3D%7CefZTm2WbwpA7wQ56y3%2Bl5A%3D%3D	jamendo	jamendo_196219
8	4	Particule	Silence	268	https://prod-1.storage.jamendo.com/?trackid=5345&format=mp32&from=%2F0qS36HMTzGWVZ7vNSVl0w%3D%3D%7C97LWtVLnzqFiiChbYBSckA%3D%3D	https://prod-1.storage.jamendo.com/?trackid=5345&format=mp32&from=%2F0qS36HMTzGWVZ7vNSVl0w%3D%3D%7C97LWtVLnzqFiiChbYBSckA%3D%3D	jamendo	jamendo_5345
9	1	Step Into The Light-Calm Atmospheric Peaceful	BDKSonic	223	https://prod-1.storage.jamendo.com/?trackid=1862935&format=mp32&from=sfu9QEdHk9KK6URF%2BthepQ%3D%3D%7CXjllG5dIqELURwAYMAfviA%3D%3D	https://prod-1.storage.jamendo.com/?trackid=1862935&format=mp32&from=sfu9QEdHk9KK6URF%2BthepQ%3D%3D%7CXjllG5dIqELURwAYMAfviA%3D%3D	jamendo	jamendo_1862935
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, password_hash, first_name, last_name, created_at, is_active, role) FROM stdin;
1	anna.ivanova@example.com	$2a$10$N9qo8uLOickgx2ZMRZoMye3Z6gZ2H6tR8C3Yz5L5w5F5VcJ5J5J5J	Анна	Иванова	2024-01-15 10:30:00	t	user
2	dmitry.petrov@example.com	$2a$10$N9qo8uLOickgx2ZMRZoMye3Z6gZ2H6tR8C3Yz5L5w5F5VcJ5J5J5J	Дмитрий	Петров	2024-01-20 14:45:00	t	user
3	ekaterina.smirnova@example.com	$2a$10$N9qo8uLOickgx2ZMRZoMye3Z6gZ2H6tR8C3Yz5L5w5F5VcJ5J5J5J	Екатерина	Смирнова	2024-02-01 09:15:00	t	user
4	sergey.kuznetsov@example.com	$2a$10$N9qo8uLOickgx2ZMRZoMye3Z6gZ2H6tR8C3Yz5L5w5F5VcJ5J5J5J	Сергей	Кузнецов	2024-02-10 16:20:00	t	user
5	maria.vasileva@example.com	$2a$10$N9qo8uLOickgx2ZMRZoMye3Z6gZ2H6tR8C3Yz5L5w5F5VcJ5J5J5J	Мария	Васильева	2024-02-25 11:00:00	t	user
6	test1771845075618@example.com	$2b$10$YX6WQGNR4ejCnH6qH9pNHO.a1ibAzIv2.PuIpyt9oLOoPkp1TsYh2	Тест	Пользователь	2026-02-23 14:11:15.2576	t	user
16	mvantsan@mail.ru	$2b$10$dgVxK3DgLsrJrFTujbo.D.i/wNWqIcbCu8qvUax7.djiJA9/e86Ea	Miron	Vantsan	2026-02-23 15:34:22.622314	t	user
17	jojo@mail.com	$2b$10$qOmwLDb.j/JPi78f5f2iMOeD8hb.Xg0Mh./06sluTdFvsTV/jjFZK	Jojo	Jojo	2026-02-23 15:40:36.420961	t	user
18	miron@	$2b$10$TZ7RLir3Br2m0TTD7gJJ..y/RTTq2JRz4SG97BAUHJWmQTJk6vtrC	Мирон	Ванцан	2026-02-23 23:41:04.13477	t	user
19	miron@mail.ru	$2b$10$MAdfyAlcblnQdj0atw8nHe8rAgJla1jQJleINjChHVVlX64osR7wG	Мирон	Ванцан	2026-02-23 23:41:43.556516	t	user
21	vantsanmiron@mail.ru	$2b$10$8ILi8iVo1cMqgW2eh19BkeEmGTLhNj2WBGw2GdFIGT/bpmv/oq7LG	Miron	Vantsan	2026-02-26 21:06:04.202696	t	user
23	madina@mail.ru	$2b$10$S9MXNXEAPDA6m9w97xMnGuGZcQ6BAh3w6OfzQcSc4cb2zpob7m0/G	Madina	Jorji	2026-05-10 18:18:37.21923	t	user
27	hoho@mail.ru	$2b$10$iUgPaTBgeDKI.1le0yTsEORUHB7roL.Wr8fLXlsNlxaFtaQQMwFxq	Leisan	Hoho	2026-05-11 16:48:35.229951	t	user
24	gogihel@mail.ru	$2b$10$KZxxRX/iZ6YN4.efyxiJeObzlUurqTPUOsm5QElE0TM3c5iif05B.	Helena	Goji	2026-05-11 12:32:19.107087	t	user
28	admin@thestillness.com	$2b$10$PATv5kUuQkr9HP.8PRcDguiDPiln/KBoEJgftr/opdCOBSvAqaon6	Админ		2026-05-11 21:34:11.46492	t	admin
26	vants@mail.ru	$2b$10$KOF98BwjrW45EsS8a0EI2O3JA25Cqn9eDUyApNbLZN47I0Z0ln7Pq	Milena	Vantsan	2026-05-11 16:39:07.582497	t	psychologist
25	psych@test.com	$2b$10$...	Анна	Смирнова	2026-05-11 13:17:25.418076	t	psychologist
30	admin2@thestillness.com	$2b$10$Q2vJjVBb2ai6Og9XfM01W.QsUQFTOIK25VozaePDvni8K7bwibUzG	Michael	Lol	2026-05-11 23:01:32.474292	t	admin
31	gigi@mail.ru	$2b$10$OvBDh.76SvDmzXjsLG8YTeNlzw8LvIvCIqY5/EcCVyM/Z1aoNSi76	Gigi	Perez	2026-05-12 23:03:40.588409	t	user
22	fursova@mail.ru	$2b$10$xynynRfODviiEUCfCvzKM.Mubk2h5S/egI/vdS/6a8qyB1/BckLgy	Adelina	Fursova	2026-02-26 21:20:57.318421	f	user
15	vantsan.milena@bk.ru	$2b$10$a6qOJPUPWVV7VuKdt5OdquwRvo0NZjCJrAg3HowYMbnMwrfwsD4R2	Milena	Vantsan	2026-02-23 15:11:57.551401	t	user
33	rosenberg@mail.ru	$2b$10$cnjMT1Zbqv.dLR2d.vAEO.BfcQDLSd3wNpOh.vY3aOvPENCW0uB42	Нина	Розенберг	2026-05-26 15:51:17.135962	t	user
35	sinica@mail.com	$2b$10$ld1FGgW0K6xRd6Sp.TrZ.OEHIftom8i/foMZ3vQKeYpXEQQ7LR3GK	Кристина	Синицина	2026-05-27 10:36:47.465487	t	psychologist
52	testuser3@test.com	$2b$10$53Q0ahUqROisobchHXUsXOl0uVkAsHICQSY1JSPc20NTnkP0nhwm6	Тест	Пользователь	2026-06-01 22:25:47.946984	t	user
38	popova@mail.com	$2b$10$UDQ43M022ohEEFsz5NUXJ.LIXH7L/8FqVv7vwmUOUYMgI.5vSWt6W	Регина	Попова	2026-05-27 12:26:10.668516	t	psychologist
32	firs@mail.ru	$2b$10$5ycCPYPl6Vb7ZQ7vx3RuFuuHX8SBL9Re/Fw8UpYif3UU0inkE6C9C	Helen	Firs	2026-05-12 23:27:34.889897	t	psychologist
34	novikova@mail.com	$2b$10$DMOW7NFUIhV/sD1g/UYcK.0Jz1OuRn1WP/RXOlATEy5kLrb.cGOlu	Марина	Новикова	2026-05-26 22:46:54.508767	t	psychologist
39	kalinina@mail.com	$2b$10$P42QTegEx4c.qPtVPoPMGu4bgITXInyNwmrfLn.GCKIlRBgQ1Aqo2	Элина	Калинина	2026-05-27 15:48:45.79617	t	psychologist
40	testuser@test.com	$2b$10$zRP8fpELyepNQgV9PO/EOuxYUL9mou74bdRBP3L29.Bgzz7ywpRAa	Тест	Пользователь	2026-06-01 19:59:44.046866	t	user
45	testuser1@test.com	$2b$10$mYYIGFo3xwX88cW1QwOqKOJfB4C.o5bypFTxZAdXcbigOH4NfsQpe	Тест	Пользователь	2026-06-01 20:06:55.486588	t	user
47	testuser2@test.com	$2b$10$IKMFSxwjLoDejtefDH2V5uP9OTAvsAzVXkVVUmaXpYdbmXILSAFVG	Тест	Пользователь	2026-06-01 20:08:32.710928	t	user
\.


--
-- Name: comic_pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.comic_pages_id_seq', 9, true);


--
-- Name: comics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.comics_id_seq', 67, true);


--
-- Name: downloaded_tracks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.downloaded_tracks_id_seq', 5, true);


--
-- Name: emotion_tracker_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.emotion_tracker_id_seq', 157, true);


--
-- Name: emotion_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.emotion_types_id_seq', 18, true);


--
-- Name: favorite_comics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.favorite_comics_id_seq', 5, true);


--
-- Name: favorite_playlists_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.favorite_playlists_id_seq', 5, true);


--
-- Name: favorite_tracks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.favorite_tracks_id_seq', 19, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.messages_id_seq', 22, true);


--
-- Name: password_reset_codes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.password_reset_codes_id_seq', 19, true);


--
-- Name: playlist_favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.playlist_favorites_id_seq', 1, false);


--
-- Name: playlists_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.playlists_id_seq', 11, true);


--
-- Name: psychologist_patients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.psychologist_patients_id_seq', 8, true);


--
-- Name: psychologist_reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.psychologist_reports_id_seq', 2, true);


--
-- Name: psychologists_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.psychologists_id_seq', 10, true);


--
-- Name: reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reports_id_seq', 62, true);


--
-- Name: smer_diary_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.smer_diary_id_seq', 30, true);


--
-- Name: tracks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tracks_id_seq', 9, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 53, true);


--
-- Name: comic_pages comic_pages_comic_id_page_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comic_pages
    ADD CONSTRAINT comic_pages_comic_id_page_number_key UNIQUE (comic_id, page_number);


--
-- Name: comic_pages comic_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comic_pages
    ADD CONSTRAINT comic_pages_pkey PRIMARY KEY (id);


--
-- Name: comics comics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comics
    ADD CONSTRAINT comics_pkey PRIMARY KEY (id);


--
-- Name: downloaded_tracks downloaded_tracks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.downloaded_tracks
    ADD CONSTRAINT downloaded_tracks_pkey PRIMARY KEY (id);


--
-- Name: downloaded_tracks downloaded_tracks_user_id_track_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.downloaded_tracks
    ADD CONSTRAINT downloaded_tracks_user_id_track_id_key UNIQUE (user_id, track_id);


--
-- Name: emotion_tracker emotion_tracker_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.emotion_tracker
    ADD CONSTRAINT emotion_tracker_pkey PRIMARY KEY (id);


--
-- Name: emotion_tracker emotion_tracker_user_id_emotion_type_id_created_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.emotion_tracker
    ADD CONSTRAINT emotion_tracker_user_id_emotion_type_id_created_date_key UNIQUE (user_id, emotion_type_id, created_date);


--
-- Name: emotion_types emotion_types_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.emotion_types
    ADD CONSTRAINT emotion_types_name_key UNIQUE (name);


--
-- Name: emotion_types emotion_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.emotion_types
    ADD CONSTRAINT emotion_types_pkey PRIMARY KEY (id);


--
-- Name: favorite_comics favorite_comics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorite_comics
    ADD CONSTRAINT favorite_comics_pkey PRIMARY KEY (id);


--
-- Name: favorite_comics favorite_comics_user_id_comic_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorite_comics
    ADD CONSTRAINT favorite_comics_user_id_comic_id_key UNIQUE (user_id, comic_id);


--
-- Name: favorite_playlists favorite_playlists_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorite_playlists
    ADD CONSTRAINT favorite_playlists_pkey PRIMARY KEY (id);


--
-- Name: favorite_playlists favorite_playlists_user_id_playlist_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorite_playlists
    ADD CONSTRAINT favorite_playlists_user_id_playlist_id_key UNIQUE (user_id, playlist_id);


--
-- Name: favorite_tracks favorite_tracks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorite_tracks
    ADD CONSTRAINT favorite_tracks_pkey PRIMARY KEY (id);


--
-- Name: favorite_tracks favorite_tracks_user_id_track_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorite_tracks
    ADD CONSTRAINT favorite_tracks_user_id_track_id_key UNIQUE (user_id, track_id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: password_reset_codes password_reset_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_codes
    ADD CONSTRAINT password_reset_codes_pkey PRIMARY KEY (id);


--
-- Name: playlist_favorites playlist_favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.playlist_favorites
    ADD CONSTRAINT playlist_favorites_pkey PRIMARY KEY (id);


--
-- Name: playlist_favorites playlist_favorites_user_id_playlist_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.playlist_favorites
    ADD CONSTRAINT playlist_favorites_user_id_playlist_id_key UNIQUE (user_id, playlist_id);


--
-- Name: playlists playlists_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.playlists
    ADD CONSTRAINT playlists_pkey PRIMARY KEY (id);


--
-- Name: psychologist_patients psychologist_patients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.psychologist_patients
    ADD CONSTRAINT psychologist_patients_pkey PRIMARY KEY (id);


--
-- Name: psychologist_patients psychologist_patients_psychologist_id_patient_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.psychologist_patients
    ADD CONSTRAINT psychologist_patients_psychologist_id_patient_id_key UNIQUE (psychologist_id, patient_id);


--
-- Name: psychologist_reports psychologist_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.psychologist_reports
    ADD CONSTRAINT psychologist_reports_pkey PRIMARY KEY (id);


--
-- Name: psychologists psychologists_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.psychologists
    ADD CONSTRAINT psychologists_pkey PRIMARY KEY (id);


--
-- Name: psychologists psychologists_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.psychologists
    ADD CONSTRAINT psychologists_user_id_key UNIQUE (user_id);


--
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (id);


--
-- Name: smer_diary smer_diary_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.smer_diary
    ADD CONSTRAINT smer_diary_pkey PRIMARY KEY (id);


--
-- Name: tracks tracks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tracks
    ADD CONSTRAINT tracks_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_downloaded_tracks_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_downloaded_tracks_user ON public.downloaded_tracks USING btree (user_id);


--
-- Name: idx_emotion_tracker_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_emotion_tracker_date ON public.emotion_tracker USING btree (created_date);


--
-- Name: idx_emotion_tracker_user_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_emotion_tracker_user_date ON public.emotion_tracker USING btree (user_id, created_date);


--
-- Name: idx_favorite_comics_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_favorite_comics_user ON public.favorite_comics USING btree (user_id);


--
-- Name: idx_favorite_comics_user_comic; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_favorite_comics_user_comic ON public.favorite_comics USING btree (user_id, comic_id);


--
-- Name: idx_favorite_playlists_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_favorite_playlists_user ON public.favorite_playlists USING btree (user_id);


--
-- Name: idx_favorite_playlists_user_playlist; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_favorite_playlists_user_playlist ON public.favorite_playlists USING btree (user_id, playlist_id);


--
-- Name: idx_favorite_tracks_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_favorite_tracks_user ON public.favorite_tracks USING btree (user_id);


--
-- Name: idx_favorite_tracks_user_track; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_favorite_tracks_user_track ON public.favorite_tracks USING btree (user_id, track_id);


--
-- Name: idx_messages_receiver; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_receiver ON public.messages USING btree (receiver_id);


--
-- Name: idx_messages_sender; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_sender ON public.messages USING btree (sender_id);


--
-- Name: idx_psych_reports_patient; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_psych_reports_patient ON public.psychologist_reports USING btree (patient_id);


--
-- Name: idx_psych_reports_psych; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_psych_reports_psych ON public.psychologist_reports USING btree (psychologist_id);


--
-- Name: idx_psychologist_patients_patient; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_psychologist_patients_patient ON public.psychologist_patients USING btree (patient_id);


--
-- Name: idx_psychologist_patients_psych; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_psychologist_patients_psych ON public.psychologist_patients USING btree (psychologist_id);


--
-- Name: idx_reports_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reports_email ON public.reports USING btree (psychologist_email);


--
-- Name: idx_reports_user_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reports_user_date ON public.reports USING btree (user_id, created_at);


--
-- Name: idx_smer_diary_emotions; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_smer_diary_emotions ON public.smer_diary USING gin (selected_emotions);


--
-- Name: idx_smer_diary_user_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_smer_diary_user_date ON public.smer_diary USING btree (user_id, entry_date);


--
-- Name: idx_tracks_playlist; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tracks_playlist ON public.tracks USING btree (playlist_id);


--
-- Name: comic_pages comic_pages_comic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comic_pages
    ADD CONSTRAINT comic_pages_comic_id_fkey FOREIGN KEY (comic_id) REFERENCES public.comics(id) ON DELETE CASCADE;


--
-- Name: downloaded_tracks downloaded_tracks_track_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.downloaded_tracks
    ADD CONSTRAINT downloaded_tracks_track_id_fkey FOREIGN KEY (track_id) REFERENCES public.tracks(id) ON DELETE CASCADE;


--
-- Name: downloaded_tracks downloaded_tracks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.downloaded_tracks
    ADD CONSTRAINT downloaded_tracks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: emotion_tracker emotion_tracker_emotion_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.emotion_tracker
    ADD CONSTRAINT emotion_tracker_emotion_type_id_fkey FOREIGN KEY (emotion_type_id) REFERENCES public.emotion_types(id);


--
-- Name: emotion_tracker emotion_tracker_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.emotion_tracker
    ADD CONSTRAINT emotion_tracker_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: favorite_comics favorite_comics_comic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorite_comics
    ADD CONSTRAINT favorite_comics_comic_id_fkey FOREIGN KEY (comic_id) REFERENCES public.comics(id) ON DELETE CASCADE;


--
-- Name: favorite_comics favorite_comics_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorite_comics
    ADD CONSTRAINT favorite_comics_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: favorite_playlists favorite_playlists_playlist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorite_playlists
    ADD CONSTRAINT favorite_playlists_playlist_id_fkey FOREIGN KEY (playlist_id) REFERENCES public.playlists(id) ON DELETE CASCADE;


--
-- Name: favorite_playlists favorite_playlists_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorite_playlists
    ADD CONSTRAINT favorite_playlists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: favorite_tracks favorite_tracks_track_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorite_tracks
    ADD CONSTRAINT favorite_tracks_track_id_fkey FOREIGN KEY (track_id) REFERENCES public.tracks(id) ON DELETE CASCADE;


--
-- Name: favorite_tracks favorite_tracks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorite_tracks
    ADD CONSTRAINT favorite_tracks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: messages messages_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: messages messages_report_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_report_id_fkey FOREIGN KEY (report_id) REFERENCES public.reports(id) ON DELETE SET NULL;


--
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: password_reset_codes password_reset_codes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_codes
    ADD CONSTRAINT password_reset_codes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: playlist_favorites playlist_favorites_playlist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.playlist_favorites
    ADD CONSTRAINT playlist_favorites_playlist_id_fkey FOREIGN KEY (playlist_id) REFERENCES public.playlists(id) ON DELETE CASCADE;


--
-- Name: playlist_favorites playlist_favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.playlist_favorites
    ADD CONSTRAINT playlist_favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: psychologist_patients psychologist_patients_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.psychologist_patients
    ADD CONSTRAINT psychologist_patients_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: psychologist_patients psychologist_patients_psychologist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.psychologist_patients
    ADD CONSTRAINT psychologist_patients_psychologist_id_fkey FOREIGN KEY (psychologist_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: psychologist_reports psychologist_reports_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.psychologist_reports
    ADD CONSTRAINT psychologist_reports_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: psychologist_reports psychologist_reports_psychologist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.psychologist_reports
    ADD CONSTRAINT psychologist_reports_psychologist_id_fkey FOREIGN KEY (psychologist_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: psychologists psychologists_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.psychologists
    ADD CONSTRAINT psychologists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reports reports_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: smer_diary smer_diary_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.smer_diary
    ADD CONSTRAINT smer_diary_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: tracks tracks_playlist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tracks
    ADD CONSTRAINT tracks_playlist_id_fkey FOREIGN KEY (playlist_id) REFERENCES public.playlists(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict pvXI5epkacF2zaulbA1xwBOclcja9e1dc3hzkiTU6M0itg6xwE15TWWgeWKJXuP

