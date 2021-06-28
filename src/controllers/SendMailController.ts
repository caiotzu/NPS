import { Request, Response } from "express";
import { resolve } from 'path';
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";

class SendMailController {
    async execute(req: Request, res: Response) {
        const { email, survey_id} = req.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const user = await usersRepository.findOne({email});
        if(!user) {
            throw new AppError("User does not exists");
        }

        const survey = await surveysRepository.findOne({id: survey_id});

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        if(!survey) {
            throw new AppError("Survey does not exists");
        }

        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where: {user_id: user.id, value: null},
            relations: ["user", "survey"]
        });

        const variable = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL
        };


        if(surveyUserAlreadyExists) {
            variable.id = surveyUserAlreadyExists.id;
            // Enviar e-mail para o usuário
            await SendMailService.execute(email, survey.title, variable, npsPath);
            return res.json(surveyUserAlreadyExists);
        }

    

        // Salvar as informações na tabela surveyUser
        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id
        });
        await surveysUsersRepository.save(surveyUser);
        
        // Enviar e-mail para o usuário
        variable.id = surveyUser.id;
        await SendMailService.execute(email, survey.title, variable, npsPath);

        return res.json(surveyUser);

    }
}

export { SendMailController }