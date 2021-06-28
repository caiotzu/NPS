import { Router } from 'express';
import { AnswerController } from './controllers/AnswerController';
import { NpsController } from './controllers/NpsController';
import { SendMailController } from './controllers/SendMailController';
import { SurveysController } from './controllers/SurveysController';
import { UserController } from './controllers/UserController';

const router = Router();
const userController = new UserController();
const surveysController = new SurveysController();
const sendMailController = new SendMailController();
const answerController = new AnswerController();
const npsController = new NpsController();

// Routes for User
router.post("/users", userController.create);

// Route for Survey
router.post("/surveys", surveysController.create);
router.get("/surveys", surveysController.show);

// Route for E-mail
router.post("/sendMail", sendMailController.execute);

// Route for Answer
router.get("/answers/:value", answerController.execute);

// Route for NPS
router.get("/nps/:survey_id", npsController.execute);

export  { router };